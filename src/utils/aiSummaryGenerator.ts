// AI Summary Report Generator
import { EvaluationRecord, AuditModule } from '../types';
import { lightWovenModules, lingerieSwimwearModules, flatKnitModules } from '../data/factoryModules';

// AI Summary Report Data Structure
export interface AISummaryReport {
  overallAssessment: string;
  keyIssuesAnalysis: string;
  improvementSuggestions: string;
  riskWarnings: string;
  optimizationDirection: string;
  generatedAt: string;
}

// Generate AI summary
export async function generateAISummary(record: EvaluationRecord, lang: 'zh' | 'en' = 'zh'): Promise<AISummaryReport> {
  const evaluationSummary = buildEvaluationSummary(record, lang);
  // callDeepSeekAPI directly returns parsed AISummaryReport
  return callDeepSeekAPI(evaluationSummary);
}

// Get all modules
const allModules: AuditModule[] = [...lightWovenModules, ...lingerieSwimwearModules, ...flatKnitModules];

// Build evaluation data summary
function buildEvaluationSummary(record: EvaluationRecord, lang: 'zh' | 'en' = 'zh'): string {
  const isEn = lang === 'en';
  const summary = {
    [isEn ? 'factoryInfo' : '工厂信息']: {
      [isEn ? 'name' : '名称']: record.factoryName,
      [isEn ? 'auditDate' : '评估日期']: record.evalDate,
      [isEn ? 'auditType' : '评估类型']: record.evalType,
      [isEn ? 'totalScore' : '总得分']: `${record.overallPercent.toFixed(2)}%`
    },
    [isEn ? 'detailedResults' : '详细评估结果']: getDetailedResults(record, lang),
    [isEn ? 'failedItems' : '不合格项汇总']: getFailedItemsDetailed(record, lang),
    [isEn ? 'evaluatorNotes' : '评估员备注']: record.comments || (isEn ? 'None' : '无')
  };

  return JSON.stringify(summary, null, 2);
}

// Create item ID to module info map
const itemIdToModuleMap = new Map<string, { item: any; moduleName: string; subModuleName: string }>();
allModules.forEach(module => {
  Object.entries(module.subModules).forEach(([subModuleName, subModule]) => {
    subModule.items.forEach(item => {
      itemIdToModuleMap.set(item.id, { item, moduleName: module.name, subModuleName });
    });
  });
});

// Get detailed evaluation results
function getDetailedResults(record: EvaluationRecord, lang: 'zh' | 'en' = 'zh'): any[] {
  const isEn = lang === 'en';
  const results = record.results || {};
  const detailedResults: any[] = [];

  // Only iterate items that have actual data
  Object.entries(results).forEach(([itemId, result]) => {
    const moduleInfo = itemIdToModuleMap.get(itemId);
    if (moduleInfo) {
      const itemData: any = {
        [isEn ? 'module' : '模块']: moduleInfo.moduleName,
        [isEn ? 'subModule' : '子模块']: moduleInfo.subModuleName,
        [isEn ? 'item' : '评估项']: moduleInfo.item.name,
        [isEn ? 'score' : '分值']: moduleInfo.item.score,
        [isEn ? 'passed' : '是否合格']: result.isChecked,
        [isEn ? 'failedDetails' : '不合格详情']: result.details || [],
        [isEn ? 'evaluatorComment' : '评估员评论']: result.comment || ''
      };
      detailedResults.push(itemData);
    }
  });

  return detailedResults;
}

// Get detailed failed items
function getFailedItemsDetailed(record: EvaluationRecord, lang: 'zh' | 'en' = 'zh'): any[] {
  const isEn = lang === 'en';
  const results = record.results || {};
  const failedItems: any[] = [];

  // Only iterate items that have actual data
  Object.entries(results).forEach(([itemId, result]) => {
    const moduleInfo = itemIdToModuleMap.get(itemId);
    if (moduleInfo && !result.isChecked) {
      failedItems.push({
        [isEn ? 'module' : '模块']: moduleInfo.moduleName,
        [isEn ? 'subModule' : '子模块']: moduleInfo.subModuleName,
        [isEn ? 'item' : '评估项']: moduleInfo.item.name,
        [isEn ? 'failedContent' : '不合格内容']: result.details || [],
        [isEn ? 'evaluatorSuggestion' : '评估员建议']: result.comment || ''
      });
    }
  });

  return failedItems;
}

