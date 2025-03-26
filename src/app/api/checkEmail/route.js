import { createConnection } from "../../../../lib/connectDB"
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email } = await request.json()
  try {
    const db = await createConnection()
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email])
    if (rows.length > 0) {
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  }
}