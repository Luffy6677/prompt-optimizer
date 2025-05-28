import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Calendar, 
  Crown, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { createCustomerPortalSession, getCustomerSubscription } from '../services/stripe'
import Toast from './Toast'

const BillingPage = () => {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { user, isAuthenticated } = useAuth()
  const { subscription, usage, refreshSubscription, isSubscriptionActive } = useSubscription()

  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription()
    }
  }, [isAuthenticated, refreshSubscription])

  const handleManageBilling = async () => {
    if (!subscription?.customer) {
      setToast({
        type: 'error',
        message: 'Unable to find customer information, please contact support'
      })
      return
    }

    try {
      setLoading(true)
      await createCustomerPortalSession(subscription.customer)
    } catch (error) {
      console.error('Error opening customer portal:', error)
      setToast({
        type: 'error',
        message: 'Failed to open customer portal, please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  const getPlanInfo = () => {
    if (!subscription) return null

    const priceId = subscription.items?.data[0]?.price?.id
    
    const planMap = {
      'price_1RTGzFP1MsuVjL1H9FCVdz3C': { name: 'Personal', period: 'Monthly', limit: 10 },
      'price_1RTGzqP1MsuVjL1HXuMWpJsP': { name: 'Personal', period: 'Yearly', limit: 10 },
      'price_1RTH0vP1MsuVjL1HfoJp8ueE': { name: 'Professional', period: 'Monthly', limit: 100 },
      'price_1RTH1MP1MsuVjL1HdMK2LLqm': { name: 'Professional', period: 'Yearly', limit: 100 },
    }

    return planMap[priceId] || { name: 'Unknown Plan', period: 'Unknown', limit: 0 }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUsagePercentage = () => {
    if (!usage.limit) return 0
    return Math.round((usage.current / usage.limit) * 100)
  }

  const planInfo = getPlanInfo()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-600">Please login first to view your subscription information</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
            <p className="text-gray-600">Manage your subscription plan and billing information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Subscription Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription Overview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Subscription</h2>
                    {isSubscriptionActive() ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 font-medium">Subscription Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">No Active Subscription</span>
                      </div>
                    )}
                  </div>
                  
                  {isSubscriptionActive() && (
                    <div className="flex items-center gap-2">
                      {planInfo?.name === 'Professional' ? (
                        <Crown className="w-6 h-6 text-purple-500" />
                      ) : (
                        <Users className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                  )}
                </div>

                {isSubscriptionActive() ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plan</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {planInfo?.name} - {planInfo?.period}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {subscription?.status === 'active' ? 'Active' : subscription?.status || 'Unknown'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Next Renewal</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {subscription?.current_period_end ? formatDate(subscription.current_period_end) : 'Unknown'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created Date</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {subscription?.created ? formatDate(subscription.created) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-500 mb-4">You haven't subscribed to any plan yet</p>
                    <button
                      onClick={() => window.location.href = '/pricing'}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Plans
                    </button>
                  </div>
                )}
              </div>

              {/* Usage Status */}
              {isSubscriptionActive() && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">This Month's Usage</h2>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Optimizations</span>
                      <span className="text-sm text-gray-500">
                        {usage.current || 0} / {usage.limit || 0}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getUsagePercentage()}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {getUsagePercentage()}% used
                      </span>
                      {getUsagePercentage() > 80 && (
                        <span className="text-xs text-orange-600 font-medium">
                          Approaching limit
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Usage resets monthly. If you need more optimizations, consider upgrading to a higher plan.
                  </div>
                </div>
              )}
            </div>

            {/* Action Panel */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  {isSubscriptionActive() && (
                    <button
                      onClick={handleManageBilling}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      Manage Billing
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    {isSubscriptionActive() ? 'Change Plan' : 'Choose Plan'}
                  </button>
                  
                  <button
                    onClick={refreshSubscription}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                  </button>
                </div>
              </div>

              {/* Help Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <Download className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>View billing history and invoices</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Contact customer support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Learn about plan details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default BillingPage 