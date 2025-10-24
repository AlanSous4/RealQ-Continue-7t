// user-service-extended.ts
import supabaseClient from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

// Tipos derivados da tabela "users"
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  user_type?: string;
  profile_image?: string;
}

export interface UserProfileUpdate {
  name: string;
  phone?: string;
  profile_image?: string;
}

// Função auxiliar para padronizar mensagens de erro
function handleError(message: string, error?: any): void {
  console.error(`${message}${error ? `: ${error.message}` : ""}`);
}

// ✅ Obter o usuário atual
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = supabaseClient;
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData?.session) {
    handleError("Erro ao obter a sessão do usuário", sessionError);
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", sessionData.session.user.id)
    .single();

  if (error) {
    handleError("Erro ao obter o perfil do usuário", error);
    return null;
  }

  return mapUserRowToUserProfile(data);
}

// Atualizar perfil do usuário atual
export async function updateCurrentUserProfile(profile: UserProfileUpdate): Promise<boolean> {
  const supabase = supabaseClient;
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData?.session) {
    throw new Error("Usuário não autenticado.");
  }

  // Garantir que o objeto updates seja do tipo UserUpdate
  const updates: UserUpdate = {
    name: profile.name,
    phone: profile.phone,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", sessionData.session.user.id);

  if (error) {
    handleError("Erro ao atualizar o perfil do usuário", error);
    throw error;
  }

  return true;
}

// ✅ Listar todos os usuários
export async function listUsers(): Promise<UserProfile[]> {
  const supabase = supabaseClient;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name");

  if (error) {
    handleError("Erro ao listar os usuários", error);
    return [];
  }

  return data.map(mapUserRowToUserProfile);
}

// ✅ Atualizar usuário por ID
export async function updateUser(id: string, profile: Partial<UserUpdate>): Promise<boolean> {
  if (!id) throw new Error("ID do usuário é obrigatório.");
  if (!profile || Object.keys(profile).length === 0) {
    throw new Error("O objeto de perfil não pode estar vazio.");
  }

  const supabase = supabaseClient;
  const updates: Partial<UserUpdate> = {
    ...profile,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar o usuário:", error.message);
    throw new Error(`Erro ao atualizar o usuário: ${error.message}`);
  }

  return true;
}
// ✅ Excluir usuário por ID com validação
export async function deleteUser(id: string): Promise<boolean> {
  if (!id) throw new Error("ID do usuário é obrigatório.");

  const supabase = supabaseClient;
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    handleError("Erro ao excluir o usuário", error);
    throw error;
  }

  return true;
}

// ✅ Obter usuário por ID
export async function getUserById(id: string): Promise<UserProfile | null> {
  if (!id) throw new Error("ID do usuário é obrigatório.");

  const supabase = supabaseClient;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    handleError("Erro ao obter o usuário por ID", error);
    return null;
  }

  return mapUserRowToUserProfile(data);
}

// ✅ Alias para compatibilidade
export async function getAllUsers(): Promise<UserProfile[]> {
  return listUsers();
}

// ✅ Funções de tipos de usuário
export function getUserTypeDescription(userType: string): string {
  switch (userType) {
    case "quality-user":
      return "Profissional de Qualidade";
    case "admin-user":
      return "Administrador";
    case "manager-user":
      return "Gestor";
    case "viewer-user":
      return "Visualizador";
    default:
      return "Tipo desconhecido";
  }
}

export function getUserTypePermissions(userType: string): string[] {
  switch (userType) {
    case "admin-user":
      return ["read", "write", "delete", "admin"];
    case "manager-user":
      return ["read", "write", "delete"];
    case "quality-user":
      return ["read", "write"];
    case "viewer-user":
      return ["read"];
    default:
      return [];
  }
}

export interface UserType {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export function getAllUserTypes(): UserType[] {
  const types = ["quality-user", "admin-user", "manager-user", "viewer-user"];
  return types.map((type) => ({
    id: type,
    name: type,
    description: getUserTypeDescription(type),
    permissions: getUserTypePermissions(type),
  }));
}

// ✅ Função auxiliar para mapear UserRow para UserProfile
function mapUserRowToUserProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    user_type: row.user_type || undefined,
    
  };
}