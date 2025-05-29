import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Clock } from 'lucide-react'

const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    'Analyzing language structure...',
    'Identifying optimization points...',
    'Generating improvement suggestions...'
  ]

  useEffect(() => {
    // 模拟步骤进度
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return 0 // 循环回到第一步
      })
    }, 2000) // 每2秒切换一步

    // 模拟进度条
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + Math.random() * 10 // 随机增加进度
        }
        return 95 // 最多到95%，避免到100%
      })
    }, 500)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [steps.length])

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
        
        <div className="space-y-2 mb-4">
          {steps.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: currentStep === index ? 1 : 0.3,
                scale: currentStep === index ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
              className={`text-sm ${
                currentStep === index 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {currentStep === index && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                )}
                <span>{text}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            animate={{ width: `${Math.min(progress, 95)}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 10-15 seconds</span>
        </div>
        
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-4 text-xs text-gray-400"
        >
          Please wait while AI processes your request...
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingAnimation 