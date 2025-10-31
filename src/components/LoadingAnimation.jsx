import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

const LoadingAnimation = () => {
  return (
    <div className="linear-card p-linear-4xl">
      <div className="text-center">
        <div className="relative mb-linear-4xl">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 bg-linear-gradient-button rounded-linear flex items-center justify-center mx-auto shadow-linear-glow"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-linear-blue-400/30 rounded-full"
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        </div>
        
        <h3 className="text-linear-2xl font-semibold linear-text-primary mb-linear-lg">
          AI 正在分析您的提示词
        </h3>
        
        <div className="space-y-linear-lg mb-linear-4xl">
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
              className="linear-text-secondary text-linear-base"
            >
              {text}
            </motion.p>
          ))}
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-linear-lg mb-linear-3xl">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.8, 1],
                backgroundColor: ['rgba(255,255,255,0.2)', '#3b82f6', 'rgba(255,255,255,0.2)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="w-3 h-3 rounded-full bg-white/20"
            />
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-linear-lg text-linear-base linear-text-muted">
          <Sparkles className="w-5 h-5 animate-linear-pulse" />
          <span>预计需要 10-15 秒</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation 