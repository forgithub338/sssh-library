import { createConnection } from '@/../lib/connectDB';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get email from query string
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Connect to database
    const connection = await createConnection();
    
    // Query projects for the user
    const [rows] = await connection.execute(
      'SELECT * FROM projects WHERE author = ?',
      [email]
    );

    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
