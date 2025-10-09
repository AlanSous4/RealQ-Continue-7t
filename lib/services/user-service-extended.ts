import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  // Obter a sessão atual
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Obter o perfil do usuário
  const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  if (error) {
    console.error("Erro ao obter perfil do usuário:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    user_type: data.user_type,
    profile_image: data.profile_image,
  }
}

// Atualizar o perfil do usuário atual
export async function updateCurrentUserProfile(profile: UserProfileUpdate): Promise<boolean> {
  const supabase = createClient()

  // Obter a sessão atual
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Usuário não autenticado")
  }

  // Atualizar o perfil do usuário
  const { error } = await supabase
    .from("users")
    .update({
      name: profile.name,
      phone: profile.phone,
      profile_image: profile.profile_image,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)

  if (error) {
    console.error("Erro ao atualizar perfil do usuário:", error)
    throw new Error("Não foi possível atualizar o perfil")
  }

  return true
}

// Listar todos os usuários
export async function listUsers(): Promise<UserProfile[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("users").select("*").order("name")

  if (error) {
    console.error("Erro ao listar usuários:", error)
    return []
  }

  return data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    user_type: user.user_type,
    profile_image: user.profile_image,
  }))
}

// Obter um usuário por ID
export async function getUserById(id: string): Promise<UserProfile | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("Erro ao obter usuário:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    user_type: data.user_type,
    profile_image: data.profile_image,
  }
}

// Atualizar um usuário por ID
export async function updateUser(id: string, profile: UserProfileUpdate): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("users")
    .update({
      name: profile.name,
      phone: profile.phone,
      profile_image: profile.profile_image,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erro ao atualizar usuário:", error)
    throw new Error("Não foi possível atualizar o usuário")
  }

  return true
}

// Excluir um usuário por ID
export async function deleteUser(id: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir usuário:", error)
    throw new Error("Não foi possível excluir o usuário")
  }

  return true
}

// Obter todos os usuários (função necessária para compatibilidade)
export async function getAllUsers(): Promise<UserProfile[]> {
  return listUsers()
}

// Obter a descrição de um tipo de usuário
export function getUserTypeDescription(userType: string): string {
  switch (userType) {
    case "quality-user":
      return "Profissional de Qualidade"
    case "admin-user":
      return "Administrador"
    case "manager-user":
      return "Gestor"
    case "viewer-user":
      return "Visualizador"
    default:
      return "Tipo desconhecido"
  }
}

// Obter as permissões de um tipo de usuário
export function getUserTypePermissions(userType: string): string[] {
  switch (userType) {
    case "admin-user":
      return ["read", "write", "delete", "admin"]
    case "manager-user":
      return ["read", "write", "delete"]
    case "quality-user":
      return ["read", "write"]
    case "viewer-user":
      return ["read"]
    default:
      return []
  }
}

// Tipo para o tipo de usuário
export interface UserType {
  id: string
  name: string
  description: string
  permissions: string[]
}

// Obter todos os tipos de usuários com descrições e permissões
export function getAllUserTypes(): UserType[] {
  const types = ["quality-user", "admin-user", "manager-user", "viewer-user"]

  return types.map((type) => ({
    id: type,
    name: type,
    description: getUserTypeDescription(type),
    permissions: getUserTypePermissions(type),
  }))
}
