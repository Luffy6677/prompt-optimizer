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

const PricingPage = ({ onAuthRequired }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const { isAuthenticated } = useAuth()

  const plans = [
    {
      id: 'personal',
      name: '个人版',
      description: '适合个人用户和偶尔使用的场景',
      price: {
        monthly: 1.99,
        yearly: 19.99
      },
      features: [
        '每月 10 次 prompt 优化',
        '4 种优化策略选择',
        '基础结果分析',
        '结果收藏功能',
        '标准客服支持',
        '优化历史记录'
      ],
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      popular: false,
      usageLimit: '10 次/月',
      support: '标准支持'
    },
    {
      id: 'professional',
      name: '专业版',
      description: '适合专业用户和频繁使用的场景',
      price: {
        monthly: 9.99,
        yearly: 99.99
      },
      features: [
        '每月 100 次 prompt 优化',
        '全部优化策略',
        '高级结果分析',
        '无限收藏和分类',
        '优先客服支持',
        '详细使用统计',
        '批量优化功能',
        '自定义优化模板',
        'API 访问权限'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      usageLimit: '100 次/月',
      support: '优先支持'
    }
  ]

  const handleSubscribe = (planId) => {
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }
    
    // TODO: 集成支付系统
    console.log(`Subscribe to ${planId}`)
    alert(`即将跳转到 ${planId === 'personal' ? '个人版' : '专业版'} 支付页面`)
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
            简单透明的定价
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            选择适合您的
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              优化方案
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            无论您是个人用户还是专业工作者，我们都有适合您的AI提示词优化方案。
            <br />
            让每一次AI对话都更加精准有效。
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
              月付
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              年付
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                省 17%
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
                      最受欢迎
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
                          /{billingPeriod === 'monthly' ? '月' : '年'}
                        </span>
                      </div>
                      
                      {billingPeriod === 'yearly' && (
                        <div className="mt-2 text-sm text-green-600">
                          每年节省 ${savings.amount.toFixed(2)} ({savings.percentage}% off)
                        </div>
                      )}
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{plan.usageLimit}</div>
                        <div className="text-sm text-gray-600">优化次数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{plan.support}</div>
                        <div className="text-sm text-gray-600">客服支持</div>
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {isAuthenticated ? '立即订阅' : '登录后订阅'}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    {!isAuthenticated && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        需要先登录才能订阅
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
              为什么选择我们的优化服务？
            </h2>
            <p className="text-lg text-gray-600">
              专业的AI技术，帮助您获得更好的AI对话体验
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">快速优化</h3>
              <p className="text-gray-600">
                采用最新的AI技术，几秒内完成提示词优化，提升您的工作效率
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">精准优化</h3>
              <p className="text-gray-600">
                多种优化策略，针对不同场景提供最适合的提示词改进方案
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">安全可靠</h3>
              <p className="text-gray-600">
                您的数据安全加密存储，我们承诺不会用于训练或其他用途
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
              常见问题
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                如果当月用完了优化次数怎么办？
              </h3>
              <p className="text-gray-600">
                您可以升级到更高的套餐，或者等待下个月的次数重置。我们也会在即将用完时提醒您。
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                可以随时取消订阅吗？
              </h3>
              <p className="text-gray-600">
                是的，您可以随时取消订阅。取消后，您可以继续使用到当前计费周期结束。
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                支持哪些支付方式？
              </h3>
              <p className="text-gray-600">
                我们支持信用卡、借记卡和 PayPal 支付。所有支付都通过安全的第三方平台处理。
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
              准备好提升您的AI对话质量了吗？
            </h2>
            <p className="text-xl mb-6 opacity-90">
              立即开始使用专业的提示词优化服务
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isAuthenticated ? onAuthRequired?.() : handleSubscribe('professional')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              {isAuthenticated ? '开始使用' : '立即注册'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PricingPage 