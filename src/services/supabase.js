    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return () => subscription.unsubscribe()
  },

  // OAuth sign in
  signInWithOAuth: async (provider, options = {}) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...options
      }
    })
    
    if (error) throw error
    return data
  },

  // Get OAuth sessions for current user
  getOAuthSessions: async () => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('oauth_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Unlink OAuth provider
  unlinkOAuthProvider: async (provider) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { error } = await supabase
      .from('oauth_sessions')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider)
    
    if (error) throw error
    return true
  },

  // Check if provider is linked
  isProviderLinked: async (provider) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    const { data, error } = await supabase
      .from('oauth_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
} 