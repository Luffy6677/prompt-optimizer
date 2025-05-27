import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, FileText, DollarSign, LogIn, User, LogOut, ChevronDown, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { favoritesService } from '../services/favorites'
import AuthModal from './AuthModal'

const Header = ({ activeTab = 'home', onTabChange }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [favoritesAvailable, setFavoritesAvailable] = useState(true)
  const { user, isAuthenticated, signOut, loading } = useAuth()

  // 检查收藏功能是否可用
  useEffect(() => {
    setFavoritesAvailable(favoritesService.isAvailable())
  }, [])

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(!isUserMenuOpen)
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
      // 退出登录后回到首页
      onTabChange?.('home')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleTabClick = (tab) => {
    if (tab === 'favorites' && !isAuthenticated) {
      setIsAuthModalOpen(true)
      return
    }
    
    if (tab === 'favorites' && !favoritesAvailable) {
      alert('收藏功能未配置，请配置 Supabase 以启用收藏功能。')
      return
    }
    
    onTabChange?.(tab)
  }

  const getUserEmail = () => {
    return user?.email || '用户'
  }

  const getUserInitials = () => {
    const email = getUserEmail()
    return email.charAt(0).toUpperCase()
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTabClick('home')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Prompt Optimizer</h1>
                  <p className="text-sm text-gray-500 hidden md:block">AI驱动的提示词优化工具</p>
                </div>
              </button>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleTabClick('pricing')}
                className={`flex items-center gap-2 transition-colors ${
                  activeTab === 'pricing' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Pricing
              </button>
              <a href="#documentation" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <FileText className="w-4 h-4" />
                Documentation
              </a>
              
              <button
                onClick={() => handleTabClick('favorites')}
                className={`flex items-center gap-2 transition-colors ${
                  activeTab === 'favorites' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
                收藏
                {!isAuthenticated && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">需登录</span>
                )}
                {isAuthenticated && !favoritesAvailable && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">未配置</span>
                )}
              </button>
            </nav>
            
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={handleAuthClick}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {getUserEmail()}
                      </div>
                      <div className="text-xs text-gray-500">已登录</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* 用户菜单下拉 */}
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-60"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{getUserEmail()}</div>
                        <div className="text-xs text-gray-500">个人账户</div>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleTabClick('favorites')
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          我的收藏
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4" />
                          个人设置
                        </button>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          退出登录
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? '加载中...' : 'Login'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* 点击外部关闭用户菜单 */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* 登录弹窗 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}

export default Header 