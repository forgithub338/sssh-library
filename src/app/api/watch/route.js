import { NextResponse } from "next/server";
import pool from "@/../lib/connectDB";

export async function POST(req) {
  const conn = await pool.getConnection();
  try {
    const { projectType, subject, sortBy } = await req.json();
    ;

    // 動態 SQL 查詢基礎
    let sql = `
      SELECT 
        p.project_id,
        p.author,
        p.title,
        p.description,
        p.date,
        p.view,
        p.love,
        p.img,
        p.video,
        p.pdf,
        p.type AS project_type,
        p.section,
        p.status,
        p.reviewed_by,
        p.rejection_reason,
        f.file_id,
        f.type AS file_type,
        f.url AS file_url,
        f.name AS file_name
      FROM projects p
      LEFT JOIN upload_files f ON p.project_id = f.project_id
      WHERE p.status = '審核通過'
    `;
    const params = [];

    if (projectType && projectType !== "所有類型") {
      sql += " AND p.type = ?";
      params.push(projectType);
    }

    if (subject && subject !== "所有領域") {
      sql += " AND p.section LIKE ?";
      params.push(`${subject}%`);
    }

    if (sortBy === "date-asc") {
      sql += " ORDER BY p.date ASC";
    } else if (sortBy === "date-desc") {
      sql += " ORDER BY p.date DESC";
    }

    const [rows] = await conn.execute(sql, params);

    // 整理資料：將相同 project_id 的資料合併，並把檔案分類進 files 中
    const projectMap = {};

    for (const row of rows) {
      const id = row.project_id;

      if (!projectMap[id]) {
        projectMap[id] = {
          project_id: id,
          author: row.author,
          title: row.title,
          description: row.description,
          date: row.date,
          view: row.view,
          love: row.love,
          img: row.img,
          video: row.video,
          pdf: row.pdf,
          type: row.project_type,
          section: row.section,
          status: row.status,
          reviewed_by: row.reviewed_by,
          rejection_reason: row.rejection_reason,
          files: {
            image: [],
            video: [],
            pdf: []
          }
        };
      }

      if (row.file_type && row.file_url) {
        const type = row.file_type.toLowerCase();
        if (type === "image" || type === "video" || type === "pdf") {
          projectMap[id].files[type].push(row.file_url);
        }
      }
    }

    const finalData = Object.values(projectMap);

    if (sortBy === "date-asc") {
    finalData.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === "date-desc") {
    finalData.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

    return NextResponse.json({ data: finalData, projectType, subject, sortBy });
  } finally {
    conn.release();
  }
}
