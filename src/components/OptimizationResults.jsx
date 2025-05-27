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
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
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
      className="space-y-6"
    >
      {/* Optimized Prompt */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900">优化后的提示词</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                已优化
              </span>
            </div>
            
            {/* 收藏按钮 */}
            {favoritesAvailable ? (
              <button
                onClick={handleFavoriteClick}
                disabled={isAddingToFavorites}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isFavorited
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${isAddingToFavorites ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isAddingToFavorites ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    处理中...
                  </>
                ) : isFavorited ? (
                  <>
                    <Heart className="w-4 h-4 fill-current" />
                    已收藏
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    收藏
                  </>
                )}
              </button>
            ) : (
              <div 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-400 cursor-not-allowed"
                title="收藏功能未配置，请配置 Supabase 以启用"
              >
                <Heart className="w-4 h-4" />
                收藏
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 leading-relaxed">{results.optimizedPrompt}</p>
          </div>
          
          {/* 收藏标题输入 */}
          {showTitleInput && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <label className="block text-sm font-medium text-blue-900 mb-2">
                收藏标题
              </label>
              <input
                type="text"
                value={favoriteTitle}
                onChange={(e) => setFavoriteTitle(e.target.value)}
                placeholder="为这个优化结果命名..."
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={100}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToFavorites ? '添加中...' : '确认收藏'}
                </button>
                <button
                  onClick={handleCancelAddFavorite}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  取消
                </button>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={() => copyToClipboard(results.optimizedPrompt, 'main')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copiedIndex === 'main' ? (
              <>
                <Check className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                复制提示词
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis & Scores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          分析报告
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(results.scores.clarity)}`}>
              {results.scores.clarity}/10 {getScoreLabel(results.scores.clarity)}
            </div>
            <p className="text-sm text-gray-600 mt-1">清晰度</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(results.scores.specificity)}`}>
              {results.scores.specificity}/10 {getScoreLabel(results.scores.specificity)}
            </div>
            <p className="text-sm text-gray-600 mt-1">具体性</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(results.scores.effectiveness)}`}>
              {results.scores.effectiveness}/10 {getScoreLabel(results.scores.effectiveness)}
            </div>
            <p className="text-sm text-gray-600 mt-1">有效性</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              改进说明
            </h4>
            <p className="text-blue-800 text-sm">{results.analysis.improvements}</p>
          </div>
          
          {results.analysis.issues && results.analysis.issues.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                原提示词问题
              </h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                {results.analysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">其他建议</h3>
          
          <div className="space-y-3">
            {results.alternatives.map((alternative, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="text-gray-800 text-sm mb-2">{alternative.prompt}</p>
                  <p className="text-gray-600 text-xs">{alternative.reason}</p>
                </div>
                
                <button
                  onClick={() => copyToClipboard(alternative.prompt, `alt-${index}`)}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedIndex === `alt-${index}` ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
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