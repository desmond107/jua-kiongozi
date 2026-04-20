import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('jk_token'))
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const fetchUser = useCallback(async () => {
    if (!token) { setLoading(false); return }
    try {
      const me = await getMe()
      setUser(me)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchUser() }, [fetchUser])

  const login = (jwt, userData) => {
    localStorage.setItem('jk_token', jwt)
    localStorage.setItem('jk_user', JSON.stringify(userData))
    setToken(jwt)
    setUser(userData)
    setShowAuthModal(false)
    toast.success(`Welcome back, ${userData.username || userData.email}!`)
  }

  const logout = () => {
    localStorage.removeItem('jk_token')
    localStorage.removeItem('jk_user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const requireAuth = (callback) => {
    if (!user) {
      setShowAuthModal(true)
      return false
    }
    if (callback) callback()
    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        showAuthModal,
        setShowAuthModal,
        requireAuth,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
