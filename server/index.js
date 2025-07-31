import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'
import Stripe from 'stripe'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Webhook endpoint should use raw body
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      console.log('Payment successful for session:', session.id)
      // TODO: Update user subscription status in database
      break
      
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object
      console.log('Subscription updated:', subscription.id)
      // TODO: Update subscription status in database
      break
      
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
  
  res.json({ received: true })
})

// Middleware (after webhook endpoint)
app.use(cors())
app.use(express.json())

  })
})

// Stripe API endpoints
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId } = req.body
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId: userId
      }
    })
    
    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/subscription`,
    })
    
    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/subscription-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    // TODO: Fetch customer ID from database based on userId
    // For now, return mock data
    res.json({
      status: 'inactive',
      subscription: null
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })
    
    res.json({ success: true, subscription })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)