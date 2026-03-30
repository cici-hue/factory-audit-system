import { auditModules } from '../data/modules';
import { EvaluationRecord, FailedItemPriority } from '../types';

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
}

// 创建打印友好的HTML内容
function createPrintContent(record: EvaluationRecord, lastEvaluation?: EvaluationRecord): string {
  // 收集所有不合格项
  const failedItems: FailedItemInfo[] = [];
  
  // 整改复查模式的对比数据
  const improvedItems: FailedItemInfo[] = [];
  const remainingItems: FailedItemInfo[] = [];
  const newItems: FailedItemInfo[] = [];

  auditModules.forEach(mod => {
    if (!record.selectedModules.includes(mod.name)) return;

    Object.entries(mod.subModules).forEach(([subModName, subMod]) => {
      subMod.items.forEach(item => {
        const result = record.results[item.id];
        if (!result) return;
        
        const itemInfo: FailedItemInfo = {
          itemId: item.id,
          moduleName: mod.name,
          subModuleName: subModName,
          itemName: item.name,
          score: item.score,
          details: result.details || [],
          comment: result.comment || '',
          isKey: item.isKey
        };
        
        // 整改复查模式的对比
        if (lastEvaluation && lastEvaluation.results) {
          const lastResult = lastEvaluation.results[item.id];
          if (lastResult && !lastResult.isChecked) {
            // 上次不合格，看这次是否整改
            if (result.isChecked) {
              // 已整改
              improvedItems.push(itemInfo);
            } else {
              // 仍存在的问题
              remainingItems.push(itemInfo);
            }
          } else if ((!lastResult || lastResult.isChecked) && !result.isChecked) {
            // 上次合格或没有记录，这次又出现问题
            newItems.push(itemInfo);
          }
        }
        
        // 收集不合格项（用于优先级排序）
        if (!result.isChecked) {
          failedItems.push(itemInfo);
        }
      });
    });
  });

  // 根据优先级排序（如果有）
  const { urgentItems, normalItems } = sortFailedItemsByPriority(failedItems, record.failedItemsPriority);

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

  <div class="footer">
    <p>此报告由欧图工厂审核系统自动生成</p>
  </div>
</body>
</html>
  `;

  return html;
}

// 根据优先级排序不合格项
function sortFailedItemsByPriority(
  failedItems: FailedItemInfo[],
  priorityData?: FailedItemPriority[]
): { urgentItems: FailedItemInfo[]; normalItems: FailedItemInfo[] } {
  if (!priorityData || priorityData.length === 0) {
    // 没有优先级数据，按分值排序
    const sorted = [...failedItems].sort((a, b) => b.score - a.score);
    return {
      urgentItems: sorted.slice(0, 10),
      normalItems: sorted.slice(10)
    };
  }

  // 创建优先级映射
  const priorityMap = new Map<string, FailedItemPriority>();
  priorityData.forEach(p => priorityMap.set(p.itemId, p));

  // 按优先级排序
  const sorted = [...failedItems].sort((a, b) => {
    const priorityA = priorityMap.get(a.itemId)?.priority || 999;
    const priorityB = priorityMap.get(b.itemId)?.priority || 999;
    return priorityA - priorityB;
  });

  // 分离急需项和一般项
  const urgentItems: FailedItemInfo[] = [];
  const normalItems: FailedItemInfo[] = [];

  sorted.forEach(item => {
    const priority = priorityMap.get(item.itemId);
    if (priority && priority.isUrgent) {
      urgentItems.push(item);
    } else {
      normalItems.push(item);
    }
  });

  return { urgentItems, normalItems };
}

export function generatePDF(record: EvaluationRecord, lastEvaluation?: EvaluationRecord): void {
  // 创建打印内容
  const printContent = createPrintContent(record, lastEvaluation);

  // 创建新的窗口
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('请允许弹出窗口以生成PDF报告');
    return;
  }

  // 写入内容
  printWindow.document.write(printContent);
  printWindow.document.close();

  // 等待内容加载完成后自动打印
  printWindow.onload = () => {
    // 延迟一点确保字体加载
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}
