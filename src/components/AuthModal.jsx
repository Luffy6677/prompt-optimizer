import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp } = useAuth()

  const handleClose = () => {
    onClose()
  }

  const handleLogin = () => {
    signIn()
    handleClose()
  }

  const handleSignUp = () => {
    signUp()
    handleClose()
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  if (!isOpen) return null
            </p>
          </div>

          {/* 按钮区域 */}
          <div className="px-8 py-6 space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                使用Auth0安全登录，支持多种登录方式
              </p>
            </div>

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn size={20} />
              <span>登录</span>
            </button>

            {/* 注册按钮 */}
            <button
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus size={20} />
              <span>注册</span>
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-500 text-xs">
                点击登录或注册将跳转到Auth0安全登录页面
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>