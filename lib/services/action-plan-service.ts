import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"
import { supabaseClient } from "@/lib/supabase/client"

// Tipo para o plano de ação
export type ActionPlan = Database["public"]["Tables"]["action_plans"]["Row"]
export type ActionPlanInput = Omit<ActionPlan, "id" | "created_at">
export type ActionPlanUpdate = Partial<ActionPlanInput>

export class ActionPlanService extends ApiService<ActionPlan> {
  constructor() {
    super("action_plans")
  }

  // Métodos específicos para planos de ação

  // Buscar planos de ação com detalhes da inspeção
  async getAllWithDetails(): Promise<
    (ActionPlan & {
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
      .order("due_date")

    if (error) {
      throw new Error(`Erro ao buscar planos de ação com detalhes: ${error.message}`)
    }

    return data as (ActionPlan & {
      inspection: {
        product: { name: string }
        batch: string
      }
    })[]
  }

  // Buscar planos de ação por inspeção
  async getByInspection(inspectionId: string): Promise<ActionPlan[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("inspection_id", inspectionId)
      .order("due_date")

    if (error) {
      throw new Error(`Erro ao buscar planos de ação da inspeção ${inspectionId}: ${error.message}`)
    }

    return data as ActionPlan[]
  }
}

// Instância singleton do serviço
export const actionPlanService = new ActionPlanService()
