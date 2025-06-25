import pool from "@/../lib/connectDB";
import { NextResponse } from "next/server";
import { sign } from 'jsonwebtoken';

export async function POST(request) {
  const conn = await pool.getConnection();
  try {
    const { email, password } = await request.json();
    console.log(`Changing password for: ${email}`);
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: "Email and password are required" 
      }, { status: 400 });
    }
    
    
    await conn.execute(
      "UPDATE users SET password = ?, alterPassWord = 1 WHERE email = ?", 
      [password, email]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully" 
    });
  } catch (error) {
    console.error(`Error changing password: ${error}`);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    conn.release()
  }
}