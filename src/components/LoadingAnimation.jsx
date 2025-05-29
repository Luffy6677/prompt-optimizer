// Fixed currentStep undefined error - Updated 2024-12-24 v2
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Clock } from 'lucide-react'

console.log('LoadingAnimation component loaded successfully')

const LoadingAnimation = () => {
  console.log('LoadingAnimation component rendering')
  
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  console.log('Current step:', currentStep, 'Progress:', progress)

  const steps = [
    'Analyzing language structure...',
    'Identifying optimization points...',
    'Generating improvement suggestions...'
  ]

  useEffect(() => {
    console.log('LoadingAnimation useEffect running')
    
    // 确保组件已挂载
    setIsLoaded(true)
    
    try {
      // 步骤循环
      let stepInterval = setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = (prevStep + 1) % steps.length
          console.log('Step changed from', prevStep, 'to', nextStep)
          return nextStep
        })
      }, 2000)

      // 进度更新
      let progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) return 95
          return Math.min(prevProgress + Math.random() * 8 + 2, 95)
        })
      }, 800)
    } catch (error) {
      console.error('LoadingAnimation setup error:', error)
    }

    // 清理函数
    return () => {
      console.log('LoadingAnimation cleanup')
      setIsLoaded(false)
      if (stepInterval) clearInterval(stepInterval)
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [])

  // 如果组件未完全加载，显示基础版本
  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            AI is analyzing your prompt
          </h3>
          <div className="text-sm text-gray-500">
            Loading optimization engine...
          </div>
        </div>
      </div>
    )
  }

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
          {steps && steps.length > 0 && steps.map((text, index) => {
            // 安全的条件渲染
            const isCurrentStep = currentStep === index
            
            return (
              <motion.div
                key={`step-${index}-${text.slice(0, 10)}`}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: isCurrentStep ? 1 : 0.3,
                  scale: isCurrentStep ? 1.02 : 1
                }}
                transition={{ duration: 0.3 }}
                className={`text-sm ${
                  isCurrentStep 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isCurrentStep && (
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
            )
          })}
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