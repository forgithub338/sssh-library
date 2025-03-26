import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { createConnection } from "@/../lib/db";
import cloudinary from "@/../lib/cloudinary";
import crypto from "crypto";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const author = "11130023@sssh.tp.edu.tw"
    if (!author) {
      return NextResponse.json({ error: "作者ID是必填欄位" }, { status: 400 });
    }
    
    // Initialize arrays for file URLs
    const imageUrls = [];
    const videoUrls = [];
    const pdfUrls = [];

    // Process images
    const images = formData.getAll("images");
    for (const image of images) {
      if (image instanceof File) {
        const url = await uploadToCloudinary(image, "images");
        imageUrls.push(url);
      }
    }
    
    // Process videos
    const videos = formData.getAll("videos");
    for (const video of videos) {
      if (video instanceof File) {
        const url = await uploadToCloudinary(video, "videos");
        videoUrls.push(url);
      }
    }

    // Process PDFs
    const pdfs = formData.getAll("pdfs");
    for (const pdf of pdfs) {
      if (pdf instanceof File) {
        if (!pdf.type || pdf.type !== 'application/pdf') {
          console.warn(`Invalid PDF file type: ${pdf.type}`);
          continue;
        }
        const url = await uploadToCloudinary(pdf, "pdfs");
        pdfUrls.push(url);
      }
    }

    // Save to database
    const db = await createConnection();
    const [result] = await db.execute(
      "INSERT INTO projects (author) VALUES (?)",
      [author]
    );
    
    const projectId = result.insertId;
    
    // Save file references
    for (const url of imageUrls) {
      await db.execute(
        "INSERT INTO upload_files (type, url, project_id) VALUES (?, ?, ?)",
        ['image', url, projectId]
      );
    }
    
    for (const url of videoUrls) {
      await db.execute(
        "INSERT INTO upload_files (type, url, project_id) VALUES (?, ?, ?)",
        ['video', url, projectId]
      );
    }
    
    for (const url of pdfUrls) {
      await db.execute(
        "INSERT INTO upload_files (type, url, project_id) VALUES (?, ?, ?)",
        ['pdf', url, projectId]
      );
    }

    return NextResponse.json({ 
      message: "上傳成功",
      projectId,
      imageCount: imageUrls.length,
      videoCount: videoUrls.length,
      pdfCount: pdfUrls.length
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack 
    }, { status: 500 });
  }
}

// Helper function to upload files to Cloudinary
async function uploadToCloudinary(file, folderName) {
  let tempFilePath = null;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });
    
    // Generate a unique temporary filename
    const tempFileName = crypto.randomBytes(16).toString('hex') + path.extname(file.name);
    tempFilePath = path.join(uploadsDir, tempFileName);
    
    // Save file temporarily
    await writeFile(tempFilePath, buffer);
    
    // Upload to Cloudinary with specific settings
    const uploadOptions = {
      folder: folderName,
      resource_type: "auto",
      // Add specific options for PDFs
      ...(file.type === 'application/pdf' && {
        pages: true,
        format: 'pdf'
      })
    };

    console.log(`Uploading file: ${file.name}, type: ${file.type}`);
    const result = await cloudinary.v2.uploader.upload(tempFilePath, uploadOptions);
    console.log(`Upload successful: ${result.secure_url}`);
    
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  } finally {
    // Clean up: delete temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log(`Temporary file deleted: ${tempFilePath}`);
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }
    }
  }
}
