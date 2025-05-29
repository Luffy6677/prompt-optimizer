import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Target, Lightbulb, Clock } from 'lucide-react'

// 全新的安全 LoadingAnimation 组件 - 不使用任何状态管理
const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      text: 'Analyzing language structure...',
      color: 'text-blue-600'
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: 'Identifying optimization points...',
      color: 'text-purple-600'
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      text: 'Generating improvement suggestions...',
      color: 'text-indigo-600'
    }
  ]

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(stepInterval)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        {/* 主要加载图标 */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* 围绕的小点动画 */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, delay: index * 0.3 }
              }}
              className="absolute inset-0"
            >
              <div 
                className="w-2 h-2 bg-blue-400 rounded-full absolute"
                style={{
                  top: '10%',
                  left: '50%',
                  transformOrigin: '0 200%',
                  transform: `rotate(${index * 120}deg)`
                }}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-900 mb-6"
        >
          AI is analyzing your prompt
        </motion.h3>
        
        {/* 当前步骤显示 */}
        <div className="mb-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className={`p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 ${steps[currentStep].color}`}
            >
              {steps[currentStep].icon}
            </motion.div>
            <span className={`text-sm font-medium ${steps[currentStep].color}`}>
              {steps[currentStep].text}
            </span>
          </motion.div>
        </div>

        {/* 步骤指示器点 */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: currentStep === index ? 1.2 : 1,
                opacity: currentStep === index ? 1 : 0.4
              }}
              transition={{ duration: 0.3 }}
              className={`w-2 h-2 rounded-full ${
                currentStep === index 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* 底部信息 */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 10-15 seconds</span>
        </div>
        
        {/* 动态提示文字 */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs text-gray-400"
        >
          Please wait while AI processes your request...
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingAnimation 