import { NextResponse } from "next/server";
import pool from "@/../lib/connectDB";

export async function POST(req) {
  const {email, password, name, position} = await req.json();
  const conn = await pool.getConnection();
  
  try{
    const [rows] = await conn.execute("INSERT INTO USERS (email, password, name, position) VALUES (?, ?, ?, ?)", [email, password, name, position])
    return NextResponse.json({success: true})
  } catch(error) {
    return NextResponse.json({success: false, error})
  } finally {
    conn.release();
  }
}