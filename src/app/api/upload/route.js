import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { createConnection } from "@/../lib/db"
import cloudinary from "@/../lib/cloudinary";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type"); // 取得 MIME 類型
    const filename = decodeURIComponent(req.headers.get("x-filename")); // 取得檔名
    const db = await createConnection();

    if (!contentType || !contentType.startsWith("image/")) {
      return NextResponse.json({ error: "無效的文件類型" }, { status: 400 });
    }

    if (!filename) {
      return NextResponse.json({ error: "缺少檔案名稱" }, { status: 400 });
    }

    const buffer = Buffer.from(await req.arrayBuffer()); // 轉成 Buffer
    const filePath = path.join(process.cwd(), "public/uploads", filename); // 儲存位置

    await writeFile(filePath, buffer); // 寫入檔案
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "uploads",
    });

    await db.execute("INSERT INTO uploads (url) VALUES (?)", [result.secure_url]);

    return NextResponse.json(
      { message: "文件上傳成功", url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
