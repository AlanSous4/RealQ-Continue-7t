import { supabaseClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

// Tipos genéricos para as operações CRUD
export type Entity<T> = T
export type EntityInput<T> = Omit<T, "id" | "created_at">
export type EntityUpdate<T> = Partial<EntityInput<T>>

// Classe base para serviços de API
export class ApiService<T extends { id: string }> {
  protected tableName: keyof Database["public"]["Tables"]

  constructor(tableName: keyof Database["public"]["Tables"]) {
    this.tableName = tableName
  }

  // Obter todos os registros
  async getAll(): Promise<T[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar ${this.tableName}: ${error.message}`)
    }

    return data as T[]
  }

  // Obter um registro pelo ID
  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabaseClient.from(this.tableName).select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Registro não encontrado
      }
      throw new Error(`Erro ao buscar ${this.tableName} com ID ${id}: ${error.message}`)
    }

    return data as T
  }

  // Criar um novo registro
  async create(input: EntityInput<T>): Promise<T> {
    const { data, error } = await supabaseClient.from(this.tableName).insert(input).select().single()

    if (error) {
      throw new Error(`Erro ao criar ${this.tableName}: ${error.message}`)
    }

    return data as T
  }

  // Atualizar um registro existente
  async update(id: string, input: EntityUpdate<T>): Promise<T> {
    const { data, error } = await supabaseClient.from(this.tableName).update(input).eq("id", id).select().single()

    if (error) {
      throw new Error(`Erro ao atualizar ${this.tableName} com ID ${id}: ${error.message}`)
    }

    return data as T
  }

  // Excluir um registro
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient.from(this.tableName).delete().eq("id", id)

    if (error) {
      throw new Error(`Erro ao excluir ${this.tableName} com ID ${id}: ${error.message}`)
    }
  }

  // Buscar registros com filtro
  async search(column: string, query: string): Promise<T[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .ilike(column, `%${query}%`)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar ${this.tableName} com filtro: ${error.message}`)
    }

    return data as T[]
  }
}
