export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          phone: string | null
          user_type: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          user_type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          user_type?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category_id?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      inspections: { /* ... */ },
      inspection_details: { /* ... */ },
      tests: { /* ... */ },
      tools: { /* ... */ },
      suppliers: { /* ... */ },
      manufacturers: { /* ... */ },
      action_plans: { /* ... */ },
      non_conformities: { /* ... */ },

      // ✅ TABELA REVENDEDORES INCORPORADA
      revendedores: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string
          cidade: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          telefone: string
          cidade: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          telefone?: string
          cidade?: string
          created_at?: string
        }
      }
    }
  }
}
