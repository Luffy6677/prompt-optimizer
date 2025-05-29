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
        message: 'Please configure STRIPE_SECRET_KEY environment variable'
      })
    }

    const { customerId, returnUrl } = req.body
    console.log('📝 Request body:', { customerId, returnUrl })

    if (!customerId) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Missing required parameter: customerId'
      })
    }

    // Build return URL
    const origin = req.headers.origin || req.headers.host || 'http://localhost:3001'
    const baseUrl = origin.startsWith('http') ? origin : `http://${origin}`
    const defaultReturnUrl = `${baseUrl}/pricing`

    console.log('🔗 Creating portal session with return URL:', defaultReturnUrl)

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || defaultReturnUrl,
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
      message: 'Failed to create customer portal session: ' + error.message
    })
  }
} 