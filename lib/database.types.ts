// /lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

interface Timestamps {
  created_at?: string
  updated_at?: string
}

interface WithId {
  id: string
}

interface BaseInsert {
  id?: string
  created_at?: string
}

interface BaseUpdate {
  id?: string
  created_at?: string
  updated_at?: string
}

// -------------------------------------------------
//  SCHEMA COMPLETO — AGORA COMPATÍVEL COM SUPABASE
// -------------------------------------------------
export interface Database {
  public: {
    Tables: {

      // ---------------- USERS ----------------
      users: {
        Row: WithId & {
          email: string | null
          name: string | null
          phone: string | null
          user_type: string | null
          auth_id: string | null
        } & Timestamps

        Insert: {
          id?: string
          email?: string
          name?: string
          phone?: string
          user_type?: string
          auth_id?: string
          created_at?: string
          updated_at?: string
        }

        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          user_type?: string
          auth_id?: string
          created_at?: string
          updated_at?: string
        }
      },

      // ---------------- PRODUCTS ----------------
      products: {
        Row: WithId & {
          name: string
          description: string | null
          category_id: string
          user_id: string
        } & Timestamps

        Insert: BaseInsert & {
          name: string
          description?: string | null
          category_id: string
          user_id: string
        }

        Update: BaseUpdate & {
          name?: string
          description?: string | null
          category_id?: string
          user_id?: string
        }
      },

      // ---------------- CATEGORIES ----------------
      categories: {
        Row: WithId & {
          name: string
          user_id: string | null
        } & Timestamps

        Insert: BaseInsert & {
          name: string
          user_id?: string | null
        }

        Update: BaseUpdate & {
          name?: string
          user_id?: string | null
        }
      },

      // ---------------- REVENDORES ----------------
      revendedores: {
        Row: WithId & {
          nome: string
          email: string
          telefone: string
          cidade: string
        } & Timestamps

        Insert: BaseInsert & {
          nome: string
          email: string
          telefone: string
          cidade: string
        }

        Update: BaseUpdate & {
          nome?: string
          email?: string
          telefone?: string
          cidade?: string
        }
      },

      // ---------------- INSPECTIONS ----------------
      inspections: {
        Row: WithId & {
          product_id: string
          batch: string
          supplier_id: string
          manufacturer_id: string
          expiry_date: string
          status: string
          created_by: string
        } & Timestamps

        Insert: BaseInsert & {
          product_id: string
          batch: string
          supplier_id: string
          manufacturer_id: string
          expiry_date: string
          status?: string
          created_by: string
        }

        Update: BaseUpdate & {
          product_id?: string
          batch?: string
          supplier_id?: string
          manufacturer_id?: string
          expiry_date?: string
          status?: string
          created_by?: string
        }
      },

      // ---------------- INSPECTION DETAILS ----------------
      inspection_details: {
        Row: WithId & {
          inspection_id: string
          test_id: string
          result: string
          notes: string
        } & Timestamps

        Insert: BaseInsert & {
          inspection_id: string
          test_id: string
          result: string
          notes?: string
        }

        Update: BaseUpdate & {
          inspection_id?: string
          test_id?: string
          result?: string
          notes?: string
        }
      },

      // ---------------- TESTS ----------------
      tests: {
        Row: WithId & {
          name: string
          description: string
        } & Timestamps

        Insert: BaseInsert & {
          name: string
          description?: string
        }

        Update: BaseUpdate & {
          name?: string
          description?: string
        }
      },

      // ---------------- TOOLS ----------------
      tools: {
        Row: WithId & {
          name: string
          description: string
        } & Timestamps

        Insert: BaseInsert & {
          name: string
          description?: string
        }

        Update: BaseUpdate & {
          name?: string
          description?: string
        }
      },

      // ---------------- SUPPLIERS ----------------
      suppliers: {
        Row: WithId & {
          name: string
          contact: string
          email: string
          phone: string
        } & Timestamps

        Insert: BaseInsert & {
          name: string
          contact?: string
          email: string
          phone?: string
        }

        Update: BaseUpdate & {
          name?: string
          contact?: string
          email?: string
          phone?: string
        }
      },

      // ---------------- MANUFACTURERS ----------------
      manufacturers: {
        Row: WithId & {
          name: string
          contact: string
          email: string
          phone: string
        } & Timestamps

        Insert: BaseInsert & {
          name: string
          contact?: string
          email: string
          phone?: string
        }

        Update: BaseUpdate & {
          name?: string
          contact?: string
          email?: string
          phone?: string
        }
      },

      // ---------------- ACTION PLANS ----------------
      action_plans: {
        Row: WithId & {
          non_conformity_id: string | null
          description: string
          status: string
          due_date: string | null
          responsible: string | null
        } & Timestamps

        Insert: BaseInsert & {
          non_conformity_id?: string | null
          description: string
          status?: string
          due_date?: string | null
          responsible?: string | null
        }

        Update: BaseUpdate & {
          non_conformity_id?: string | null
          description?: string
          status?: string
          due_date?: string | null
          responsible?: string | null
        }
      },

      // ---------------- NON CONFORMITIES ----------------
      non_conformities: {
        Row: WithId & {
          inspection_id: string
          description: string
          severity: string
          category: string | null
          impact: string | null
          status: string
        } & Timestamps

        Insert: BaseInsert & {
          inspection_id: string
          description: string
          severity?: string
          category?: string | null
          impact?: string | null
          status?: string
        }

        Update: BaseUpdate & {
          inspection_id?: string
          description?: string
          severity?: string
          category?: string | null
          impact?: string | null
          status?: string
        }
      }
    },

    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {}
  }
}
