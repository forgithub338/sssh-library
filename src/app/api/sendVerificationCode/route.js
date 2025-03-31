import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, code } = await request.json();

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
      to: email,
      subject: "[松山高中成果分享網站] 更改密碼驗證碼",
      text: `親愛的使用者，\n\n您正在嘗試更改密碼，請使用以下驗證碼完成操作：\n\n驗證碼：${code}\n\n請注意：此驗證碼有效時間為 **10 分鐘**，請盡快使用。如果您沒有嘗試更改密碼，請忽略此郵件。\n\n松山高中成果分享網站敬上`,
    });

    return NextResponse.json({message: "驗證碼已發送"})
  } catch (error) {
    return NextResponse.json({message: "郵件發送失敗"})
  }
}
