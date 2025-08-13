import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  // Only create client on browser side
  if (typeof window === 'undefined') {
    return null;
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
