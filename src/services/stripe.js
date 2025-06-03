import { loadStripe } from '@stripe/stripe-js'

// Load Stripe
let stripePromise

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.error('Missing Stripe publishable key. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.')
      return null
    }
    
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

// Stripe payment services

// Fixed API_BASE_URL configuration for production
const API_BASE_URL = import.meta.env.MODE === 'development' || import.meta.env.DEV 
  ? 'http://localhost:3000' // Development environment
  : '' // Production environment uses relative paths

console.log('🔧 Stripe API Base URL:', API_BASE_URL)
console.log('🌍 Environment MODE:', import.meta.env.MODE)
console.log('🌍 Environment DEV:', import.meta.env.DEV)
console.log('🌍 Environment PROD:', import.meta.env.PROD)

// Create Stripe Checkout session and redirect
export async function createAndRedirectToCheckout(priceId, userId) {
  try {
    console.log('🛒 Creating checkout session...')
    console.log('💰 Price ID:', priceId)
    console.log('👤 User ID:', userId)
    console.log('🔗 API URL:', `${API_BASE_URL}/api/create-checkout-session`)
    
    const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      }),
    })

    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', response.headers)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ API Error:', errorData)
      throw new Error(errorData.message || 'Failed to create payment session')
    }

    const { sessionId } = await response.json()
    console.log('✅ Session created:', sessionId)

    // Redirect to Stripe Checkout
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error('Failed to load Stripe')
    }
    
    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('❌ Checkout error:', error)
    throw error
  }
}

// Get Checkout session details
export async function getCheckoutSession(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checkout-session?sessionId=${sessionId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get payment session')
    }

    return await response.json()
  } catch (error) {
    console.error('Get checkout session error:', error)
    throw error
  }
}

// Get user subscription information
export async function getCustomerSubscription(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscription?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get subscription information')
    }

    return await response.json()
  } catch (error) {
    console.error('Get subscription error:', error)
    throw error
  }
}

// Create customer portal session and redirect
export async function createCustomerPortalSession(customerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/pricing`
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create customer portal session')
    }

    const { url } = await response.json()
    
    // Redirect to customer portal
    window.location.href = url
  } catch (error) {
    console.error('Portal session error:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    return await response.json()
  } catch (error) {
    console.error('Cancel subscription error:', error)
    throw error
  }
}

export default getStripe 