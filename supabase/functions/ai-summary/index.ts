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

请严格按照以下五个独立部分生成分析报告。每个部分必须完全独立，绝对不能包含其他部分的内容：

【第一部分：总体评估概览】（严格控制在200-300字，只写概述）
内容仅限：
- 工厂整体水平评价（基于总得分${totalScore}）
- 2-3个主要亮点
- 主要问题类别概述（只列类别名称，不要展开具体问题细节，不要分析问题原因，不要给建议）
【本部分禁止】：分析具体问题、给出建议、讨论风险、提及优化方向

【第二部分：重点问题分析】（根据${failedItems.length}个不合格项数量调整字数）
内容仅限：
- 逐条列出每个不合格项的具体问题
- 每个问题的直接影响和后果
- 引用评估项原文说明问题
【本部分禁止】：写改进建议、讨论风险、提及优化方向、总结性语言

【第三部分：改进建议】（约300-400字）
内容仅限：
- 针对第二部分列出的问题，逐条给出改进措施
- 具体行动步骤
【本部分禁止】：重复描述问题、讨论风险、提及优化方向、写总结

【第四部分：风险预警】（约100-150字）
内容仅限：
- 不整改可能带来的风险
- 风险等级（高/中/低）
【本部分禁止】：重复问题描述、重复建议内容、提及优化方向

【第五部分：优化方向】（约30-50字）
内容仅限：
- 2-3条长期战略方向
【本部分禁止】：写具体措施、重复前面任何内容

【绝对禁止的行为】
1. 在第一部分写第二、三、四、五部分的内容
2. 在第二部分写第三、四、五部分的内容
3. 在第三部分写第四、五部分的内容
4. 在第四部分写第五部分的内容
5. 使用"针对上述问题"、"综上所述"等跨部分引用语句
6. 每个部分结尾不要写小结或过渡语句

【格式要求】
1. 每个部分标题必须使用【第X部分：XXX】格式
2. 部分之间用空行分隔
3. 只基于提供的评估数据，不要编造
4. 提到具体问题时引用评估项原文

请确保五个部分完全独立，内容绝不重复！`
}

// 解析AI响应
function parseAIResponse(aiResponse: string): any {
  return {
    overallAssessment: extractSection(aiResponse, '【第一部分：总体评估概览】'),
    keyIssuesAnalysis: extractSection(aiResponse, '【第二部分：重点问题分析】'),
    improvementSuggestions: extractSection(aiResponse, '【第三部分：改进建议】'),
    riskWarnings: extractSection(aiResponse, '【第四部分：风险预警】'),
    optimizationDirection: extractSection(aiResponse, '【第五部分：优化方向】'),
    generatedAt: new Date().toISOString(),
    rawResponse: aiResponse
  }
}

// 提取特定章节内容
function extractSection(text: string, sectionName: string): string {
  // 找到章节开始位置
  const startIdx = text.indexOf(sectionName);
  if (startIdx === -1) {
    return '暂无详细分析';
  }
  
  // 从章节标题后开始提取
  const contentStart = startIdx + sectionName.length;
  
  // 定义所有可能的下一个章节标题
  const nextSections = [
    '【第一部分：总体评估概览】',
    '【第二部分：重点问题分析】',
    '【第三部分：改进建议】',
    '【第四部分：风险预警】',
    '【第五部分：优化方向】'
  ];
  
  // 找到下一个章节的位置
  let endIdx = text.length;
  for (const nextSection of nextSections) {
    const idx = text.indexOf(nextSection, contentStart);
    if (idx !== -1 && idx < endIdx) {
      endIdx = idx;
    }
  }
  
  // 提取内容
  let content = text.substring(contentStart, endIdx).trim();
  
  // 清理内容
  content = content
    .replace(/^\n+/, '')           // 去掉开头的空行
    .replace(/\n+$/, '')           // 去掉结尾的空行
    .replace(/\（约\d+-\d+字[^\）]*\）/g, '')  // 去掉字数提示
    .replace(/内容仅限：/g, '')
    .replace(/【本部分禁止】[^\n]*/g, '');
  
  return content || '暂无详细分析';
}
