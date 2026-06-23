import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Rehydrate from localStorage on page load
    const stored = localStorage.getItem("awi_admin_user")
    return stored ? JSON.parse(stored) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("awi_admin_user")
  })
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)
  const [isLoadingPublicSettings] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [authChecked, setAuthChecked] = useState(true)
  const [appPublicSettings] = useState(null)

  const login = useCallback((userData) => {
    localStorage.setItem("awi_admin_user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    setAuthError(null)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("awi_admin_user")
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const navigateToLogin = () => {
    window.location.href = '/admin/login'
  }

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true)
    try {
      // TODO: replace with real API call
      // const res = await fetch("/api/auth/me", { credentials: "include" })
      // if (!res.ok) throw new Error("Not authenticated")
      // const data = await res.json()
      // login(data.user)

      // For now rehydrate from localStorage
      const stored = localStorage.getItem("awi_admin_user")
      if (stored) {
        setUser(JSON.parse(stored))
        setIsAuthenticated(true)
      }
    } catch (err) {
      setAuthError({ type: 'auth_required', message: err.message })
      setIsAuthenticated(false)
    } finally {
      setIsLoadingAuth(false)
      setAuthChecked(true)
    }
  }, [])

  const checkAppState = async () => {
    // TODO: replace with your own backend app state check
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      login,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}