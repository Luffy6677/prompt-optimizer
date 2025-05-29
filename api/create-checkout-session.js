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
        message: 'Please configure STRIPE_SECRET_KEY environment variable'
      })
    }

    const { priceId, userId, successUrl, cancelUrl } = req.body
    console.log('📝 Request body:', { priceId, userId, successUrl, cancelUrl })

    if (!priceId || !userId) {
      console.error('❌ Missing required parameters:', { priceId: !!priceId, userId: !!userId })
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Missing required parameters: priceId or userId'
      })
    }

    // Create or get customer
    let customer
    try {
      console.log('👤 Finding or creating customer for userId:', userId)
      
      // Try to create customer directly (if exists, we'll handle the error)
      try {
        customer = await stripe.customers.create({
          metadata: { userId: userId }
        })
        console.log('✅ Created new customer:', customer.id)
      } catch (createError) {
        // If creation fails, customer might already exist, try to find existing
        console.log('ℹ️ Customer creation failed, trying to find existing customer')
        
        // Since we can't directly query by metadata, use email as unique identifier
        // Or simply create new customer for each request (in real app, should use database to store customer ID mapping)
        customer = await stripe.customers.create({
          metadata: { userId: userId + '_' + Date.now() } // Add timestamp to avoid duplicates
        })
        console.log('✅ Created fallback customer:', customer.id)
      }
    } catch (error) {
      console.error('❌ Error creating customer:', error.message)
      return res.status(500).json({ 
        error: 'Failed to create customer',
        message: 'Failed to create customer: ' + error.message
      })
    }

    // Validate price ID exists
    try {
      console.log('💰 Validating price ID:', priceId)
      const price = await stripe.prices.retrieve(priceId)
      console.log('✅ Price validation successful:', price.id, price.unit_amount)
    } catch (error) {
      console.error('❌ Invalid price ID:', priceId, 'Error:', error.message)
      return res.status(400).json({ 
        error: 'Invalid price ID', 
        message: `Price ID "${priceId}" does not exist. Please check if the price ID in Stripe Dashboard is correct. Error details: ${error.message}`
      })
    }

    // Create Checkout session
    console.log('🛒 Creating checkout session...')
    
    // Build default URLs
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
      message: 'Failed to create payment session: ' + error.message
    })
  }
} 