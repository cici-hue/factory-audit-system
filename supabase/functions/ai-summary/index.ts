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

请严格按照以下五个独立模块生成分析报告。每个模块使用【模块X】作为标题，内容必须独立不重复：

【模块一：总体评估概览】（约300字）
内容要求：
- **工厂整体水平**：基于总得分${totalScore}，明确评价等级（优秀/良好/一般/需改进）
- **主要亮点**：列举2-3个做得好的方面，用**加粗**标出关键词
- **主要问题类别**：只概述问题类别（如"面辅料品质控制"、"生产流程管理"），不要展开具体问题细节

【模块二：重点问题分析】（约400字）
内容要求：
- **逐条分析**：针对每个不合格项单独分析
- **引用原文**：用**加粗**标出评估项名称，引用评估项原文说明问题
- **影响后果**：说明该问题会导致什么后果
- **禁止内容**：不要包含改进建议、风险预警、优化方向等内容

【模块三：改进建议】（约350字）
内容要求：
- **对应问题**：针对模块二分析的每个问题，给出1-2条具体改进措施
- **执行细节**：用**加粗**标出负责人、时间节点等关键信息
- **禁止内容**：不要重复描述问题本身，直接给建议

【模块四：风险预警】（约150字）
内容要求：
- **风险描述**：如果不整改会有什么具体风险
- **风险等级**：用**加粗**标出风险等级（高风险/中风险/低风险）
- **禁止内容**：不要重复问题和建议内容

【模块五：优化方向】（约50字）
内容要求：
- **战略方向**：2-3条长期战略改进方向
- **禁止内容**：不要涉及具体整改措施

【格式要求】
1. 每个模块标题必须使用【模块X：模块名称】格式
2. 重要关键词、评估项名称、风险等级必须用**加粗**
3. 五个模块内容严格独立，绝对不要重复
4. 模块间不要互相引用（如"针对上述问题"等表述）
5. 严格基于提供的评估数据，不要编造

【字数控制】
- 模块一：250-350字
- 模块二：350-450字
- 模块三：300-400字
- 模块四：120-180字
- 模块五：40-60字
- 总计：1200-1500字

请确保各模块标题格式正确，内容独立，重点部分加粗显示！`
}

// 解析AI响应
function parseAIResponse(aiResponse: string): any {
  return {
    overallAssessment: extractSection(aiResponse, '【模块一：总体评估概览】'),
    keyIssuesAnalysis: extractSection(aiResponse, '【模块二：重点问题分析】'),
    improvementSuggestions: extractSection(aiResponse, '【模块三：改进建议】'),
    riskWarnings: extractSection(aiResponse, '【模块四：风险预警】'),
    optimizationDirection: extractSection(aiResponse, '【模块五：优化方向】'),
    generatedAt: new Date().toISOString(),
    rawResponse: aiResponse
  }
}

// 提取特定章节内容
function extractSection(text: string, sectionName: string): string {
  // 直接使用完整的模块标题匹配
  const startIdx = text.indexOf(sectionName);
  
  if (startIdx === -1) {
    return '暂无详细分析';
  }
  
  // 从模块标题后开始提取
  const contentStart = startIdx + sectionName.length;
  
  // 定义所有可能的下一个模块标题
  const nextModules = [
    '【模块一：总体评估概览】',
    '【模块二：重点问题分析】',
    '【模块三：改进建议】',
    '【模块四：风险预警】',
    '【模块五：优化方向】'
  ];
  
  // 找到下一个模块的位置
  let endIdx = text.length;
  for (const nextModule of nextModules) {
    const idx = text.indexOf(nextModule, contentStart);
    if (idx !== -1 && idx < endIdx) {
      endIdx = idx;
    }
  }
  
  // 提取内容
  let content = text.substring(contentStart, endIdx).trim();
  
  // 清理内容
  content = content
    .replace(/^[:：]\s*/, '')      // 去掉开头的冒号
    .replace(/^\n+/, '')           // 去掉开头的空行
    .replace(/\n+$/, '')           // 去掉结尾的空行
    .replace(/\(约\d+字\)/g, '');  // 去掉字数提示
  
  return content || '暂无详细分析';
}
