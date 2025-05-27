import dotenv from 'dotenv'

dotenv.config()

console.log('=== Environment Variables Test ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', process.env.PORT)
console.log('DEEPSEEK_API_KEY exists:', !!process.env.DEEPSEEK_API_KEY)
console.log('DEEPSEEK_API_KEY value:', process.env.DEEPSEEK_API_KEY ? `${process.env.DEEPSEEK_API_KEY.substring(0, 10)}...` : 'null')
console.log('DEEPSEEK_API_KEY length:', process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.length : 0)

// Test the condition used in server code
const apiKeyCondition = process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here'
console.log('API Key condition result:', apiKeyCondition) 