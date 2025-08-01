    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await auth.signInWithGoogle()
      return result
    } catch (error) {
      throw error
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
    isAuthenticated: !!user
  }
