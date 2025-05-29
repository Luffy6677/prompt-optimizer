import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Helper function to read raw request body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      resolve(body)
    })
    req.on('error', (err) => {
      reject(err)
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!endpointSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET')
    return res.status(400).json({ error: 'Missing webhook secret' })
  }

  let event

  try {
    // Get raw request body for signature verification
    const body = await getRawBody(req)
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    console.log('✅ Webhook signature verified')
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      console.log('🎉 Payment was successful:', session.id)
      console.log('👤 Customer ID:', session.customer)
      console.log('💰 Amount total:', session.amount_total)
      
      // Here you can update database, record subscription info
      // For example: update user subscription status, reset usage count, etc.
      
      break
    case 'customer.subscription.created':
      const subscription = event.data.object
      console.log('🎯 Subscription created:', subscription.id)
      console.log('👤 Customer ID:', subscription.customer)
      console.log('📅 Status:', subscription.status)
      break
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object
      console.log('🔄 Subscription updated:', updatedSubscription.id)
      console.log('📅 New status:', updatedSubscription.status)
      break
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object
      console.log('❌ Subscription cancelled:', deletedSubscription.id)
      break
    case 'invoice.payment_succeeded':
      const invoice = event.data.object
      console.log('💳 Invoice payment succeeded:', invoice.id)
      console.log('💰 Amount paid:', invoice.amount_paid)
      break
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object
      console.log('❌ Invoice payment failed:', failedInvoice.id)
      break
    default:
      console.log(`🤷‍♂️ Unhandled event type: ${event.type}`)
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true })
}

// This tells Vercel to use the raw body parser
export const config = {
  api: {
    bodyParser: false, // Disable default body parser to get raw request body
  },
} 