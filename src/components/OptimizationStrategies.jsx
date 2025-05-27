import React from 'react'
import { motion } from 'framer-motion'

const OptimizationStrategies = ({ strategies, selectedStrategy, onStrategyChange, compact = false }) => {
  if (compact) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">优化策略</h4>
        <div className="grid grid-cols-2 gap-2">
          {strategies.map((strategy, index) => (
            <motion.button
              key={strategy.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onStrategyChange(strategy.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                selectedStrategy === strategy.id
                  ? 'border-blue-400 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`${
                  selectedStrategy === strategy.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}>
                  {strategy.icon}
                </div>
                <span className="text-sm font-medium">{strategy.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">选择优化策略</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map((strategy, index) => (
          <motion.button
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onStrategyChange(strategy.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedStrategy === strategy.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                selectedStrategy === strategy.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {strategy.icon}
              </div>
              <h4 className={`font-medium ${
                selectedStrategy === strategy.id
                  ? 'text-blue-900'
                  : 'text-gray-900'
              }`}>
                {strategy.name}
              </h4>
            </div>
            <p className={`text-sm ${
              selectedStrategy === strategy.id
                ? 'text-blue-700'
                : 'text-gray-600'
            }`}>
              {strategy.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default OptimizationStrategies 