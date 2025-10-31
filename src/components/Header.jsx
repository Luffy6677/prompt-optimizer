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
        className="bg-surface-primary/90 border-b border-border-primary sticky top-0 z-50 backdrop-blur-linear-lg"
      >
        <div className="max-w-7xl mx-auto px-linear-6xl">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-linear-xl">
              <button
                onClick={() => handleTabClick('home')}
                className="flex items-center gap-linear-xl hover:bg-surface-secondary rounded-linear p-linear-lg transition-all duration-200 group"
              >
                <motion.div 
                  className="relative w-10 h-10 bg-linear-gradient-button rounded-linear flex items-center justify-center shadow-linear-glow overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* 光晕背景动画 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-linear-blue-400/20 via-linear-purple-500/20 to-linear-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* 闪烁光点效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  {/* Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, -5, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <Brain className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />
                  </motion.div>
                  
                  {/* 外圈光晕 */}
                  <div className="absolute inset-0 rounded-linear bg-linear-gradient-button opacity-0 group-hover:opacity-100 blur-md -z-10 transition-opacity duration-300"></div>
                </motion.div>
                <div>
                  <h1 className="text-linear-xl font-semibold text-text-primary group-hover:text-linear-blue-400 transition-colors duration-200">Prompt Optimizer</h1>
                </div>
              </button>
            </div>
            
            <nav className="hidden md:flex items-center gap-linear-xl">
              <button
                onClick={() => handleTabClick('pricing')}
                className={`linear-button-ghost ${
                  activeTab === 'pricing' 
                    ? 'bg-surface-secondary text-text-primary shadow-linear-glow' 
                    : 'text-text-secondary'
                }`}
              >
                <DollarSign className="w-4 h-4 mr-linear-lg" />
                Pricing
              </button>
              <a href="#documentation" className="linear-button-ghost text-text-secondary">
                <FileText className="w-4 h-4 mr-linear-lg" />
                Documentation
              </a>
              
              <button
                onClick={() => handleTabClick('favorites')}
                className={`linear-button-ghost ${
                  activeTab === 'favorites' 
                    ? 'bg-surface-secondary text-text-primary shadow-linear-glow' 
                    : 'text-text-secondary'
                }`}
              >
                <Heart className={`w-4 h-4 mr-linear-lg ${activeTab === 'favorites' ? 'fill-current text-linear-red-400' : ''}`} />
                收藏
                {!isAuthenticated && (
                  <span className="linear-badge-warning text-linear-xs ml-linear-lg">需登录</span>
                )}
                {isAuthenticated && !favoritesAvailable && (
                  <span className="linear-badge text-linear-xs bg-surface-secondary text-text-muted border-border-primary ml-linear-lg">未配置</span>
                )}
              </button>
            </nav>
            
            <div className="flex items-center gap-linear-xl">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={handleAuthClick}
                    className="flex items-center gap-linear-xl px-linear-xl py-linear-lg hover:bg-surface-secondary rounded-linear transition-all duration-200"
                  >
                    <div className="w-9 h-9 bg-linear-gradient-button rounded-full flex items-center justify-center text-white text-linear-base font-semibold shadow-linear-glow">
                      {getUserInitials()}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-linear-base font-medium text-text-primary truncate max-w-32">
                        {getUserEmail()}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-text-muted transition-transform duration-200" />
                  </button>

                  {/* 用户菜单下拉 */}
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-linear-lg w-72 linear-card-elevated py-linear-xl z-60"
                    >
                      <div className="px-linear-4xl py-linear-xl border-b border-border-primary">
                        <div className="text-linear-base font-medium text-text-primary">{getUserEmail()}</div>
                        <div className="text-linear-sm text-text-muted">个人账户</div>
                      </div>
                      
                      <div className="py-linear-lg">
                        <button
                          onClick={() => {
                            handleTabClick('favorites')
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-linear-xl px-linear-4xl py-linear-xl text-linear-base text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all duration-200"
                        >
                          <Heart className="w-5 h-5" />
                          我的收藏
                        </button>
                        
                        <button className="w-full flex items-center gap-linear-xl px-linear-4xl py-linear-xl text-linear-base text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all duration-200">
                          <User className="w-5 h-5" />
                          个人设置
                        </button>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-linear-xl px-linear-4xl py-linear-xl text-linear-base text-linear-red-400 hover:bg-linear-red-500/10 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5" />
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
                  className="linear-button-primary"
                >
                  <LogIn className="w-5 h-5 mr-linear-lg" />
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