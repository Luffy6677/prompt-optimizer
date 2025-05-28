import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getCustomerSubscription } from '../services/stripe'

const SubscriptionContext = createContext({})

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState({
    current: 0,
    limit: 0
  })
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSubscription()
    } else {
      setSubscription(null)
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const data = await getCustomerSubscription(user.id)
      setSubscription(data.subscription)
      setUsage(data.usage || { current: 0, limit: 0 })
    } catch (error) {
      console.error('Error loading subscription:', error)
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshSubscription = async () => {
    if (isAuthenticated && user) {
      await loadSubscription()
    }
  }

  const canUseService = () => {
    if (!subscription) {
      return false
    }
    
    if (subscription.status !== 'active') {
      return false
    }
    
    // 检查使用限制
    if (usage.limit > 0 && usage.current >= usage.limit) {
      return false
    }
    
    return true
  }

  const incrementUsage = () => {
    setUsage(prev => ({
      ...prev,
      current: prev.current + 1
    }))
  }

  const getRemainingUsage = () => {
    if (!subscription || usage.limit === 0) {
      return 0
    }
    
    return Math.max(0, usage.limit - usage.current)
  }

  const getPlanName = (priceId) => {
    const planNames = {
      'price_personal_monthly': 'Personal (Monthly)',
      'price_personal_yearly': 'Personal (Yearly)',
      'price_professional_monthly': 'Professional (Monthly)',
      'price_professional_yearly': 'Professional (Yearly)',
    }
    
    return planNames[priceId] || 'Unknown Plan'
  }

  const isSubscriptionActive = () => {
    return subscription && subscription.status === 'active'
  }

  const value = {
    subscription,
    loading,
    usage,
    canUseService,
    incrementUsage,
    getRemainingUsage,
    getPlanName,
    isSubscriptionActive,
    refreshSubscription
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
} 