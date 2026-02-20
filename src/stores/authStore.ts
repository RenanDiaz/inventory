import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  organizationId: string | null
  loading: boolean
  setAuth: (session: Session | null) => void
  clear: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  organizationId: null,
  loading: true,
  setAuth: (session) =>
    set({
      session,
      user: session?.user ?? null,
      organizationId:
        session?.user?.user_metadata?.organization_id ??
        session?.user?.id ??
        null,
      loading: false,
    }),
  clear: () =>
    set({
      user: null,
      session: null,
      organizationId: null,
      loading: false,
    }),
  setLoading: (loading) => set({ loading }),
}))
