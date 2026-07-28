import { lightWovenModules, lingerieSwimwearModules, flatKnitModules } from '../data/factoryModules';
import { EvaluationRecord, FailedItemPriority, AuditModule, AuditItem } from '../types';
import { 
  PhotoItem, 
  processPhotosBatch, 
  limitPhotos,
  createLoadingHTML,
  updateLoadingProgress,
  hideLoading
} from './pdfImageUtils';

// 不合格项信息接口 (Failed item info interface)
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
  reverseScoring?: boolean;  // Reverse scoring flag
  selectedScore?: number;    // Flat Knit: selected score
}

// Merge all factory type modules
const allModules: AuditModule[] = [...lightWovenModules, ...lingerieSwimwearModules, ...flatKnitModules];

// Create item ID to module info map
const itemIdToModuleMap = new Map<string, { item: AuditItem; moduleName: string; subModuleName: string }>();
allModules.forEach(module => {
  Object.entries(module.subModules).forEach(([subModuleName, subModule]) => {
    subModule.items.forEach(item => {
      itemIdToModuleMap.set(item.id, { item, moduleName: module.name, subModuleName });
    });
  });
});

// Generate sub-detail check HTML
function generateSubDetailHTML(item: FailedItemInfo, lang: 'zh' | 'en' = 'zh'): string {
  const isEn = lang === 'en';
  const metLabel = isEn ? 'Met' : '已满足';
  const notMetLabel = isEn ? 'Not Met' : '未满足';

  // Flat Knit: display selected score
  if (item.selectedScore !== undefined) {
    const scoreText = isEn
      ? (item.selectedScore > 0 ? `Score: ${item.selectedScore}` : `Score: ${item.selectedScore} (Not Achieved)`)
      : (item.selectedScore > 0 ? `得分: ${item.selectedScore}分` : `得分: ${item.selectedScore}分（未达标）`);
    return `<div class="item-details">${scoreText}</div>`;
  }

  if (!item.useDetailScore || !item.subDetails || item.subDetails.length === 0) {
    return '';
  }

  const notMetItems: string[] = [];   // Not met
  const metItems: string[] = [];      // Met

  item.subDetails.forEach(sub => {
    const isSubChecked = item.subDetailChecks?.[sub.id] || false;

    if (item.reverseScoring) {
      // Reverse scoring (e.g. measurement): checked = issue (not met), unchecked = pass (met)
      if (isSubChecked) {
        notMetItems.push(sub.name);
      } else {
        metItems.push(sub.name);
      }
    } else {
      // Normal scoring: checked = pass (met), unchecked = issue (not met)
      if (isSubChecked) {
        metItems.push(sub.name);
      } else {
        notMetItems.push(sub.name);
      }
    }
  });

  let html = '';
  if (notMetItems.length > 0) {
    const symbol = isEn ? '✗' : '✗';
    html += `<div class="item-details"><span style="color: #f59e0b;">${symbol} ${notMetLabel}: ${notMetItems.join(', ')}</span></div>`;
  }
  if (metItems.length > 0) {
    const symbol = isEn ? '✓' : '✓';
    html += `<div class="item-details"><span style="color: #10b981;">${symbol} ${metLabel}: ${metItems.join(', ')}</span></div>`;
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

  const penalizedItemIds = new Set<string>();
  Object.entries(record.results).forEach(([itemId, result]) => {
    const moduleInfo = itemIdToModuleMap.get(itemId);
    if (!moduleInfo) return;
    const item = moduleInfo.item;
    if (item.penaltyItems && result.selectedScore !== undefined) {
      const shouldPenalize = item.penaltyOnZeroScore 
        ? result.selectedScore === 0 
        : true;
      if (shouldPenalize) {
        item.penaltyItems.forEach(penalizedId => {
          penalizedItemIds.add(penalizedId);
        });
      }
    }
  });

  Object.entries(record.results).forEach(([itemId, result]) => {
    const moduleInfo = itemIdToModuleMap.get(itemId);
    if (!moduleInfo) return;

    if (!record.selectedModules.includes(moduleInfo.moduleName)) return;

    const isChecked = result.isChecked;
    const details = result.details || [];
    const comment = result.comment || '';
    const imagePath = result.imagePath || null;
    const item = moduleInfo.item;

    const itemInfo: FailedItemInfo = {
      itemId: itemId,
      moduleName: moduleInfo.moduleName,
      subModuleName: moduleInfo.subModuleName,
      itemName: moduleInfo.item.name,
      score: moduleInfo.item.score,
      details: details,
      comment: comment,
      isKey: moduleInfo.item.isKey,
      useDetailScore: moduleInfo.item.useDetailScore,
      subDetails: moduleInfo.item.subDetails,
      subDetailChecks: result.subDetailChecks,
      reverseScoring: moduleInfo.item.reverseScoring,
      selectedScore: result.selectedScore,
    };

    const isPenalized = penalizedItemIds.has(itemId);

    let isFlatKnitFailed = false;
    if (item.scoreOptions && item.scoreOptions.length > 0) {
      if (isPenalized) {
        isFlatKnitFailed = false;
      } else if (item.penaltyOnZeroScore && result.selectedScore === 0) {
        isFlatKnitFailed = true;
      } else if (!item.penaltyOnZeroScore && item.penaltyItems && result.selectedScore !== undefined) {
        isFlatKnitFailed = true;
      } else if (result.selectedScore !== undefined && result.selectedScore <= 0) {
        isFlatKnitFailed = true;
      } else {
        isFlatKnitFailed = false;
      }
    } else {
      isFlatKnitFailed = !isChecked;
    }

    if (isFlatKnitFailed) {
      failedItems.push(itemInfo);

      if (imagePath) {
        console.log('收集到照片:', itemId, imagePath);
        photoItems.push({
          itemId: itemId,
          priority: 0,
          isUrgent: false,
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

// Generate photo section HTML
function generatePhotoSectionHTML(
  urgentPhotos: PhotoItem[],
  normalPhotos: PhotoItem[],
  hasMore: boolean,
  lang: 'zh' | 'en' = 'zh'
): string {
  const isEn = lang === 'en';
  const titleText = isEn ? '5. Site Photos' : '五、现场照片';
  const noPhotosText = isEn ? 'No site photos uploaded' : '未上传现场照片';
  const altText = isEn ? 'Site Photo' : '现场照片';
  const loadErrorText = isEn ? 'Photo loading failed' : '照片加载失败';
  const issueLabel = isEn ? 'Issue: ' : '问题: ';
  const commentLabel = isEn ? 'Note: ' : '备注: ';
  const urgentSectionTitle = isEn ? '(1) Urgent Item Site Photos' : '（一）急需整改项现场照片';
  const normalSectionTitle = isEn ? 'General Item Site Photos' : '一般整改项现场照片';
  const sectionPrefix1 = isEn ? '(1) ' : '（一）';
  const sectionPrefix2 = isEn ? '(2) ' : '（二）';
  const limitNote = isEn
    ? 'Too many photos, only first 50 are shown. Please login for more.'
    : '照片数量较多，仅展示前 50 张，更多照片请登录系统查看';

  if (urgentPhotos.length === 0 && normalPhotos.length === 0) {
    return `
      <h2>${titleText}</h2>
      <p style="color: #999; font-style: italic; padding: 20px; text-align: center;">
        ${noPhotosText}
      </p>
    `;
  }

  const generatePhotoCard = (photo: PhotoItem): string => {
    const imageSrc = photo.imageBase64 || photo.imageUrl;
    const badgeClass = photo.isUrgent ? 'urgent' : 'normal';

    return `
      <div class="photo-card">
        <div class="photo-index ${badgeClass}">${photo.priority}</div>
        <img src="${imageSrc}" alt="${altText}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="photo-error" style="display: none; height: 180px; align-items: center; justify-content: center; background: #f3f4f6; color: #9ca3af; font-size: 12px;">
          ${loadErrorText}
        </div>
        <div class="photo-info">
          <div class="photo-location">${photo.moduleName} - ${photo.subModuleName}</div>
          <div class="photo-desc">${photo.itemName}</div>
          ${photo.details.length > 0 ? `<div class="photo-detail">${issueLabel}${photo.details.join(', ')}</div>` : ''}
          ${photo.comment ? `<div class="photo-comment">${commentLabel}${photo.comment}</div>` : ''}
        </div>
      </div>
    `;
  };

  return `
    <h2>${titleText}</h2>

    ${urgentPhotos.length > 0 ? `
    <div class="photo-section urgent-photos">
      <h3>${urgentSectionTitle}</h3>
      <div class="photo-grid">
        ${urgentPhotos.map(generatePhotoCard).join('')}
      </div>
    </div>
    ` : ''}

    ${normalPhotos.length > 0 ? `
    <div class="photo-section normal-photos">
      <h3>${urgentPhotos.length > 0 ? sectionPrefix2 : sectionPrefix1}${normalSectionTitle}</h3>
      <div class="photo-grid">
        ${normalPhotos.map(generatePhotoCard).join('')}
      </div>
    </div>
    ` : ''}

    ${hasMore ? `
    <p style="color: #666; font-size: 11px; text-align: center; margin-top: 20px; padding: 10px; background: #f9fafb; border-radius: 4px;">
      ${limitNote}
    </p>
    ` : ''}
  `;
}

// Create print-friendly HTML content
async function createPrintContent(
  record: EvaluationRecord,
  lastEvaluation?: EvaluationRecord,
  lang: 'zh' | 'en' = 'zh'
): Promise<string> {
  const isEn = lang === 'en';

  // Collect failed items and photos
  const { failedItems, photoItems } = collectFailedItems(record);

  // Sort by priority
  const { urgentItems, normalItems, urgentPhotos, normalPhotos } = sortByPriority(
    failedItems,
    photoItems,
    record.failedItemsPriority
  );

  // Limit photo count
  const allPhotos = [...urgentPhotos, ...normalPhotos];
  const { photos: limitedPhotos, hasMore } = limitPhotos(allPhotos, 50);

  // Re-group
  const finalUrgentPhotos = limitedPhotos.filter(p => p.isUrgent);
  const finalNormalPhotos = limitedPhotos.filter(p => !p.isUrgent);

  // Process photos (download and compress)
  let processedUrgentPhotos = finalUrgentPhotos;
  let processedNormalPhotos = finalNormalPhotos;

  if (limitedPhotos.length > 0) {
    console.log(`Starting to process ${limitedPhotos.length} photos...`);
    const processed = await processPhotosBatch(limitedPhotos, 3, (completed, total) => {
      console.log(`Photo progress: ${completed}/${total}`);
    });
    processedUrgentPhotos = processed.filter(p => p.isUrgent);
    processedNormalPhotos = processed.filter(p => !p.isUrgent);
    console.log('Photo processing complete');
  }

  // Rectification review comparison data
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

  // Generate photo section HTML
  const photoSectionHTML = generatePhotoSectionHTML(
    processedUrgentPhotos,
    processedNormalPhotos,
    hasMore,
    lang
  );

  // Bilingual labels
  const labels = {
    htmlLang: isEn ? 'en' : 'zh-CN',
    reportTitle: isEn ? 'Factory Audit Report' : '工厂流程审核报告',
    pageTitle: isEn ? `Factory Audit Report - ${record.factoryName}` : `工厂流程审核报告 - ${record.factoryName}`,
    factory: isEn ? 'Factory: ' : '工厂名称：',
    supplier: isEn ? 'Supplier: ' : '供应商：',
    orderNo: isEn ? 'Order No.: ' : '订单号：',
    styleNo: isEn ? 'Style No.: ' : '款号：',
    productionStatus: isEn ? 'Production Status: ' : '生产状态：',
    evalDate: isEn ? 'Audit Date: ' : '评估日期：',
    evaluator: isEn ? 'Evaluator: ' : '评估人员：',
    evalType: isEn ? 'Audit Type: ' : '审核性质：',
    totalScore: isEn ? 'Total Score: ' : '工厂总分：',
    scoreNote: isEn ? 'Score Note: ' : '得分说明：',
    scoreAccum: isEn
      ? `This rectification review score is accumulated based on the last evaluation (${lastEvaluation?.evalDate}, score ${lastEvaluation?.overallPercent.toFixed(2)}%)`
      : `本次整改复查得分基于上次评估(${lastEvaluation?.evalDate}，得分${lastEvaluation?.overallPercent.toFixed(2)}%)进行累加计算`,
    compareTitle: isEn ? '1. Rectification Comparison' : '一、整改对比分析',
    compareText: isEn
      ? `This rectification review compared with the evaluation on ${lastEvaluation?.evalDate}:`
      : `本次整改复查与 ${lastEvaluation?.evalDate} 的评估结果对比：`,
    issueTitle: isEn ? '1. Summary of Issues' : '一、存在问题汇总',
    issueText: isEn ? 'Please pay attention to the following aspects:' : '经评估，请该工厂注意以下方面：',
    improved: isEn ? '(1) Rectified Items' : '（一）已整改项目',
    remaining: isEn ? '(2) Remaining Issues After Rectification' : '（二）整改后仍存在的问题',
    newIssues: isEn ? '(3) New Issues' : '（三）新增问题',
    improvedSymbol: isEn ? '✅ Rectified' : '✅ 已整改',
    remainingSymbol: isEn ? '❌ Still Not Rectified' : '❌ 仍未整改',
    newSymbol: isEn ? '⚠️ New Issue' : '⚠️ 新问题',
    noChange: isEn ? 'No significant changes were found in this rectification review' : '本次整改复查未发现明显变化',
    urgentSection: isEn ? '(1) Urgent Items (Top 10)' : '（一）急需整改项（前10项）',
    generalSection: isEn ? '(2) General Items' : '（二）一般整改项',
    urgentBadge: isEn ? 'Urgent' : '急需',
    generalBadge: isEn ? 'General' : '一般',
    noUrgent: isEn ? 'No urgent items' : '无急需整改项',
    noGeneral: isEn ? 'No general items' : '无一般整改项',
    keyProcess: isEn ? '(1) Key Process' : '（一）重点工序',
    otherProcess: isEn ? '(2) Other Process' : '（二）其他工序',
    noKeyIssue: isEn ? 'No key process issues found in this evaluation' : '本次评估未发现重点工序问题',
    noOtherIssue: isEn ? 'No other process issues found in this evaluation' : '本次评估未发现其他工序问题',
    evaluatorComment: isEn ? '4. Evaluator Comments' : '四、评估者评论',
    noComment: isEn ? 'No comments' : '无评论',
    issueLabel: isEn ? 'Issue: ' : '问题: ',
    commentLabel: isEn ? 'Comment: ' : '评论: ',
    footer: isEn ? 'This report is auto-generated by Factory Audit System' : '此报告由欧图工厂审核系统自动生成',
  };

  // Generate print-friendly HTML
  const html = `
<!DOCTYPE html>
<html lang="${labels.htmlLang}">
<head>
  <meta charset="UTF-8">
  <title>${labels.pageTitle}</title>
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
      font-family: "Microsoft YaHei", "PingFang SC", "Heiti SC", "SimHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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

    /* Photo section styles */
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
  <h1>${labels.reportTitle}</h1>

  <div class="info-box">
    <p><strong>${labels.factory}</strong>${record.factoryName}</p>
    <p><strong>${labels.supplier}</strong>${record.supplierName || '-'}</p>
    <p><strong>${labels.orderNo}</strong>${record.orderNo || '-'}</p>
    <p><strong>${labels.styleNo}</strong>${record.styleNo || '-'}</p>
    <p><strong>${labels.productionStatus}</strong>${record.productionStatus || '-'}</p>
    <p><strong>${labels.evalDate}</strong>${record.evalDate}</p>
    <p><strong>${labels.evaluator}</strong>${record.evaluator}</p>
    <p><strong>${labels.evalType}</strong>${record.evalType}</p>
    <p class="score"><strong>${labels.totalScore}</strong>${record.overallPercent.toFixed(2)}%</p>
    ${lastEvaluation ? `<p><strong>${labels.scoreNote}</strong>${labels.scoreAccum}</p>` : ''}
  </div>

  ${lastEvaluation ? `
  <h2 style="color: #2563eb;">${labels.compareTitle}</h2>
  <p>${labels.compareText}</p>
  ` : `
  <h2>${labels.issueTitle}</h2>
  <p>${labels.issueText}</p>
  `}

  ${lastEvaluation ? `
  ${improvedItems.length > 0 ? `
  <h3 style="color: #22c55e;">${labels.improved}</h3>
  <ul>
    ${improvedItems.map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName} ${labels.improvedSymbol}</div>
        ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item, lang)}
      </li>
    `).join('')}
  </ul>
  ` : ''}

  ${remainingItems.length > 0 ? `
  <h3 style="color: #ef4444;">${labels.remaining}</h3>
  <ul>
    ${remainingItems.map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName} ${labels.remainingSymbol}</div>
        ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item, lang)}
        ${item.comment ? `<div class="item-details">${labels.commentLabel}${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : ''}

  ${newItems.length > 0 ? `
  <h3 style="color: #ef4444;">${labels.newIssues}</h3>
  <ul>
    ${newItems.map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName} ${labels.newSymbol}</div>
        ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item, lang)}
        ${item.comment ? `<div class="item-details">${labels.commentLabel}${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : ''}

  ${improvedItems.length === 0 && remainingItems.length === 0 && newItems.length === 0 ? `
  <p class="no-issue">${labels.noChange}</p>
  ` : ''}
  ` : `
  ${failedItems.length > 0 && record.failedItemsPriority && record.failedItemsPriority.length > 0 ? `
  <!-- With priority sorting -->
  <div class="urgent-section">
    <h3>${labels.urgentSection}</h3>
    ${urgentItems.length > 0 ? `
    <ul>
      ${urgentItems.map((item, index) => `
        <li>
          <div class="item-header">
            ${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}
            <span class="priority-badge urgent-badge">${labels.urgentBadge}</span>
          </div>
          ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
          ${generateSubDetailHTML(item, lang)}
          ${item.comment ? `<div class="item-details">${labels.commentLabel}${item.comment}</div>` : ''}
        </li>
      `).join('')}
    </ul>
    ` : `<p class="no-issue">${labels.noUrgent}</p>`}
  </div>

  <div class="normal-section">
    <h3>${labels.generalSection}</h3>
    ${normalItems.length > 0 ? `
    <ul>
      ${normalItems.map((item, index) => `
        <li>
          <div class="item-header">
            ${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}
            <span class="priority-badge normal-badge">${labels.generalBadge}</span>
          </div>
          ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
          ${generateSubDetailHTML(item, lang)}
          ${item.comment ? `<div class="item-details">${labels.commentLabel}${item.comment}</div>` : ''}
        </li>
      `).join('')}
    </ul>
    ` : `<p class="no-issue">${labels.noGeneral}</p>`}
  </div>
  ` : `
  <!-- Without priority sorting (original logic) -->
  ${failedItems.filter(i => i.isKey).length > 0 ? `
  <h3>${labels.keyProcess}</h3>
  <ul class="key-items">
    ${failedItems.filter(i => i.isKey).map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}</div>
        ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item, lang)}
        ${item.comment ? `<div class="item-details">${labels.commentLabel}${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : `<p class="no-issue">${labels.noKeyIssue}</p>`}

  <h3>${labels.otherProcess}</h3>
  ${failedItems.filter(i => !i.isKey).length > 0 ? `
  <ul>
    ${failedItems.filter(i => !i.isKey).map((item, index) => `
      <li>
        <div class="item-header">${index + 1}. ${item.moduleName} - ${item.subModuleName}: ${item.itemName}</div>
        ${item.details.length > 0 ? `<div class="item-details">${labels.issueLabel}${item.details.join(', ')}</div>` : ''}
        ${generateSubDetailHTML(item, lang)}
        ${item.comment ? `<div class="item-details">${labels.commentLabel}${item.comment}</div>` : ''}
      </li>
    `).join('')}
  </ul>
  ` : `<p class="no-issue">${labels.noOtherIssue}</p>`}
  `}
  `}

  <h2>${labels.evaluatorComment}</h2>

  ${record.comments ? `
  <p>${record.comments}</p>
  ` : `<p style="color: #999;">${labels.noComment}</p>`}

  ${photoSectionHTML}

  <div class="footer">
    <p>${labels.footer}</p>
  </div>
</body>
</html>
  `;

  return html;
}

export async function generatePDF(record: EvaluationRecord, lastEvaluation?: EvaluationRecord, lang: 'zh' | 'en' = 'zh'): Promise<void> {
  const isEn = lang === 'en';
  // Show loading indicator
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
          ${isEn ? 'Generating PDF report...' : '正在生成 PDF 报告...'}
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
          ${isEn ? 'Loading site photos, please wait...' : '正在加载现场照片，请稍候...'}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  try {
    // Update progress
    const progressEl = document.getElementById('pdf-progress');
    if (progressEl) progressEl.style.width = '30%';

    // Create print content (async, includes photo download)
    const printContent = await createPrintContent(record, lastEvaluation, lang);

    if (progressEl) progressEl.style.width = '80%';

    // Create new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(isEn ? 'Please allow pop-up windows to generate the PDF report' : '请允许弹出窗口以生成PDF报告');
      return;
    }

    // Write content
    printWindow.document.write(printContent);
    printWindow.document.close();

    if (progressEl) progressEl.style.width = '100%';

    // Auto print after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        // Remove loading indicator
        document.body.removeChild(loadingDiv);
        printWindow.print();
      }, 500);
    };
  } catch (error) {
    console.error(isEn ? 'PDF generation failed:' : '生成 PDF 失败:', error);
    document.body.removeChild(loadingDiv);
    alert(isEn ? 'PDF generation failed, please try again' : '生成 PDF 失败，请重试');
  }
}
