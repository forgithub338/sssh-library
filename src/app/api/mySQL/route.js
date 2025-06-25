import pool from "@/../lib/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [posts] = await conn.query("SELECT * FROM users")
    return NextResponse.json({posts: posts || []})
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  } finally {
    conn.release();
  }
}

export async function POST(request) {
  const { email, password } = await request.json()
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute("INSERT INTO users (email, password, alterPassword) VALUES (?, ?, ?)", [email, password, true])
    return NextResponse.json({message: "signUp success"})
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  } finally {
    conn.release();
  }
}
