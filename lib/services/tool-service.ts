import { supabaseClient } from "@/lib/supabase/client"

// Tipo para a ferramenta
export interface Tool {
  id: string
  name: string
  description: string
  created_at: string
}

// Função para obter todas as ferramentas
export async function getAllTools(): Promise<Tool[]> {
  try {
    const { data, error } = await supabaseClient.from("tools").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar ferramentas:", error)
    throw error
  }
}

// Função para obter uma ferramenta específica por ID
export async function getToolById(id: string): Promise<Tool | null> {
  try {
    const { data, error } = await supabaseClient.from("tools").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Ferramenta não encontrada
      }
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar ferramenta com ID ${id}:`, error)
    throw error
  }
}

// Função para criar uma ferramenta
export async function createTool(data: { name: string; description?: string }): Promise<Tool> {
  try {
    const { data: tool, error } = await supabaseClient
      .from("tools")
      .insert({
        name: data.name,
        description: data.description || "",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return tool
  } catch (error) {
    console.error("Erro ao criar ferramenta:", error)
    throw error
  }
}

// Função para atualizar uma ferramenta
export async function updateTool(id: string, data: { name?: string; description?: string }): Promise<Tool> {
  try {
    const { data: tool, error } = await supabaseClient
      .from("tools")
      .update({
        name: data.name,
        description: data.description,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return tool
  } catch (error) {
    console.error(`Erro ao atualizar ferramenta com ID ${id}:`, error)
    throw error
  }
}

// Função para excluir uma ferramenta
export async function deleteTool(id: string): Promise<void> {
  try {
    const { error } = await supabaseClient.from("tools").delete().eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error(`Erro ao excluir ferramenta com ID ${id}:`, error)
    throw error
  }
}
