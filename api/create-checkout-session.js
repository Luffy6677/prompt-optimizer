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
    console.log('🔔 Creating checkout session...')
    console.log('🔑 Environment check:')
    console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set (****)' : 'NOT SET')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    
    if (!stripe) {
      console.error('❌ Stripe not configured - missing STRIPE_SECRET_KEY')
      return res.status(500).json({ 
        error: 'Stripe not configured',
        message: '请配置 STRIPE_SECRET_KEY 环境变量'
      })
    }

    const { priceId, userId, successUrl, cancelUrl } = req.body
    console.log('📝 Request body:', { priceId, userId, successUrl, cancelUrl })

    if (!priceId || !userId) {
      console.error('❌ Missing required parameters:', { priceId: !!priceId, userId: !!userId })
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: '缺少必要参数：priceId 或 userId'
      })
    }

    // 创建或获取客户
    let customer
    try {
      console.log('👤 Finding or creating customer for userId:', userId)
      
      // 使用 email 或其他方式查找客户，而不是 metadata
      // 先尝试直接创建客户（如果已存在会返回错误，我们可以处理）
      try {
        customer = await stripe.customers.create({
          metadata: { userId: userId }
        })
        console.log('✅ Created new customer:', customer.id)
      } catch (createError) {
        // 如果创建失败，可能是因为客户已存在，尝试通过其他方式查找
        console.log('ℹ️ Customer creation failed, trying to find existing customer')
        
        // 由于无法直接通过 metadata 查询，我们使用 email 作为唯一标识
        // 或者简单地为每个请求创建新客户（在实际应用中，应该使用数据库存储客户ID映射）
        customer = await stripe.customers.create({
          metadata: { userId: userId + '_' + Date.now() } // 添加时间戳避免重复
        })
        console.log('✅ Created fallback customer:', customer.id)
      }
    } catch (error) {
      console.error('❌ Error creating customer:', error.message)
      return res.status(500).json({ 
        error: 'Failed to create customer',
        message: '创建客户失败：' + error.message
      })
    }

    // 验证价格ID是否存在
    try {
      console.log('💰 Validating price ID:', priceId)
      const price = await stripe.prices.retrieve(priceId)
      console.log('✅ Price validation successful:', price.id, price.unit_amount)
    } catch (error) {
      console.error('❌ Invalid price ID:', priceId, 'Error:', error.message)
      return res.status(400).json({ 
        error: 'Invalid price ID', 
        message: `价格ID "${priceId}" 不存在。请检查Stripe Dashboard中的价格ID是否正确。错误详情：${error.message}`
      })
    }

    // 创建Checkout会话
    console.log('🛒 Creating checkout session...')
    
    // 构建默认的 URLs
    const origin = req.headers.origin || req.headers.host || 'http://localhost:3001'
    const baseUrl = origin.startsWith('http') ? origin : `http://${origin}`
    
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/pricing`,
      metadata: {
        userId: userId,
        priceId: priceId,
      },
    })

    console.log('✅ Checkout session created successfully:', session.id)
    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('❌ Error creating checkout session:', error.message)
    console.error('❌ Full error details:', {
      name: error.name,
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    })
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: '创建支付会话失败：' + error.message
    })
  }
} 