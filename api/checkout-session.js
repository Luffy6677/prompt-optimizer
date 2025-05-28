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
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' })
    }

    const { sessionId } = req.query

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    res.json(session)
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    res.status(500).json({ error: 'Failed to retrieve checkout session' })
  }
} 