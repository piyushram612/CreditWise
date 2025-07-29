import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthComponent from './components/auth/AuthComponent';

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-100">CreditWise</h1>
                <p className="mt-2 text-gray-400">Your intelligent credit card spending assistant.</p>
            </div>
            <AuthComponent />
        </div>
    </div>
  );
}