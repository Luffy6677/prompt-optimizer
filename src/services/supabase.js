import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查 Supabase 配置是否有效
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) &&
  !supabaseUrl.includes('your_supabase_project_url_here') &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here')

if (!isSupabaseConfigured) {
  console.warn('Supabase not properly configured. Authentication features will be disabled.')
  console.warn('To enable authentication, please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = isSupabaseConfigured ? 
  createClient(supabaseUrl, supabaseAnonKey) : null

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Sign in with email and password  
  signIn: async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  getCurrentUser: () => {
    if (!supabase) {
      return Promise.resolve({ data: { user: null }, error: null })
    }
    return supabase.auth.getUser()
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    if (!supabase) {
      // 返回一个空的取消订阅函数
      return () => {}
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return () => subscription.unsubscribe()
  }
} 