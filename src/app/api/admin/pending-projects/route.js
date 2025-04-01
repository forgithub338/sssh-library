import { createConnection } from "@/../lib/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM projects WHERE status = '審核中' ORDER BY date DESC`
    );
    
    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error("Error fetching pending projects:", error);
    return NextResponse.json({ error: "Failed to fetch pending projects" }, { status: 500 });
  }
} 