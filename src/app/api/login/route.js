import { createConnection } from "../../../../lib/connectDB"
import { NextResponse } from "next/server";
import { sign } from 'jsonwebtoken';

export async function POST(request) {
  const { email, password } = await request.json()
  console.log(`Login attempt for: ${email}`);
  
  try {
    const db = await createConnection()
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    if(rows.length > 0 && rows[0].password === password) {
      console.log('Login successful, creating token');
      
      // 使用固定密鑰簽署 token
      const secretKey = process.env.JWT_SECRET || '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      const token = sign(
        { email: rows[0].email },
        secretKey,
        { expiresIn: '24h' }
      );
      
      // 創建響應物件
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token: token, // 也在响应正文中返回 token，方便调试
        alterPassword: rows[0].alterPassWord
      });
      
      // 修改 cookie 設置，移除可能導致問題的選項
      response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: false, // 允許 JavaScript 訪問 (僅用於調試)
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax'
      });
      
      console.log('Cookie set with token', token.substring(0, 20) + '...');
      return response;
    }
    
    return NextResponse.json({ success: false, message: 'Invalid credentials' });
  } catch(error) {
    console.error(`Login error: ${error}`);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}