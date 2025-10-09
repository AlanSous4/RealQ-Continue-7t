import { supabaseClient } from "@/lib/supabase/client"

// Tipo para o produto com categoria
export interface ProductWithCategory {
  id: string
  name: string
  description: string
  category_id: string
  created_at: string
  category: {
    name: string
  }
}

// Função para obter todos os produtos com suas categorias
export async function getAllProducts(): Promise<ProductWithCategory[]> {
  try {
    const { data, error } = await supabaseClient
      .from("products")
      .select(`
        *,
        category:categories(name)
      `)
      .order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    throw error
  }
}

// Função para obter um produto específico por ID
export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  try {
    const { data, error } = await supabaseClient
      .from("products")
      .select(`
        *,
        category:categories(name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Produto não encontrado
      }
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error)
    throw error
  }
}

// Função para criar um produto
export async function createProduct(data: {
  name: string
  description?: string
  category_id: string
}): Promise<any> {
  try {
    const { data: product, error } = await supabaseClient
      .from("products")
      .insert({
        name: data.name,
        description: data.description || "",
        category_id: data.category_id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return product
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    throw error
  }
}

// Função para atualizar um produto
export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    category_id?: string
  },
): Promise<any> {
  try {
    const { data: product, error } = await supabaseClient
      .from("products")
      .update({
        name: data.name,
        description: data.description,
        category_id: data.category_id,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return product
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${id}:`, error)
    throw error
  }
}

// Função para excluir um produto
export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabaseClient.from("products").delete().eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error(`Erro ao excluir produto com ID ${id}:`, error)
    throw error
  }
}
