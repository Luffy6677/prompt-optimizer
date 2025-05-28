import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Fetching subscription for userId:', req.query.userId)
    
    if (!stripe) {
      console.error('❌ Stripe not configured')
      return res.status(500).json({ error: 'Stripe not configured' })
    }

    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    try {
      // 尝试查找客户
      console.log('🔍 Searching for customers...')
      
      // 由于无法通过metadata查询，我们使用不同的策略
      // 1. 首先获取所有客户（仅限最近创建的）
      const customers = await stripe.customers.list({
        limit: 100, // 限制查询数量
        created: {
          gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60) // 只查询最近30天的客户
        }
      })

      console.log(`📋 Found ${customers.data.length} recent customers`)

      // 2. 在客户中查找匹配的userId
      let customer = null
      for (const cust of customers.data) {
        if (cust.metadata && cust.metadata.userId === userId) {
          customer = cust
          console.log('✅ Found matching customer:', customer.id)
          break
        }
      }

      if (!customer) {
        console.log('ℹ️ No customer found for userId:', userId)
        return res.json({ 
          subscription: null, 
          usage: { current: 0, limit: 0 },
          customer: null 
        })
      }

      // 3. 获取客户的订阅
      console.log('🔍 Fetching subscriptions for customer:', customer.id)
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 10
      })

      console.log(`📋 Found ${subscriptions.data.length} active subscriptions`)

      if (subscriptions.data.length === 0) {
        console.log('ℹ️ No active subscriptions found')
        return res.json({ 
          subscription: null, 
          usage: { current: 0, limit: 0 },
          customer: customer.id 
        })
      }

      // 4. 返回第一个活跃订阅
      const subscription = subscriptions.data[0]
      console.log('✅ Found active subscription:', subscription.id)

      // 5. 根据订阅计划确定使用限制
      const priceId = subscription.items.data[0]?.price?.id
      let usageLimit = 0
      
      const priceLimits = {
        'price_1RTGzFP1MsuVjL1H9FCVdz3C': 10,  // 个人版月付
        'price_1RTGzqP1MsuVjL1HXuMWpJsP': 10,  // 个人版年付
        'price_1RTH0vP1MsuVjL1HfoJp8ueE': 100, // 专业版月付
        'price_1RTH1MP1MsuVjL1HdMK2LLqm': 100, // 专业版年付
      }
      
      usageLimit = priceLimits[priceId] || 0
      console.log(`📊 Usage limit for price ${priceId}: ${usageLimit}`)

      return res.json({ 
        subscription: subscription, 
        usage: { current: 0, limit: usageLimit }, // TODO: 实现真实使用量跟踪
        customer: customer.id 
      })

    } catch (stripeError) {
      console.error('❌ Stripe API error:', stripeError.message)
      
      // 如果是API错误，但不是致命错误，返回空订阅
      if (stripeError.type === 'StripeInvalidRequestError') {
        console.log('ℹ️ Returning empty subscription due to Stripe error')
        return res.json({ 
          subscription: null, 
          usage: { current: 0, limit: 0 },
          customer: null 
        })
      }
      
      throw stripeError
    }

  } catch (error) {
    console.error('❌ Error fetching subscription:', error)
    res.status(500).json({ 
      error: 'Failed to fetch subscription',
      message: error.message 
    })
  }
} 