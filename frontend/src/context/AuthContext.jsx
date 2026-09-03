import { createContext, useContext, useEffect, useState } from 'react'
import {
  getCurrentUser,
  logoutUser
} from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser()
      setUser(response.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}