import { createConnection } from "../../../../lib/connectDB";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email } = await request.json()
  try {
    const db = await createConnection()
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if(result[0].latestProject1) {
      const [project1] = await db.query("SELECT * FROM projects WHERE project_id = ?", [result[0].latestProject1])
      result[0].latestProject1 = project1[0]
    }

    if(result[0].latestProject2) {
      const [project2] = await db.query("SELECT * FROM projects WHERE project_id = ?", [result[0].latestProject2])
      result[0].latestProject2 = project2[0]
    }

    if(result[0].latestProject3) {
      const [project3] = await db.query("SELECT * FROM projects WHERE project_id = ?", [result[0].latestProject3])
      result[0].latestProject3 = project3[0]
    }

    if(result[0].latestProject4) {
      const [project4] = await db.query("SELECT * FROM projects WHERE project_id = ?", [result[0].latestProject4])
      result[0].latestProject4 = project4[0]
    }

    return NextResponse.json(result[0])
  } catch(error) {
    console.log(`error: ${error}`)
    return NextResponse.json({error: error.message})
  }
}
