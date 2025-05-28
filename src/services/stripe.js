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

// Stripe 支付服务

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // 生产环境使用相对路径，Vercel 会自动处理
  : 'http://localhost:3000' // 开发环境，指向 Vercel dev 端口

// 创建Stripe Checkout会话并重定向
export async function createAndRedirectToCheckout(priceId, userId) {
  try {
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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '创建支付会话失败')
    }

    const { sessionId } = await response.json()

    // 重定向到Stripe Checkout
    const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Checkout error:', error)
    throw error
  }
}

// 获取Checkout会话详情
export async function getCheckoutSession(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checkout-session?sessionId=${sessionId}`)
    
    if (!response.ok) {
      throw new Error('获取支付会话失败')
    }

    return await response.json()
  } catch (error) {
    console.error('Get checkout session error:', error)
    throw error
  }
}

// 获取用户订阅信息
export async function getCustomerSubscription(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscription?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('获取订阅信息失败')
    }

    return await response.json()
  } catch (error) {
    console.error('Get subscription error:', error)
    throw error
  }
}

// 创建客户门户会话并重定向
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
      throw new Error('创建客户门户会话失败')
    }

    const { url } = await response.json()
    
    // 重定向到客户门户
    window.location.href = url
  } catch (error) {
    console.error('Portal session error:', error)
    throw error
  }
}

// 取消订阅
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
      throw new Error('取消订阅失败')
    }

    return await response.json()
  } catch (error) {
    console.error('Cancel subscription error:', error)
    throw error
  }
}

export default getStripe 