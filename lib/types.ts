// FILE: app/lib/types.ts
export interface Card {
  id: number;
  card_name: string;
  card_issuer: string;
  credit_limit: number;
  amount_used: number;
  card_details_id: number;
  benefits?: string[]; // This line is crucial
}

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