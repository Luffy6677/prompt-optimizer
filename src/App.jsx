import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Send, Copy, RefreshCw, Lightbulb, Target, Zap } from 'lucide-react'
import PromptInput from './components/PromptInput'
import AuthModal from './components/AuthModal'
import FavoritesPage from './components/FavoritesPage'
import PricingPage from './components/PricingPage'
import CustomerPortal from './components/CustomerPortal'
import PaymentSuccess from './components/PaymentSuccess'
import PaymentCancel from './components/PaymentCancel'
import SubscriptionStatus from './components/SubscriptionStatus'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { StripeProvider } from './contexts/StripeContext'
import { optimizePrompt } from './services/api'

function AppContent({ initialTab = 'home' }) {
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [optimizedResults, setOptimizedResults] = useState(null)
  const [selectedStrategy, setSelectedStrategy] = useState('comprehensive')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab)
  const navigate = useNavigate()

  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const strategies = [
    {
  }

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      navigate('/')
    } else {
      navigate(`/${tab}`)
    }
  }

  // 渲染主页内容
  )
}

// 主App组件，包装AuthProvider和Router
function App() {
  return (
    <Router>
      <AuthProvider>
        <StripeProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/pricing" element={<AppContent initialTab="pricing" />} />
            <Route path="/favorites" element={<AppContent initialTab="favorites" />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
          </Routes>
          <SubscriptionStatus />
        </StripeProvider>
      </AuthProvider>
    </Router>
  )
}

// Subscription page component
function SubscriptionPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header activeTab="subscription" onTabChange={(tab) => navigate(tab === 'home' ? '/' : `/${tab}`)} />
      
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <CustomerPortal />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">请先登录以查看订阅信息</p>
          </div>
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false)
          navigate('/')
        }}
      />
    </div>
  )
}
