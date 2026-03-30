// AI总结Edge Function - 仅支持DeepSeek
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== 收到AI总结请求 ===')

  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 验证请求方法
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: '只支持POST请求' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 解析请求体
    const body = await req.json()
    const { evaluationData, apiKey } = body

    if (!evaluationData) {
      return new Response(
        JSON.stringify({ error: '缺少evaluationData参数' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: '缺少API密钥，请检查环境变量配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('工厂名称:', evaluationData.工厂信息?.名称)
    console.log('不合格项数量:', evaluationData.不合格项汇总?.length || 0)
    console.log('不合格项数据:', JSON.stringify(evaluationData.不合格项汇总, null, 2))

    // 构建提示词
    const prompt = buildAIPrompt(evaluationData)

    // 调用DeepSeek API
    const aiResponse = await callDeepSeekAPI(prompt, apiKey)

    // 解析AI响应
    const aiSummary = parseAIResponse(aiResponse)

    return new Response(
      JSON.stringify({
        success: true,
        data: aiSummary
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('AI总结处理失败:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// 调用DeepSeek API
async function callDeepSeekAPI(prompt: string, apiKey: string): Promise<string> {
  console.log('正在调用DeepSeek API...')

  const response = await fetch(
    'https://api.deepseek.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    }
  )

  console.log('DeepSeek API响应状态:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('DeepSeek API错误响应:', errorText)
    throw new Error(`DeepSeek API调用失败: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  console.log('DeepSeek API响应成功，数据长度:', data.choices[0].message.content.length)

  return data.choices[0].message.content
}

// 构建AI提示词
function buildAIPrompt(evaluationData: any): string {
  const failedItems = evaluationData.不合格项汇总 || [];
  const totalScore = evaluationData.工厂信息?.总得分 || '0%';

  return `你是一位资深的服装制造行业质量管理专家。请基于以下真实的工厂评估数据，生成一份专业、客观的分析报告。

【重要提示】
1. 必须严格基于提供的评估数据进行分析，不要编造不存在的问题
2. 重点关注"不合格项汇总"中列出的具体问题
3. 分析要紧扣实际的评估项内容，不要泛泛而谈
4. 如果某项没有问题，就不要在报告中提及

工厂基本信息：
- 工厂名称：${evaluationData.工厂信息?.名称}
- 评估日期：${evaluationData.工厂信息?.评估日期}
- 评估类型：${evaluationData.工厂信息?.评估类型}
- 总得分：${totalScore}

不合格项汇总（共${failedItems.length}项）：
${JSON.stringify(failedItems, null, 2)}

评估员备注：
${evaluationData.评估员备注}

请严格按照以下五个独立模块生成分析报告，每个模块之间不要重复内容：

【模块一】总体评估概览（约250字）
只包含：
- 基于总得分${totalScore}，对工厂整体水平评价（优秀/良好/一般/需改进）
- 主要亮点（做得好的方面）
- 主要问题类别概述（不要展开具体问题细节）

【模块二】重点问题分析（约400字）
只包含：
- 针对不合格项逐条分析具体问题
- 引用评估项原文说明问题
- 问题的影响和后果
- 不要包含改进建议、风险预警等内容

【模块三】改进建议（约350字）
只包含：
- 针对模块二分析的问题，给出具体改进措施
- 具体要做什么、谁来做、什么时候完成
- 不要重复描述问题本身

【模块四】风险预警（约150字）
只包含：
- 如果不整改会有什么风险
- 风险等级评估（高/中/低）
- 不要重复问题和建议内容

【模块五】优化方向（约50字）
只包含：
- 2-3条长期战略改进方向
- 不要涉及具体整改措施

【重要要求】
1. 五个模块必须严格分离，内容互不重复
2. 模块一只概述，不展开细节
3. 模块二只分析问题，不给建议
4. 模块三只给建议，不重复问题描述
5. 模块四只谈风险，不涉及其他内容
6. 模块五只谈长期方向
7. 严格基于提供的评估数据，不要编造
8. 总字数控制在1200字以内

请确保各模块内容独立，不要交叉重复！`
}

// 解析AI响应
function parseAIResponse(aiResponse: string): any {
  return {
    overallAssessment: extractSection(aiResponse, '总体评估概览'),
    keyIssuesAnalysis: extractSection(aiResponse, '重点问题分析'),
    improvementSuggestions: extractSection(aiResponse, '改进建议'),
    riskWarnings: extractSection(aiResponse, '风险预警'),
    optimizationDirection: extractSection(aiResponse, '优化方向'),
    generatedAt: new Date().toISOString(),
    rawResponse: aiResponse
  }
}

// 提取特定章节内容
function extractSection(text: string, sectionName: string): string {
  // 支持多种可能的分隔符
  const sectionPatterns = [
    `【模块】${sectionName}`,
    `【模块一】${sectionName}`,
    `【模块二】${sectionName}`,
    `【模块三】${sectionName}`,
    `【模块四】${sectionName}`,
    `【模块五】${sectionName}`,
    `## ${sectionName}`,
    `**${sectionName}**`,
    `${sectionName}`
  ];
  
  const nextSectionPatterns = [
    '【模块一】',
    '【模块二】',
    '【模块三】',
    '【模块四】',
    '【模块五】',
    '## '
  ];
  
  let startIndex = -1;
  
  // 找到章节开始位置
  for (const pattern of sectionPatterns) {
    const idx = text.indexOf(pattern);
    if (idx !== -1) {
      startIndex = idx + pattern.length;
      break;
    }
  }
  
  if (startIndex === -1) {
    return '暂无详细分析';
  }
  
  // 找到下一个章节开始位置
  let endIndex = text.length;
  for (const pattern of nextSectionPatterns) {
    const idx = text.indexOf(pattern, startIndex);
    if (idx !== -1 && idx < endIndex) {
      endIndex = idx;
    }
  }
  
  // 提取内容
  let content = text.substring(startIndex, endIndex).trim();
  
  // 清理内容
  content = content
    .replace(/^[:：]\s*/, '')  // 去掉开头的冒号
    .replace(/^\n+/, '')       // 去掉开头的空行
    .replace(/\n+$/, '');      // 去掉结尾的空行
  
  return content || '暂无详细分析';
}
