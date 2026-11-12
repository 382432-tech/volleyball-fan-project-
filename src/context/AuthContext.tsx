'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const MOCK_USER_KEY = 'spike_hub_mock_user'
const MOCK_USERS_KEY = 'spike_hub_mock_users'

function createMockUser(email: string): User {
  return {
    id: `mock-${email.toLowerCase()}`,
    email,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      Promise.resolve().then(() => {
        try {
          const stored = window.localStorage.getItem(MOCK_USER_KEY)
          if (stored) {
            setUser(JSON.parse(stored) as User)
          }
        } catch {
          // Ignore storage errors
        }
        setLoading(false)
      })
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      try {
        const rawUsers = window.localStorage.getItem(MOCK_USERS_KEY)
        const users: Record<string, { password: string; user: User }> = rawUsers ? JSON.parse(rawUsers) : {}
        const key = email.toLowerCase()
        if (users[key] && users[key].password !== password) {
          return { error: new Error('Invalid email or password') }
        }
        const mockUser = users[key]?.user ?? createMockUser(email)
        users[key] = { password, user: mockUser }
        window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
        window.localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
        setUser(mockUser)
      } catch {
        setUser(createMockUser(email))
      }
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      const mockUser = createMockUser(email)
      try {
        const rawUsers = window.localStorage.getItem(MOCK_USERS_KEY)
        const users: Record<string, { password: string; user: User }> = rawUsers ? JSON.parse(rawUsers) : {}
        users[email.toLowerCase()] = { password, user: mockUser }
        window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
        window.localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
      } catch {
        // Ignore storage errors
      }
      setUser(mockUser)
      return { error: null }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    return { error }
  }

  const signOut = async () => {
    if (!supabase) {
      try {
        window.localStorage.removeItem(MOCK_USER_KEY)
      } catch {
        // Ignore storage errors
      }
      setUser(null)
      return
    }

    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

