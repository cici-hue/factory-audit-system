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

请按照以下结构生成分析报告，总字数控制在1500字以内：

## 总体评估概览（约250字）
基于总得分${totalScore}，对工厂整体表现进行评价：
- 工厂处于什么水平（优秀/良好/一般/需改进）
- 主要亮点（做得好的方面）
- 主要问题（基于不合格项）

## 重点问题分析（根据不合格项数量调整字数，每项至少80-100字）
针对所有${failedItems.length}个不合格项，必须逐条详细分析，不允许合并或省略任何一项：

对每个不合格项，必须包含以下要素：
1. 问题编号和名称（引用评估项完整名称）
2. 具体问题描述（详细说明是什么问题）
3. 问题影响分析（对生产/质量/交期的具体影响）
4. 后果评估（不整改会导致什么后果）

【严格要求】
- 每个不合格项单独成段，用序号标明
- 不允许将多个问题合并描述
- 不允许用"其他项"、"其余问题"等模糊表述
- 必须引用评估项原文
- 不要编造，只分析数据中存在的问题

## 改进建议（约350字）
针对每个不合格项，提供具体改进措施：
- 具体要做什么
- 谁来做
- 什么时候完成

## 风险预警（约150字）
- 如果不整改会有什么风险
- 风险等级评估

## 优化方向（约50字）
- 2-3条长期改进方向

要求：
1. 严格基于提供的评估数据，不要编造
2. 提到具体问题时，要引用评估项的原文
3. 语言简洁明了，避免空话套话
4. 建议要具体可操作
5. 总字数控制在1500字以内

请基于真实数据生成分析报告！`
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
  const lines = text.split('\n')
  let inSection = false
  const sectionContent: string[] = []

  // 定义所有可能的章节标题（用于识别下一个章节的开始）
  const allSectionTitles = [
    '总体评估概览',
    '重点问题分析',
    '改进建议',
    '风险预警',
    '优化方向'
  ]

  // 辅助函数：检查是否是章节标题行
  const isChapterTitle = (line: string): boolean => {
    // 支持格式：
    // ## 总体评估概览
    // ### **一、 总体评估概览**
    // 一、总体评估概览
    // **一、 总体评估概览**
    return line.startsWith('## ') || 
           line.startsWith('### ') ||
           line.match(/^[一二三四五]、/) !== null ||
           line.match(/^\*\*[一二三四五]、/) !== null
  }

  for (const line of lines) {
    // 检查是否是目标章节的标题行
    const isSectionStart = line.includes(sectionName) && isChapterTitle(line)
    
    if (isSectionStart) {
      inSection = true
      continue
    }

    if (inSection) {
      // 检查是否是下一个章节的开始
      const isNextSection = isChapterTitle(line) ||
                            allSectionTitles.some(title => line.includes(title) && !line.includes(sectionName))
      
      if (isNextSection) {
        break
      }
      
      if (line.trim()) {
        sectionContent.push(line.trim())
      }
    }
  }

  const result = sectionContent.join('\n')
  return result || '暂无详细分析'
}
