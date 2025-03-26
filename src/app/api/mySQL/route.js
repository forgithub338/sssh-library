import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection()
    const [posts] = await db.query("SELECT * FROM users")
    return NextResponse.json({posts})
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  }
}

export async function POST(request) {
  const { email, password } = await request.json()
  try {
    const db = await createConnection()
    const [result] = await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password])
    return NextResponse.json({message: "signUp success"})
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  }
}
