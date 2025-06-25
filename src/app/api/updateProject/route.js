import pool from "@/../lib/connectDB";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/../lib/uploadToCloudinary";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function POST(req) {

  let conn

  try {
    const formData = await req.formData();
    
    // 獲取基本信息
    const projectId = formData.get("projectId");
    const author = formData.get("author");
    const title = formData.get("title");
    const description = formData.get("description");
    const projectType = formData.get("projectType");
    const subject = formData.get("subject");
    const interest = formData.get("interest");
    
    if (!projectId || !author || !title || !projectType || !subject || !interest) {
      return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
    }
    
    // 驗證用戶身份和權限
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "需要身份驗證" }, { status: 401 });
    }
    
    let decodedToken;
    try {
      decodedToken = verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "無效的身份驗證" }, { status: 401 });
    }
    
    if (decodedToken.email !== author) {
      return NextResponse.json({ error: "沒有權限修改此專案" }, { status: 403 });
    }
    
    // 連接數據庫並驗證專案所有權
    conn = await pool.getConnection();
    const [projectCheck] = await conn.execute(
      "SELECT author FROM projects WHERE project_id = ?",
      [projectId]
    );
    
    if (projectCheck.length === 0) {
      return NextResponse.json({ error: "找不到專案" }, { status: 404 });
    }
    
    if (projectCheck[0].author !== author) {
      return NextResponse.json({ error: "沒有權限修改此專案" }, { status: 403 });
    }
    
    // 處理上傳文件
    const imageUrls = [];
    const videoUrls = [];
    const pdfUrls = [];
    
    // 上傳圖片
    const images = formData.getAll("images");
    for (const image of images) {
      if (image instanceof File) {
        const url = await uploadToCloudinary(image, "images");
        imageUrls.push(url);
      }
    }
    
    // 上傳影片
    const videos = formData.getAll("videos");
    for (const video of videos) {
      if (video instanceof File) {
        const url = await uploadToCloudinary(video, "videos");
        videoUrls.push(url);
      }
    }
    
    // 上傳PDF
    const pdfs = formData.getAll("pdfs");
    for (const pdf of pdfs) {
      if (pdf instanceof File) {
        if (!pdf.type || pdf.type !== 'application/pdf') {
          console.warn(`無效的 PDF 檔案類型: ${pdf.type}`);
          continue;
        }
        const url = await uploadToCloudinary(pdf, "pdfs");
        pdfUrls.push(url);
      }
    }
    
    // 更新專案資訊
    const sectionValue = `${subject}-${interest}`;
    
    await conn.execute(
      "UPDATE projects SET title = ?, description = ?, type = ?, section = ?, status = ? WHERE project_id = ?",
      [title, description, projectType, sectionValue, '審核中', projectId]
    );
    
    // 更新專案的媒體計數
    const [currentCounts] = await conn.execute(
      "SELECT img, video, pdf FROM projects WHERE project_id = ?",
      [projectId]
    );
    
    const updatedImg = Number(currentCounts[0].img) + imageUrls.length;
    const updatedVideo = Number(currentCounts[0].video) + videoUrls.length;
    const updatedPdf = Number(currentCounts[0].pdf) + pdfUrls.length;
    
    await conn.execute(
      "UPDATE projects SET img = ?, video = ?, pdf = ? WHERE project_id = ?",
      [updatedImg, updatedVideo, updatedPdf, projectId]
    );
    
    // 保存新上傳的檔案
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
      message: "專案更新成功",
      projectId,
      imageCount: imageUrls.length,
      videoCount: videoUrls.length,
      pdfCount: pdfUrls.length
    });
    
  } catch (error) {
    console.error("更新專案錯誤:", error);
    return NextResponse.json({
      error: error.message,
      details: error.stack
    }, { status: 500 });
  } finally {
    conn.release();
  }
} 