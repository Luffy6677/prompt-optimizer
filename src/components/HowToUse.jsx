import React from 'react'
import { motion } from 'framer-motion'
import { Edit3, Sparkles, Copy, CheckCircle } from 'lucide-react'

const HowToUse = () => {
  const steps = [
    {
      id: 1,
      icon: <Edit3 className="w-8 h-8" />,
      title: "Enter Your Prompt",
      description: "Input your original prompt in the left text box. It can be any type of AI conversation prompt that you want to optimize"
    },
    {
      id: 2,
      icon: <Sparkles className="w-8 h-8" />,
      title: "Start Optimization",
      description: "Click the \"Start Optimization\" button, and our AI will analyze and improve your prompt to make it more precise and effective"
    },
    {
      id: 3,
      icon: <Copy className="w-8 h-8" />,
      title: "Get Results",
      description: "View the optimized prompt on the right side, including detailed improvement suggestions and optimization explanations"
    },
    {
      id: 4,
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Apply & Use",
      description: "Copy the optimized prompt and use it in your AI applications to enjoy better conversation results"
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
            How to Use
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to make your AI prompt more professional and efficient
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
            <span className="text-gray-700 font-medium">Professional Prompt Optimization, Let AI Understand Your Needs</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowToUse 