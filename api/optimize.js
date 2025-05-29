import { OpenAI } from 'openai'

// Initialize Deepseek API client (compatible with OpenAI SDK)
const deepseek = process.env.DEEPSEEK_API_KEY && 
                 process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here' ? 
  new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
    timeout: 30000, // 30 second timeout, suitable for Deepseek-V3 response time
  }) : null

// Optimization strategies
const optimizationStrategies = {
  comprehensive: {
    name: 'Comprehensive Optimization',
    systemPrompt: `You are a professional prompt optimization expert, skilled in utilizing Deepseek-V3's powerful reasoning capabilities. Please analyze the user-provided prompt and optimize it comprehensively from the following aspects:
1. Clarity: Ensure instructions are clear and easy to understand
2. Specificity: Add necessary details and constraints
3. Structure: Optimize language structure and logical order
4. Effectiveness: Improve the likelihood of achieving desired results
5. Reasoning guidance: Use chain-of-thought to guide better reasoning processes

Please fully utilize your reasoning capabilities and return the optimized prompt along with a detailed analysis report.`
  },
  clarity: {
    name: 'Clarity Optimization',
    systemPrompt: `You are a prompt optimization expert focused on language clarity, with Deepseek-V3's powerful language understanding capabilities. Please focus on:
1. Eliminating ambiguous expressions
2. Simplifying complex sentence structures
3. Using more accurate vocabulary
4. Ensuring instructions are easy to understand
5. Providing clear logical chains

Please use your deep reasoning abilities to return an optimized prompt and explain the improvements.`
  },
  specificity: {
    name: 'Specificity Enhancement',
    systemPrompt: `You are an optimization expert focused on prompt specificity, capable of in-depth detail analysis. Please focus on:
1. Adding specific requirements and constraints
2. Clarifying output format and structure
3. Providing clear examples or references
4. Detailing each step of the task
5. Establishing clear success criteria

Please use Deepseek-V3's powerful analytical capabilities to return a more specific prompt and explain the added specific requirements.`
  },
  creativity: {
    name: 'Creativity Enhancement',
    systemPrompt: `You are a prompt optimization expert focused on inspiring creativity, with Deepseek-V3's innovative thinking capabilities. Please focus on:
1. Encouraging multi-perspective thinking
2. Inspiring innovative thinking
3. Guiding divergent thinking
4. Promoting original expression
5. Building creative thinking frameworks

Please use your creative reasoning abilities to return prompts that can inspire more creativity and explain optimization strategies.`
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
            
Please strictly return the result in the following JSON format, without any markdown markers or code block markers:
{
  "optimizedPrompt": "Optimized prompt",
  "scores": {
    "clarity": score(1-10),
    "specificity": score(1-10),
    "effectiveness": score(1-10)
  },
  "analysis": {
    "improvements": "Improvement description",
    "issues": ["List of original prompt issues"]
  },
  "alternatives": [
    {
      "prompt": "Alternative suggested prompt",
      "reason": "Recommendation reason"
    }
  ]
}

Important: Please return the JSON object directly, without using \`\`\`json markers or any other formatting markers.`
          },
          {
            role: "user",
            content: `Please optimize this prompt: ${prompt}`
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
    if (keywords.includes('code') || keywords.includes('programming') || keywords.includes('develop')) return 'programming'
    if (keywords.includes('marketing') || keywords.includes('sales') || keywords.includes('promotion')) return 'marketing'
    if (keywords.includes('write') || keywords.includes('content') || keywords.includes('article')) return 'content creation'
    if (keywords.includes('design') || keywords.includes('ui') || keywords.includes('interface')) return 'design'
    if (keywords.includes('data') || keywords.includes('analysis') || keywords.includes('statistics')) return 'data analysis'
    return 'relevant field'
  }

  const mockResponses = {
    comprehensive: {
      optimizedPrompt: `As a professional ${getTopicFromPrompt(originalPrompt)} expert, please help me ${originalPrompt.replace('write', 'create').replace('make', 'develop')}.

Requirements:
1. Content structure should be clear with strong logic
2. Language should be professional, accurate, and easy to understand
3. Include specific examples and data support
4. Word count should be 800-1200 words
5. Please use a general-specific-general structure

Please reflect your professional knowledge and practical experience in your response.`,
      scores: {
        clarity: 8,
        specificity: 9,
        effectiveness: 8
      },
      analysis: {
        improvements: "Added role setting, clarified output requirements, specified word count range and structure requirements, making the prompt more specific and professional.",
        issues: [
          "Original prompt was too simple, lacking specific requirements",
          "No clear role and output format specified",
          "Lacked constraints and quality standards"
        ]
      },
      alternatives: [
        {
          prompt: `Please help me create detailed content about ${getTopicFromPrompt(originalPrompt)}, including background introduction, core viewpoints, case analysis, and summary recommendations.`,
          reason: "More focused on content completeness and structure"
        },
        {
          prompt: `Introduce ${getTopicFromPrompt(originalPrompt)} in Q&A format, including 5-8 core questions and their detailed answers.`,
          reason: "Uses Q&A format, easier to understand and remember"
        }
      ]
    },
    clarity: {
      optimizedPrompt: `Please clearly explain the basic concepts, main characteristics, and practical applications of ${getTopicFromPrompt(originalPrompt)}.

Please use simple and understandable language, avoid technical jargon, and if you must use them, please explain them.`,
      scores: {
        clarity: 9,
        specificity: 7,
        effectiveness: 8
      },
      analysis: {
        improvements: "Simplified language expression, clarified explanation requirements, avoided complex terminology usage.",
        issues: [
          "Original prompt expression was not clear enough",
          "May contain ambiguous statements",
          "Lacked clear language requirements"
        ]
      },
      alternatives: [
        {
          prompt: `Explain ${getTopicFromPrompt(originalPrompt)} step by step, using examples to illustrate each concept.`,
          reason: "Step-by-step explanation with examples for better understanding"
        }
      ]
    },
    specificity: {
      optimizedPrompt: `Please provide a comprehensive analysis of ${getTopicFromPrompt(originalPrompt)} with the following specific requirements:

1. Definition and scope
2. Key components or elements
3. Implementation steps or methodology
4. Best practices and common pitfalls
5. Measurable outcomes or success metrics

Format: Use bullet points and numbered lists for clarity.`,
      scores: {
        clarity: 8,
        specificity: 10,
        effectiveness: 9
      },
      analysis: {
        improvements: "Added specific structure requirements, clear deliverables, and formatting guidelines.",
        issues: [
          "Original prompt lacked specific requirements",
          "No clear structure or format specified",
          "Missing measurable criteria"
        ]
      },
      alternatives: [
        {
          prompt: `Create a detailed guide for ${getTopicFromPrompt(originalPrompt)} including prerequisites, step-by-step instructions, and troubleshooting tips.`,
          reason: "Focuses on practical implementation with troubleshooting support"
        }
      ]
    },
    creativity: {
      optimizedPrompt: `Think creatively about ${getTopicFromPrompt(originalPrompt)} and explore it from multiple innovative angles:

1. Challenge conventional approaches
2. Propose novel solutions or perspectives
3. Connect ideas from different fields
4. Consider future possibilities and trends
5. Generate original concepts or frameworks

Please think outside the box and surprise me with your insights.`,
      scores: {
        clarity: 7,
        specificity: 8,
        effectiveness: 9
      },
      analysis: {
        improvements: "Enhanced creative thinking prompts, encouraged innovation and cross-field connections.",
        issues: [
          "Original prompt was too conventional",
          "Lacked creativity triggers",
          "Missing innovation encouragement"
        ]
      },
      alternatives: [
        {
          prompt: `Reimagine ${getTopicFromPrompt(originalPrompt)} as if you were from the future looking back, or from a completely different industry perspective.`,
          reason: "Uses perspective shifting to unlock creative thinking"
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
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

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Missing prompt',
        message: 'Please provide a prompt to optimize'
      })
    }

    if (prompt.length > 2000) {
      return res.status(400).json({ 
        error: 'Prompt too long',
        message: 'Prompt must be less than 2000 characters'
      })
    }

    if (!optimizationStrategies[strategy]) {
      return res.status(400).json({ 
        error: 'Invalid strategy',
        message: 'Available strategies: ' + Object.keys(optimizationStrategies).join(', ')
      })
    }

    console.log('🚀 Starting prompt optimization')
    console.log('📝 Prompt:', prompt)
    console.log('🎯 Strategy:', strategy)
    console.log('🔑 Deepseek configured:', !!deepseek)

    const result = await optimizePromptWithAI(prompt, strategy)

    console.log('✅ Optimization completed successfully')
    res.json(result)
  } catch (error) {
    console.error('❌ Optimization error:', error.message)
    console.error('❌ Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    res.status(500).json({ 
      error: 'Optimization failed',
      message: 'Failed to optimize prompt: ' + error.message
    })
  }
} 