import type { Database } from './database.types';

// The single source of truth for the Json type
export type Json = Database['public']['Tables']['cards']['Row']['benefits'];

// The Card type is now derived directly from the database schema, ensuring they are always in sync.
export type Card = Database['public']['Tables']['user_owned_cards']['Row'] & {
    // This allows us to handle the joined 'cards' table data
    cards?: Database['public']['Tables']['cards']['Row'] | null;
};

// The Message interface, required by the AiCardAdvisor component.
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
