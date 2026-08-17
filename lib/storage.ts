import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME not configured');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  
  // Return the public URL (assuming bucket is public or using CloudFront)
  const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (cloudFrontDomain) {
    return `https://${cloudFrontDomain}/${key}`;
  }
  
  return `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
}

export async function deleteFromS3(key: string): Promise<void> {
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

export function generateS3Key(userId: string, filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = filename.split('.').pop();
  return `uploads/${userId}/${timestamp}-${random}.${extension}`;
}
