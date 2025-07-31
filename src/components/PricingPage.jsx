  Target
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useStripe } from '../contexts/StripeContext'
import { PRICE_IDS, createCheckoutSession, getStripe } from '../services/stripe'
import PaymentModal from './PaymentModal'
import { useNavigate } from 'react-router-dom'

const PricingPage = ({ onAuthRequired }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const { isAuthenticated, user } = useAuth()
  const { isSubscribed, subscription } = useStripe()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const plans = [
    {
    }
  ]

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      onAuthRequired?.()
      return
    }
    
    // If already subscribed, redirect to customer portal
    if (isSubscribed()) {
      navigate('/subscription')
      return
    }
    
    setLoading(true)
    try {
      const plan = plans.find(p => p.id === planId)
      const priceId = PRICE_IDS[planId]?.[billingPeriod]
      
      if (!priceId) {
        console.error('Price ID not found for plan:', planId, billingPeriod)
        alert('价格配置错误，请联系客服')
        return
      }
      
      // Use Stripe Checkout instead of modal
      const { sessionId } = await createCheckoutSession(priceId, user.id)
      const stripe = await getStripe()
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('支付初始化失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const getPrice = (plan) => {
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        '处理中...'
                      ) : isSubscribed() ? (
                        '管理订阅'
                      ) : isAuthenticated ? (
                        '立即订阅'
                      ) : (
                        '登录后订阅'
                      )}
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
