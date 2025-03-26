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
      subject: "松山高中成果發表網站驗證碼",
      text: `你的驗證碼是：${code}`,
    });

    return NextResponse.json({message: "驗證碼已發送"})
  } catch (error) {
    return NextResponse.json({message: "郵件發送失敗"})
  }
}
