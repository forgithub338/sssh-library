import pool from '@/../lib/connectDB';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const conn = await pool.getConnection();
  try {
    // Get email from query string
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Query projects for the user
    const [rows] = await conn.execute(
      'SELECT * FROM projects WHERE author = ?',
      [email]
    );

    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  } finally {
    conn.release();
  }
}
