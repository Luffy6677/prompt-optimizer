import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export const optimizePrompt = async (prompt, strategy = 'comprehensive') => {
  try {
    const response = await api.post('/optimize', {
      prompt,
      strategy,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getOptimizationHistory = async () => {
  try {
    const response = await api.get('/history')
    return response
  } catch (error) {
    throw error
  }
}

export default api 