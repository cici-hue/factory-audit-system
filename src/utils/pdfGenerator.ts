import { lightWovenModules, lingerieSwimwearModules } from '../data/factoryModules';
import { EvaluationRecord, FailedItemPriority, AuditModule, AuditItem } from '../types';
import { 
  PhotoItem, 
  processPhotosBatch, 
  limitPhotos,
  createLoadingHTML,
  updateLoadingProgress,
  hideLoading
} from './pdfImageUtils';

// 不合格项信息接口
interface FailedItemInfo {
  itemId: string;
  moduleName: string;
  subModuleName: string;
  itemName: string;
  score: number;
  details: string[];
  comment: string;
  isKey: boolean;
  useDetailScore?: boolean;
  subDetails?: { id: string; name: string }[];
  subDetailChecks?: { [key: string]: boolean };
}

// 合并所有工厂类型的模块
const allModules: AuditModule[] = [...lightWovenModules, ...lingerieSwimwearModules];

// 创建 item ID 到模块信息的映射
const itemIdToModuleMap = new Map<string, { item: AuditItem; moduleName: string; subModuleName: string }>();
allModules.forEach(module => {
  Object.entries(module.subModules).forEach(([subModuleName, subModule]) => {
    subModule.items.forEach(item => {
      itemIdToModuleMap.set(item.id, { item, moduleName: module.name, subModuleName });
    });
  });
});

// 生成小点勾选详情的 HTML
function generateSubDetailHTML(item: FailedItemInfo): string {
  if (!item.useDetailScore || !item.subDetails || item.subDetails.length === 0) {
    return '';
  }

  const notMetItems: string[] = [];   // 未满足：未勾选小点（表示有问题）
  const metItems: string[] = [];      // 已满足：勾选了小点（表示合格）

  item.subDetails.forEach(sub => {
    const isSubChecked = item.subDetailChecks?.[sub.id] || false;
    if (isSubChecked) {
      // 勾选了小点 = 该项合格 = 已满足
      metItems.push(sub.name);
    } else {
      // 未勾选小点 = 该项有问题 = 未满足
      notMetItems.push(sub.name);
    }
  });

  let html = '';
  if (notMetItems.length > 0) {
    html += `<div class="item-details"><span style="color: #f59e0b;">✗ 未满足: ${notMetItems.join(', ')}</span></div>`;
  }
  if (metItems.length > 0) {
    html += `<div class="item-details"><span style="color: #10b981;">✓ 已满足: ${metItems.join(', ')}</span></div>`;
  }

  return html;
}

// 收集不合格项和照片信息
function collectFailedItems(record: EvaluationRecord): {
  failedItems: FailedItemInfo[];
  photoItems: PhotoItem[];
} {
  const failedItems: FailedItemInfo[] = [];
  const photoItems: PhotoItem[] = [];

  console.log('collectFailedItems - record.results:', record.results);
  console.log('collectFailedItems - record.selectedModules:', record.selectedModules);

  // 只遍历 results 中实际有数据的项
  Object.entries(record.results).forEach(([itemId, result]) => {
    const moduleInfo = itemIdToModuleMap.get(itemId);
    if (!moduleInfo) return;

    // 检查该模块是否在当前选中的模块中
    if (!record.selectedModules.includes(moduleInfo.moduleName)) return;

    const isChecked = result.isChecked;
    const details = result.details || [];
    const comment = result.comment || '';
    const imagePath = result.imagePath || null;

    const itemInfo: FailedItemInfo = {
      itemId: itemId,
      moduleName: moduleInfo.moduleName,
      subModuleName: moduleInfo.subModuleName,
      itemName: moduleInfo.item.name,
      score: moduleInfo.item.score,
      details: details,
      comment: comment,
      isKey: moduleInfo.item.isKey,
      // 保存可多选小点的信息
      useDetailScore: moduleInfo.item.useDetailScore,
      subDetails: moduleInfo.item.subDetails,
      subDetailChecks: result.subDetailChecks
    };

    if (!isChecked) {
      failedItems.push(itemInfo);

      // 收集有照片的不合格项
      if (imagePath) {
        console.log('收集到照片:', itemId, imagePath);
        photoItems.push({
          itemId: itemId,
          priority: 0, // 稍后设置
          isUrgent: false, // 稍后设置
          moduleName: moduleInfo.moduleName,
          subModuleName: moduleInfo.subModuleName,
          itemName: moduleInfo.item.name,
          score: moduleInfo.item.score,
          details: details,
          comment: comment,
          imageUrl: imagePath
        });
      }
    }
  });

  console.log('collectFailedItems - 不合格项数量:', failedItems.length);
  console.log('collectFailedItems - 照片数量:', photoItems.length);

  return { failedItems, photoItems };
}

