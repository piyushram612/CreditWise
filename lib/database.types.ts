export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string
          card_name: string
          issuer: string
          network: string | null
          annual_fee: number | null
          reward_rates: Json | null
          benefits: string | null
          created_at: string | null
          card_type: string[] | null
          joining_fee: number | null
          fee_waiver: string | null
          welcome_benefits: string | null
          milestone_benefits: Json | null
          lounge_access: Json | null
          other_benefits: string[] | null
          suitability: string | null
        }
        Insert: {
          id?: string
          card_name: string
          issuer: string
          network?: string | null
          annual_fee?: number | null
          reward_rates?: Json | null
          benefits?: string | null
          created_at?: string | null
          card_type?: string[] | null
          joining_fee?: number | null
          fee_waiver?: string | null
          welcome_benefits?: string | null
          milestone_benefits?: Json | null
          lounge_access?: Json | null
          other_benefits?: string[] | null
          suitability?: string | null
        }
        Update: {
          id?: string
          card_name?: string
          issuer?: string
          network?: string | null
          annual_fee?: number | null
          reward_rates?: Json | null
          benefits?: string | null
          created_at?: string | null
          card_type?: string[] | null
          joining_fee?: number | null
          fee_waiver?: string | null
          welcome_benefits?: string | null
          milestone_benefits?: Json | null
          lounge_access?: Json | null
          other_benefits?: string[] | null
          suitability?: string | null
        }
      }
      user_owned_cards: {
        Row: {
          id: string
          user_id: string
          card_id: string | null
          credit_limit: number | null
          created_at: string | null
          custom_benefits: string | null
          card_name: string | null
          issuer: string | null
          card_type: string | null
          benefits: Json | null
          fees: Json | null
          used_amount: number | null
        }
        Insert: {
          id?: string
          user_id: string
          card_id?: string | null
          credit_limit?: number | null
          created_at?: string | null
          custom_benefits?: string | null
          card_name?: string | null
          issuer?: string | null
          card_type?: string | null
          benefits?: Json | null
          fees?: Json | null
          used_amount?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string | null
          credit_limit?: number | null
          created_at?: string | null
          custom_benefits?: string | null
          card_name?: string | null
          issuer?: string | null
          card_type?: string | null
          benefits?: Json | null
          fees?: Json | null
          used_amount?: number | null
        }
      }
      feedback: {
        Row: {
          id: number
          created_at: string
          user_id: string
          feedback_text: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          feedback_text: string
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          feedback_text?: string
        }
      }
      card_requests: {
        Row: {
          id: number
          created_at: string
          user_id: string
          card_name: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          card_name: string
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          card_name?: string
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          card_id: string
          amount: number
          merchant_name: string
          transaction_date: string
          status: string
          category: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          card_id: string
          amount: number
          merchant_name: string
          transaction_date: string
          status: string
          category?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          card_id?: string
          amount?: number
          merchant_name?: string
          transaction_date?: string
          status?: string
          category?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
