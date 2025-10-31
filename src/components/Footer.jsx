import React from 'react'
import { Heart, Mail, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-effect-strong border-t border-white/10 mt-linear-5xl backdrop-blur-linear-lg">
      <div className="max-w-6xl mx-auto px-linear-3xl py-linear-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-linear-2xl">
          <div className="flex items-center gap-linear-lg linear-text-secondary text-linear-base">
            <span>Made with</span>
            <Heart className="w-5 h-5 text-linear-red-400 animate-linear-pulse" />
            <span>by AI Prompt Optimizer Team</span>
          </div>
          
          <div className="flex items-center gap-linear-3xl">
            <a
              href="https://discord.gg/promptoptimizer"
              className="flex items-center gap-linear-lg linear-text-secondary hover:linear-text-primary transition-all duration-300 text-linear-base hover-lift"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Discord</span>
            </a>
            <a
              href="mailto:contact@promptoptimizer.com"
              className="flex items-center gap-linear-lg linear-text-secondary hover:linear-text-primary transition-all duration-300 text-linear-base hover-lift"
            >
              <Mail className="w-5 h-5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
        
        <div className="mt-linear-3xl pt-linear-3xl linear-divider text-center text-linear-base linear-text-muted">
          <p>&copy; 2024 AI Prompt Optimizer. All rights reserved.</p>
          <p className="mt-linear-sm">
            Powered by advanced AI technology to enhance your prompting experience.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 