// 根据优先级排序不合格项和照片
function sortByPriority(
  failedItems: FailedItemInfo[],
  photoItems: PhotoItem[],
  priorityData?: FailedItemPriority[]
): {
  urgentItems: FailedItemInfo[];
  normalItems: FailedItemInfo[];
  urgentPhotos: PhotoItem[];
  normalPhotos: PhotoItem[];
} {
  // 创建优先级映射
  const priorityMap = new Map<string, FailedItemPriority>();
  if (priorityData && priorityData.length > 0) {
    priorityData.forEach(p => priorityMap.set(p.itemId, p));
  }

  // 按优先级排序不合格项（有优先级的按优先级，没有优先级的按分值降序排在最后）
  const sortedItems = [...failedItems].sort((a, b) => {
    const priorityA = priorityMap.get(a.itemId);
    const priorityB = priorityMap.get(b.itemId);
    
    if (priorityA && priorityB) {
      return priorityA.priority - priorityB.priority;
    } else if (priorityA) {
      return -1; // a 有优先级，排在前面
    } else if (priorityB) {
      return 1; // b 有优先级，排在前面
    } else {
      // 都没有优先级，按分值降序
      return b.score - a.score;
    }
  });

  // 按优先级排序照片
  const sortedPhotos = [...photoItems].sort((a, b) => {
    const priorityA = priorityMap.get(a.itemId);
    const priorityB = priorityMap.get(b.itemId);
    
    if (priorityA && priorityB) {
      return priorityA.priority - priorityB.priority;
    } else if (priorityA) {
      return -1;
    } else if (priorityB) {
      return 1;
    } else {
      return b.score - a.score;
    }
  });

  // 分离急需项和一般项
  const urgentItems: FailedItemInfo[] = [];
  const normalItems: FailedItemInfo[] = [];
  const urgentPhotos: PhotoItem[] = [];
  const normalPhotos: PhotoItem[] = [];

  // 处理不合格项
  sortedItems.forEach((item, index) => {
    const priority = priorityMap.get(item.itemId);
    if (priority) {
      // 有优先级数据，按优先级分类
      if (priority.isUrgent) {
        urgentItems.push(item);
      } else {
        normalItems.push(item);
      }
    } else {
      // 没有优先级数据，前10项归为急需，其余为一般
      if (index < 10) {
        urgentItems.push(item);
      } else {
        normalItems.push(item);
      }
    }
  });

  // 处理照片
  sortedPhotos.forEach((photo, index) => {
    const priority = priorityMap.get(photo.itemId);
    if (priority) {
      photo.priority = priority.priority;
      photo.isUrgent = priority.isUrgent;
      if (priority.isUrgent) {
        urgentPhotos.push(photo);
      } else {
        normalPhotos.push(photo);
      }
    } else {
      // 没有优先级数据，按排序后的索引分配
      photo.priority = index + 1;
      photo.isUrgent = index < 10;
      if (index < 10) {
        urgentPhotos.push(photo);
      } else {
        normalPhotos.push(photo);
      }
    }
  });

  return { urgentItems, normalItems, urgentPhotos, normalPhotos };
}

// 生成照片模块 HTML
function generatePhotoSectionHTML(
  urgentPhotos: PhotoItem[],
  normalPhotos: PhotoItem[],
  hasMore: boolean
): string {
  if (urgentPhotos.length === 0 && normalPhotos.length === 0) {
    return `
      <h2>五、现场照片</h2>
      <p style="color: #999; font-style: italic; padding: 20px; text-align: center;">
        未上传现场照片
      </p>
    `;
  }

  const generatePhotoCard = (photo: PhotoItem): string => {
    const imageSrc = photo.imageBase64 || photo.imageUrl;
    const badgeClass = photo.isUrgent ? 'urgent' : 'normal';
    
    return `
      <div class="photo-card">
        <div class="photo-index ${badgeClass}">${photo.priority}</div>
        <img src="${imageSrc}" alt="现场照片" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="photo-error" style="display: none; height: 180px; align-items: center; justify-content: center; background: #f3f4f6; color: #9ca3af; font-size: 12px;">
          照片加载失败
        </div>
        <div class="photo-info">
          <div class="photo-location">${photo.moduleName} - ${photo.subModuleName}</div>
          <div class="photo-desc">${photo.itemName}</div>
          ${photo.details.length > 0 ? `<div class="photo-detail">问题: ${photo.details.join(', ')}</div>` : ''}
          ${photo.comment ? `<div class="photo-comment">备注: ${photo.comment}</div>` : ''}
        </div>
      </div>
    `;
  };

  return `
    <h2>五、现场照片</h2>
    
    ${urgentPhotos.length > 0 ? `
    <div class="photo-section urgent-photos">
      <h3>（一）急需整改项现场照片</h3>
      <div class="photo-grid">
        ${urgentPhotos.map(generatePhotoCard).join('')}
      </div>
    </div>
    ` : ''}
    
    ${normalPhotos.length > 0 ? `
    <div class="photo-section normal-photos">
      <h3>${urgentPhotos.length > 0 ? '（二）' : '（一）'}一般整改项现场照片</h3>
      <div class="photo-grid">
        ${normalPhotos.map(generatePhotoCard).join('')}
      </div>
    </div>
    ` : ''}
    
    ${hasMore ? `
    <p style="color: #666; font-size: 11px; text-align: center; margin-top: 20px; padding: 10px; background: #f9fafb; border-radius: 4px;">
      照片数量较多，仅展示前 50 张，更多照片请登录系统查看
    </p>
    ` : ''}
  `;
}

