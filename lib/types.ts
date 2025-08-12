import type { Database } from './database.types';

// The single source of truth for the Json type
export type Json = Database['public']['Tables']['cards']['Row']['benefits'];

// This is the single, consistent interface for a card object used throughout the application.
// It combines fields from both 'user_owned_cards' and the joined 'cards' table.
export interface Card {
  id: string; // This will be the ID from the user_owned_cards table
  user_id: string;
  card_id: string;
  credit_limit: number | null;
  used_amount: number | null;
  card_name: string | null;
  issuer: string | null; // Note: the property is 'issuer', not 'card_issuer'
  benefits: Json | null;
  fees: Json | null;
}

// The Message interface, required by the AiCardAdvisor component.
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
