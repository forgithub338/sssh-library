import { NextResponse } from "next/server";
import { createConnection } from "../../../../lib/connectDB";
import { uploadToCloudinary } from "@/../lib/uploadToCloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const author = formData.get("author");
    if (!author) {
      return NextResponse.json({ error: "作者ID是必填欄位" }, { status: 400 });
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const type = formData.get("projectType");
    const subject = formData.get("subject") + "-" + formData.get("interest");
    
    
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

    let date = new Date();
    date = date.setHours(date.getHours() + 8);
    const mysqlDateTime = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

    const img = imageUrls.length;
    const video = videoUrls.length;
    const pdf = pdfUrls.length;

    // Save to database
    const db = await createConnection();
    const [result] = await db.execute(
      "INSERT INTO projects (author, title, description, date, view, love, img, video, pdf, type, section) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [author, title, description, mysqlDateTime, 0, 0, img, video, pdf, type, subject]
    );
    
    const projectId = result.insertId;

    const [latestProject] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [author]
    );

    const latestProject2 = latestProject[0].latestProject1;
    const latestProject3 = latestProject[0].latestProject2;
    const latestProject4 = latestProject[0].latestProject3;

    await db.execute(
      "UPDATE users SET latestDate = ?, latestProject1 = ?, latestProject2 = ?, latestProject3 = ?, latestProject4 = ? WHERE email = ?",
      [mysqlDateTime, projectId, latestProject2, latestProject3, latestProject4, author]
    );
    
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
