import { createConnection } from "@/../lib/connectDB";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT position FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ position: rows[0].position || null });
  } catch (error) {
    console.error("Error checking user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 