import dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()

console.log('=== Testing Deepseek API Connection ===')

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  timeout: 30000,
})

async function testDeepseekAPI() {
  try {
    console.log('Sending test request to Deepseek API...')
    
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "请回答：1+1等于几？"
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    })

    console.log('✅ Success! Deepseek API response:')
    console.log('Response:', response.choices[0].message.content)
    console.log('Model used:', response.model)
    console.log('Usage:', response.usage)
    
  } catch (error) {
    console.error('❌ Deepseek API test failed:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error status:', error.status)
    console.error('Error code:', error.code)
    
    if (error.response) {
      console.error('Error response data:', error.response.data)
    }
  }
}

testDeepseekAPI() 