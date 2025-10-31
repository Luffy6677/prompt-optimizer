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
    <section className="py-linear-5xl glass-effect border-y border-white/10">
      <div className="max-w-6xl mx-auto px-linear-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-linear-5xl"
        >
          <h2 className="text-linear-3xl font-bold linear-text-primary mb-linear-2xl">
            如何使用
          </h2>
          <p className="text-linear-xl linear-text-secondary max-w-3xl mx-auto">
            四个简单步骤，让您的 AI 提示词更加专业和高效
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-notion-2xl">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-notion-xl">
                <div className="w-12 h-12 bg-white rounded-notion shadow-notion flex items-center justify-center mx-auto group-hover:shadow-notion-md transition-shadow duration-300">
                  <div className="text-notion-blue-500">
                    {React.cloneElement(step.icon, { className: "w-6 h-6" })}
                  </div>
                </div>
              </div>
              
              <h3 className="text-notion-lg font-semibold notion-text-primary mb-notion-sm">
                {step.title}
              </h3>
              <p className="notion-text-secondary leading-relaxed text-notion-sm">
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
          className="text-center mt-notion-3xl"
        >
          <div className="inline-flex items-center gap-notion-sm bg-white px-notion-xl py-notion-sm rounded-notion shadow-notion">
            <Sparkles className="w-4 h-4 text-notion-blue-500" />
            <span className="notion-text-secondary font-medium text-notion-sm">专业提示词优化，让 AI 更懂你的需求</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowToUse 