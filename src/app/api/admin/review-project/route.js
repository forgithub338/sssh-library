import pool from "@/../lib/connectDB";
import { connection, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  const conn = await pool.getConnection();
  try {
    const { projectId, action, reason, reviewedBy } = await request.json();

    
    if (!projectId || !action || !reviewedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    if (action === 'reject' && !reason) {
      return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
    }
    
    
    // 獲取專案作者信息
    const [projectRows] = await conn.execute(
      'SELECT author, title FROM projects WHERE project_id = ?',
      [projectId]
    );
    
    if (projectRows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    const author = projectRows[0].author;
    const projectTitle = projectRows[0].title;
    
    
    // 更新專案狀態
    const status = action === 'approve' ? '審核通過' : '審核未通過';
    await conn.execute(
      'UPDATE projects SET status = ?, reviewed_by = ?, rejection_reason = ? WHERE project_id = ?',
      [status, reviewedBy, action === 'reject' ? reason : null, projectId]
    );
    
    const subject = action === "approve" 
      ? `[松山高中成果分享網站] 您的專案已通過審核 🎉` 
      : `[松山高中成果分享網站] 您的專案未通過審核`;

    const html = action === "approve"
      ? `<p>親愛的使用者您好</p>
      <p>您的專案「${projectTitle}」已成功通過審核，現在已正式發布 🎉。</p>
      <span>您可以前往網站查看您的專案：
        <a href="http://localhost:3000/projects/projectOverview/${projectId}">🔗 查看專案</a>
      </span>
      <p>感謝您的分享，期待更多優秀的作品！</p>
      <p>松山高中成果分享網站 敬上</p>`
      : `<p>親愛的使用者您好</p>
      <p>很遺憾通知您，您的專案「${projectTitle}」未能通過審核。</p>
      <p>🔍 <b>審核者：${reviewedBy}</b></p>
      <p>🔍 <b>原因：${reason}</b></p>
      <p>請根據審核意見進行修改，並重新提交您的專案。</p>
      <p>如有任何疑問，請聯繫我們。</p>
      <p>松山高中成果分享網站 敬上</p>`;


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "11130023@sssh.tp.edu.tw",
        pass: process.env.GMAIL_APPLICATION_PASSWORD,
      },
    });
  
    try {
      await transporter.sendMail({
        from: "11130023@sssh.tp.edu.tw",
        to: author,
        subject: subject,
        html: html,
      })
    } catch (error) {
      console.error(`Error sending email:`, error);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Project ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });
    
  } catch (error) {
    console.error(`Error reviewing project:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    conn.release();
  }
} 