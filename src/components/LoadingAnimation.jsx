import React from 'react'
import { Brain, Clock } from 'lucide-react'

// 全新的安全 LoadingAnimation 组件 - 不使用任何状态管理
const LoadingAnimation = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-white animate-pulse" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          AI is analyzing your prompt
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="text-sm text-blue-600 font-medium">
            ✨ Analyzing language structure...
          </div>
          <div className="text-sm text-gray-500">
            🔍 Identifying optimization points...
          </div>
          <div className="text-sm text-gray-500">
            💡 Generating improvement suggestions...
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-2/3 animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 10-15 seconds</span>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          Please wait while AI processes your request...
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation 