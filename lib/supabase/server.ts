import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '../../lib/database.types';

export const createClient = () =>
  createServerComponentClient<Database>({
    cookies: cookies,
  });
