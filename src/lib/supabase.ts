import { createClient } from '@supabase/supabase-js';
import { compressImage, blobToFile } from '../utils/imageCompression';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mttbkirfdtwwxplokupe.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dGJraXJmZHR3d3hwbG9rdXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTUyMjgsImV4cCI6MjA4OTM5MTIyOH0.hF3uaubeCsTMqwJcvddumomeMARz5M7LIyYDqMSEpIw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 存储桶名称
export const STORAGE_BUCKET = 'audit-images';

/**
 * 生成安全的文件夹名称
 * Supabase Storage 只支持小写字母、数字、横线、下划线
 */
function sanitizeFolderName(name: string): string {
  return name
    .toLowerCase() // 转小写
    .replace(/[^a-z0-9]/g, '_') // 只保留小写字母和数字
    .replace(/_+/g, '_') // 多个下划线合并
    .replace(/^_+|_+$/g, '') // 移除首尾下划线
    .substring(0, 30); // 限制长度
}

/**
 * 上传图片到 Supabase Storage（带压缩）
 * @param file 原始图片文件
 * @param folderName 文件夹名称
 * @param itemId 评估项ID
 * @returns 图片的公开 URL
 */
export async function uploadImage(
  file: File,
  folderName: string,
  itemId: string
): Promise<string | null> {
  try {
    console.log('开始压缩图片:', file.name, file.size);
    
    // 压缩图片
    const compressedBlob = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      maxSizeKB: 500
    });
    
    console.log('图片压缩完成:', compressedBlob.size);
    
    // 将 blob 转为 file
    const compressedFile = blobToFile(
      compressedBlob,
      `${itemId}_${Date.now()}.jpg`
    );

    // 生成文件路径
    const fileName = `${folderName}/${itemId}_${Date.now()}.jpg`;

    console.log('开始上传到 Storage:', fileName);
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, compressedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      });

    if (error) {
      console.error('上传图片失败:', error);
      return null;
    }

    // 获取公开URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    console.log('图片上传成功:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('上传图片异常:', error);
    return null;
  }
}

/**
 * 上传临时图片（评估还未保存时使用临时文件夹）
 * @param file 原始图片文件
 * @param tempFolderName 临时文件夹名称
 * @param itemId 评估项ID
 * @returns 图片的公开 URL
 */
export async function uploadTempImage(
  file: File,
  tempFolderName: string,
  itemId: string
): Promise<string | null> {
  // 使用临时文件夹
  return uploadImage(file, `temp_${sanitizeFolderName(tempFolderName)}`, itemId);
}

/**
 * 移动临时图片到正式评估文件夹
 * @param tempFolderName 临时文件夹名称
 * @param finalFolderName 正式文件夹名称
 * @param evalId 评估ID
 * @param evaluatorName 评估人名称
 * @param imageUrls 图片URL列表
 */
export async function moveTempImages(
  tempFolderName: string,
  finalFolderName: string,
  evalId: string,
  evaluatorName: string,
  imageUrls: string[]
): Promise<string[]> {
  const sanitizedTempFolder = `temp_${sanitizeFolderName(tempFolderName)}`;
  const sanitizedFinalFolder = sanitizeFolderName(finalFolderName);
  const sanitizedEvaluatorName = sanitizeFolderName(evaluatorName);
  const newUrls: string[] = [];
  
  console.log('移动图片:', { from: sanitizedTempFolder, to: sanitizedFinalFolder, evalId, evaluatorName });
  
  for (const url of imageUrls) {
    if (!url.includes(sanitizedTempFolder)) {
      // 不是临时图片，直接保留
      newUrls.push(url);
      continue;
    }
    
    try {
      // 从URL中提取文件路径
      const urlParts = url.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
      if (urlParts.length < 2) {
        newUrls.push(url);
        continue;
      }
      
      const oldPath = urlParts[1];
      const fileName = oldPath.split('/').pop();
      // 新文件名: 评估人_评估ID_itemId_timestamp.jpg
      const newPath = `${sanitizedFinalFolder}/${sanitizedEvaluatorName}_${evalId}_${fileName}`;
      
      console.log('复制文件:', { from: oldPath, to: newPath });
      
      // 复制文件到新位置
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .copy(oldPath, newPath);
      
      if (error) {
        console.error('复制图片失败:', error);
        newUrls.push(url);
        continue;
      }
      
      // 获取新URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(newPath);
      
      newUrls.push(urlData.publicUrl);
      
      // 删除旧文件
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([oldPath]);
      
    } catch (error) {
      console.error('移动临时图片失败:', error);
      newUrls.push(url);
    }
  }
  
  return newUrls;
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
