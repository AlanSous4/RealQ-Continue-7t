import { supabaseClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

// Tipo oficial vindo do Supabase
export type Category = Database["public"]["Tables"]["categories"]["Row"]

// Tipo usado para o JOIN com contagem
interface CategoryWithJoinedProducts extends Category {
  products?: { count: number }[] | null
}

// --------------------------------------------------
// Buscar todas as categorias
// --------------------------------------------------
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .select("*")
      .order("name")

    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    throw error
  }
}

// --------------------------------------------------
// Buscar categoria por ID
// --------------------------------------------------
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null
      throw error
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar categoria com ID ${id}:`, error)
    throw error
  }
}

// --------------------------------------------------
// Criar categoria (corrigido + tipado)
// --------------------------------------------------
export async function createCategory(name: string): Promise<Category> {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .insert({ name }) // ← types agora corretos
      .select("*")
      .single() // melhor que maybeSingle aqui

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    throw error
  }
}

// --------------------------------------------------
// Atualizar categoria (corrigido + tipado)
// --------------------------------------------------
export async function updateCategory(id: string, name: string): Promise<Category> {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .update({ name }) // ← types agora corretos
      .eq("id", id)
      .select("*")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`Erro ao atualizar categoria com ID ${id}:`, error)
    throw error
  }
}

// --------------------------------------------------
// Excluir categoria
// --------------------------------------------------
export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabaseClient
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error(`Erro ao excluir categoria com ID ${id}:`, error)
    throw error
  }
}

// --------------------------------------------------
// Categorias com contagem de produtos
// --------------------------------------------------
export async function getCategoriesWithProductCount(): Promise<
  (Category & { product_count: number })[]
> {
  try {
    const { data, error } = await supabaseClient
      .from("categories")
      .select(`
        *,
        products:products(count)
      `)
      .order("name")

    if (error) throw error

    const safeData = (data ?? []) as CategoryWithJoinedProducts[]

    return safeData.map((category) => ({
      ...category,
      product_count: category.products?.[0]?.count ?? 0,
    }))
  } catch (error) {
    console.error("Erro ao buscar categorias com contagem:", error)
    throw error
  }
}
