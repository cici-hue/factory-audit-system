import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 百度文心一言API配置
const BAIDU_API_URL = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant';

// 获取访问令牌
async function getAccessToken(apiKey, secretKey) {
  try {
    const response = await axios.post(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
    );
    return response.data.access_token;
  } catch (error) {
    console.error('获取访问令牌失败:', error.response?.data || error.message);
    throw new Error('获取访问令牌失败');
  }
}

// 调用百度文心一言API
async function callBaiduWenxinAPI(prompt, accessToken) {
  try {
    const response = await axios.post(
      `${BAIDU_API_URL}?access_token=${accessToken}`,
      {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }
    );
    
    return response.data.result;
  } catch (error) {
    console.error('调用百度文心API失败:', error.response?.data || error.message);
    throw new Error('AI分析失败，请稍后重试');
  }
}

// AI总结API端点
app.post('/api/ai-summary', async (req, res) => {
  try {
    const { evaluationData, apiKey, secretKey } = req.body;
    
    // 验证参数
    if (!evaluationData || !apiKey || !secretKey) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: evaluationData, apiKey, secretKey'
      });
    }
    
    console.log('收到AI总结请求，工厂:', evaluationData.工厂信息?.名称);
    
    // 获取访问令牌
    const accessToken = await getAccessToken(apiKey, secretKey);
    
    // 构建提示词
    const prompt = buildAIPrompt(evaluationData);
    
    // 调用百度文心API
    const aiResponse = await callBaiduWenxinAPI(prompt, accessToken);
    
    // 解析AI响应
    const aiSummary = parseAIResponse(aiResponse);
    
    res.json({
      success: true,
      data: aiSummary
    });
    
  } catch (error) {
    console.error('AI总结处理失败:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 构建AI提示词
function buildAIPrompt(evaluationData) {
  return `你是一个专业的工厂质量审核专家。请基于以下工厂评估数据，生成一份专业、客观、实用的AI分析报告。

评估数据：
${JSON.stringify(evaluationData, null, 2)}

请按照以下结构生成分析报告：

## 📈 总体评估概览
- 对工厂整体表现进行概括性评价
- 突出亮点和主要问题
- 与行业标准进行对比分析

## 🎯 重点问题分析  
- 识别最关键的质量问题
- 分析问题产生的根本原因
- 评估问题对产品质量的影响程度

## 💡 改进建议
- 提供具体可行的改进措施
- 按优先级排序（紧急、重要、一般）
- 包含实施步骤和时间建议

## ⚠️ 风险预警
- 识别潜在的质量风险
- 评估风险发生的可能性
- 提出风险防控建议

## 🚀 优化方向
- 长期改进建议
- 质量管理体系优化
- 持续改进机制建立

要求：
1. 使用专业术语但易于理解
2. 建议具体可操作，避免空泛
3. 分析客观公正，基于数据
4. 语言简洁明了，重点突出
5. 针对工厂实际情况提出建议

请生成专业的中文分析报告。`;
}

// 解析AI响应
function parseAIResponse(aiResponse) {
  // 这里可以添加更复杂的解析逻辑
  // 目前直接返回AI的原始响应
  return {
    overallAssessment: extractSection(aiResponse, '总体评估概览'),
    keyIssuesAnalysis: extractSection(aiResponse, '重点问题分析'),
    improvementSuggestions: extractSection(aiResponse, '改进建议'),
    riskWarnings: extractSection(aiResponse, '风险预警'),
    optimizationDirection: extractSection(aiResponse, '优化方向'),
    generatedAt: new Date().toISOString(),
    rawResponse: aiResponse // 保留原始响应用于调试
  };
}

// 提取特定章节内容（简化版）
function extractSection(text, sectionName) {
  const lines = text.split('\n');
  let inSection = false;
  let sectionContent = [];
  
  for (const line of lines) {
    if (line.includes(sectionName)) {
      inSection = true;
      continue;
    }
    
    if (inSection) {
      if (line.startsWith('## ') || line.includes('## 📈') || line.includes('## 🎯') || 
          line.includes('## 💡') || line.includes('## ⚠️') || line.includes('## 🚀')) {
        break;
      }
      if (line.trim()) {
        sectionContent.push(line.trim());
      }
    }
  }
  
  return sectionContent.join(' ').trim() || '暂无分析内容';
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`AI总结后端服务运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});