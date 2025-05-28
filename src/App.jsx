import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Copy, RefreshCw, Lightbulb, Target, Zap } from 'lucide-react'
import PromptInput from './components/PromptInput'
import OptimizationResults from './components/OptimizationResults'
import OptimizationStrategies from './components/OptimizationStrategies'
import LoadingAnimation from './components/LoadingAnimation'
import Header from './components/Header'
import Footer from './components/Footer'
import HowToUse from './components/HowToUse'
import AuthModal from './components/AuthModal'
import FavoritesPage from './components/FavoritesPage'
import PricingPage from './components/PricingPage'
import PaymentSuccess from './components/PaymentSuccess'
import BillingPage from './components/BillingPage'
import Documentation from './components/Documentation'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { optimizePrompt } from './services/api'

function AppContent() {
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [optimizedResults, setOptimizedResults] = useState(null)
  const [selectedStrategy, setSelectedStrategy] = useState('comprehensive')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const { isAuthenticated } = useAuth()

  // Check URL parameters to determine if it's a payment success page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    
    if (sessionId && window.location.pathname.includes('payment-success')) {
      setActiveTab('payment-success')
    }
  }, [])

  const strategies = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Optimization',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Comprehensively analyze and improve all aspects of prompts'
    },
    {
      id: 'clarity',
      name: 'Clarity Optimization',
      icon: <Lightbulb className="w-5 h-5" />,
      description: 'Improve clarity and comprehensibility of prompts'
    },
    {
      id: 'specificity',
      name: 'Specificity Enhancement',
      icon: <Target className="w-5 h-5" />,
      description: 'Increase specificity and precision of prompts'
    },
    {
      id: 'creativity',
      name: 'Creativity Stimulation',
      icon: <Zap className="w-5 h-5" />,
      description: 'Optimize prompts to inspire more creative responses'
    }
  ]

  const handleOptimize = async () => {
    // Check login status
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
      return
    }

    if (!originalPrompt.trim()) {
      setError('Please enter a prompt to optimize')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await optimizePrompt(originalPrompt, selectedStrategy)
      setOptimizedResults(result)
    } catch (err) {
      setError(err.message || 'An error occurred during optimization, please try again later')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginRequired = () => {
    setIsAuthModalOpen(true)
  }

  const handleClearAll = () => {
    setOriginalPrompt('')
    setOptimizedResults(null)
    setError(null)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    
    // Update URL to support direct links
    if (tab === 'home') {
      window.history.pushState({}, '', '/')
    } else if (tab === 'payment-success') {
      // Keep current URL parameters
    } else {
      window.history.pushState({}, '', `/${tab}`)
    }
  }

  // Render home page content
  const renderHomeContent = () => (
    <>
      {/* Hero Section with Slogan */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            AI Prompt Optimizer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Leverage advanced AI technology to make your prompts more precise, clear, and effective
          </motion.p>
        </motion.div>

        {/* Core Section - Input and Results */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section - Emphasize user input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  Enter Your Prompt
                </h2>
                
                <PromptInput
                  value={originalPrompt}
                  onChange={setOriginalPrompt}
                  onOptimize={handleOptimize}
                  isLoading={isLoading}
                  onLoginRequired={handleLoginRequired}
                />
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <p className="text-red-600">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleOptimize}
                    disabled={isLoading || !originalPrompt.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isLoading ? 'Optimizing...' : 'Start Optimization'}
                  </button>
                  
                  <button
                    onClick={handleClearAll}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[500px]">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  Optimization Results
                </h2>
                
                {isLoading ? (
                  <LoadingAnimation />
                ) : optimizedResults ? (
                  <OptimizationResults 
                    results={optimizedResults}
                    originalPrompt={originalPrompt}
                    strategy={selectedStrategy}
                    onLoginRequired={handleLoginRequired}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Waiting for Optimization Results
                    </h3>
                    <p className="text-gray-500">
                      {isAuthenticated ? 'Enter your prompt and click "Start Optimization" button' : 'Please login first to start using'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <HowToUse />
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main>
        {activeTab === 'home' && renderHomeContent()}
        {activeTab === 'favorites' && (
          <FavoritesPage 
            onLoginRequired={handleLoginRequired} 
            onTabChange={handleTabChange}
          />
        )}
        {activeTab === 'pricing' && (
          <PricingPage 
            onAuthRequired={handleLoginRequired}
          />
        )}
        {activeTab === 'documentation' && (
          <Documentation />
        )}
        {activeTab === 'billing' && (
          <BillingPage />
        )}
        {activeTab === 'payment-success' && (
          <PaymentSuccess />
        )}
      </main>

      <Footer />

      {/* Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}

// Main App component, wrapping AuthProvider and SubscriptionProvider
function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App 