// 创建打印友好的HTML内容
async function createPrintContent(
  record: EvaluationRecord, 
  lastEvaluation?: EvaluationRecord
): Promise<string> {
  // 收集不合格项和照片
  const { failedItems, photoItems } = collectFailedItems(record);
  
  // 根据优先级排序
  const { urgentItems, normalItems, urgentPhotos, normalPhotos } = sortByPriority(
    failedItems, 
    photoItems, 
    record.failedItemsPriority
  );

  // 限制照片数量
  const allPhotos = [...urgentPhotos, ...normalPhotos];
  const { photos: limitedPhotos, hasMore } = limitPhotos(allPhotos, 50);
  
  // 重新分组
  const finalUrgentPhotos = limitedPhotos.filter(p => p.isUrgent);
  const finalNormalPhotos = limitedPhotos.filter(p => !p.isUrgent);

  // 处理照片（下载并压缩）
  let processedUrgentPhotos = finalUrgentPhotos;
  let processedNormalPhotos = finalNormalPhotos;
  
  if (limitedPhotos.length > 0) {
    console.log(`开始处理 ${limitedPhotos.length} 张照片...`);
    const processed = await processPhotosBatch(limitedPhotos, 3, (completed, total) => {
      console.log(`照片处理进度: ${completed}/${total}`);
    });
    processedUrgentPhotos = processed.filter(p => p.isUrgent);
    processedNormalPhotos = processed.filter(p => !p.isUrgent);
    console.log('照片处理完成');
  }

  // 整改复查模式的对比数据
  const improvedItems: FailedItemInfo[] = [];
  const remainingItems: FailedItemInfo[] = [];
  const newItems: FailedItemInfo[] = [];

  if (lastEvaluation && lastEvaluation.results) {
    auditModules.forEach(mod => {
      if (!record.selectedModules.includes(mod.name)) return;
      Object.entries(mod.subModules).forEach(([subModName, subMod]) => {
        subMod.items.forEach(item => {
          const result = record.results[item.id];
          const isChecked = result ? result.isChecked : false;
          const lastResult = lastEvaluation.results[item.id];
          const lastIsChecked = lastResult ? lastResult.isChecked : true;
          
          const itemInfo: FailedItemInfo = {
            itemId: item.id,
            moduleName: mod.name,
            subModuleName: subModName,
            itemName: item.name,
            score: item.score,
            details: result ? result.details || [] : [],
            comment: result ? result.comment || '' : '',
            isKey: item.isKey
          };
          
          if (lastResult && !lastIsChecked) {
            if (isChecked) {
              improvedItems.push(itemInfo);
            } else {
              remainingItems.push(itemInfo);
            }
          } else if ((!lastResult || lastIsChecked) && !isChecked) {
            newItems.push(itemInfo);
          }
        });
      });
    });
  }

  // 生成照片模块 HTML
  const photoSectionHTML = generatePhotoSectionHTML(
    processedUrgentPhotos,
    processedNormalPhotos,
    hasMore
  );

  // 生成打印友好的HTML
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>工厂流程审核报告 - ${record.factoryName}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: "Microsoft YaHei", "PingFang SC", "Heiti SC", "SimHei", sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    .info-box {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .info-box p {
      margin: 5px 0;
    }
    .info-box .score {
      font-size: 18px;
      color: #2563eb;
      font-weight: bold;
    }
    h2 {
      font-size: 16px;
      margin: 20px 0 10px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 5px;
    }
    h3 {
      font-size: 14px;
      margin: 15px 0 10px;
    }
    .urgent-section h3 {
      color: #dc2626;
      border-left: 4px solid #dc2626;
      padding-left: 10px;
    }
    .normal-section h3 {
      color: #6b7280;
      border-left: 4px solid #6b7280;
      padding-left: 10px;
    }
    .key-items {
      color: #d97706;
    }
    .no-issue {
      color: #22c55e;
    }
    ul {
      margin-left: 20px;
    }
    li {
      margin: 8px 0;
      padding: 8px;
      background: #fafafa;
      border-radius: 4px;
    }
    .urgent-section li {
      background: #fef2f2;
      border-left: 3px solid #dc2626;
    }
    .normal-section li {
      background: #f9fafb;
      border-left: 3px solid #6b7280;
    }
    .item-header {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .item-details {
      color: #666;
      font-size: 11px;
      margin-top: 4px;
    }
    .priority-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      margin-left: 8px;
    }
    .urgent-badge {
      background: #dc2626;
      color: white;
    }
    .normal-badge {
      background: #6b7280;
      color: white;
    }
    
    /* 照片模块样式 */
    .photo-section {
      margin: 20px 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .photo-section h3 {
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 4px solid;
    }
    .urgent-photos h3 {
      color: #dc2626;
      border-color: #dc2626;
    }
    .normal-photos h3 {
      color: #6b7280;
      border-color: #6b7280;
    }
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 15px 0;
    }
    .photo-card {
      position: relative;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      break-inside: avoid;
      page-break-inside: avoid;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .photo-index {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: white;
      z-index: 1;
    }
    .photo-index.urgent {
      background: #dc2626;
    }
    .photo-index.normal {
      background: #6b7280;
    }
    .photo-card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      background: #f5f5f5;
      display: block;
    }
    .photo-info {
      padding: 12px;
      font-size: 11px;
      line-height: 1.5;
    }
    .photo-location {
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
      font-size: 12px;
    }
    .photo-desc {
      color: #555;
      margin-bottom: 4px;
    }
    .photo-detail, .photo-comment {
      color: #888;
      font-size: 10px;
    }
    .photo-comment {
      margin-top: 4px;
      font-style: italic;
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #999;
      font-size: 10px;
    }
    @media print {
      body {
        padding: 0;
      }
      .photo-card {
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
      }
      .photo-section {
        break-before: auto;
        page-break-before: auto;
      }
      .photo-card img {
        max-height: 200px;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <h1>工厂流程审核报告</h1>

  <div class="info-box">
    <p><strong>工厂名称：</strong>${record.factoryName}</p>
    <p><strong>供应商：</strong>${record.supplierName || '-'}</p>
    <p><strong>订单号：</strong>${record.orderNo || '-'}</p>
    <p><strong>款号：</strong>${record.styleNo || '-'}</p>
    <p><strong>生产状态：</strong>${record.productionStatus || '-'}</p>
    <p><strong>评估日期：</strong>${record.evalDate}</p>
    <p><strong>评估人员：</strong>${record.evaluator}</p>
    <p><strong>审核性质：</strong>${record.evalType}</p>
    <p class="score"><strong>工厂总分：</strong>${record.overallPercent.toFixed(2)}%</p>
    ${lastEvaluation ? `<p><strong>得分说明：</strong>本次整改复查得分基于上次评估(${lastEvaluation.evalDate}，得分${lastEvaluation.overallPercent.toFixed(2)}%)进行累加计算</p>` : ''}
  </div>

  ${lastEvaluation ? `
  <h2 style="color: #2563eb;">一、整改对比分析</h2>
  <p>本次整改复查与 ${lastEvaluation.evalDate} 的评估结果对比：</p>
  ` : `
  <h2>一、存在问题汇总</h2>
  <p>经评估，请该工厂注意以下方面：</p>
  `}

  ${lastEvaluation ? `
  ${improvedItems.length > 0 ? `
  <h3 style="color: #22c55e;">（一）已整改项目</h3>
  <ul>
    ${improvedItems.map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName} ✅ 已整改</div>
        ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item)}
      </li>
    `).join('')}
  </ul>
  ` : ''}

  ${remainingItems.length > 0 ? `
  <h3 style="color: #ef4444;">（二）整改后仍存在的问题</h3>
  <ul>
    ${remainingItems.map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName} ❌ 仍未整改</div>
        ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item)}
        ${item.comment ? `<div class="item-details">评论: ${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : ''}

  ${newItems.length > 0 ? `
  <h3 style="color: #ef4444;">（三）新增问题</h3>
  <ul>
    ${newItems.map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName} ⚠️ 新问题</div>
        ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item)}
        ${item.comment ? `<div class="item-details">评论: ${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : ''}

  ${improvedItems.length === 0 && remainingItems.length === 0 && newItems.length === 0 ? `
  <p class="no-issue">本次整改复查未发现明显变化</p>
  ` : ''}
  ` : `
  ${failedItems.length > 0 && record.failedItemsPriority && record.failedItemsPriority.length > 0 ? `
  <!-- 有优先级排序的情况 -->
  <div class="urgent-section">
    <h3>（一）急需整改项（前10项）</h3>
    ${urgentItems.length > 0 ? `
    <ul>
      ${urgentItems.map((item, index) => `
        <li>
          <div class="item-header">
            ${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}
            <span class="priority-badge urgent-badge">急需</span>
          </div>
          ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
          ${generateSubDetailHTML(item)}
          ${item.comment ? `<div class="item-details">评论: ${item.comment}</div>` : ''}
        </li>
      `).join('')}
    </ul>
    ` : '<p class="no-issue">无急需整改项</p>'}
  </div>

  <div class="normal-section">
    <h3>（二）一般整改项</h3>
    ${normalItems.length > 0 ? `
    <ul>
      ${normalItems.map((item, index) => `
        <li>
          <div class="item-header">
            ${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}
            <span class="priority-badge normal-badge">一般</span>
          </div>
          ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
          ${generateSubDetailHTML(item)}
          ${item.comment ? `<div class="item-details">评论: ${item.comment}</div>` : ''}
        </li>
      `).join('')}
    </ul>
    ` : '<p class="no-issue">无一般整改项</p>'}
  </div>
  ` : `
  <!-- 无优先级排序的情况（原有逻辑） -->
  ${failedItems.filter(i => i.isKey).length > 0 ? `
  <h3>（一）重点工序</h3>
  <ul class="key-items">
    ${failedItems.filter(i => i.isKey).map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}</div>
        ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item)}
        ${item.comment ? `<div class="item-details">评论: ${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : `<p class="no-issue">本次评估未发现重点工序问题</p>`}

  <h3>（二）其他工序</h3>
  ${failedItems.filter(i => !i.isKey).length > 0 ? `
  <ul>
    ${failedItems.filter(i => !i.isKey).map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}</div>
        ${item.details.length > 0 ? `<div class="item-details">问题: ${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item)}
        ${item.comment ? `<div class="item-details">评论: ${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : `<p class="no-issue">本次评估未发现其他工序问题</p>`}
  `}
  `}

  <h2>四、评估者评论</h2>

  ${record.comments ? `
  <p>${record.comments}</p>
  ` : `<p style="color: #999;">无评论</p>`}

  ${photoSectionHTML}

  <div class="footer">
    <p>此报告由欧图工厂审核系统自动生成</p>
  </div>
</body>
</html>
  `;

  return html;
}

export async function generatePDF(record: EvaluationRecord, lastEvaluation?: EvaluationRecord): Promise<void> {
  // 显示加载提示
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
      ">
        <div style="font-size: 16px; color: #374151; margin-bottom: 16px;">
          正在生成 PDF 报告...
        </div>
        <div style="
          width: 200px;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin: 0 auto;
          overflow: hidden;
        ">
          <div id="pdf-progress" style="
            width: 20%;
            height: 100%;
            background: #3b82f6;
            border-radius: 4px;
            transition: width 0.3s ease;
          "></div>
        </div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 12px;">
          正在加载现场照片，请稍候...
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  try {
    // 更新进度
    const progressEl = document.getElementById('pdf-progress');
    if (progressEl) progressEl.style.width = '30%';

    // 创建打印内容（异步，包含照片下载）
    const printContent = await createPrintContent(record, lastEvaluation);
    
    if (progressEl) progressEl.style.width = '80%';

    // 创建新的窗口
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许弹出窗口以生成PDF报告');
      return;
    }

    // 写入内容
    printWindow.document.write(printContent);
    printWindow.document.close();

    if (progressEl) progressEl.style.width = '100%';

    // 等待内容加载完成后自动打印
    printWindow.onload = () => {
      setTimeout(() => {
        // 移除加载提示
        document.body.removeChild(loadingDiv);
        printWindow.print();
      }, 500);
    };
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    document.body.removeChild(loadingDiv);
    alert('生成 PDF 失败，请重试');
  }
}
