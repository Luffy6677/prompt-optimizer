    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return () => subscription.unsubscribe()
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) throw error
    return data
  },

  // Handle OAuth callback
  handleOAuthCallback: async () => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)
    
    if (error) throw error
    return data
  }
} 