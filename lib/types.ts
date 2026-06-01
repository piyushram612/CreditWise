// Re-export the Json type from database.types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// This is the single, consistent interface for a card object used throughout the application.
// It combines fields from both 'user_owned_cards' and the joined 'cards' table.
export interface Card {
  id: string; // This will be the ID from the user_owned_cards table
  user_id: string;
  card_id: string | null; // Can be null according to database schema
  credit_limit: number | null;
  used_amount: number | null;
  card_name: string | null;
  issuer: string | null;
  benefits: Json | null;
  fees: Json | null;
  // Additional fields from cards table (when joined)
  network?: string | null;
  annual_fee?: number | null;
  reward_rates?: Json | null;
  card_type?: string[] | null;
  joining_fee?: number | null;
  fee_waiver?: string | null;
  welcome_benefits?: string | null;
  milestone_benefits?: Json | null;
  lounge_access?: Json | null;
  other_benefits?: string[] | null;
  suitability?: string | null;
}

// The Message interface, required by the AiCardAdvisor component.
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
