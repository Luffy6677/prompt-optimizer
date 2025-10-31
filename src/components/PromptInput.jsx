import React from 'react'
import { motion } from 'framer-motion'
import { Type, FileText, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const PromptInput = ({ value, onChange, onOptimize, isLoading, onLoginRequired }) => {
  const { isAuthenticated } = useAuth()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (isAuthenticated) {
        onOptimize()
      } else {
        onLoginRequired?.()
      }
    }
  }

  const handleTextareaClick = () => {
    if (!isAuthenticated) {
      onLoginRequired?.()
    }
  }

  const handleExampleClick = (prompt) => {
    if (!isAuthenticated) {
      onLoginRequired?.()
    } else {
      onChange(prompt)
    }
  }

  const examplePrompts = [
    "写一篇关于人工智能的文章",
    "为我的产品创建一个营销方案",
    "解释量子计算的基本原理",
    "设计一个用户友好的移动应用界面"
  ]

  return (
    <div className="space-y-linear-4xl">
      <div className="linear-card overflow-hidden">
        <div className="bg-surface-secondary/50 px-linear-4xl py-linear-xl border-b border-border-primary backdrop-blur-linear">
          <div className="flex items-center gap-linear-xl">
            <Type className="w-5 h-5 text-text-muted" />
            <h3 className="font-semibold text-text-primary text-linear-lg">原始提示词</h3>
            <span className="linear-badge-primary text-linear-sm">({value.length} 字符)</span>
          </div>
        </div>
        
        <div className="p-linear-4xl relative">
          <textarea
            value={value}
            onChange={(e) => isAuthenticated ? onChange(e.target.value) : null}
            onKeyDown={handleKeyDown}
            onClick={handleTextareaClick}
            placeholder={isAuthenticated ? "请输入您要优化的提示词..." : "请先登录后开始使用"}
            className={`linear-textarea h-48 ${
              isAuthenticated 
                ? 'linear-focus' 
                : 'cursor-pointer bg-surface-secondary/30'
            }`}
            disabled={isLoading || !isAuthenticated}
            readOnly={!isAuthenticated}
          />
          
          {!isAuthenticated && (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-gradient-glass rounded-linear backdrop-blur-linear-lg">
              <div className="text-center">
                <div className="relative mb-linear-xl">
                  <Lock className="w-10 h-10 text-text-muted mx-auto animate-linear-pulse" />
                  <div className="absolute inset-0 w-10 h-10 bg-linear-blue-500/20 rounded-full blur-lg animate-linear-glow mx-auto"></div>
                </div>
                <p className="text-text-secondary font-semibold text-linear-lg mb-linear-lg">请先登录使用</p>
                <p className="text-linear-base text-text-muted">登录后即可开始优化您的提示词</p>
              </div>
            </div>
          )}
          
          <div className="mt-linear-xl text-linear-base text-text-muted">
            <p className="flex items-center gap-linear-lg">
              <span className="text-linear-blue-400">💡</span>
              提示：{isAuthenticated ? '按 Ctrl/Cmd + Enter 快速开始优化' : '登录后解锁所有功能'}
            </p>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="linear-card-glass p-linear-4xl"
      >
        <h4 className="font-semibold text-linear-blue-400 mb-linear-4xl flex items-center gap-linear-xl text-linear-lg">
          <FileText className="w-6 h-6" />
          示例提示词
        </h4>
        <div className="grid gap-linear-lg">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(prompt)}
              className={`text-left text-linear-base transition-all duration-200 p-linear-xl rounded-linear border border-transparent ${
                isAuthenticated
                  ? 'text-linear-blue-400 hover:text-linear-blue-300 hover:bg-linear-blue-500/10 hover:border-linear-blue-500/30 hover:shadow-linear-glow hover:translate-y-[-1px]'
                  : 'text-text-muted cursor-pointer hover:bg-surface-secondary hover:border-border-primary'
              }`}
              disabled={isLoading}
            >
              {isAuthenticated ? `"${prompt}"` : `🔒 "${prompt}"`}
            </button>
          ))}
        </div>
        
        {!isAuthenticated && (
          <div className="mt-linear-4xl text-center">
            <p className="text-linear-base text-text-muted flex items-center justify-center gap-linear-lg">
              <Lock className="w-5 h-5" />
              登录后可使用示例提示词
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default PromptInput 