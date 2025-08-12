import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/app/utils/supabase'
import type { User } from '@/app/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user }
}