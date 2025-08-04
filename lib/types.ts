// A single source of truth for the Json type, used across the application.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// This interface now perfectly matches the structure of the card objects
// used within the application, resolving the TypeScript errors.
export interface Card {
  id: string;
  user_id: string;
  card_id: string;
  credit_limit: number | null;
  used_amount: number | null;
  card_name: string | null;
  card_issuer: string | null;
  benefits: Json | null;
  fees: Json | null;
}

// The Message interface, required by the AiCardAdvisor component.
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
