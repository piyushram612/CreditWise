import { createClient } from '@/lib/supabaseClient';

// Create a singleton supabase client to avoid creating multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Return a mock client for server-side rendering
    return null;
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}