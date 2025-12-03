export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type UserType = "admin" | "user"
export type InspectionStatus = "pending" | "approved" | "rejected"

// =====================
// SCHEMA CORRIGIDO + MELHORIAS
// =====================

export interface Database {
  public: {
    Tables: {

      // ------------ USERS ------------
      users: {
        Row: {
          id: string
          auth_id: string | null   // ✅ IMPORTANTÍSSIMO
          email: string
          name: string
          phone: string | null
          user_type: UserType
          created_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          email: string
          name: string
          phone?: string | null
          user_type?: UserType
          created_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          email?: string
          name?: string
          phone?: string | null
          user_type?: UserType
          created_at?: string
        }
      }

      // ------------ PRODUCTS ------------
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string
          user_id: string | null   // ✅ EXISTE NO BANCO
          created_at: string
          quantity: number | null  // ✅ necessário para soma
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id: string
          user_id?: string | null
          quantity?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string
          user_id?: string | null
          quantity?: number | null
          created_at?: string
        }
      }

      // ------------ CATEGORIES ------------
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          user_id: string | null         
          produto_quantidade: number | null
        }

        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          user_id?: string | null          
          produto_quantidade: number | null
        }

        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          user_id?: string | null
          produto_quantidade: number | null
        }
      }

      // ------------ INSPECTIONS ------------
      inspections: {
        Row: {
          id: string
          product_id: string
          batch: string
          supplier_id: string
          manufacturer_id: string
          expiry_date: string
          status: InspectionStatus
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          product_id: string
          batch: string
          supplier_id: string
          manufacturer_id: string
          expiry_date: string
          status?: InspectionStatus
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          product_id?: string
          batch?: string
          supplier_id?: string
          manufacturer_id?: string
          expiry_date?: string
          status?: InspectionStatus
          created_at?: string
          created_by?: string
        }
      }

      // ------------ INSPECTION DETAILS ------------
      inspection_details: {
        Row: {
          id: string
          inspection_id: string
          test_id: string
          result: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          test_id: string
          result: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          test_id?: string
          result?: string
          notes?: string | null
          created_at?: string
        }
      }

      // ------------ TESTS ------------
      tests: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }

      // ------------ TOOLS ------------
      tools: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }

      // ------------ SUPPLIERS ------------
      suppliers: {
        Row: {
          id: string
          name: string
          contact: string | null
          email: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contact?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
        }
      }

      // ------------ MANUFACTURERS ------------
      manufacturers: {
        Row: {
          id: string
          name: string
          contact: string | null
          email: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contact?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact?: string | null
          email?: string | null
          phone?: string | null
          created_at?: string
        }
      }

    }

    Views: {}
    Functions: {}
    Enums: {
      inspection_status: InspectionStatus
    }
    CompositeTypes: {}
  }
}
