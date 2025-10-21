import  supabaseClient  from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type UserRow = Database["public"]["Tables"]["users"]["Row"]

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  user_type?: string
  profile_image?: string
}

export interface UserProfileUpdate {
  name: string
  phone?: string
  profile_image?: string
}

// Obter o usuário atual
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = supabaseClient

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (error) {
    console.error("Erro ao obter perfil do usuário:", error)
    return null
  }

  return data
}

// Atualizar perfil do usuário atual
export async function updateCurrentUserProfile(profile: UserProfileUpdate): Promise<boolean> {
  const supabase = supabaseClient
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Usuário não autenticado")

  const { error } = await supabase
    .from("users")
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq("id", session.user.id)

  if (error) throw error
  return true
}

// Listar todos os usuários
export async function listUsers(): Promise<UserProfile[]> {
  const supabase = supabaseClient
  const { data, error } = await supabase.from("users").select("*").order("name")

  if (error) {
    console.error("Erro ao listar usuários:", error)
    return []
  }

  return data
}

// Atualizar usuário por ID
export async function updateUser(id: string, profile: UserProfileUpdate): Promise<boolean> {
  const supabase = supabaseClient
  const { error } = await supabase
    .from("users")
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
  return true
}

// Excluir usuário por ID
export async function deleteUser(id: string): Promise<boolean> {
  const supabase = supabaseClient
  const { error } = await supabase.from("users").delete().eq("id", id)
  if (error) throw error
  return true
}

// Obter usuário por ID
export async function getUserById(id: string): Promise<UserProfile | null> {
  const supabase = supabaseClient
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
  if (error) return null
  return data
}

// Obter todos os usuários (compatibilidade)
export async function getAllUsers(): Promise<UserProfile[]> {
  return listUsers()
}

// Funções de tipos de usuário
export function getUserTypeDescription(userType: string): string {
  switch (userType) {
    case "quality-user": return "Profissional de Qualidade"
    case "admin-user": return "Administrador"
    case "manager-user": return "Gestor"
    case "viewer-user": return "Visualizador"
    default: return "Tipo desconhecido"
  }
}

export function getUserTypePermissions(userType: string): string[] {
  switch (userType) {
    case "admin-user": return ["read", "write", "delete", "admin"]
    case "manager-user": return ["read", "write", "delete"]
    case "quality-user": return ["read", "write"]
    case "viewer-user": return ["read"]
    default: return []
  }
}

export interface UserType {
  id: string
  name: string
  description: string
  permissions: string[]
}

export function getAllUserTypes(): UserType[] {
  const types = ["quality-user", "admin-user", "manager-user", "viewer-user"]
  return types.map((type) => ({
    id: type,
    name: type,
    description: getUserTypeDescription(type),
    permissions: getUserTypePermissions(type),
  }))
}
