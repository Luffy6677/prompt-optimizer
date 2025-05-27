import React from 'react'
import { Heart, Mail, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by AI Prompt Optimizer Team</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://discord.gg/promptoptimizer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discord</span>
            </a>
            <a
              href="mailto:contact@promptoptimizer.com"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; 2024 AI Prompt Optimizer. All rights reserved.</p>
          <p className="mt-1">
            Powered by advanced AI technology to enhance your prompting experience.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 