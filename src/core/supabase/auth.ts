import { supabase } from './client'
import { useAuthStore } from '@/stores/authStore'

/**
 * Sign up a new user with email and password.
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

/**
 * Sign in with Google OAuth via Supabase.
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
  if (error) throw error
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  useAuthStore.getState().clear()
}

/**
 * Initialize the auth listener. Call once at app startup.
 * Returns an unsubscribe function.
 */
export function initAuthListener(): () => void {
  const { setAuth, setLoading } = useAuthStore.getState()

  // Check existing session
  setLoading(true)
  supabase.auth.getSession().then(({ data: { session } }) => {
    setAuth(session)
  })

  // Listen for auth state changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setAuth(session)
  })

  return () => {
    subscription.unsubscribe()
  }
}
