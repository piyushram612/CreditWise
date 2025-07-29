// FILE: app/lib/types.ts
export interface Card {
  id: string; // Changed to string for UUID
  user_id: string;
  card_id?: string | null; // Changed from card_details_id and made optional
  credit_limit?: number | null;
  created_at?: string | null;
  custom_benefits?: string | null;
  card_name?: string | null;
  card_issuer?: string | null; // Changed from issuer
  card_type?: string | null;
  benefits?: Json | null; // Using Json type for jsonb
  fees?: Json | null; // Using Json type for jsonb
  used_amount?: number | null; // Changed from amount_used
}

// Supabase's jsonb type can be represented this way in TypeScript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CardData {
  id: number;
  card_name: string;
  issuer: string;
  network: string;
  rewards: {
    type: string;
    rate: number;
    category?: string;
  }[];
  benefits: string[];
}
