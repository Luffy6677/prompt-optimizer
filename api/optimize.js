import { OpenAI } from 'openai'

// Initialize Deepseek API client (compatible with OpenAI SDK)
const deepseek = process.env.DEEPSEEK_API_KEY && 
                 process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here' ? 
  new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
    timeout: 30000, // 30秒超时，适合Deepseek-V3的响应时间
  }) : null

// Optimization strategies
const optimizationStrategies = {
  comprehensive: {
    name: '综合优化',
    systemPrompt: `你是一个专业的提示词优化专家，擅长使用Deepseek-V3的强大推理能力。请分析用户提供的提示词，并从以下几个方面进行综合优化：
1. 清晰度：确保指令明确、易理解
2. 具体性：增加必要的细节和约束条件  
3. 结构化：优化语言结构和逻辑顺序
4. 有效性：提高获得期望结果的可能性
5. 推理引导：利用链式思考方式引导更好的推理过程

请充分发挥你的推理能力，返回优化后的提示词以及详细的分析报告。`
  },
  clarity: {
    name: '清晰度优化',
    systemPrompt: `你是一个专注于语言清晰度的提示词优化专家，具备Deepseek-V3的强大语言理解能力。请重点关注：
1. 消除歧义表达
2. 简化复杂句式
3. 使用更准确的词汇
4. 确保指令易于理解
5. 提供清晰的逻辑链条

请运用你的深度推理能力，返回优化后的提示词并说明改进之处。`
  },
  specificity: {
    name: '具体性增强',
    systemPrompt: `你是一个专注于提示词具体性的优化专家，能够进行深度的细节分析。请重点关注：
1. 添加具体的要求和约束
2. 明确输出格式和结构
3. 提供清晰的示例或参考
4. 细化任务的各个步骤
5. 建立明确的成功标准

请运用Deepseek-V3的强大分析能力，返回更具体的提示词并说明增加的具体要求。`
  },
  creativity: {
    name: '创意激发',
    systemPrompt: `你是一个专注于激发创意的提示词优化专家，具备Deepseek-V3的创新思维能力。请重点关注：
1. 鼓励多角度思考
2. 激发创新思维
3. 引导发散性思考
4. 促进原创性表达
5. 建立创意思维框架

请发挥你的创造性推理能力，返回能够激发更多创意的提示词并说明优化策略。`
  }
}

