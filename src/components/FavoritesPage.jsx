import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Trash2, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  X, 
  Calendar,
  Target,
  Sparkles,
  Search,
  Filter,
  ChevronDown,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { favoritesService } from '../services/favorites'

const FavoritesPage = ({ onLoginRequired, onTabChange }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStrategy, setFilterStrategy] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')

  const { user, isAuthenticated } = useAuth()

  // 策略选项
  const strategyOptions = [
    { value: 'all', label: 'All Strategies' },
    { value: 'comprehensive', label: 'Comprehensive' },
    { value: 'clarity', label: 'Clarity' },
    { value: 'specificity', label: 'Specificity' },
    { value: 'creativity', label: 'Creativity' }
  ]

  // 排序选项
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'By Title' },
    { value: 'strategy', label: 'By Strategy' }
  ]

  // 加载收藏列表
  const loadFavorites = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await favoritesService.getFavorites(user.id)
      
      if (result.error) {
        setError(result.error)
        setFavorites([])
      } else {
        setFavorites(result.data || [])
      }
    } catch (err) {
      console.error('加载收藏失败:', err)
      setError(err.message || '加载收藏失败，请重试')
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [isAuthenticated, user])

  // 删除收藏
  const handleDelete = async (favoriteId) => {
    if (!window.confirm('确定要删除这个收藏吗？')) {
      return
    }

    try {
      await favoritesService.deleteFavorite(favoriteId)
      setFavorites(favorites.filter(fav => fav.id !== favoriteId))
    } catch (err) {
      console.error('删除收藏失败:', err)
      alert('删除失败，请重试')
    }
  }

  // 复制到剪贴板
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 开始编辑标题
  const startEdit = (favorite) => {
    setEditingId(favorite.id)
    setEditTitle(favorite.title)
  }

  // 保存编辑
  const saveEdit = async () => {
    if (!editTitle.trim()) {
      alert('标题不能为空')
      return
    }

    try {
      await favoritesService.updateFavoriteTitle(editingId, editTitle.trim())
      setFavorites(favorites.map(fav => 
        fav.id === editingId 
          ? { ...fav, title: editTitle.trim() }
          : fav
      ))
      setEditingId(null)
      setEditTitle('')
    } catch (err) {
      console.error('更新标题失败:', err)
      alert('更新失败，请重试')
    }
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  // 获取策略标签
  const getStrategyLabel = (strategy) => {
    const strategyMap = {
      'comprehensive': 'Comprehensive',
      'clarity': 'Clarity',
      'specificity': 'Specificity',
      'creativity': 'Creativity'
    }
    return strategyMap[strategy] || strategy
  }

  // 获取评分颜色
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  // 过滤和排序收藏
  const filteredAndSortedFavorites = favorites
    .filter(fav => {
      const matchesSearch = fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fav.optimized_prompt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStrategy = filterStrategy === 'all' || fav.strategy === filterStrategy
      return matchesSearch && matchesStrategy
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'strategy':
          return a.strategy.localeCompare(b.strategy)
        case 'created_at':
        default:
          return new Date(b.created_at) - new Date(a.created_at)
      }
    })

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view your favorites</p>
          <button
            onClick={onLoginRequired}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载收藏中...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    const isConfigError = error.includes('Supabase未配置') || error.includes('收藏表不存在')
    
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`text-6xl mb-4 ${isConfigError ? 'text-yellow-500' : 'text-red-600'}`}>
            {isConfigError ? '⚙️' : '⚠️'}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isConfigError ? 'Favorites Feature Not Configured' : 'Loading Failed'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          
          {isConfigError ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-blue-900 mb-2">How to enable favorites feature:</h3>
              {error.includes('收藏表不存在') ? (
                <div className="text-blue-800 text-sm space-y-2">
                  <p className="font-medium">Please follow these steps to create the favorites table:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Login to Supabase console: <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://app.supabase.com</a></li>
                    <li>Select your project</li>
                    <li>Click "SQL Editor" in the left menu</li>
                    <li>Copy and execute the table creation SQL from SUPABASE_SETUP.md</li>
                    <li>Click "Run" to execute the SQL</li>
                    <li>Refresh this page</li>
                  </ol>
                  <div className="mt-3 p-3 bg-blue-100 rounded">
                    <p className="text-xs text-blue-700">
                      💡 Tip: Complete table creation SQL can be found in the SUPABASE_SETUP.md file in the project root
                    </p>
                  </div>
                </div>
              ) : (
                <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                  <li>Configure Supabase project (refer to SUPABASE_SETUP.md)</li>
                  <li>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file</li>
                  <li>Create favorites table in Supabase</li>
                  <li>Restart the application</li>
                </ol>
              )}
            </div>
          ) : (
            <button
              onClick={loadFavorites}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload
            </button>
          )}
          
          {isConfigError && (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">
                You can still use the prompt optimization feature normally even without configuring favorites
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          My Favorites
        </h1>
        <p className="text-gray-600">
          Manage your favorited prompt optimization results, {favorites.length} favorites total
        </p>
      </motion.div>

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search favorites by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 策略筛选 */}
          <div className="relative">
            <select
              value={filterStrategy}
              onChange={(e) => setFilterStrategy(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {strategyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* 排序 */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* 收藏列表 */}
      {filteredAndSortedFavorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {searchTerm || filterStrategy !== 'all' ? 'No matching favorites found' : 'No favorites yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStrategy !== 'all' 
              ? 'Try adjusting your search terms or filters' 
              : 'Start optimizing prompts and save your favorite results!'
            }
          </p>
          {(!searchTerm && filterStrategy === 'all') && (
            <button
              onClick={() => onTabChange?.('home')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Optimizing Prompts
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAndSortedFavorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 收藏标题和操作 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingId === favorite.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={100}
                          />
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {favorite.title}
                          </h3>
                          <button
                            onClick={() => startEdit(favorite)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(favorite.created_at).toLocaleDateString('en-US')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {getStrategyLabel(favorite.strategy)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(favorite.optimized_prompt, favorite.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {copiedId === favorite.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(favorite.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 优化内容 */}
                <div className="px-6 py-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 原始提示词 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Original Prompt</h4>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                        {favorite.original_prompt || 'No original prompt'}
                      </div>
                    </div>

                    {/* 优化后提示词 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-green-600" />
                        Optimized Prompt
                      </h4>
                      <div className="bg-green-50 rounded-lg p-3 text-sm text-gray-800">
                        {favorite.optimized_prompt}
                      </div>
                    </div>
                  </div>

                  {/* 评分 */}
                  {favorite.scores && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Scores</h4>
                      <div className="flex gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(favorite.scores.clarity)}`}>
                          Clarity {favorite.scores.clarity}/10
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(favorite.scores.specificity)}`}>
                          Specificity {favorite.scores.specificity}/10
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(favorite.scores.effectiveness)}`}>
                          Effectiveness {favorite.scores.effectiveness}/10
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage 