  const [error, setError] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [authLoading, setAuthLoading] = useState(false)

  const { isAuthenticated, handleAuthCallback } = useAuth()

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const authError = urlParams.get('error')
      
      if (token || authError) {
        setAuthLoading(true)
        
        if (authError) {
          setError('登录失败，请重试')
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
          setAuthLoading(false)
          return
        }

        try {
          await handleAuthCallback(token)
          // Clean URL after successful auth
          window.history.replaceState({}, document.title, window.location.pathname)
        } catch (err) {
          setError('登录处理失败，请重试')
        } finally {
          setAuthLoading(false)
        }
      }
    }

    handleOAuthCallback()
  }, [])

  const strategies = [
    {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* OAuth Loading Overlay */}
      {authLoading && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <LoadingAnimation />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">正在完成登录...</h2>
            <p className="mt-2 text-gray-500">请稍候，我们正在验证您的身份</p>
          </div>
        </div>
      )}

      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main>