import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { ApiError, api } from '../lib/api'
import type { AdminUser } from '../types'

interface AuthContextValue {
  user: AdminUser | null
  /** True until the session check on `/api/auth/me` settles. */
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AUTH_ME_KEY = ['auth', 'me'] as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: async (): Promise<AdminUser | null> => {
      try {
        const data = await api.get<{ user: AdminUser }>('/api/auth/me')
        return data.user
      } catch (error) {
        // A 401 is the expected answer for a signed-out visitor, so it resolves
        // to "no user" instead of an error state the UI has to special-case.
        if (error instanceof ApiError && error.status === 401) return null
        throw error
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<{ user: AdminUser }>('/api/auth/login', { email, password })
      queryClient.setQueryData(AUTH_ME_KEY, data.user)
    },
    [queryClient],
  )

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout')
    queryClient.setQueryData(AUTH_ME_KEY, null)
    // Drop cached admin data so a different account never sees stale rows.
    queryClient.removeQueries({ queryKey: ['admin'] })
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isLoading: meQuery.isPending,
      login,
      logout,
    }),
    [meQuery.data, meQuery.isPending, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an <AuthProvider>')
  return context
}
