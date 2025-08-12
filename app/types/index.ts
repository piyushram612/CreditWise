import { User as SupabaseUser, SupabaseClient } from '@supabase/supabase-js'

export type User = SupabaseUser;

export interface RewardValue {
  rate: number;
  type: string;
  notes: string;
}

export interface LoungeAccess {
  domestic?: string;
  international?: string;
}

export interface Card {
  id: string;
  card_name: string;
  issuer: string;
  network?: string;
  annual_fee?: number;
  reward_rates?: Record<string, RewardValue>;
  benefits?: string;
  card_type?: string[];
  joining_fee?: number;
  fee_waiver?: string;
  welcome_benefits?: string;
  milestone_benefits?: Record<string, unknown>[];
  lounge_access?: LoungeAccess;
  other_benefits?: string[];
  suitability?: string;
}

export interface UserOwnedCard {
  id: string;
  credit_limit?: number;
  used_amount?: number;
  card_name: string;
  issuer: string;
  card_type?: string;
  benefits?: Record<string, string>;
  fees?: Record<string, string>;
}

export interface CardSuggestion {
  name: string;
  reason: string;
}

export interface OptimizationResult {
  bestCard: {
    name: string;
    issuer: string;
  };
  reason: string;
  alternatives: CardSuggestion[];
}

export interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
}

export interface DashboardViewProps {
  user: User | null;
  setActiveView: (view: string) => void;
  onAddCardClick: () => void;
}

export interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: User | null;
  onAuthClick: () => void;
  supabase: SupabaseClient;
  theme: string;
  toggleTheme: () => void;
  onLinkClick: () => void;
}