// Get module scores
function getModuleScores(record: EvaluationRecord): any {
  const moduleScores: { [key: string]: { score: number; total: number; percent: number } } = {};

  // Extract score from results
  const results = record.results || {};

  // Group by module
  const moduleGroups: { [key: string]: { checked: number; total: number } } = {};

  Object.entries(results).forEach(([key, result]) => {
    const moduleId = key.split('_')[0]; // Get module ID prefix
    if (!moduleGroups[moduleId]) {
      moduleGroups[moduleId] = { checked: 0, total: 0 };
    }
    moduleGroups[moduleId].total++;
    if (result.isChecked) {
      moduleGroups[moduleId].checked++;
    }
  });

  // Calculate each module score rate
  Object.entries(moduleGroups).forEach(([moduleId, data]) => {
    moduleScores[moduleId] = {
      score: data.checked,
      total: data.total,
      percent: data.total > 0 ? Math.round((data.checked / data.total) * 100) : 0
    };
  });

  return moduleScores;
}

// Get failed items list
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

// Get rectification history
function getRectificationHistory(record: EvaluationRecord): any {
  // If rectification review, return related info
  if (record.evalType === '整改复查') {
    return {
      auditType: 'Rectification Review',
      rectificationNote: record.comments || 'None'
    };
  }
  return null;
}

// Call DeepSeek API
async function callDeepSeekAPI(evaluationSummary: string): Promise<AISummaryReport> {
  const evaluationData = JSON.parse(evaluationSummary);

  // Debug: print data sent to AI
  console.log('=== Data sent to AI ===');
  console.log('Failed items count:', evaluationData.failedItems?.length || 0);
  console.log('Failed items:', JSON.stringify(evaluationData.failedItems, null, 2));
  console.log('Detailed results count:', evaluationData.detailedResults?.length || 0);
  console.log('First 3 results:', JSON.stringify(evaluationData.detailedResults?.slice(0, 3), null, 2));
  console.log('========================');

  const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_PROJECT_REF')) {
    throw new Error('Supabase configuration missing, please check environment variables');
  }

  if (!deepseekApiKey) {
    throw new Error('DeepSeek API key not configured, please set VITE_DEEPSEEK_API_KEY in .env file');
  }

  console.log('Using Supabase Edge Function to call DeepSeek API');

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
    throw new Error(errorData.error || 'Edge Function call failed');
  }

  const result = await response.json();
  console.log('=== Edge Function Return Data ===');
  console.log('result.success:', result.success);
  console.log('result.data:', JSON.stringify(result.data, null, 2));
  console.log('========================');

  if (result.success) {
    // Edge Function already parsed, return parsed data directly
    return result.data as AISummaryReport;
  } else {
    throw new Error(result.error || 'AI analysis failed');
  }
}

