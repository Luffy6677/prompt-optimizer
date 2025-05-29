import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, Clock, Zap, Target, Lightbulb } from 'lucide-react'

// 全新的安全 LoadingAnimation 组件 - 不使用任何状态管理
const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: 'Analyzing language structure...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: 'Identifying optimization points...',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: 'Generating improvement suggestions...',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  useEffect(() => {
    // 步骤循环动画
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2500)

    // 进度条动画
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90
        return prev + Math.random() * 8 + 2
      })
    }, 600)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        {/* 主要加载图标 */}
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" }
          }}
          className="relative w-20 h-20 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          {/* 旋转的光环 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
            }}
          />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-900 mb-6"
        >
          AI is analyzing your prompt
        </motion.h3>
        
        {/* 步骤指示器 */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: currentStep === index ? 1.02 : 1
              }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex items-center justify-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                currentStep === index 
                  ? `${step.bgColor} shadow-sm scale-102` 
                  : 'bg-gray-50'
              }`}
            >
              <motion.div
                animate={currentStep === index ? {
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 1, repeat: currentStep === index ? Infinity : 0 }}
                className={`p-2 rounded-full ${
                  currentStep === index ? step.bgColor : 'bg-gray-200'
                }`}
              >
                <div className={currentStep === index ? step.color : 'text-gray-500'}>
                  {step.icon}
                </div>
              </motion.div>
              
              <span className={`text-sm font-medium ${
                currentStep === index ? step.color : 'text-gray-600'
              }`}>
                {step.text}
              </span>
              
              {/* 活跃指示器 */}
              <AnimatePresence>
                {currentStep === index && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex gap-1"
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: dot * 0.2
                        }}
                        className={`w-1.5 h-1.5 rounded-full ${step.bgColor.replace('bg-', 'bg-').replace('100', '400')}`}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full relative"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* 进度条光效 */}
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ width: '30%' }}
            />
          </motion.div>
        </div>
        
        {/* 底部信息 */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 10-15 seconds</span>
        </div>
        
        {/* 动态提示文字 */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs text-gray-400"
        >
          <motion.span
            animate={{ 
              background: [
                'linear-gradient(45deg, #3B82F6, #8B5CF6)',
                'linear-gradient(45deg, #8B5CF6, #6366F1)',
                'linear-gradient(45deg, #6366F1, #3B82F6)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-medium"
          >
            Powered by advanced AI technology
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingAnimation 