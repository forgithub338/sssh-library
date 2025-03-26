import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import cloudinary from "./connectCloudinary";

export async function uploadToCloudinary(file, folderName) {
  let tempFilePath = null;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });
    
    // Generate a unique temporary filename
    const tempFileName = crypto.randomBytes(16).toString('hex') + path.extname(file.name);
    tempFilePath = path.join(uploadsDir, tempFileName);
    
    // Save file temporarily
    await writeFile(tempFilePath, buffer);
    
    // Upload to Cloudinary with specific settings
    const uploadOptions = {
      folder: folderName,
      resource_type: "auto",
      // Add specific options for PDFs
      ...(file.type === 'application/pdf' && {
        pages: true,
        format: 'pdf'
      })
    };

    console.log(`Uploading file: ${file.name}, type: ${file.type}`);
    const result = await cloudinary.v2.uploader.upload(tempFilePath, uploadOptions);
    console.log(`Upload successful: ${result.secure_url}`);
    
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  } finally {
    // Clean up: delete temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log(`Temporary file deleted: ${tempFilePath}`);
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }
    }
  }
} 