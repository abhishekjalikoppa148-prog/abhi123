import { supabaseAdmin } from './supabase/admin';

const DEFAULT_MEDIA_BUCKET = process.env.SUPABASE_MEDIA_BUCKET || 'website-media';

/**
 * Upload a file buffer to Supabase Storage.
 * @param key File path inside the bucket (e.g. uploads/userId/timestamp-random.jpg)
 * @param body Buffer containing the file data
 * @param contentType MIME type of the file
 * @param bucket Storage bucket name (defaults to 'website-media')
 */
export async function uploadToStorage(
  key: string,
  body: Buffer,
  contentType: string,
  bucket: string = DEFAULT_MEDIA_BUCKET
): Promise<{ url: string; path: string }> {
  // If Supabase URL is available, upload to Supabase Storage
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(key, body, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Supabase Storage Upload Error:', error.message);
      throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  }

  // Fallback for local development if credentials not yet configured
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const { existsSync } = await import('fs');

  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filename = key.split('/').pop() || `${Date.now()}.png`;
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, body);

  return {
    url: `/uploads/${filename}`,
    path: `uploads/${filename}`,
  };
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFromStorage(
  key: string,
  bucket: string = DEFAULT_MEDIA_BUCKET
): Promise<void> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([key]);

    if (error) {
      console.error('Supabase Storage Delete Error:', error.message);
      throw new Error(`Failed to delete from Supabase Storage: ${error.message}`);
    }
    return;
  }

  // Fallback local deletion
  try {
    const { unlink } = await import('fs/promises');
    const { join } = await import('path');
    const filename = key.split('/').pop();
    if (filename) {
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      await unlink(filepath).catch(() => {});
    }
  } catch {}
}

/**
 * Generate a unique storage file path.
 */
export function generateStorageKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = filename.split('.').pop() || 'png';
  return `uploads/${userId}/${timestamp}-${random}.${extension}`;
}

// Backward-compatible alias exports for smooth migration
export const uploadToS3 = uploadToStorage;
export const deleteFromS3 = deleteFromStorage;
export const generateS3Key = generateStorageKey;
