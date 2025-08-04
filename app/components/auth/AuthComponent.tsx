'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';

export default function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setIsSubmitting(false);
  };

  const handleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-400">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />
      <div className="flex space-x-2">
        <button onClick={handleSignIn} disabled={isSubmitting} className="w-full p-2 bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-500">
          Sign In
        </button>
        <button onClick={handleSignUp} disabled={isSubmitting} className="w-full p-2 bg-gray-600 rounded hover:bg-gray-700 disabled:bg-gray-500">
          Sign Up
        </button>
      </div>
      <button onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full p-2 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-500">
        Sign in with Google
      </button>
    </div>
  );
}
