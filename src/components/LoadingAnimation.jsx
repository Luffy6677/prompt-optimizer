import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Clock } from 'lucide-react'

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
        
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          AI is analyzing your prompt
        </motion.h3>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          {['Analyzing language structure...', 'Identifying optimization points...', 'Generating improvement suggestions...'].map((text, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: currentStep === index ? 1 : 0.3,
                scale: currentStep === index ? 1.05 : 1
              }}
              className="text-sm text-gray-600"
            >
              {text}
            </motion.span>
          ))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 10-15 seconds</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation 