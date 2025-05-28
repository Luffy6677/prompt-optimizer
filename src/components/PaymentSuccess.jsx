import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Download, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'

const PaymentSuccess = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { refreshSubscription } = useSubscription()

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    
    // Refresh subscription status first
    refreshSubscription()
    
    if (sessionId) {
      // Verify payment session
      fetch(`/api/checkout-session/${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setSession(data)
          setLoading(false)
          // Refresh subscription status again after payment verification succeeds
          setTimeout(() => {
            refreshSubscription()
          }, 2000) // Delay 2 seconds to ensure Stripe webhook has been processed
        })
        .catch(error => {
          console.error('Error fetching session:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [refreshSubscription])

  const handleStartUsing = () => {
    window.location.href = '/'
  }

  const handleManageSubscription = () => {
    window.location.href = '/billing'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          {/* Main Message */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            🎉 Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-gray-600 mb-8"
          >
            Congratulations! You have successfully subscribed to our AI prompt optimization service!
            <br />
            Now you can start enjoying professional optimization features.
          </motion.p>

          {/* Payment Info Card */}
          {session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Subscription Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Subscription Plan
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {session.metadata?.planName || 'Professional'}
                  </p>
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Payment Amount
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(session.amount_total / 100).toFixed(2)} USD
                  </p>
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Subscription Status
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    Active
                  </p>
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Customer Email
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {session.customer_details?.email || user?.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* What's Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-3xl mx-auto border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What's Next:</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Optimizing
                </h3>
                <p className="text-gray-600 text-sm">
                  Immediately use our AI tools to optimize your prompts
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Download Invoice
                </h3>
                <p className="text-gray-600 text-sm">
                  Access customer portal to download payment invoices
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Subscription
                </h3>
                <p className="text-gray-600 text-sm">
                  Change plan or cancel subscription anytime
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartUsing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              Start Using Service
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManageSubscription}
              className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300"
            >
              Manage Subscription
            </motion.button>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600">
              If you have any questions, please contact our customer service team
              <br />
              We will respond to your inquiry within 24 hours
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentSuccess 