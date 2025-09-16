// Re-export types from lib
export type { Card, Message, Json } from '@/lib/types';
import type { Json } from '@/lib/types';

// Additional app-specific types
export interface OptimizationResult {
  bestCard: {
    name: string;
    issuer: string;
  };
  reason: string;
  alternatives: Array<{
    name: string;
    reason: string;
  }>;
}

export interface ChatMessage {
  from: 'user' | 'ai';
  text: string;
}

export interface UserOwnedCard {
  id: string;
  user_id: string;
  card_id: string;
  credit_limit: number | null;
  used_amount: number | null;
  card_name: string | null;
  issuer: string | null;
  card_type?: string | null;
  network?: string | null;
  benefits: Json | null;
  fees: Json | null;
}

export interface User {
  id: string;
  email?: string;
  // Add other user properties as needed
}

export interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: User | null;
  onAuthClick: () => void;
  supabase: { auth: { signOut: () => Promise<{ error: unknown | null }> } }; // Minimal Supabase client type
  theme: string;
  toggleTheme: () => void;
  onLinkClick: () => void;
}

export interface Transaction {
  id: string;
  created_at: string;
  user_id: string;
  card_id: string;
  amount: number;
  merchant_name: string;
  transaction_date: string;
  status: 'confirmed' | 'pending' | 'declined';
  category: string | null;
}