import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

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
    console.log('🏪 Creating customer portal session...')
    
    if (!stripe) {
      console.error('❌ Stripe not configured - missing STRIPE_SECRET_KEY')
      return res.status(500).json({ 
        error: 'Stripe not configured',
        message: '请配置 STRIPE_SECRET_KEY 环境变量'
      })
    }

    const { customerId, returnUrl } = req.body
    console.log('📝 Request body:', { customerId, returnUrl })

    if (!customerId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: customerId',
        message: '缺少必要参数：customerId'
      })
    }

    // 构建返回URL
    const origin = req.headers.origin || req.headers.host || 'http://localhost:3001'
    const baseUrl = origin.startsWith('http') ? origin : `http://${origin}`
    const finalReturnUrl = returnUrl || `${baseUrl}/billing`

    console.log('🔗 Creating portal session with return URL:', finalReturnUrl)

    // 创建客户门户会话
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: finalReturnUrl,
    })

    console.log('✅ Portal session created successfully:', session.id)
    res.json({ url: session.url })
  } catch (error) {
    console.error('❌ Error creating portal session:', error.message)
    console.error('❌ Full error details:', {
      name: error.name,
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    })
    res.status(500).json({ 
      error: 'Failed to create portal session',
      message: '创建客户门户会话失败：' + error.message
    })
  }
} 