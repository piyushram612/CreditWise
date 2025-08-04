import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AuthComponent from './components/auth/AuthComponent';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">CreditWise</h1>
          <p className="mt-2 text-gray-400">Optimize your credit card rewards effortlessly.</p>
        </div>
        <AuthComponent />
      </div>
    </div>
  );
}
