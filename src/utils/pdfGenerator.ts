import { auditModules } from '../data/modules';
import { EvaluationRecord } from '../types';

// 创建打印友好的HTML内容
function createPrintContent(record: EvaluationRecord, lastEvaluation?: EvaluationRecord): string {
  // 收集问题项
  const keyItems: string[] = [];
  const otherItems: string[] = [];
  
  // 整改复查模式的对比数据
  const improvedItems: string[] = [];
  const remainingItems: string[] = [];
  const newItems: string[] = [];

  auditModules.forEach(mod => {
    if (!record.selectedModules.includes(mod.name)) return;

    Object.entries(mod.subModules).forEach(([subModName, subMod]) => {
      subMod.items.forEach(item => {
        const result = record.results[item.id];
        
        let itemText = `${mod.name} - ${subModName}: ${item.name}`;
        
        // 整改复查模式的对比
        if (lastEvaluation && lastEvaluation.results) {
          const lastResult = lastEvaluation.results[item.id];
          if (lastResult && !lastResult.isChecked) {
            // 上次不合格，看这次是否整改
            if (result && result.isChecked) {
              // 已整改
              improvedItems.push(`${itemText} ✅ 已整改`);
            } else if (result && !result.isChecked) {
              // 仍存在的问题
              if (result.details && result.details.length > 0) {
                itemText += ` (问题: ${result.details.join(', ')})`;
              }
              remainingItems.push(`${itemText} ❌ 仍未整改`);
            }
          } else if (!lastResult || lastResult.isChecked) {
            // 上次合格或没有记录，这次又出现问题
            if (result && !result.isChecked) {
              if (result.details && result.details.length > 0) {
                itemText += ` (问题: ${result.details.join(', ')})`;
              }
              newItems.push(`${itemText} ⚠️ 新问题`);
            }
          }
        }
        
        // 非整改复查模式或仅收集问题项
        if (!lastEvaluation && result && !result.isChecked) {
          if (result.details && result.details.length > 0) {
            itemText += ` (问题: ${result.details.join(', ')})`;
          }
          if (item.comment) {
            itemText += ` [建议: ${item.comment}]`;
          }
          if (result.comment) {
            itemText += ` [评论: ${result.comment}]`;
          }
          
          if (item.isKey) {
            keyItems.push(itemText);
          } else {
            otherItems.push(itemText);
          }
        }
      });
    });
  });

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
      margin: 6px 0;
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
    ${improvedItems.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}
  </ul>
  ` : ''}

  ${remainingItems.length > 0 ? `
  <h3 style="color: #ef4444;">（二）整改后仍存在的问题</h3>
  <ul>
    ${remainingItems.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}
  </ul>
  ` : ''}

  ${newItems.length > 0 ? `
  <h3 style="color: #ef4444;">（三）新增问题</h3>
  <ul>
    ${newItems.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}
  </ul>
  ` : ''}

  ${improvedItems.length === 0 && remainingItems.length === 0 && newItems.length === 0 ? `
  <p class="no-issue">本次整改复查未发现明显变化</p>
  ` : ''}
  ` : `
  ${keyItems.length > 0 ? `
  <h3>（一）重点工序</h3>
  <ul class="key-items">
    ${keyItems.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}
  </ul>
  ` : `<p class="no-issue">本次评估未发现重点工序问题</p>`}

  <h3>（二）其他工序</h3>
  ${otherItems.length > 0 ? `
  <ul>
    ${otherItems.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}
  </ul>
  ` : `<p class="no-issue">本次评估未发现其他工序问题</p>`}
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

export function generatePDFDownload(record: EvaluationRecord, lastEvaluation?: EvaluationRecord): void {
  // 生成HTML内容
  const printContent = createPrintContent(record, lastEvaluation);

  // 创建Blob并下载
  const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `工厂评估报告_${record.factoryName}_${record.evalDate}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 提示用户
  alert('报告已下载为HTML文件，请在浏览器中打开并使用"打印 -> 另存为PDF"功能导出为PDF');
}
