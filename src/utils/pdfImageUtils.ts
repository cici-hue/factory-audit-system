/**
 * PDF 图片处理工具
 * 从 Supabase 下载图片并压缩为 Base64 用于 PDF 嵌入
 */

export interface PhotoItem {
  itemId: string;
  priority: number;
  isUrgent: boolean;
  moduleName: string;
  subModuleName: string;
  itemName: string;
  details: string[];
  comment: string;
  imageUrl: string;
  imageBase64?: string;
}

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

const DEFAULT_COMPRESSION: CompressionOptions = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.6,
  maxSizeKB: 200
};

/**
 * 从 URL 获取图片并压缩为 Base64
 * @param imageUrl 图片 URL
 * @param options 压缩选项
 * @returns Base64 字符串 (data:image/jpeg;base64,...)
 */
export async function fetchAndCompressImage(
  imageUrl: string,
  options: CompressionOptions = {}
): Promise<string | null> {
  const opts = { ...DEFAULT_COMPRESSION, ...options };
  
  try {
    // 获取图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('获取图片失败:', response.status, imageUrl);
      return null;
    }
    
    const blob = await response.blob();
    
    // 如果图片已经很小，直接转 base64
    if (blob.size <= opts.maxSizeKB! * 1024) {
      return await blobToBase64(blob);
    }
    
    // 需要压缩
    return await compressImageBlob(blob, opts);
  } catch (error) {
    console.error('处理图片失败:', error, imageUrl);
    return null;
  }
}

/**
 * Blob 转 Base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 压缩图片 Blob
 */
function compressImageBlob(
  blob: Blob,
  options: CompressionOptions
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // 计算压缩后的尺寸
      let { width, height } = calculateDimensions(
        img.width,
        img.height,
        options.maxWidth!,
        options.maxHeight!
      );
      
      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为 base64
      const base64 = canvas.toDataURL('image/jpeg', options.quality);
      resolve(base64);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    
    img.src = url;
  });
}

/**
 * 计算压缩后的尺寸
 */
function calculateDimensions(
  origWidth: number,
  origHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = origWidth;
  let height = origHeight;
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }
  
  return { width, height };
}

/**
 * 批量处理照片（带并发控制）
 * @param items 照片项列表
 * @param concurrency 并发数
 * @param onProgress 进度回调
 */
export async function processPhotosBatch(
  items: PhotoItem[],
  concurrency: number = 3,
  onProgress?: (completed: number, total: number) => void
): Promise<PhotoItem[]> {
  const results: PhotoItem[] = [];
  const queue = [...items];
  let completed = 0;
  
  async function processOne(item: PhotoItem): Promise<void> {
    try {
      const base64 = await fetchAndCompressImage(item.imageUrl);
      if (base64) {
        item.imageBase64 = base64;
      }
    } catch (error) {
      console.error('处理照片失败:', item.imageUrl, error);
    }
    
    completed++;
    if (onProgress) {
      onProgress(completed, items.length);
    }
  }
  
  // 并发处理
  const executing: Promise<void>[] = [];
  
  for (const item of queue) {
    const promise = processOne(item);
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }
  
  await Promise.all(executing);
  
  return items;
}

/**
 * 限制照片数量
 * @param items 所有照片项
 * @param maxPhotos 最大数量
 */
export function limitPhotos(
  items: PhotoItem[],
  maxPhotos: number = 50
): { photos: PhotoItem[]; hasMore: boolean } {
  if (items.length <= maxPhotos) {
    return { photos: items, hasMore: false };
  }
  
  // 优先保留急需项
  const urgentItems = items.filter(p => p.isUrgent);
  const normalItems = items.filter(p => !p.isUrgent);
  
  const keepNormalCount = maxPhotos - urgentItems.length;
  const selectedPhotos = [
    ...urgentItems,
    ...normalItems.slice(0, Math.max(0, keepNormalCount))
  ];
  
  return { photos: selectedPhotos, hasMore: true };
}

/**
 * 创建加载进度 HTML
 */
export function createLoadingHTML(total: number): string {
  return `
    <div id="photo-loading" style="
      padding: 40px;
      text-align: center;
      background: #f9fafb;
      border-radius: 8px;
      margin: 20px 0;
    ">
      <div style="font-size: 16px; color: #374151; margin-bottom: 16px;">
        正在加载现场照片... (<span id="loaded-count">0</span>/${total})
      </div>
      <div style="
        width: 100%;
        max-width: 400px;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        margin: 0 auto;
        overflow: hidden;
      ">
        <div id="progress-bar" style="
          width: 0%;
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.3s ease;
        "></div>
      </div>
      <div style="font-size: 12px; color: #9ca3af; margin-top: 12px;">
        照片正在压缩处理中，请稍候...
      </div>
    </div>
  `;
}

/**
 * 更新加载进度
 */
export function updateLoadingProgress(completed: number, total: number): void {
  const countEl = document.getElementById('loaded-count');
  const barEl = document.getElementById('progress-bar');
  
  if (countEl) {
    countEl.textContent = String(completed);
  }
  if (barEl) {
    barEl.style.width = `${(completed / total) * 100}%`;
  }
}

/**
 * 隐藏加载提示
 */
export function hideLoading(): void {
  const loadingEl = document.getElementById('photo-loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
}
