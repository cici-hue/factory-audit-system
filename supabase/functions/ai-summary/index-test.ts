// AI总结Edge Function - 简化测试版
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== 收到请求 ===')
  console.log('请求方法:', req.method)
  
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
    const { evaluationData, apiKey, secretKey, apiProvider = 'deepseek' } = body
    
    console.log('请求体:', JSON.stringify(body, null, 2))
    console.log('evaluationData:', evaluationData ? '存在' : '缺失')
    console.log('apiKey:', apiKey ? apiKey.substring(0, 20) + '...' : '缺失')
    console.log('apiProvider:', apiProvider)
    
    if (!evaluationData) {
      return new Response(
        JSON.stringify({ error: '缺少evaluationData参数' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 测试：直接返回固定内容，不调用外部API
    console.log('返回测试数据...')
    
    const testResponse = `## 📈 总体评估概览

这是一个测试响应，说明Edge Function工作正常！

工厂整体表现良好，但在某些关键环节需要改进。亮点包括：1）建立了基本的质量管理体系；2）生产现场整洁有序；3）员工质量意识培训定期开展。

主要问题：1）关键工序质量控制不足；2）质量追溯体系不完善；3）持续改进机制不健全。

## 🎯 重点问题分析

### 问题一：关键工序质量控制不足

关键工序的质量控制点设置不够合理，部分重要参数未纳入监控范围。建议立即完善关键工序质量控制点，加强过程监控。

### 问题二：质量追溯体系不完善

目前的质量追溯体系仅停留在批次级别，无法追溯到具体的生产环节。建议加快建立质量追溯系统。

## 💡 改进建议

### 紧急改进措施（1-2周内完成）

1. **完善关键工序质量控制点**
   - 组织工艺、质量、生产部门联合开展关键工序识别
   - 采用FMEA方法识别关键质量特性和控制点
   - 时间建议：2周内完成

2. **建立质量追溯系统**
   - 建立从原材料入库到成品各环节的追溯记录
   - 采用条码或RFID技术实现追溯
   - 时间建议：1个月内全面推广

## ⚠️ 风险预警

### 风险一：关键工序质量失控风险
- 风险描述：关键工序质量控制点不完善可能导致批量质量问题
- 发生可能性：高
- 影响程度：严重
- 防控措施：立即完善关键工序质量控制点

## 🚀 优化方向

### 一、长期改进建议

1. **建立卓越质量战略规划**
制定3-5年质量管理战略规划，明确质量目标和里程碑。

2. **推进全面质量管理（TQM）**
引入全面质量管理理念和方法，建立全员参与的质量管理体系。`

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          overallAssessment: '工厂整体表现良好，但在某些关键环节需要改进。亮点包括建立了基本的质量管理体系、生产现场整洁有序、员工质量意识培训定期开展。主要问题有关键工序质量控制不足、质量追溯体系不完善、持续改进机制不健全。',
          keyIssuesAnalysis: '发现2个重点问题：1）关键工序质量控制不足，控制点设置不合理；2）质量追溯体系不完善，仅停留在批次级别。',
          improvementSuggestions: '建议：1）完善关键工序质量控制点，2周内完成；2）建立质量追溯系统，1个月内全面推广。',
          riskWarnings: '关键工序质量失控风险较高，建议立即完善质量控制点。',
          optimizationDirection: '建议建立卓越质量战略规划，推进全面质量管理。',
          generatedAt: new Date().toISOString(),
          rawResponse: testResponse
        }
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
