import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"
import { supabaseClient } from "@/lib/supabase/client"

// Tipo para a não conformidade
export type NonConformity = Database["public"]["Tables"]["non_conformities"]["Row"]
export type NonConformityInput = Omit<NonConformity, "id" | "created_at">
export type NonConformityUpdate = Partial<NonConformityInput>

export class NonConformityService extends ApiService<NonConformity> {
  constructor() {
    super("non_conformities")
  }

  // Métodos específicos para não conformidades

  // Buscar não conformidades com detalhes da inspeção
  async getAllWithDetails(): Promise<
    (NonConformity & {
      inspection: {
        product: { name: string }
        batch: string
      }
    })[]
  > {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        inspection:inspections(
          batch,
          product:products(name)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar não conformidades com detalhes: ${error.message}`)
    }

    return data as (NonConformity & {
      inspection: {
        product: { name: string }
        batch: string
      }
    })[]
  }

  // Buscar não conformidades por inspeção
  async getByInspection(inspectionId: string): Promise<NonConformity[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("inspection_id", inspectionId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar não conformidades da inspeção ${inspectionId}: ${error.message}`)
    }

    return data as NonConformity[]
  }
}

// Instância singleton do serviço
export const nonConformityService = new NonConformityService()
