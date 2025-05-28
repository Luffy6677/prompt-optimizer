import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Zap, 
  Users, 
  CreditCard, 
  Heart, 
  Settings, 
  Target, 
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Code,
  Database,
  Server
} from 'lucide-react'

const Documentation = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            {...fadeInUp}
            className="text-center"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Complete guide to using AI Prompt Optimizer - from getting started to advanced features
            </p>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            {...fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: <Zap className="w-5 h-5" />, title: "Quick Start Guide", href: "#quick-start" },
                { icon: <Users className="w-5 h-5" />, title: "User Registration & Login", href: "#registration" },
                { icon: <CreditCard className="w-5 h-5" />, title: "Subscription Plans", href: "#subscription" },
                { icon: <Target className="w-5 h-5" />, title: "Optimization Strategies", href: "#strategies" },
                { icon: <Heart className="w-5 h-5" />, title: "Favorites Management", href: "#favorites" },
                { icon: <Settings className="w-5 h-5" />, title: "Account Management", href: "#account" },
                { icon: <Code className="w-5 h-5" />, title: "Technical Setup", href: "#technical" },
                { icon: <Shield className="w-5 h-5" />, title: "Security & Privacy", href: "#security" }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div className="text-blue-600 group-hover:text-blue-700">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-blue-700">
                    {item.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Quick Start Guide */}
          <motion.section 
            id="quick-start"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Quick Start Guide</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-700">
                Get started with AI Prompt Optimizer in just a few minutes. Follow these simple steps to begin optimizing your prompts.
              </p>

              <div className="grid gap-6">
                {[
                  {
                    step: "1",
                    title: "Create Your Account",
                    description: "Sign up with your email address to access the optimization features.",
                    icon: <Users className="w-6 h-6" />
                  },
                  {
                    step: "2", 
                    title: "Choose a Subscription Plan",
                    description: "Select between Personal ($1.99/month) or Professional ($9.99/month) plans.",
                    icon: <CreditCard className="w-6 h-6" />
                  },
                  {
                    step: "3",
                    title: "Enter Your Prompt",
                    description: "Type or paste the prompt you want to optimize in the input field.",
                    icon: <BookOpen className="w-6 h-6" />
                  },
                  {
                    step: "4",
                    title: "Select Optimization Strategy",
                    description: "Choose from Comprehensive, Clarity, Specificity, or Creativity optimization.",
                    icon: <Target className="w-6 h-6" />
                  },
                  {
                    step: "5",
                    title: "Get Optimized Results",
                    description: "Review the improved prompt with detailed analysis and recommendations.",
                    icon: <Sparkles className="w-6 h-6" />
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-blue-600">{item.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* User Registration & Login */}
          <motion.section 
            id="registration"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">User Registration & Login</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Creating Your Account</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Click the "Login" button in the top navigation</p>
                  <p>• Select "Sign Up" to create a new account</p>
                  <p>• Enter your email address and create a secure password</p>
                  <p>• Verify your email address if required</p>
                  <p>• Complete your profile setup</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Login Process</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Use your registered email and password to log in</p>
                  <p>• Enable "Remember Me" for convenient access</p>
                  <p>• Use password reset if you forget your credentials</p>
                  <p>• Access your dashboard immediately after login</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Security Note</h4>
                    <p className="text-blue-800 text-sm">
                      Your account is protected with industry-standard security measures. We never store your payment information directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Subscription Plans */}
          <motion.section 
            id="subscription"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Subscription Plans</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Plan */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Plan</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">$1.99<span className="text-lg text-gray-600">/month</span></div>
                  <div className="text-lg text-gray-600">or $19.99/year</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {[
                    "10 prompt optimizations per month",
                    "4 optimization strategies",
                    "Basic result analysis", 
                    "Favorites functionality",
                    "Standard customer support",
                    "Optimization history"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Choose Personal
                </button>
              </div>

              {/* Professional Plan */}
              <div className="border-2 border-purple-500 rounded-xl p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Recommended
                  </span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Plan</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">$9.99<span className="text-lg text-gray-600">/month</span></div>
                  <div className="text-lg text-gray-600">or $99.99/year</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {[
                    "100 prompt optimizations per month",
                    "All optimization strategies",
                    "Advanced result analysis",
                    "Unlimited favorites & categories",
                    "Priority customer support",
                    "Detailed usage statistics",
                    "Batch optimization features",
                    "Custom optimization templates",
                    "API access rights"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Choose Professional
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Subscription Management</h3>
              <div className="space-y-3 text-gray-700">
                <p>• <strong>Upgrade/Downgrade:</strong> Change your plan anytime through the customer portal</p>
                <p>• <strong>Cancel Anytime:</strong> No cancellation fees, access continues until period ends</p>
                <p>• <strong>Billing Cycle:</strong> Monthly or annual billing options available</p>
                <p>• <strong>Payment Methods:</strong> Credit cards and PayPal accepted</p>
                <p>• <strong>Invoices:</strong> Download invoices from your customer portal</p>
              </div>
            </div>
          </motion.section>

          {/* Optimization Strategies */}
          <motion.section 
            id="strategies"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Optimization Strategies</h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Choose from four specialized optimization strategies, each designed to improve different aspects of your prompts using Deepseek-V3's advanced AI capabilities.
            </p>

            <div className="grid gap-6">
              {[
                {
                  icon: <Sparkles className="w-8 h-8 text-purple-600" />,
                  title: "Comprehensive Optimization",
                  description: "Complete analysis and improvement of all prompt aspects using Deepseek-V3's reasoning capabilities.",
                  features: [
                    "Full-spectrum prompt analysis",
                    "Chain-of-thought reasoning enhancement", 
                    "Balance clarity, specificity, and effectiveness",
                    "Advanced logical structure optimization"
                  ],
                  color: "purple"
                },
                {
                  icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
                  title: "Clarity Optimization", 
                  description: "Focus on eliminating ambiguity and improving prompt comprehensibility.",
                  features: [
                    "Remove ambiguous expressions",
                    "Simplify complex sentence structures",
                    "Ensure clear instruction understanding",
                    "Establish clear logical connections"
                  ],
                  color: "yellow"
                },
                {
                  icon: <Target className="w-8 h-8 text-blue-600" />,
                  title: "Specificity Enhancement",
                  description: "Add concrete requirements and constraints to make prompts more precise.",
                  features: [
                    "Add specific requirements and constraints",
                    "Define clear output format and structure", 
                    "Provide concrete examples and references",
                    "Establish clear success criteria"
                  ],
                  color: "blue"
                },
                {
                  icon: <Zap className="w-8 h-8 text-green-600" />,
                  title: "Creativity Stimulation",
                  description: "Optimize prompts to encourage more creative and innovative responses.",
                  features: [
                    "Encourage multi-perspective thinking",
                    "Stimulate innovative reasoning",
                    "Promote original expression",
                    "Build creative thinking frameworks"
                  ],
                  color: "green"
                }
              ].map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      strategy.color === 'purple' ? 'bg-purple-100' :
                      strategy.color === 'yellow' ? 'bg-yellow-100' :
                      strategy.color === 'blue' ? 'bg-blue-100' :
                      strategy.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {strategy.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{strategy.title}</h3>
                      <p className="text-gray-700 mb-4">{strategy.description}</p>
                      <div className="space-y-2">
                        {strategy.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Favorites Management */}
          <motion.section 
            id="favorites"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900">Favorites Management</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-700">
                Save and organize your best optimization results for easy access and future reference.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Adding to Favorites</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Click the heart icon on any optimization result</p>
                  <p>• Add a custom title for easy identification</p>
                  <p>• Results are automatically saved with full context</p>
                  <p>• Include original prompt, optimized version, strategy, and scores</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Managing Your Favorites</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: <Database className="w-5 h-5" />, title: "Search", desc: "Find favorites by title or content" },
                    { icon: <Target className="w-5 h-5" />, title: "Filter", desc: "Filter by optimization strategy" },
                    { icon: <TrendingUp className="w-5 h-5" />, title: "Sort", desc: "Sort by date, title, or strategy" },
                    { icon: <Settings className="w-5 h-5" />, title: "Edit", desc: "Modify titles and organize collections" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-blue-600 mt-0.5">{feature.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Data Security</h4>
                    <p className="text-green-800 text-sm">
                      All favorites are securely stored in the cloud with user-level data isolation and automatic backups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Account Management */}
          <motion.section 
            id="account"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Account Management</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Profile Settings</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Update your email address and personal information</p>
                  <p>• Change your password for enhanced security</p>
                  <p>• Set notification preferences</p>
                  <p>• Configure usage alerts and limits</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Subscription Management</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• View current subscription status and usage</p>
                  <p>• Access Stripe customer portal for billing management</p>
                  <p>• Upgrade or downgrade plans as needed</p>
                  <p>• Download invoices and payment history</p>
                  <p>• Update payment methods securely</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Monitoring</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Track monthly optimization usage in real-time</p>
                  <p>• View detailed usage statistics and trends</p>
                  <p>• Receive notifications when approaching limits</p>
                  <p>• Access optimization history and results</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Technical Setup */}
          <motion.section 
            id="technical"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Technical Setup</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">System Requirements</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Modern web browser (Chrome, Firefox, Safari, Edge)</p>
                  <p>• Stable internet connection for real-time optimization</p>
                  <p>• JavaScript enabled for full functionality</p>
                  <p>• Responsive design supports desktop and mobile devices</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Compatibility</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Chrome", version: "90+" },
                    { name: "Firefox", version: "88+" },
                    { name: "Safari", version: "14+" },
                    { name: "Edge", version: "90+" }
                  ].map((browser, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{browser.name}</div>
                      <div className="text-sm text-gray-600">{browser.version}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">API Integration</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Professional plan includes API access for developers</p>
                  <p>• RESTful API with comprehensive documentation</p>
                  <p>• Authentication via API keys for secure access</p>
                  <p>• Rate limiting based on subscription tier</p>
                  <p>• Full support for all optimization strategies</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Security & Privacy */}
          <motion.section 
            id="security"
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Security & Privacy</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• All data transmitted over HTTPS encryption</p>
                  <p>• User data stored securely in Supabase cloud infrastructure</p>
                  <p>• No storage of payment information on our servers</p>
                  <p>• Regular security audits and updates</p>
                  <p>• GDPR compliant data handling practices</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Policy</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Your prompts and optimization results remain private</p>
                  <p>• No sharing of user data with third parties</p>
                  <p>• Option to delete your account and all data</p>
                  <p>• Transparent data usage policies</p>
                  <p>• Cookie usage limited to essential functionality</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Security</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Payment processing handled by Stripe (PCI DSS certified)</p>
                  <p>• No credit card information stored on our servers</p>
                  <p>• Secure payment forms with SSL encryption</p>
                  <p>• Fraud detection and prevention measures</p>
                  <p>• Secure customer portal for billing management</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Support Section */}
          <motion.section 
            {...fadeInUp}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our support team is here to help you get the most out of AI Prompt Optimizer.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-sm text-gray-600">Comprehensive guides and tutorials</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">Connect with other users and share tips</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Server className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-sm text-gray-600">Direct support for technical issues</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}

export default Documentation 