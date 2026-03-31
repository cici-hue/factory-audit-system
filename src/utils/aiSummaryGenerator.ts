// AI总结报告生成器
import { EvaluationRecord } from '../types';

// AI总结报告数据结构
export interface AISummaryReport {
  overallAssessment: string;
  keyIssuesAnalysis: string;
  improvementSuggestions: string;
  riskWarnings: string;
  optimizationDirection: string;
  generatedAt: string;
}

// 生成AI总结
export async function generateAISummary(record: EvaluationRecord): Promise<AISummaryReport> {
  const evaluationSummary = buildEvaluationSummary(record);
  // callDeepSeekAPI 现在直接返回解析后的 AISummaryReport
  return callDeepSeekAPI(evaluationSummary);
}

// 导入模块定义
import { auditModules } from '../data/modules';

// 构建评估数据摘要
function buildEvaluationSummary(record: EvaluationRecord): string {
  const summary = {
    工厂信息: {
      名称: record.factoryName,
      评估日期: record.evalDate,
      评估类型: record.evalType,
      总得分: `${record.overallPercent.toFixed(2)}%`
    },
    详细评估结果: getDetailedResults(record),
    不合格项汇总: getFailedItemsDetailed(record),
    评估员备注: record.comments || '无'
  };

  return JSON.stringify(summary, null, 2);
}

// 获取详细的评估结果
function getDetailedResults(record: EvaluationRecord): any[] {
  const results = record.results || {};
  const detailedResults: any[] = [];

  // 遍历所有模块
  auditModules.forEach(module => {
    Object.entries(module.subModules).forEach(([subModuleName, subModule]) => {
      subModule.items.forEach(item => {
        const result = results[item.id];
        if (result) {
          const itemData: any = {
            模块: module.name,
            子模块: subModuleName,
            评估项: item.name,
            分值: item.score,
            是否合格: result.isChecked,
            不合格详情: result.details || [],
            评估员评论: result.comment || ''
          };
          detailedResults.push(itemData);
        }
      });
    });
  });

  return detailedResults;
}

// 获取详细的不合格项
function getFailedItemsDetailed(record: EvaluationRecord): any[] {
  const results = record.results || {};
  const failedItems: any[] = [];

  console.log('获取不合格项，record.results:', Object.keys(results).length, '项');

  auditModules.forEach(module => {
    Object.entries(module.subModules).forEach(([subModuleName, subModule]) => {
      subModule.items.forEach(item => {
        const result = results[item.id];
        // 调试：打印每个评估项的结果
        if (result && !result.isChecked) {
          console.log(`不合格项: ${item.id} - ${item.name}, isChecked: ${result.isChecked}, details:`, result.details);
        }
        // 只要 isChecked 为 false 就算不合格，不管 details 有没有内容
        if (result && !result.isChecked) {
          failedItems.push({
            模块: module.name,
            子模块: subModuleName,
            评估项: item.name,
            不合格内容: result.details || [],
            评估员建议: result.comment || ''
          });
        }
      });
    });
  });

  console.log('找到不合格项数量:', failedItems.length);
  return failedItems;
}

// 获取模块得分情况
function getModuleScores(record: EvaluationRecord): any {
  const moduleScores: { [key: string]: { score: number; total: number; percent: number } } = {};

  // 从results中提取各模块的得分情况
  const results = record.results || {};

  // 按模块分组统计
  const moduleGroups: { [key: string]: { checked: number; total: number } } = {};

  Object.entries(results).forEach(([key, result]) => {
    const moduleId = key.split('_')[0]; // 获取模块ID前缀
    if (!moduleGroups[moduleId]) {
      moduleGroups[moduleId] = { checked: 0, total: 0 };
    }
    moduleGroups[moduleId].total++;
    if (result.isChecked) {
      moduleGroups[moduleId].checked++;
    }
  });

  // 计算每个模块的得分率
  Object.entries(moduleGroups).forEach(([moduleId, data]) => {
    moduleScores[moduleId] = {
      score: data.checked,
      total: data.total,
      percent: data.total > 0 ? Math.round((data.checked / data.total) * 100) : 0
    };
  });

  return moduleScores;
}

// 获取不合格项列表
function getFailedItems(record: EvaluationRecord): any[] {
  const failedItems: any[] = [];
  const results = record.results || {};

  Object.entries(results).forEach(([key, result]) => {
    if (!result.isChecked && result.details && result.details.length > 0) {
      failedItems.push({
        itemId: key,
        details: result.details,
        comment: result.comment || '',
        hasImage: !!result.imagePath
      });
    }
  });

  return failedItems;
}

// 获取历史整改情况
function getRectificationHistory(record: EvaluationRecord): any {
  // 如果是整改复查，返回相关信息
  if (record.evalType === '整改复查') {
    return {
      审核性质: '整改复查',
      整改说明: record.comments || '无'
    };
  }
  return null;
}

