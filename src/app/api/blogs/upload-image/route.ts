import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary configuration is missing. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB to reduce timeout issues)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary with timeout
    const uploadResult = await Promise.race([
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: 'amritam-blogs',
            resource_type: 'auto',
            transformation: [
              { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            ],
            timeout: 60000, // 60 seconds timeout
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      }),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Upload timeout: Request took too long. Please try again with a smaller image.'));
        }, 60000); // 60 seconds timeout
      }),
    ]);

    const result = uploadResult as any;

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error);
    
    // Handle timeout errors specifically
    if (error.message?.includes('timeout') || error.name === 'TimeoutError' || error.http_code === 499) {
      return NextResponse.json(
        { 
          error: 'Upload timeout', 
          details: 'The upload took too long. Please try again with a smaller image file (under 2MB recommended).',
          suggestion: 'Try compressing the image before uploading.'
        },
        { status: 408 }
      );
    }

    // Handle other Cloudinary errors
    if (error.http_code) {
      return NextResponse.json(
        { 
          error: 'Cloudinary upload failed', 
          details: error.message || 'Unknown error',
          http_code: error.http_code
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

