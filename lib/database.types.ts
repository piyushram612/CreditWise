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
          benefits: Json | null
          fees: Json | null
        }
        Insert: {
          id?: string
          card_name: string
          issuer: string
          benefits?: Json | null
          fees?: Json | null
        }
        Update: {
          id?: string
          card_name?: string
          issuer?: string
          benefits?: Json | null
          fees?: Json | null
        }
      }
      user_owned_cards: {
        Row: {
          id: string
          user_id: string
          card_id: string
          credit_limit: number | null
          used_amount: number | null
          card_name: string | null
          issuer: string | null
          benefits: Json | null
          fees: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          credit_limit?: number | null
          used_amount?: number | null
          card_name?: string | null
          issuer?: string | null
          benefits?: Json | null
          fees?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string
          credit_limit?: number | null
          used_amount?: number | null
          card_name?: string | null
          issuer?: string | null
          benefits?: Json | null
          fees?: Json | null
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
