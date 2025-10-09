import { supabaseClient } from "@/lib/supabase/client"

// Tipo para as configurações
export interface Settings {
  id?: string
  company_name: string
  company_logo?: string
  email_notifications: boolean
  default_user_type: string
  created_at?: string
  updated_at?: string
}

// Função para obter as configurações
export async function getSettings(): Promise<Settings | null> {
  try {
    // Verificar se a tabela settings existe
    const { error: tableCheckError } = await supabaseClient.from("settings").select("id").limit(1)

    if (tableCheckError) {
      if (tableCheckError.code === "42P01") {
        console.log("Tabela settings não existe. Retornando configurações padrão.")
        return {
          company_name: "RealQ",
          company_logo: "",
          email_notifications: true,
          default_user_type: "quality-user",
        }
      }
      throw tableCheckError
    }

    // Buscar as configurações
    const { data, error } = await supabaseClient
      .from("settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Nenhuma configuração encontrada, criar uma padrão
        const defaultSettings = {
          company_name: "RealQ",
          company_logo: "",
          email_notifications: true,
          default_user_type: "quality-user",
        }

        const { data: newSettings, error: createError } = await supabaseClient
          .from("settings")
          .insert(defaultSettings)
          .select()
          .single()

        if (createError) {
          throw createError
        }

        return newSettings
      }
      throw error
    }

    return data
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    // Retornar configurações padrão em caso de erro
    return {
      company_name: "RealQ",
      company_logo: "",
      email_notifications: true,
      default_user_type: "quality-user",
    }
  }
}

// Função para atualizar as configurações
export async function updateSettings(settings: Settings): Promise<Settings> {
  try {
    // Verificar se a tabela settings existe
    const { error: tableCheckError } = await supabaseClient.from("settings").select("id").limit(1)

    if (tableCheckError) {
      if (tableCheckError.code === "42P01") {
        console.log("Tabela settings não existe. Criando tabela...")
        // Aqui você poderia criar a tabela via SQL, mas vamos assumir que ela já existe
        throw new Error("Tabela settings não existe. Por favor, execute a migração do banco de dados.")
      }
      throw tableCheckError
    }

    // Buscar as configurações existentes
    const { data: existingSettings, error: fetchError } = await supabaseClient
      .from("settings")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    let result

    if (existingSettings) {
      // Atualizar as configurações existentes
      const { data, error } = await supabaseClient
        .from("settings")
        .update({
          company_name: settings.company_name,
          company_logo: settings.company_logo,
          email_notifications: settings.email_notifications,
          default_user_type: settings.default_user_type,
        })
        .eq("id", existingSettings.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      result = data
    } else {
      // Criar novas configurações
      const { data, error } = await supabaseClient
        .from("settings")
        .insert({
          company_name: settings.company_name,
          company_logo: settings.company_logo,
          email_notifications: settings.email_notifications,
          default_user_type: settings.default_user_type,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      result = data
    }

    return result
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    throw error
  }
}
