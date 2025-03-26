import { createConnection } from "../../../../lib/db"
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json()
  try {
    const db = await createConnection()
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if(rows[0].password === password) return NextResponse.json({success: true})
    return NextResponse.json({success: false})
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  }
}