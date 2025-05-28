import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

// 读取原始请求体的辅助函数
const getRawBody = async (req) => {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook not configured properly')
    return res.status(500).json({ error: 'Stripe webhook not configured' })
  }

  let event

  try {
    // 获取原始请求体用于签名验证
    const rawBody = await getRawBody(req)
    
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    console.log('✅ Webhook signature verified successfully')
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  console.log(`🔔 Processing webhook event: ${event.type}`)

  // 处理事件
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('💳 Payment succeeded for session:', session.id)
        console.log('👤 Customer:', session.customer)
        console.log('📧 Customer email:', session.customer_details?.email)
        
        // 这里可以更新数据库，记录订阅信息
        // 例如：更新用户的订阅状态、重置使用次数等
        break

      case 'customer.subscription.created':
        const createdSubscription = event.data.object
        console.log('🆕 Subscription created:', createdSubscription.id)
        console.log('👤 Customer:', createdSubscription.customer)
        console.log('💰 Price:', createdSubscription.items.data[0]?.price.id)
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object
        console.log('🔄 Subscription updated:', updatedSubscription.id)
        console.log('📊 Status:', updatedSubscription.status)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log('❌ Subscription deleted:', deletedSubscription.id)
        console.log('👤 Customer:', deletedSubscription.customer)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('✅ Payment succeeded for invoice:', invoice.id)
        console.log('💰 Amount:', invoice.amount_paid / 100, invoice.currency)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        console.log('💸 Payment failed for invoice:', failedInvoice.id)
        console.log('👤 Customer:', failedInvoice.customer)
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    console.log('✅ Webhook event processed successfully')
    res.json({ received: true, type: event.type })
  } catch (error) {
    console.error('❌ Error processing webhook event:', error)
    res.status(500).json({ error: 'Failed to process webhook event' })
  }
}

// Vercel configuration for webhook handling
export const config = {
  api: {
    bodyParser: false, // 禁用默认的 body parser 以获取原始请求体
  },
} 