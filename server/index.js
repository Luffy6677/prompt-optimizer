import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

dotenv.config()

  return '相关主题'
}

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google/callback`
)

// Auth Routes
app.get('/api/auth/google', (req, res) => {
  const authUrl = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent'
  })
  
  res.redirect(authUrl)
})

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query
  
  if (!code) {
    return res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}?error=no_code`)
  }
  
  try {
    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code)
    googleClient.setCredentials(tokens)
    
    // Get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    
    const payload = ticket.getPayload()
    
    // Create user session/JWT
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      provider: 'google'
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign(
      user,
      process.env.JWT_SECRET || 'your-jwt-secret-here',
      { expiresIn: '7d' }
    )
    
    // Redirect to frontend with token
    res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}/auth/callback?token=${jwtToken}`)
    
  } catch (error) {
    console.error('Google OAuth error:', error)
    res.redirect(`${process.env.VITE_APP_URL || 'http://localhost:5173'}?error=auth_failed`)
  }
})

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-here')
    res.json({ user: decoded })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Prompt Optimizer API is running' })