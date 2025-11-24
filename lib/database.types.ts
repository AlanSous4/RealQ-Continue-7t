// /lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

// ---------------------------------------------
// Types gerados manualmente conforme seu schema
// ---------------------------------------------
export interface Database {
  public: {
    Tables: {

      // ---------------- USERS ----------------
      users: {
        Row: {
          id: string
          email: string | null
          name: string | null
          phone: string | null
          user_type: string | null
          auth_id: string | null
          created_at: string
        }

        Insert: {
          id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          user_type?: string | null
          auth_id?: string | null
          created_at?: string
        }

        Update: {
          id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          user_type?: string | null
          auth_id?: string | null
          created_at?: string
        }
      },

      // ---------------- PRODUCTS ----------------
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string
          created_at: string
          user_id: string | null
        }
      
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id: string
          created_at?: string
          user_id?: string | null
        }
      
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string
          created_at?: string
          user_id?: string | null
        }
      },

      // ---------------- CATEGORIES ----------------
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
          user_id: string | null
        }
      
        Insert: {
          id?: string
          name: string
          created_at?: string
          user_id?: string | null
        }
      
        Update: {
          id?: string
          name?: string
          created_at?: string
          user_id?: string | null
        }
      },

      // ---------------- REVENDORES ----------------
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
      },

      // ---------------- INSPECTIONS ----------------
      inspections: {
        Row: {
          id: string
          product_id: string
          batch: string
          supplier_id: string
          manufacturer_id: string
          expiry_date: string
          status: string
          created_by: string
          created_at: string
        }

        Insert: {
          id?: string
          product_id: string
          batch: string
          supplier_id: string
          manufacturer_id: string
          expiry_date: string
          status?: string
          created_by: string
          created_at?: string
        }

        Update: {
          id?: string
          product_id?: string
          batch?: string
          supplier_id?: string
          manufacturer_id?: string
          expiry_date?: string
          status?: string
          created_by?: string
          created_at?: string
        }
      },

      // ---------------- INSPECTION DETAILS ----------------
      inspection_details: {
        Row: {
          id: string
          inspection_id: string
          test_id: string
          result: string
          notes: string
          created_at: string
        }

        Insert: {
          id?: string
          inspection_id: string
          test_id: string
          result: string
          notes?: string
          created_at?: string
        }

        Update: {
          id?: string
          inspection_id?: string
          test_id?: string
          result?: string
          notes?: string
          created_at?: string
        }
      },

      // ---------------- TESTS ----------------
      tests: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }

        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
        }

        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      },

      // ---------------- TOOLS ----------------
      tools: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }

        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
        }

        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      },

      // ---------------- SUPPLIERS ----------------
      suppliers: {
        Row: {
          id: string
          name: string
          contact: string
          email: string
          phone: string
          created_at: string
        }

        Insert: {
          id?: string
          name: string
          contact?: string
          email: string
          phone?: string
          created_at?: string
        }

        Update: {
          id?: string
          name?: string
          contact?: string
          email?: string
          phone?: string
          created_at?: string
        }
      },

      // ---------------- MANUFACTURERS ----------------
      manufacturers: {
        Row: {
          id: string
          name: string
          contact: string
          email: string
          phone: string
          created_at: string
        }

        Insert: {
          id?: string
          name: string
          contact?: string
          email: string
          phone?: string
          created_at?: string
        }

        Update: {
          id?: string
          name?: string
          contact?: string
          email?: string
          phone?: string
          created_at?: string
        }
      },

      // ---------------- ACTION PLANS ----------------
      action_plans: {
        Row: {
          id: string
          non_conformity_id: string | null
          description: string
          status: string
          due_date: string | null
          responsible: string | null
          created_at: string
        }

        Insert: {
          id?: string
          non_conformity_id?: string | null
          description: string
          status?: string
          due_date?: string | null
          responsible?: string | null
          created_at?: string
        }

        Update: {
          id?: string
          non_conformity_id?: string | null
          description?: string
          status?: string
          due_date?: string | null
          responsible?: string | null
          created_at?: string
        }
      },

      // ---------------- NON CONFORMITIES ----------------
      non_conformities: {
        Row: {
          id: string
          inspection_id: string
          description: string
          severity: string
          category: string | null
          impact: string | null
          status: string
          created_at: string
        }

        Insert: {
          id?: string
          inspection_id: string
          description: string
          severity?: string
          category?: string | null
          impact?: string | null
          status?: string
          created_at?: string
        }

        Update: {
          id?: string
          inspection_id?: string
          description?: string
          severity?: string
          category?: string | null
          impact?: string | null
          status?: string
          created_at?: string
        }
      }
    },

    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {},
  }
}
