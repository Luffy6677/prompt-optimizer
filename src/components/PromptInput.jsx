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
    "Write an article about artificial intelligence",
    "Create a marketing plan for my product",
    "Explain the basic principles of quantum computing",
    "Design a user-friendly mobile application interface"
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Original Prompt</h3>
            <span className="text-sm text-gray-500">({value.length} characters)</span>
          </div>
        </div>
        
        <div className="p-4 relative">
          <textarea
            value={value}
            onChange={(e) => isAuthenticated ? onChange(e.target.value) : null}
            onKeyDown={handleKeyDown}
            onClick={handleTextareaClick}
            placeholder={isAuthenticated ? "Enter the prompt you want to optimize..." : "Please log in first to start using"}
            className={`w-full h-40 p-4 border border-gray-300 rounded-lg resize-none transition-all duration-200 ${
              isAuthenticated 
                ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                : 'cursor-pointer bg-gray-50'
            }`}
            disabled={isLoading || !isAuthenticated}
            readOnly={!isAuthenticated}
          />
          
          {!isAuthenticated && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-lg backdrop-blur-sm">
              <div className="text-center">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Please log in first</p>
                <p className="text-sm text-gray-500">Log in to start optimizing your prompts</p>
              </div>
            </div>
          )}
          
          <div className="mt-3 text-sm text-gray-500">
            <p>💡 Tip: {isAuthenticated ? 'Press Ctrl/Cmd + Enter to quickly start optimization' : 'Log in to unlock all features'}</p>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 rounded-lg p-4"
      >
        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Example Prompts
        </h4>
        <div className="grid gap-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(prompt)}
              className={`text-left text-sm transition-colors p-2 rounded ${
                isAuthenticated
                  ? 'text-blue-700 hover:text-blue-900 hover:bg-blue-100'
                  : 'text-gray-500 cursor-pointer hover:bg-gray-100'
              }`}
              disabled={isLoading}
            >
              {isAuthenticated ? `"${prompt}"` : `🔒 "${prompt}"`}
            </button>
          ))}
        </div>
        
        {!isAuthenticated && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              <Lock className="w-4 h-4 inline mr-1" />
              Login and use example prompts
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default PromptInput 