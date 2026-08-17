import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadToS3, generateS3Key } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and videos allowed.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if S3 is configured
    if (!process.env.AWS_S3_BUCKET_NAME) {
      // Fallback to local storage if S3 not configured
      const { writeFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync } = await import('fs');
      
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${random}.${extension}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
        size: file.size,
        type: file.type,
        storage: 'local'
      });
    }

    // Upload to S3
    const key = generateS3Key(session.userId, file.name);
    const publicUrl = await uploadToS3(key, buffer, file.type);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: key,
      size: file.size,
      type: file.type,
      storage: 's3'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
