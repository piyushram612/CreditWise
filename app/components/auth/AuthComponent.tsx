'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GithubIcon } from '../icons';

export default function AuthComponent() {
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-lg">
        <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
            <GithubIcon className="h-5 w-5 mr-2" />
            Sign in with GitHub
        </button>
        <p className="mt-6 text-center text-sm text-gray-400">
            By signing in, you agree to our terms of service.
        </p>
    </div>
  );
}