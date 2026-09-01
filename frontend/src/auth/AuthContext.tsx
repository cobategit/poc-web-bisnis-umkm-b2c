import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiFetch } from '../api/client'

export type AuthUser = {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

type AuthContextValue = {
  user: AuthUser | null
  accessToken: string
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  can: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthResponse = { access_token: string; user: AuthUser }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState('')
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      const res = await apiFetch<AuthResponse>('/auth/refresh', { method: 'POST' })
      setUser(res.user)
      setAccessToken(res.access_token)
    } catch {
      setUser(null)
      setAccessToken('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refresh() }, [])

  async function login(email: string, password: string) {
    const res = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(res.user)
    setAccessToken(res.access_token)
  }

  async function logout() {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => undefined)
    setUser(null)
    setAccessToken('')
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    accessToken,
    loading,
    login,
    logout,
    can: (permission) => Boolean(user?.permissions.includes(permission) || user?.permissions.includes('*')),
  }), [user, accessToken, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
