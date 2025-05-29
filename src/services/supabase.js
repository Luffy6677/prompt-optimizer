import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Authentication features will be disabled.')
}

// Supabase client configuration with auth settings
export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Configure authentication settings
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }) : null

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Configure email redirect URL for verification
        emailRedirectTo: `${window.location.origin}/`
      }
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
    if (!supabase) return null
    return supabase.auth.getUser()
  },

  // Get current session
  getSession: () => {
    if (!supabase) return null
    return supabase.auth.getSession()
  },

  // Resend email verification
  resendEmailVerification: async (email) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    })
    
    if (error) throw error
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    if (!supabase) return () => {}
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return () => subscription.unsubscribe()
  }
} 