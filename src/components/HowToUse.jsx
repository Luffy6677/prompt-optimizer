import React from 'react'
import { motion } from 'framer-motion'
import { Edit3, Sparkles, Copy, CheckCircle } from 'lucide-react'

const HowToUse = () => {
  const steps = [
    {
      id: 1,
      icon: <Edit3 className="w-8 h-8" />,
      title: "输入提示词",
      description: "在左侧输入框中输入您想要优化的原始提示词，可以是任何类型的AI对话提示"
    },
    {
      id: 2,
      icon: <Sparkles className="w-8 h-8" />,
      title: "开始优化",
      description: "点击\"开始优化\"按钮，我们的AI将分析并改进您的提示词，使其更加精准有效"
    },
    {
      id: 3,
      icon: <Copy className="w-8 h-8" />,
      title: "获取结果",
      description: "在右侧查看优化后的提示词，包含详细的改进建议和优化说明"
    },
    {
      id: 4,
      icon: <CheckCircle className="w-8 h-8" />,
      title: "应用使用",
      description: "复制优化后的提示词，在您的AI应用中使用，享受更好的对话效果"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            如何使用
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            四个简单步骤，让您的AI提示词更加专业和高效
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto group-hover:shadow-xl transition-shadow duration-300">
                  <div className="text-blue-600">
                    {step.icon}
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium">专业提示词优化，让AI更懂你的需求</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowToUse 