import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { SupabaseClient } from '@supabase/supabase-js';
import { XMarkIcon } from '@/app/components/shared/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: SupabaseClient;
}

export function AuthModal({ isOpen, onClose, supabase }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon />
        </button>
        
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          providers={['google', 'github']} 
          theme="light" 
        />
      </div>
    </div>
  );
}