async function optimizePromptWithAI(prompt, strategy) {
  console.log(`🔄 Optimizing prompt with strategy: ${strategy}`)
  console.log(`📝 Original prompt: "${prompt}"`)
  
  // If Deepseek is configured, use it
  if (deepseek) {
    console.log('🤖 Using Deepseek API')
    try {
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: optimizationStrategies[strategy].systemPrompt + `
            
请严格按照以下JSON格式返回结果，不要包含任何markdown标记或代码块标记：
{
  "optimizedPrompt": "优化后的提示词",
  "scores": {
    "clarity": 评分(1-10),
    "specificity": 评分(1-10),
    "effectiveness": 评分(1-10)
  },
  "analysis": {
    "improvements": "改进说明",
    "issues": ["原提示词的问题列表"]
  },
  "alternatives": [
    {
      "prompt": "其他建议的提示词",
      "reason": "建议理由"
    }
  ]
}

重要：请直接返回JSON对象，不要使用\`\`\`json标记或任何其他格式化标记。`
          },
          {
            role: "user",
            content: `请优化这个提示词：${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })

      console.log('✅ Deepseek API response received')
      console.log('🔍 Raw response content:', response.choices[0].message.content)
      
      try {
        const parsedResult = JSON.parse(response.choices[0].message.content)
        return parsedResult
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError.message)
        console.error('❌ Raw content that failed to parse:', response.choices[0].message.content)
        console.log('🔄 Falling back to mock response due to parsing error')
        // Fall back to mock response
      }
    } catch (error) {
      console.error('❌ Deepseek API error:', error.message)
      console.error('❌ Full error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        code: error.code
      })
      console.log('🔄 Falling back to mock response')
      // Fall back to mock response
    }
  } else {
    console.log('🎭 Using mock response (Deepseek not configured)')
  }

  // Mock response for demo purposes
  console.log('📦 Returning mock optimization result')
  return mockOptimizationResponse(prompt, strategy)
}

function mockOptimizationResponse(originalPrompt, strategy) {
  const getTopicFromPrompt = (prompt) => {
    const keywords = prompt.toLowerCase()
    if (keywords.includes('代码') || keywords.includes('编程') || keywords.includes('程序')) return '编程技术'
    if (keywords.includes('营销') || keywords.includes('推广') || keywords.includes('销售')) return '市场营销'
    if (keywords.includes('文章') || keywords.includes('写作') || keywords.includes('内容')) return '内容创作'
    if (keywords.includes('设计') || keywords.includes('UI') || keywords.includes('界面')) return '设计'
    if (keywords.includes('数据') || keywords.includes('分析') || keywords.includes('统计')) return '数据分析'
    return '相关领域'
  }

  const mockResponses = {
    comprehensive: {
      optimizedPrompt: `作为专业的${getTopicFromPrompt(originalPrompt)}专家，请为我${originalPrompt.replace('写', '撰写').replace('做', '制作')}。

要求：
1. 内容结构清晰，逻辑性强
2. 语言专业准确，通俗易懂  
3. 包含具体的例子和数据支撑
4. 字数控制在800-1200字
5. 请采用总-分-总的结构

请在回答中体现您的专业知识和实践经验。`,
      scores: {
        clarity: 8,
        specificity: 9,
        effectiveness: 8
      },
      analysis: {
        improvements: "增加了角色设定、明确了输出要求、指定了字数范围和结构要求，使提示词更加具体和专业。",
        issues: [
          "原提示词过于简单，缺乏具体要求",
          "没有明确角色和输出格式",
          "缺少约束条件和质量标准"
        ]
      },
      alternatives: [
        {
          prompt: `请帮我创建一份关于${getTopicFromPrompt(originalPrompt)}的详细内容，包含背景介绍、核心观点、实例分析和总结建议。`,
          reason: "更注重内容的完整性和结构化"
        },
        {
          prompt: `以问答形式为我介绍${getTopicFromPrompt(originalPrompt)}，包含5-8个核心问题及其详细解答。`,
          reason: "采用问答形式，更易于理解和记忆"
        }
      ]
    },
    clarity: {
      optimizedPrompt: `请为我清晰地解释${getTopicFromPrompt(originalPrompt)}的基本概念、主要特点和实际应用。

请用简单易懂的语言，避免专业术语，如果必须使用请加以解释。`,
      scores: {
        clarity: 9,
        specificity: 7,
        effectiveness: 8
      },
      analysis: {
        improvements: "简化了语言表达，明确了解释要求，避免了复杂的术语使用。",
        issues: [
          "原提示词表达不够清晰",
          "可能包含歧义的表述",
          "缺乏明确的语言要求"
        ]
      },
      alternatives: [
        {
          prompt: `用通俗易懂的话告诉我${getTopicFromPrompt(originalPrompt)}是什么，有什么用处。`,
          reason: "更加口语化，易于理解"
        }
      ]
    },
    specificity: {
      optimizedPrompt: `请按照以下具体要求为我${originalPrompt}：

具体要求：
- 输出格式：分段式结构，每段不超过150字
- 内容深度：包含基础概念、实际案例和操作建议
- 目标受众：${getTopicFromPrompt(originalPrompt)}初学者
- 完成时间：提供可在30分钟内阅读完的内容量
- 质量标准：确保信息准确性，提供可验证的资料来源

请确保每个要求都得到满足。`,
      scores: {
        clarity: 8,
        specificity: 10,
        effectiveness: 9
      },
      analysis: {
        improvements: "添加了详细的输出格式、目标受众、时间约束和质量标准，使要求更加具体明确。",
        issues: [
          "原提示词缺乏具体要求",
          "没有明确的成功标准",
          "缺少输出格式说明"
        ]
      },
      alternatives: [
        {
          prompt: `制作一个${getTopicFromPrompt(originalPrompt)}的完整指南，包含步骤说明、注意事项和检查清单。`,
          reason: "提供更实用的指南格式"
        }
      ]
    },
    creativity: {
      optimizedPrompt: `请以创新的视角为我${originalPrompt}，要求：

创意要求：
1. 至少提供3个不同角度的独特观点
2. 结合跨领域的知识和经验
3. 使用类比、故事或比喻来增强理解
4. 鼓励批判性思维和质疑精神
5. 提供启发性的问题供进一步思考

请跳出常规思维，展现您的创造力和想象力。`,
      scores: {
        clarity: 7,
        specificity: 8,
        effectiveness: 9
      },
      analysis: {
        improvements: "增加了创意思维的引导，要求多角度思考和跨领域知识整合，激发更有创意的回答。",
        issues: [
          "原提示词缺乏创意激发",
          "思维角度单一",
          "没有鼓励创新思考"
        ]
      },
      alternatives: [
        {
          prompt: `如果你是一位来自未来的${getTopicFromPrompt(originalPrompt)}专家，你会如何重新定义和讲解这个概念？`,
          reason: "通过时空转换激发创新思维"
        }
      ]
    }
  }

  return mockResponses[strategy] || mockResponses.comprehensive
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, strategy = 'comprehensive' } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    if (!optimizationStrategies[strategy]) {
      return res.status(400).json({ error: 'Invalid strategy' })
    }

    console.log(`🔄 Processing optimization request`)
    console.log(`📝 Prompt: ${prompt}`)
    console.log(`🎯 Strategy: ${strategy}`)

    const result = await optimizePromptWithAI(prompt, strategy)

    console.log('✅ Optimization completed successfully')
    return res.status(200).json(result)

  } catch (error) {
    console.error('❌ Error in optimization:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
} 