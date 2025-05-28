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
          console.error('Failed to check favorite status:', error)
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
    return 'Untitled Prompt Optimization'
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.()
      return
    }

    if (!favoritesAvailable) {
      showToast('Favorites feature not configured. Please configure Supabase to enable favorites.', 'warning')
      return
    }

    if (isFavorited) {
      // 取消收藏
      try {
        setIsAddingToFavorites(true)
        await favoritesService.removeFavoriteByContent(user.id, results.optimizedPrompt)
        setIsFavorited(false)
        showToast('Removed from favorites')
      } catch (error) {
        console.error('Failed to remove favorite:', error)
        showToast(error.message || 'Failed to remove from favorites, please try again', 'error')
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
      showToast('Favorites feature not configured. Please configure Supabase to enable favorites.', 'warning')
      return
    }

    if (!favoriteTitle.trim()) {
      showToast('Please enter a favorite title', 'warning')
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
      showToast('Successfully added to favorites!')
    } catch (error) {
      console.error('Failed to add favorite:', error)
      
      // 提供更详细的错误信息
      if (error.message.includes('Supabase not configured')) {
        showToast('Favorites feature not configured. Please configure Supabase to enable favorites.', 'warning')
      } else if (error.message.includes('Favorites table does not exist')) {
        showToast('Favorites table does not exist. Please check console for detailed setup instructions', 'warning')
        
        // 输出详细信息到控制台
        console.group('📋 Favorites Table Setup Instructions')
        console.log('Please follow these steps to create the favorites table:')
        console.log('1. Login to your Supabase console: https://app.supabase.com')
        console.log('2. Select your project')
        console.log('3. Click "SQL Editor" in the left menu')
        console.log('4. Execute the table creation SQL from SUPABASE_SETUP.md in the project root')
        console.log('5. Click "Run" to execute the SQL')
        console.log('6. Refresh the page and try the favorites feature again')
        console.groupEnd()
      } else {
        showToast(error.message || 'Failed to add to favorites, please try again', 'error')
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
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    return 'Needs Improvement'
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
              <h3 className="font-medium text-gray-900">Optimized Prompt</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Optimized
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
                    Processing...
                  </>
                ) : isFavorited ? (
                  <>
                    <Heart className="w-4 h-4 fill-current" />
                    Favorited
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Favorite
                  </>
                )}
              </button>
            ) : (
              <div 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-400 cursor-not-allowed"
                title="Favorites feature not configured. Please configure Supabase to enable favorites."
              >
                <Heart className="w-4 h-4" />
                Favorite
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
                Favorite Title
              </label>
              <input
                type="text"
                value={favoriteTitle}
                onChange={(e) => setFavoriteTitle(e.target.value)}
                placeholder="Name this optimization result..."
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={100}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToFavorites ? 'Adding...' : 'Confirm Favorite'}
                </button>
                <button
                  onClick={handleCancelAddFavorite}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
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
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis & Scores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analysis Report
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(results.scores.clarity)}`}>
              {results.scores.clarity}/10 {getScoreLabel(results.scores.clarity)}
            </div>
            <p className="text-sm text-gray-600 mt-1">Clarity</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(results.scores.specificity)}`}>
              {results.scores.specificity}/10 {getScoreLabel(results.scores.specificity)}
            </div>
            <p className="text-sm text-gray-600 mt-1">Specificity</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(results.scores.effectiveness)}`}>
              {results.scores.effectiveness}/10 {getScoreLabel(results.scores.effectiveness)}
            </div>
            <p className="text-sm text-gray-600 mt-1">Effectiveness</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Improvement Notes
            </h4>
            <p className="text-blue-800 text-sm">{results.analysis.improvements}</p>
          </div>
          
          {results.analysis.issues && results.analysis.issues.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Original Prompt Issues
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Suggestions</h3>
          
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