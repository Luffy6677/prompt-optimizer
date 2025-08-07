  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for JWT token first
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Invalid token')
          }
        })
        .then(({ user }) => {
          setUser(user)
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem('auth_token')
          setUser(null)
          setLoading(false)
        })
    } else {
      // Get initial session from Supabase
      auth.getCurrentUser()
        .then(({ data: { user } }) => {
          setUser(user)
          setLoading(false)
        })
        .catch((error) => {
          console.warn('Auth initialization failed:', error)
          setUser(null)
          setLoading(false)
        })
    }

    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChange((event, session) => {
    try {
      setLoading(true)
      await auth.signOut()
      // Also clear any JWT token
      localStorage.removeItem('auth_token')
    } catch (error) {
      throw error
    } finally {
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      // If using Supabase OAuth
      if (auth.signInWithGoogle) {
        const result = await auth.signInWithGoogle()
        return result
      } else {
        // Fallback to direct server OAuth
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleAuthCallback = async (token) => {
    try {
      setLoading(true)
      if (token) {
        // Store JWT token
        localStorage.setItem('auth_token', token)
        // Verify and get user info
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const { user } = await response.json()
          setUser(user)
        }
      } else if (auth.handleOAuthCallback) {
        // Handle Supabase OAuth callback
        await auth.handleOAuthCallback()
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    handleAuthCallback,
    isAuthenticated: !!user
  }
