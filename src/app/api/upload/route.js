import { NextResponse } from "next/server";
import { createConnection } from "../../../../lib/connectDB";
import { uploadToCloudinary } from "@/../lib/uploadToCloudinary";

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
