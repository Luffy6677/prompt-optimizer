import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Sparkles, TrendingUp, AlertCircle, Lightbulb, Heart, HeartOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { favoritesService } from '../services/favorites'
import Toast from './Toast'

const OptimizationResults = ({ results, originalPrompt, strategy, onLoginRequired }) => {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const [favoriteTitle, setFavoriteTitle] = useState('')
  const [showTitleInput, setShowTitleInput] = useState(false)
  const [favoritesAvailable, setFavoritesAvailable] = useState(true)
  
  // Toast 状态
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })

  const { user, isAuthenticated } = useAuth()

  // 检查收藏功能是否可用
  useEffect(() => {
    setFavoritesAvailable(favoritesService.isAvailable())
  }, [])

  // 检查是否已收藏
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && user && results?.optimizedPrompt && favoritesAvailable) {
        try {
          const favorited = await favoritesService.checkIfFavorited(user.id, results.optimizedPrompt)
          setIsFavorited(favorited)
        } catch (error) {
          console.error('检查收藏状态失败:', error)
        }
      }
    }

    checkFavoriteStatus()
  }, [isAuthenticated, user, results?.optimizedPrompt, favoritesAvailable])

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const generateFavoriteTitle = () => {
    if (originalPrompt) {
      // 取原始提示词的前30个字符作为标题
      return originalPrompt.length > 30 
        ? originalPrompt.substring(0, 30) + '...' 
        : originalPrompt
    }
    return '未命名的提示词优化'
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.()
      return
    }

    if (!favoritesAvailable) {
      showToast('收藏功能未配置，请配置 Supabase 以启用收藏功能。', 'warning')
      return
    }

    if (isFavorited) {
      // 取消收藏
      try {
        setIsAddingToFavorites(true)
        await favoritesService.removeFavoriteByContent(user.id, results.optimizedPrompt)
        setIsFavorited(false)
        showToast('已取消收藏')
      } catch (error) {
        console.error('取消收藏失败:', error)
        showToast(error.message || '取消收藏失败，请重试', 'error')
      } finally {
        setIsAddingToFavorites(false)
      }
      return
    }

    // 添加收藏 - 显示标题输入框
    setFavoriteTitle(generateFavoriteTitle())
    setShowTitleInput(true)
  }

  const handleAddToFavorites = async () => {
    if (!isAuthenticated || !user) {
      onLoginRequired?.()
      return
    }

    if (!favoritesAvailable) {
      showToast('收藏功能未配置，请配置 Supabase 以启用收藏功能。', 'warning')
      return
    }

    if (!favoriteTitle.trim()) {
      showToast('请输入收藏标题', 'warning')
      return
    }

    setIsAddingToFavorites(true)

    try {
      await favoritesService.addFavorite({
        title: favoriteTitle.trim(),
        originalPrompt: originalPrompt || '',
        optimizedPrompt: results.optimizedPrompt,
        strategy: strategy || 'comprehensive',
        scores: results.scores,
        analysis: results.analysis,
        alternatives: results.alternatives,
        userId: user.id
      })

      setIsFavorited(true)
      setShowTitleInput(false)
      setFavoriteTitle('')
      
      // 显示成功提示（可以用toast替代）
      showToast('已成功添加到收藏！')
    } catch (error) {
      console.error('添加收藏失败:', error)
      
      // 提供更详细的错误信息
      if (error.message.includes('Supabase未配置')) {
        showToast('收藏功能未配置，请配置 Supabase 以启用收藏功能。', 'warning')
      } else if (error.message.includes('收藏表不存在')) {
        showToast('收藏表不存在，请查看控制台了解详细设置步骤', 'warning')
        
        // 输出详细信息到控制台
        console.group('📋 收藏表设置说明')
        console.log('请按以下步骤创建收藏表：')
        console.log('1. 登录您的 Supabase 控制台：https://app.supabase.com')
        console.log('2. 选择您的项目')
        console.log('3. 点击左侧菜单的 "SQL Editor"')
        console.log('4. 执行项目根目录 SUPABASE_SETUP.md 中的建表SQL')
        console.log('5. 点击 "Run" 执行 SQL')
        console.log('6. 刷新页面重试收藏功能')
        console.groupEnd()
      } else {
        showToast(error.message || '添加收藏失败，请重试', 'error')
      }
    } finally {
      setIsAddingToFavorites(false)
    }
  }

  const handleCancelAddFavorite = () => {
    setShowTitleInput(false)
    setFavoriteTitle('')
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-linear-green-400 bg-linear-green-500/20 border-linear-green-500/30'
    if (score >= 6) return 'text-linear-orange-400 bg-linear-orange-500/20 border-linear-orange-500/30'
    return 'text-linear-red-400 bg-linear-red-500/20 border-linear-red-500/30'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return '优秀'
    if (score >= 6) return '良好'
    return '需改进'
  }

  // Toast 辅助函数
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-linear-3xl"
    >
      {/* Optimized Prompt */}
      <div className="linear-card overflow-hidden hover-lift">
        <div className="bg-linear-green-500/10 px-linear-2xl py-linear-lg border-b border-linear-green-500/20 backdrop-blur-linear">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-linear-lg">
              <Sparkles className="w-5 h-5 text-linear-green-400 animate-linear-pulse" />
              <h3 className="font-semibold linear-text-primary text-linear-base">优化后的提示词</h3>
              <span className="linear-badge-success text-linear-xs">
                已优化
              </span>
            </div>
            
            {/* 收藏按钮 */}
            {favoritesAvailable ? (
              <button
                onClick={handleFavoriteClick}
                disabled={isAddingToFavorites}
                className={`linear-button-ghost text-linear-xs hover-lift ${
                  isFavorited
                    ? 'bg-linear-red-500/10 text-linear-red-400 hover:bg-linear-red-500/20 border border-linear-red-500/30'
                    : 'linear-text-secondary hover:bg-white/10'
                } ${isAddingToFavorites ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAddingToFavorites ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-linear-sm"></div>
                    处理中...
                  </>
                ) : isFavorited ? (
                  <>
                    <Heart className="w-4 h-4 fill-current mr-linear-sm" />
                    已收藏
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-linear-sm" />
                    收藏
                  </>
                )}
              </button>
            ) : (
              <div 
                className="linear-button-ghost text-linear-xs linear-text-muted cursor-not-allowed"
                title="收藏功能未配置，请配置 Supabase 以启用"
              >
                <Heart className="w-4 h-4 mr-linear-sm" />
                收藏
              </div>
            )}
          </div>
        </div>
        
        <div className="p-linear-2xl">
          <div className="bg-surface-secondary/50 rounded-linear p-linear-2xl mb-linear-2xl backdrop-blur-linear border border-white/10">
            <p className="linear-text-primary leading-relaxed text-linear-base">{results.optimizedPrompt}</p>
          </div>
          
          {/* 收藏标题输入 */}
          {showTitleInput && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-linear-2xl p-linear-2xl linear-card-glass border border-linear-blue-500/30 animate-linear-fade-in"
            >
              <label className="block text-linear-sm font-semibold text-linear-blue-400 mb-linear-lg">
                收藏标题
              </label>
              <input
                type="text"
                value={favoriteTitle}
                onChange={(e) => setFavoriteTitle(e.target.value)}
                placeholder="为这个优化结果命名..."
                className="linear-input text-linear-sm"
                maxLength={100}
              />
              <div className="flex gap-linear-lg mt-linear-lg">
                <button
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                  className="linear-button-primary text-linear-sm hover-glow-purple"
                >
                  {isAddingToFavorites ? '添加中...' : '确认收藏'}
                </button>
                <button
                  onClick={handleCancelAddFavorite}
                  className="linear-button-secondary text-linear-sm hover-lift"
                >
                  取消
                </button>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={() => copyToClipboard(results.optimizedPrompt, 'main')}
            className="linear-button-primary text-linear-sm hover-glow-purple"
          >
            {copiedIndex === 'main' ? (
              <>
                <Check className="w-5 h-5 mr-linear-lg" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-linear-lg" />
                复制提示词
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis & Scores */}
      <div className="linear-card p-linear-3xl hover-lift">
        <h3 className="text-linear-2xl font-semibold linear-text-primary mb-linear-3xl flex items-center gap-linear-lg">
          <TrendingUp className="w-6 h-6 text-linear-blue-400" />
          分析报告
        </h3>
        
        <div className="grid md:grid-cols-3 gap-linear-2xl mb-linear-4xl">
          <div className="text-center p-linear-2xl linear-card-glass hover-lift">
            <div className={`inline-flex items-center px-linear-lg py-linear-sm rounded-full text-linear-sm font-semibold border ${getScoreColor(results.scores.clarity)}`}>
              {results.scores.clarity}/10 {getScoreLabel(results.scores.clarity)}
            </div>
            <p className="text-linear-base linear-text-secondary mt-linear-lg font-medium">清晰度</p>
          </div>
          
          <div className="text-center p-linear-2xl linear-card-glass hover-lift">
            <div className={`inline-flex items-center px-linear-lg py-linear-sm rounded-full text-linear-sm font-semibold border ${getScoreColor(results.scores.specificity)}`}>
              {results.scores.specificity}/10 {getScoreLabel(results.scores.specificity)}
            </div>
            <p className="text-linear-base linear-text-secondary mt-linear-lg font-medium">具体性</p>
          </div>
          
          <div className="text-center p-linear-2xl linear-card-glass hover-lift">
            <div className={`inline-flex items-center px-linear-lg py-linear-sm rounded-full text-linear-sm font-semibold border ${getScoreColor(results.scores.effectiveness)}`}>
              {results.scores.effectiveness}/10 {getScoreLabel(results.scores.effectiveness)}
            </div>
            <p className="text-linear-base linear-text-secondary mt-linear-lg font-medium">有效性</p>
          </div>
        </div>

        <div className="space-y-linear-2xl">
          <div className="linear-card-glass p-linear-2xl border border-linear-blue-500/30">
            <h4 className="font-semibold text-linear-blue-400 mb-linear-lg flex items-center gap-linear-lg text-linear-base">
              <Lightbulb className="w-5 h-5" />
              改进说明
            </h4>
            <p className="text-linear-blue-300 text-linear-base leading-relaxed">{results.analysis.improvements}</p>
          </div>
          
          {results.analysis.issues && results.analysis.issues.length > 0 && (
            <div className="linear-card-glass p-linear-2xl border border-linear-orange-500/30">
              <h4 className="font-semibold text-linear-orange-400 mb-linear-lg flex items-center gap-linear-lg text-linear-base">
                <AlertCircle className="w-5 h-5" />
                原提示词问题
              </h4>
              <ul className="text-linear-orange-300 text-linear-base space-y-linear-sm">
                {results.analysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-linear-lg">
                    <span className="text-linear-orange-400 mt-1 font-bold">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Suggestions */}
      {results.alternatives && results.alternatives.length > 0 && (
        <div className="linear-card p-linear-3xl hover-lift">
          <h3 className="text-linear-2xl font-semibold linear-text-primary mb-linear-3xl">其他建议</h3>
          
          <div className="space-y-linear-lg">
            {results.alternatives.map((alternative, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="linear-card-glass p-linear-2xl flex items-start justify-between gap-linear-2xl hover-lift"
              >
                <div className="flex-1">
                  <p className="linear-text-primary text-linear-base mb-linear-lg leading-relaxed">{alternative.prompt}</p>
                  <p className="linear-text-muted text-linear-sm">{alternative.reason}</p>
                </div>
                
                <button
                  onClick={() => copyToClipboard(alternative.prompt, `alt-${index}`)}
                  className="flex-shrink-0 p-linear-lg linear-text-muted hover:linear-text-secondary hover:bg-white/10 rounded-linear transition-all duration-300 hover-lift"
                >
                  {copiedIndex === `alt-${index}` ? (
                    <Check className="w-5 h-5 text-linear-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </motion.div>
  )
}

export default OptimizationResults 