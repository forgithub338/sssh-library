import { createConnection } from '@/../lib/connectDB';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get email from query string
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const projectId = searchParams.get('projectId');
    
    if (!email || !projectId) {
      return NextResponse.json({ error: 'Email and projectId are required' }, { status: 400 });
    }

    // Connect to database
    const connection = await createConnection();
    
    // Query projects for the user
    const [result] = await connection.execute(
      'SELECT * FROM projects WHERE project_id = ?',
      [projectId]
    );

    const project = result[0];

    const [files] = await connection.execute(
      'SELECT type, url FROM upload_files WHERE project_id = ?',
      [project.project_id]
    );
    project.files = files;
    
    return NextResponse.json({ project: project });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
