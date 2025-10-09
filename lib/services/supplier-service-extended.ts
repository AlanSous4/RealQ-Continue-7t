import { supabaseClient } from "@/lib/supabase/client"

// Tipo para o fornecedor (revendedor)
export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  created_at: string
}

// Função para obter todos os fornecedores
export async function getAllSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabaseClient.from("suppliers").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error)
    throw error
  }
}

// Função para obter um fornecedor específico por ID
export async function getSupplierById(id: string): Promise<Supplier | null> {
  try {
    const { data, error } = await supabaseClient.from("suppliers").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Fornecedor não encontrado
      }
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar fornecedor com ID ${id}:`, error)
    throw error
  }
}

// Função para criar um fornecedor
export async function createSupplier(data: {
  name: string
  contact?: string
  email?: string
  phone?: string
}): Promise<Supplier> {
  try {
    const { data: supplier, error } = await supabaseClient
      .from("suppliers")
      .insert({
        name: data.name,
        contact: data.contact || "",
        email: data.email || "",
        phone: data.phone || "",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return supplier
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error)
    throw error
  }
}

// Função para atualizar um fornecedor
export async function updateSupplier(
  id: string,
  data: {
    name?: string
    contact?: string
    email?: string
    phone?: string
  },
): Promise<Supplier> {
  try {
    const { data: supplier, error } = await supabaseClient
      .from("suppliers")
      .update({
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return supplier
  } catch (error) {
    console.error(`Erro ao atualizar fornecedor com ID ${id}:`, error)
    throw error
  }
}

// Função para excluir um fornecedor
export async function deleteSupplier(id: string): Promise<void> {
  try {
    const { error } = await supabaseClient.from("suppliers").delete().eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error(`Erro ao excluir fornecedor com ID ${id}:`, error)
    throw error
  }
}
