import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'
import db from './config/database.js'

dotenv.config()

  })
})

// Test database connection
async function testDatabaseConnection() {
  try {
    await db.raw('SELECT 1+1 AS result')
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Prompt Optimizer Server is running on port ${PORT}`)
  console.log(`📝 API available at http://localhost:${PORT}/api`)
  console.log(`💡 Deepseek integration: ${deepseek ? 'Enabled' : 'Disabled (using mock responses)'}`)
  
  // Test database connection
  await testDatabaseConnection()
}) 