import { createClient } from '@/lib/supabaseClient';

// Create a singleton supabase client to avoid creating multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}