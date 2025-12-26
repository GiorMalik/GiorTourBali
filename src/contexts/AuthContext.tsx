"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  isVerified?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string; data?: any }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string; user?: User }>
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; data?: any }>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string; user?: User }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok && data.ok) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('[AuthContext] Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await response.json()
      if (response.ok && data.ok) {
        return { success: true, message: data.message, data }
      } else {
        return { success: false, message: data.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('[AuthContext] Registration error:', error)
      return { success: false, message: 'An error occurred during registration' }
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await response.json()
      if (response.ok && data.ok) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        return { success: true, message: data.message, user: data.user }
      } else {
        return { success: false, message: data.message || 'OTP verification failed' }
      }
    } catch (error) {
      console.error('[AuthContext] OTP verification error:', error)
      return { success: false, message: 'An error occurred during OTP verification' }
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok && data.ok) {
        return { success: true, message: data.message, data }
      } else {
        return { success: false, message: data.message || 'Failed to send OTP' }
      }
    } catch (error) {
      console.error('[AuthContext] Forgot password error:', error)
      return { success: false, message: 'An error occurred while sending OTP' }
    }
  }

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await response.json()
      if (response.ok && data.ok) {
        if (data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        return { success: true, message: data.message, user: data.user }
      } else {
        return { success: false, message: data.message || 'Failed to reset password' }
      }
    } catch (error) {
      console.error('[AuthContext] Password reset error:', error)
      return { success: false, message: 'An error occurred while resetting password' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('[AuthContext] Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, verifyOTP, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
