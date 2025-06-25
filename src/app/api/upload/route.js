import { NextResponse } from "next/server";
import pool from "@/../lib/connectDB";
import fs from "fs/promises";
import path from "path";
import {v4 as uuidv4} from "uuid";
import { Recursive } from "next/font/google";

export async function POST(req) {
  const conn = await pool.getConnection();
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

    const setFileExtension = (folder) => {
      switch(folder) {
        case "images": return ".jpg";
        case "videos": return ".mp4";
        case "pdfs": return ".pdf";
      }
    }

    const saveFile = async (file, folder) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = `${uuidv4()}_${file.name}`
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
      await fs.mkdir(uploadDir, {recursive: true})
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      return `/uploads/${folder}/${fileName}`;
    }

    // Process images
    const images = formData.getAll("images");
    for (const image of images) {
      if (image instanceof File) {
        const url = await saveFile(image, "images");
        imageUrls.push(url);
      }
    }
    
    // Process videos
    const videos = formData.getAll("videos");
    for (const video of videos) {
      if (video instanceof File) {
        const url = await saveFile(video, "videos");
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
        const url = await saveFile(pdf, "pdfs");
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
    ;
    const [result] = await conn.execute(
      "INSERT INTO projects (author, title, description, date, view, love, img, video, pdf, type, section) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [author, title, description, mysqlDateTime, 0, 0, img, video, pdf, type, subject]
    );
    
    const projectId = result.insertId;

    const [latestProject] = await conn.execute(
      "SELECT * FROM users WHERE email = ?",
      [author]
    );

    const project = latestProject[0].project + 1;
    const latestProject2 = latestProject[0].latestProject1;
    const latestProject3 = latestProject[0].latestProject2;
    const latestProject4 = latestProject[0].latestProject3;

    await conn.execute(
      "UPDATE users SET project = ?, latestDate = ?, latestProject1 = ?, latestProject2 = ?, latestProject3 = ?, latestProject4 = ? WHERE email = ?",
      [project, mysqlDateTime, projectId, latestProject2, latestProject3, latestProject4, author]
    );
    
    // Save file references
    for (const url of imageUrls) {
      await conn.execute(
        "INSERT INTO upload_files (type, url, project_id) VALUES (?, ?, ?)",
        ['image', url, projectId]
      );
    }
    
    for (const url of videoUrls) {
      await conn.execute(
        "INSERT INTO upload_files (type, url, project_id) VALUES (?, ?, ?)",
        ['video', url, projectId]
      );
    }
    
    for (const url of pdfUrls) {
      await conn.execute(
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
  } finally {
    conn.release();
  }
}
