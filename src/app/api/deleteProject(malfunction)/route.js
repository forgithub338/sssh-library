import { createConnection } from '@/../lib/connectDB';
import { NextResponse } from 'next/server';
import cloudinary from "@/../lib/connectCloudinary";



export async function POST(request) {
  try {
    // Get project from query string
    const { searchParams } = new URL(request.url);
    const project = JSON.parse(searchParams.get('project'));
    
    if (!project || !project.project_id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Connect to database
    const connection = await createConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    try {
      // Get files associated with the project
      const [files] = await connection.execute(
        'SELECT type, url FROM upload_files WHERE project_id = ?',
        [project.project_id]
      );
      
      // Delete files from Cloudinary
      for (const file of files) {
        if (file.url) {
          // Extract public_id from the URL
          const urlParts = file.url.split('/');
          const filenameWithExtension = urlParts[urlParts.length - 1];
          const publicId = filenameWithExtension.split('.')[0];
          
          // Delete from Cloudinary
          await cloudinary.v2.uploader.destroy(publicId);
        }
      }
      
      // Delete files from database
      await connection.execute(
        'DELETE FROM upload_files WHERE project_id = ?',
        [project.project_id]
      );
      
      // Delete project from database
      await connection.execute(
        'DELETE FROM projects WHERE project_id = ?',
        [project.project_id]
      );
      
      // Commit transaction
      await connection.commit();
      
      return NextResponse.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.end();
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
