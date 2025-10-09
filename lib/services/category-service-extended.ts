import { supabaseClient } from "@/lib/supabase/client"

// Tipo para a categoria
export interface Category {
  id: string
  name: string
  created_at: string
}

// Função para obter todas as categorias
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabaseClient.from("categories").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    throw error
  }
}

// Função para obter uma categoria específica por ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabaseClient.from("categories").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Categoria não encontrada
      }
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar categoria com ID ${id}:`, error)
    throw error
  }
}

// Função para criar uma categoria
export async function createCategory(name: string): Promise<Category> {
  try {
    const { data, error } = await supabaseClient.from("categories").insert({ name }).select().single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    throw error
  }
}

// Função para atualizar uma categoria
export async function updateCategory(id: string, name: string): Promise<Category> {
  try {
    const { data, error } = await supabaseClient.from("categories").update({ name }).eq("id", id).select().single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao atualizar categoria com ID ${id}:`, error)
    throw error
  }
}

// Função para excluir uma categoria
export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabaseClient.from("categories").delete().eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error(`Erro ao excluir categoria com ID ${id}:`, error)
    throw error
  }
}

// Função para obter categorias com contagem de produtos
export async function getCategoriesWithProductCount(): Promise<(Category & { product_count: number })[]> {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .select(`
        *,
        products:products(count)
      `)
      .order("name")

    if (error) {
      throw error
    }

    // Transformar o resultado para incluir a contagem de produtos
    return data.map((category) => ({
      ...category,
      product_count: category.products?.[0]?.count || 0,
    })) as (Category & { product_count: number })[]
  } catch (error) {
    console.error("Erro ao buscar categorias com contagem:", error)
    throw error
  }
}
