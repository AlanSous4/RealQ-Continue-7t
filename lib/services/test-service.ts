import { supabaseClient } from "@/lib/supabase/client"

// Tipo para o teste
export interface Test {
  id: string
  name: string
  description: string
  created_at: string
}

// Função para obter todos os testes
export async function getAllTests(): Promise<Test[]> {
  try {
    const { data, error } = await supabaseClient.from("tests").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar testes:", error)
    throw error
  }
}

// Função para obter um teste específico por ID
export async function getTestById(id: string): Promise<Test | null> {
  try {
    const { data, error } = await supabaseClient.from("tests").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Teste não encontrado
      }
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar teste com ID ${id}:`, error)
    throw error
  }
}

// Função para criar um teste
export async function createTest(data: { name: string; description?: string }): Promise<Test> {
  try {
    const { data: test, error } = await supabaseClient
      .from("tests")
      .insert({
        name: data.name,
        description: data.description || "",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return test
  } catch (error) {
    console.error("Erro ao criar teste:", error)
    throw error
  }
}

// Função para atualizar um teste
export async function updateTest(id: string, data: { name?: string; description?: string }): Promise<Test> {
  try {
    const { data: test, error } = await supabaseClient
      .from("tests")
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

    return test
  } catch (error) {
    console.error(`Erro ao atualizar teste com ID ${id}:`, error)
    throw error
  }
}

// Função para excluir um teste
export async function deleteTest(id: string): Promise<void> {
  try {
    const { error } = await supabaseClient.from("tests").delete().eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error(`Erro ao excluir teste com ID ${id}:`, error)
    throw error
  }
}
