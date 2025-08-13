import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/app/utils/supabase'
import type { User } from '@/app/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const supabase = getSupabaseClient()
    if (!supabase) return;
    
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      }
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user }
}