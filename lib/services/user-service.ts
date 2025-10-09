import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"
import { supabaseClient } from "@/lib/supabase/client"

// Tipo para o usuário
export type User = Database["public"]["Tables"]["users"]["Row"]
export type UserInput = Omit<User, "id" | "created_at">
export type UserUpdate = Partial<UserInput>

export class UserService extends ApiService<User> {
  constructor() {
    super("users")
  }

  // Métodos específicos para usuários

  // Buscar usuário por email
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseClient.from(this.tableName).select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Usuário não encontrado
      }
      throw new Error(`Erro ao buscar usuário com email ${email}: ${error.message}`)
    }

    return data as User
  }

  // Buscar usuários por tipo
  async getByType(userType: string): Promise<User[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("user_type", userType)
      .order("name")

    if (error) {
      throw new Error(`Erro ao buscar usuários do tipo ${userType}: ${error.message}`)
    }

    return data as User[]
  }

  // Buscar usuário atual
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return null
    }

    return this.getByEmail(session.user.email!)
  }
}

// Instância singleton do serviço
export const userService = new UserService()
