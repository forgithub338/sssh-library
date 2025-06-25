import pool from '@/../lib/connectDB';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function GET(request) {

  let conn;

  try {
    // Get projectId from query
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const email = searchParams.get('email');
    const method = searchParams.get('method');
    
    // Verify that the email in the request matches the authenticated user
    // This is a crucial security check
    if (method === 'user') {
      const cookieStore = cookies();
      const token = cookieStore.get('authToken')?.value;
      
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      
      let decodedToken;
      try {
        decodedToken = verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
      }
      
      // Verify the authenticated user matches the requested email
      if (decodedToken.email !== email) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }
      
      // Now proceed with the database query
      conn = await pool.getConnection();
      
      // First verify this project belongs to the user
      const [ownership] = await conn.execute(
        'SELECT COUNT(*) as count FROM projects WHERE project_id = ? AND author = ?',
        [projectId, email]
      );
      
      if (ownership[0].count === 0) {
        return NextResponse.json({ error: 'You do not have permission to view this project' }, { status: 403 });
      }
    } else if(method === 'admin'){
      conn = await pool.getConnection();
      const [admin] = await conn.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if(admin[0].position !== '管理者'){
        return NextResponse.json({ error: 'You do not have permission to view this project' }, { status: 403 });
      }
    }
    
    // Query projects for the user
    const [result] = await conn.execute(
      'SELECT * FROM projects WHERE project_id = ?',
      [projectId]
    );

    const project = result[0];

    const [files] = await conn.execute(
      'SELECT type, url FROM upload_files WHERE project_id = ?',
      [project.project_id]
    );
    project.files = files;
    
    return NextResponse.json({ project: project, method: method });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  } finally {
    conn.release();
  }
}
