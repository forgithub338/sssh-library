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
    

    for(const row of rows) {
      const [fileCounts] = await connection.execute(
        'SELECT type, COUNT(*) as count FROM upload_files WHERE project_id = ? GROUP BY type',
        [row.project_id]
      );

      // Initialize counts
      row.image = 0;
      row.video = 0;
      row.pdf = 0;

      // Update counts based on query results
      fileCounts.forEach(count => {
        if (count.type === 'image') row.image = count.count;
        if (count.type === 'video') row.video = count.count;
        if (count.type === 'pdf') row.pdf = count.count;
      });
    }

    return NextResponse.json({ projects: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
