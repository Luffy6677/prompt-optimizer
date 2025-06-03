import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Users, 
  Crown, 
  Sparkles, 
  ArrowRight,
  Shield,
  Clock,
  Target
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { createAndRedirectToCheckout, createCustomerPortalSession } from '../services/stripe'
import Toast from './Toast'

const PricingPage = ({ onAuthRequired }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [loading, setLoading] = useState(null)
  const [toast, setToast] = useState(null)
  const { isAuthenticated, user } = useAuth()
  const { subscription, isSubscriptionActive } = useSubscription()

  // Stripe Price ID Configuration
  // Note: Use price IDs (price_xxx), not product IDs (prod_xxx)
  // In Stripe Dashboard -> Products -> Select Product -> Copy Price ID
  const PRICE_IDS = {
    personal: {
      // These are example price IDs for Stripe test environment, replace with your actual price IDs
      monthly: 'price_1RTGzFP1MsuVjL1H9FCVdz3C', // $1.99/month
      yearly: 'price_1RTGzqP1MsuVjL1HXuMWpJsP'   // $19.99/year
    },
    professional: {
      monthly: 'price_1RTH0vP1MsuVjL1HfoJp8ueE', // $9.99/month  
      yearly: 'price_1RTH1MP1MsuVjL1HdMK2LLqm'   // $99.99/year
    }
  }

  const plans = [
    {
      id: 'personal',
      name: 'Personal',
      description: 'Perfect for individuals and occasional use',
      price: {
        monthly: 1.99,
        yearly: 19.99
      },
      features: [
        '10 prompt optimizations per month',
        '4 optimization strategies',
        'Basic result analysis',
        'Favorites functionality',
        'Standard customer support',
        'Optimization history'
      ],
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      popular: false,
      usageLimit: '10/month',
      support: 'Standard Support'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for professionals and frequent users',
      price: {
        monthly: 9.99,
        yearly: 99.99
      },
      features: [
        '100 prompt optimizations per month',
        'All optimization strategies',
        'Advanced result analysis',
        'Unlimited favorites & categories',
        'Priority customer support',
        'Detailed usage analytics',
        'Batch optimization',
        'Custom optimization templates',
        'API access'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      usageLimit: '100/month',
      support: 'Priority Support'
    }
  ]

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }

    // If user already has an active subscription, redirect to billing page
    if (isSubscriptionActive()) {
      try {
        setLoading(planId)
        // Redirect to subscription management page
        window.location.href = '/billing'
      } catch (error) {
        console.error('Error navigating to billing page:', error)
      } finally {
        setLoading(null)
      }
      return
    }

    try {
      setLoading(planId)
      
      // Get corresponding price ID
      const priceId = PRICE_IDS[planId][billingPeriod]
      
      if (!priceId) {
        throw new Error('Invalid plan or billing period')
      }

      // Create Stripe Checkout session and redirect
      await createAndRedirectToCheckout(priceId, user.id)
      
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setToast({
        type: 'error',
        message: 'Payment initialization failed, please try again'
      })
    } finally {
      setLoading(null)
    }
  }

  const getPrice = (plan) => {
    return billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly
  }

  const getSavings = (plan) => {
    const monthlyTotal = plan.price.monthly * 12
    const yearlyPrice = plan.price.yearly
    const savings = monthlyTotal - yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { amount: savings, percentage }
  }

  const getButtonText = (planId) => {
    if (!isAuthenticated) {
      return 'Login to Subscribe'
    }
    
    if (isSubscriptionActive()) {
      return 'Manage Subscription'
    }
    
    return loading === planId ? 'Processing...' : 'Subscribe Now'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Simple & Transparent Pricing
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Optimization Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Whether you're an individual user or a professional worker, we have the perfect AI prompt optimization plan for you.
            <br />
            Make every AI conversation more precise and effective.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center bg-white p-1 rounded-lg shadow-md border border-gray-200"
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {plans.map((plan, index) => {
              const savings = getSavings(plan)
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                    plan.popular 
                      ? 'ring-2 ring-purple-500 ring-opacity-50 scale-105' 
                      : 'border border-gray-200'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-medium">
                      <Star className="w-4 h-4 inline mr-1" />
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ${getPrice(plan)}
                        </span>
                        <span className="text-gray-600">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      
                      {billingPeriod === 'yearly' && (
                        <div className="mt-2 text-sm text-green-600">
                          Save ${savings.amount.toFixed(2)} annually ({savings.percentage}% off)
                        </div>
                      )}
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{plan.usageLimit}</div>
                        <div className="text-sm text-gray-600">Optimizations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{plan.support}</div>
                        <div className="text-sm text-gray-600">Customer Support</div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.2 + featureIndex * 0.05, duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: loading === plan.id ? 1 : 1.02 }}
                      whileTap={{ scale: loading === plan.id ? 1 : 0.98 }}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading === plan.id}
                      className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } ${loading === plan.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {getButtonText(plan.id)}
                      {loading === plan.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </motion.button>

                    {!isAuthenticated && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        Please login first to subscribe
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Optimization Service?
            </h2>
            <p className="text-lg text-gray-600">
              Professional AI technology to help you achieve better AI conversation experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Optimization</h3>
              <p className="text-gray-600">
                Using the latest AI technology, complete prompt optimization in seconds and boost your productivity
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Precise Optimization</h3>
              <p className="text-gray-600">
                Multiple optimization strategies, providing the most suitable prompt improvement solutions for different scenarios
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your data is securely encrypted and stored. We promise not to use it for training or other purposes
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I use up my monthly optimizations?
              </h3>
              <p className="text-gray-600">
                You can upgrade to a higher plan, or wait for the next month's quota to reset. We'll also remind you when you're about to run out.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. After cancellation, you can continue to use the service until the end of your current billing cycle.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you support?
              </h3>
              <p className="text-gray-600">
                We support credit cards, debit cards, and PayPal. All payments are processed through secure third-party platforms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Enhance Your AI Conversation Quality?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Start using professional prompt optimization services today
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isAuthenticated ? onAuthRequired?.() : handleSubscribe('professional')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              {isAuthenticated ? 'Get Started' : 'Sign Up Now'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
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

export default PricingPage 