"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, Session } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      setLoading(true)
      // TODO: Implement session check API call
      // For now, we'll simulate no session
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error checking session:', error)
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      // TODO: Implement sign in API call
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Sign in failed')
      }

      const { user: userData, session: sessionData } = await response.json()
      setUser(userData)
      setSession(sessionData)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      // TODO: Implement sign up API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        throw new Error('Sign up failed')
      }

      const { user: userData, session: sessionData } = await response.json()
      setUser(userData)
      setSession(sessionData)
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      // TODO: Implement sign out API call
      await fetch('/api/auth/signout', {
        method: 'POST',
      })

      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      // TODO: Implement session refresh API call
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const { user: userData, session: sessionData } = await response.json()
        setUser(userData)
        setSession(sessionData)
      } else {
        setUser(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      setUser(null)
      setSession(null)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}