// Format AI content: remove Markdown symbols, bold subtitles, keep paragraph format
function formatAIContent(content: string): string {
  if (!content) return 'No detailed analysis';

  // Process content, remove Markdown header symbols (keep tables)
  const processedContent = content
    .replace(/^#{1,6}\s*/gm, '')  // Remove leading # ## ### etc.
    .replace(/\*\*/g, '')         // Remove ** bold symbols
    .replace(/\*/g, '')           // Remove * symbols
    .replace(/`/g, '');           // Remove ` code symbols

  // Split by paragraphs
  const paragraphs = processedContent.split('\n\n');

  return paragraphs
    .map(paragraph => {
      // Check if it's a table (contains |)
      const lines = paragraph.split('\n');
      const isTable = lines.some(line => line.includes('|'));

      if (isTable) {
        // Process table: remove | symbols, keep content
        const tableRows = lines
          .filter(line => line.trim() && !line.match(/^\|[-:]+\|/)) // Remove separator lines
          .map(line => {
            // Split cells
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
            if (cells.length === 0) return '';
            // Join cells with space
            return cells.join(' ');
          })
          .filter(line => line.trim());

        if (tableRows.length === 0) return '';
        return `<p>${tableRows.join('<br>')}</p>`;
      }

      // Process regular paragraph
      const processedLines = lines
        .map(line => {
          // Remove leading list symbols
          let formattedLine = line.replace(/^\s*[-*•]\s*/, '');

          // Bold entire title line (e.g.: 1. Problem Description, 2. Suggestion Measures etc.)
          formattedLine = formattedLine.replace(/^(\d+\.\s*)(.+)$/, '<strong>$1$2</strong>');

          return formattedLine;
        })
        .filter(line => line.trim());

      // If paragraph has multiple lines, use <br>; if only one line, return directly
      if (processedLines.length === 0) return '';
      if (processedLines.length === 1) return `<p>${processedLines[0]}</p>`;
      return `<p>${processedLines.join('<br>')}</p>`;
    })
    .filter(p => p.trim())
    .join('');
}

// Generate AI summary PDF report
export function generateAISummaryPDF(record: EvaluationRecord, aiSummary: AISummaryReport, lang: 'zh' | 'en' = 'zh'): void {
  const printContent = createAISummaryHTML(record, aiSummary, lang);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert(lang === 'en' ? 'Please allow pop-up windows to generate the AI summary report' : '请允许弹出窗口以生成AI总结报告');
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

// Create AI summary HTML content
function createAISummaryHTML(record: EvaluationRecord, aiSummary: AISummaryReport, lang: 'zh' | 'en' = 'zh'): string {
  const isEn = lang === 'en';
  const labels = {
    htmlLang: isEn ? 'en' : 'zh-CN',
    reportTitle: isEn ? 'AI Analysis Report' : 'AI智能分析报告',
    pageTitle: isEn ? `AI Analysis Report - ${record.factoryName}` : `AI智能分析报告 - ${record.factoryName}`,
    factory: isEn ? 'Factory: ' : '工厂名称：',
    evalDate: isEn ? 'Audit Date: ' : '评估日期：',
    evaluator: isEn ? 'Evaluator: ' : '评估人员：',
    evalType: isEn ? 'Audit Type: ' : '审核性质：',
    totalScore: isEn ? 'Total Score: ' : '工厂总分：',
    aiTime: isEn ? 'AI Analysis Time: ' : 'AI分析时间：',
    overall: isEn ? 'Overall Assessment' : '总体评估概览',
    keyProblems: isEn ? 'Key Problem Analysis' : '重点问题分析',
    suggestions: isEn ? 'Improvement Suggestions' : '改进建议',
    risk: isEn ? 'Risk Warning' : '风险预警',
    optimization: isEn ? 'Optimization Direction' : '优化方向',
    footer: isEn ? 'This report is generated by Factory Audit System AI' : '此报告由欧图工厂审核系统AI分析生成',
  };

  return `
<!DOCTYPE html>
<html lang="${labels.htmlLang}">
<head>
  <meta charset="UTF-8">
  <title>${labels.pageTitle}</title>
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
      font-family: 'Microsoft YaHei', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
  <h1>${labels.reportTitle}</h1>

  <div class="info-box">
    <p><strong>${labels.factory}</strong>${record.factoryName}</p>
    <p><strong>${labels.evalDate}</strong>${record.evalDate}</p>
    <p><strong>${labels.evaluator}</strong>${record.evaluator}</p>
    <p><strong>${labels.evalType}</strong>${record.evalType}</p>
    <p><strong>${labels.totalScore}</strong>${record.overallPercent.toFixed(2)}%</p>
    <p><strong>${labels.aiTime}</strong>${new Date(aiSummary.generatedAt).toLocaleString(isEn ? 'en-US' : 'zh-CN')}</p>
  </div>

  <h2>${labels.overall}</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.overallAssessment)}</p>
  </div>

  <h2>${labels.keyProblems}</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.keyIssuesAnalysis)}</p>
  </div>

  <h2>${labels.suggestions}</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.improvementSuggestions)}</p>
  </div>

  <h2>${labels.risk}</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.riskWarnings)}</p>
  </div>

  <h2>${labels.optimization}</h2>
  <div class="section">
    <p>${formatAIContent(aiSummary.optimizationDirection)}</p>
  </div>

  <div class="footer">
    <p>${labels.footer}</p>
  </div>
</body>
</html>
  `;
}