// 调用DeepSeek API
async function callDeepSeekAPI(evaluationSummary: string): Promise<string> {
  const evaluationData = JSON.parse(evaluationSummary);

  // 调试：打印传给AI的数据
  console.log('=== 传给AI的评估数据 ===');
  console.log('不合格项数量:', evaluationData.不合格项汇总?.length || 0);
  console.log('不合格项:', JSON.stringify(evaluationData.不合格项汇总, null, 2));
  console.log('详细评估结果数量:', evaluationData.详细评估结果?.length || 0);
  console.log('前3项评估结果:', JSON.stringify(evaluationData.详细评估结果?.slice(0, 3), null, 2));
  console.log('========================');

  const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_PROJECT_REF')) {
    throw new Error('Supabase配置缺失，请检查环境变量');
  }

  if (!deepseekApiKey) {
    throw new Error('DeepSeek API密钥未配置，请在.env文件中设置VITE_DEEPSEEK_API_KEY');
  }

  console.log('使用Supabase Edge Function调用DeepSeek API');

  const response = await fetch(`${supabaseUrl}/functions/v1/ai-summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      evaluationData,
      apiKey: deepseekApiKey
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Edge Function调用失败');
  }

  const result = await response.json();
  if (result.success) {
    // Edge Function 已经解析好了，直接返回解析后的数据
    return result.data as AISummaryReport;
  } else {
    throw new Error(result.error || 'AI分析失败');
  }
}

// 格式化AI内容：去掉Markdown符号，加粗小标题，保持段落格式
function formatAIContent(content: string): string {
  if (!content) return '暂无详细分析';

  // 先处理整个内容，去掉Markdown标题符号（但保留表格）
  let processedContent = content
    .replace(/^#{1,6}\s*/gm, '')  // 去掉行首的 # ## ### 等标题符号
    .replace(/\*\*/g, '')         // 去掉 ** 粗体符号
    .replace(/\*/g, '')           // 去掉 * 符号
    .replace(/`/g, '');           // 去掉 ` 代码符号

  // 按段落分割
  const paragraphs = processedContent.split('\n\n');
  
  return paragraphs
    .map(paragraph => {
      // 检查是否是表格（包含 | 符号）
      const lines = paragraph.split('\n');
      const isTable = lines.some(line => line.includes('|'));
      
      if (isTable) {
        // 处理表格：去掉 | 符号，保留内容
        const tableRows = lines
          .filter(line => line.trim() && !line.match(/^\|[-:]+\|/)) // 去掉分隔线
          .map(line => {
            // 分割单元格
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
            if (cells.length === 0) return '';
            // 用空格连接单元格内容
            return cells.join(' ');
          })
          .filter(line => line.trim());
        
        if (tableRows.length === 0) return '';
        return `<p>${tableRows.join('<br>')}</p>`;
      }
      
      // 处理普通段落
      const processedLines = lines
        .map(line => {
          // 去掉行首的列表符号
          let formattedLine = line.replace(/^\s*[-*•]\s*/, '');
          
          // 加粗整个标题行（如：1. 问题描述、2. 建议措施等）
          formattedLine = formattedLine.replace(/^(\d+\.\s*)(.+)$/, '<strong>$1$2</strong>');
          
          return formattedLine;
        })
        .filter(line => line.trim());
      
      // 如果段落有多行，用 <br> 连接；如果只有一行，直接返回
      if (processedLines.length === 0) return '';
      if (processedLines.length === 1) return `<p>${processedLines[0]}</p>`;
      return `<p>${processedLines.join('<br>')}</p>`;
    })
    .filter(p => p.trim())
    .join('');
}

// 生成AI总结PDF报告
export function generateAISummaryPDF(record: EvaluationRecord, aiSummary: AISummaryReport): void {
  const printContent = createAISummaryHTML(record, aiSummary);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('请允许弹出窗口以生成AI总结报告');
    return;
  }

  printWindow.document.write(printContent);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

// 创建AI总结HTML内容
function createAISummaryHTML(record: EvaluationRecord, aiSummary: AISummaryReport): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AI智能分析报告 - ${record.factoryName}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
      font-size: 12px;
      line-height: 1.8;
      color: #333;
      padding: 20px;
    }
    h1 {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
      color: #2563eb;
    }
    h2 {
      font-size: 16px;
      margin: 20px 0 12px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 5px;
      color: #1e40af;
      font-weight: 700;
    }
    .info-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .info-box p {
      margin: 6px 0;
    }
    .section {
      margin: 15px 0;
      padding: 15px;
      border-radius: 8px;
      background: #fafafa;
      border-left: 4px solid #3b82f6;
    }
    .section p {
      margin: 8px 0;
      text-align: justify;
    }
    .section p:first-child {
      margin-top: 0;
    }
    .section p:last-child {
      margin-bottom: 0;
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
  <h1>AI智能分析报告</h1>

  <div class="info-box">
    <p><strong>工厂名称：</strong>${record.factoryName}</p>
    <p><strong>评估日期：</strong>${record.evalDate}</p>
    <p><strong>评估人员：</strong>${record.evaluator}</p>
    <p><strong>审核性质：</strong>${record.evalType}</p>
    <p><strong>工厂总分：</strong>${record.overallPercent.toFixed(2)}%</p>
    <p><strong>AI分析时间：</strong>${new Date(aiSummary.generatedAt).toLocaleString('zh-CN')}</p>
  </div>

  <h2>总体评估概览</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.overallAssessment)}</p>
  </div>

  <h2>重点问题分析</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.keyIssuesAnalysis)}</p>
  </div>

  <h2>改进建议</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.improvementSuggestions)}</p>
  </div>

  <h2>风险预警</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.riskWarnings)}</p>
  </div>

  <h2>优化方向</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.optimizationDirection)}</p>
  </div>

  <div class="footer">
    <p>此报告由欧图工厂审核系统AI分析生成</p>
  </div>
</body>
</html>
  `;
}
