import pool from "@/../lib/connectDB";
import { connection, NextResponse } from "next/server";

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM projects WHERE status = '審核中' ORDER BY date DESC`
    );
    
    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error("Error fetching pending projects:", error);
    return NextResponse.json({ error: "Failed to fetch pending projects" }, { status: 500 });
  } finally {
    conn.release();
  }
} 