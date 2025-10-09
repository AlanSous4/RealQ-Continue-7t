import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"
import { supabaseClient } from "@/lib/supabase/client"

// Tipo para a inspeção
export type Inspection = Database["public"]["Tables"]["inspections"]["Row"]
export type InspectionInput = Omit<Inspection, "id" | "created_at">
export type InspectionUpdate = Partial<InspectionInput>

// Tipo para detalhes da inspeção
export type InspectionDetail = Database["public"]["Tables"]["inspection_details"]["Row"]
export type InspectionDetailInput = Omit<InspectionDetail, "id" | "created_at">
export type InspectionDetailUpdate = Partial<InspectionDetailInput>

export class InspectionService extends ApiService<Inspection> {
  constructor() {
    super("inspections")
  }

  // Métodos específicos para inspeções

  // Buscar inspeções com detalhes relacionados
  async getAllWithDetails(): Promise<
    (Inspection & {
      product: { name: string }
      supplier: { name: string }
      manufacturer: { name: string }
    })[]
  > {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        product:products(name),
        supplier:suppliers(name),
        manufacturer:manufacturers(name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar inspeções com detalhes: ${error.message}`)
    }

    return data as (Inspection & {
      product: { name: string }
      supplier: { name: string }
      manufacturer: { name: string }
    })[]
  }

  // Buscar inspeções pendentes
  async getPending(): Promise<Inspection[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("status", "Pendente")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar inspeções pendentes: ${error.message}`)
    }

    return data as Inspection[]
  }

  // Buscar inspeções por produto
  async getByProduct(productId: string): Promise<Inspection[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar inspeções do produto ${productId}: ${error.message}`)
    }

    return data as Inspection[]
  }

  // Adicionar detalhes à inspeção
  async addDetail(detail: InspectionDetailInput): Promise<InspectionDetail> {
    const { data, error } = await supabaseClient.from("inspection_details").insert(detail).select().single()

    if (error) {
      throw new Error(`Erro ao adicionar detalhe à inspeção: ${error.message}`)
    }

    return data as InspectionDetail
  }

  // Buscar detalhes de uma inspeção
  async getDetails(inspectionId: string): Promise<InspectionDetail[]> {
    const { data, error } = await supabaseClient
      .from("inspection_details")
      .select("*")
      .eq("inspection_id", inspectionId)

    if (error) {
      throw new Error(`Erro ao buscar detalhes da inspeção ${inspectionId}: ${error.message}`)
    }

    return data as InspectionDetail[]
  }
}

// Instância singleton do serviço
export const inspectionService = new InspectionService()
