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
import { AuthProvider, useAuth } from './contexts/AuthContext'
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

  const strategies = [
    {
      id: 'comprehensive',
      name: '综合优化',
      icon: <Sparkles className="w-5 h-5" />,
      description: '全面分析并改进提示词的各个方面'
    },
    {
      id: 'clarity',
      name: '清晰度优化',
      icon: <Lightbulb className="w-5 h-5" />,
      description: '提高提示词的清晰度和可理解性'
    },
    {
      id: 'specificity',
      name: '具体性增强',
      icon: <Target className="w-5 h-5" />,
      description: '增加提示词的具体性和精确性'
    },
    {
      id: 'creativity',
      name: '创意激发',
      icon: <Zap className="w-5 h-5" />,
      description: '优化提示词以激发更有创意的回答'
    }
  ]

  const handleOptimize = async () => {
    // 检查登录状态
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
      return
    }

    if (!originalPrompt.trim()) {
      setError('请输入要优化的提示词')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await optimizePrompt(originalPrompt, selectedStrategy)
      setOptimizedResults(result)
    } catch (err) {
      setError(err.message || '优化过程中出现错误，请稍后重试')
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
  }

  // 渲染主页内容
  const renderHomeContent = () => (
    <>
      {/* Hero Section with Slogan */}
      <section className="max-w-7xl mx-auto px-linear-6xl py-linear-8xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-linear-8xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-linear-5xl font-bold text-text-primary mb-linear-4xl bg-gradient-to-r from-linear-blue-400 via-linear-purple-400 to-linear-blue-500 bg-clip-text text-transparent"
          >
            AI 提示词优化器
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-linear-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            利用先进的 AI 技术，让您的提示词更加精准、清晰、有效
          </motion.p>
        </motion.div>

        {/* Core Section - Input and Results */}
        <div className="grid lg:grid-cols-2 gap-linear-6xl">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-linear-4xl"
          >
            <div className="linear-card p-linear-5xl hover-lift">
              <div className="flex items-center gap-linear-xl mb-linear-4xl">
                <div className="w-10 h-10 bg-linear-gradient-button rounded-linear flex items-center justify-center shadow-linear-glow">
                  <span className="text-white font-semibold text-linear-base">1</span>
                </div>
                <h2 className="text-linear-2xl font-semibold text-text-primary">
                  输入您的提示词
                </h2>
              </div>
              
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
                  className="mt-linear-4xl bg-linear-red-500/10 border border-linear-red-500/30 rounded-linear p-linear-3xl backdrop-blur-linear"
                >
                  <p className="text-linear-red-400 text-linear-base">{error}</p>
                </motion.div>
              )}

              <div className="flex gap-linear-xl mt-linear-4xl">
                <button
                  onClick={handleOptimize}
                  disabled={isLoading || !originalPrompt.trim()}
                  className="linear-button-primary flex-1"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin mr-linear-lg" />
                  ) : (
                    <Send className="w-5 h-5 mr-linear-lg" />
                  )}
                  {isLoading ? '优化中...' : '开始优化'}
                </button>
                
                <button
                  onClick={handleClearAll}
                  className="linear-button-secondary"
                >
                  清空
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-linear-4xl"
          >
            <div className="linear-card p-linear-5xl min-h-[700px] hover-lift">
              <div className="flex items-center gap-linear-xl mb-linear-4xl">
                <div className="w-10 h-10 bg-linear-gradient-success rounded-linear flex items-center justify-center shadow-linear-glow-green">
                  <span className="text-white font-semibold text-linear-base">2</span>
                </div>
                <h2 className="text-linear-2xl font-semibold text-text-primary">
                  优化结果
                </h2>
              </div>
              
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
                  <div className="relative mb-linear-4xl">
                    <Sparkles className="w-20 h-20 text-text-muted animate-linear-pulse" />
                    <div className="absolute inset-0 w-20 h-20 bg-linear-blue-500/20 rounded-full blur-xl animate-linear-glow mx-auto"></div>
                  </div>
                  <h3 className="text-linear-xl font-medium text-text-secondary mb-linear-xl">
                    等待优化结果
                  </h3>
                  <p className="text-text-muted text-linear-base max-w-sm leading-relaxed">
                    {isAuthenticated ? '输入您的提示词并点击"开始优化"按钮' : '请先登录后开始使用'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Use Section */}
      <HowToUse />
    </>
  )

  return (
    <div className="min-h-screen bg-linear-gradient font-linear relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-linear-blue-500/8 rounded-full blur-3xl animate-linear-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-linear-purple-500/8 rounded-full blur-3xl animate-linear-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-linear-blue-400/5 rounded-full blur-2xl animate-linear-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10">
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main className="linear-content">
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
        </main>

        <Footer />

        {/* 登录弹窗 */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  )
}

// 主App组件，包装AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App 