import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '../database.types';

// This is the single, correct way to create a Supabase client for Server Components
// in this application.
export const createClient = () =>
  createServerComponentClient<Database>({
    cookies: cookies,
  });
