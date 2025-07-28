import React, { createContext, useContext } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'

const AuthContext = createContext({})

export const useAuth = () => {
  const auth0 = useAuth0()
  
  return {
    user: auth0.user,
    loading: auth0.isLoading,
    isAuthenticated: auth0.isAuthenticated,
    signIn: () => auth0.loginWithRedirect(),
    signUp: () => auth0.loginWithRedirect({ screen_hint: 'signup' }),
    signOut: () => auth0.logout({ logoutParams: { returnTo: window.location.origin } })
  }
}

export const AuthProvider = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = window.location.origin

  if (!domain || !clientId) {
    console.error('Auth0 configuration is missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Configuration Error</h2>
          <p className="text-gray-600">Please configure Auth0 environment variables.</p>
        </div>
      </div>
    )
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri
      }}
    >
      <AuthContext.Provider value={{}}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  )
} 