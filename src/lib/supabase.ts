import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mttbkirfdtwwxplokupe.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dGJraXJmZHR3d3hwbG9rdXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTUyMjgsImV4cCI6MjA4OTM5MTIyOH0.hF3uaubeCsTMqwJcvddumomeMARz5M7LIyYDqMSEpIw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 存储桶名称
export const STORAGE_BUCKET = 'audit-images';

// 上传图片到Supabase Storage
export async function uploadImage(file: File, evaluationId: string, itemId: string): Promise<string | null> {
  try {
    const fileName = `${evaluationId}/${itemId}_${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('上传图片失败:', error);
      return null;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('上传图片异常:', error);
    return null;
  }
}

// 从Supabase Storage删除图片
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // 从URL中提取文件路径
    const urlParts = imageUrl.split('/storage/v2/object/public/');
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('删除图片失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除图片异常:', error);
    return false;
  }
}
