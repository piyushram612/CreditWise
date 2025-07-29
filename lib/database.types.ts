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
      // This is a placeholder. If you generate types from your
      // Supabase dashboard, you can paste them here.
      // For now, an empty object will satisfy the compiler.
      card_details: {
        Row: {
          id: number
          card_name: string
          issuer: string
        }
      }
      user_cards: {
        Row: {
          id: number
          user_id: string
          card_details_id: number
          credit_limit: number
          amount_used: number
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
