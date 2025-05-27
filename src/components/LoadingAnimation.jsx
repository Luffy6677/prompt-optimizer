import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

const LoadingAnimation = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI正在分析您的提示词
        </h3>
        
        <div className="space-y-2 mb-6">
          {['分析语言结构...', '识别优化点...', '生成改进建议...'].map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.5,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1.5
              }}
              className="text-gray-600 text-sm"
            >
              {text}
            </motion.p>
          ))}
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                backgroundColor: ['#e5e7eb', '#3b82f6', '#e5e7eb']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="w-3 h-3 rounded-full bg-gray-300"
            />
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>预计需要 10-15 秒</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation 