import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"
import { supabaseClient } from "@/lib/supabase/client"

// Tipo para a categoria
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type CategoryInput = Omit<Category, "id" | "created_at">
export type CategoryUpdate = Partial<CategoryInput>

export class CategoryService extends ApiService<Category> {
  constructor() {
    super("categories")
  }

  // Buscar uma categoria pelo ID
  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      // Código padrão do Supabase para "registro não encontrado"
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Erro ao buscar categoria por ID: ${error.message}`)
    }

    return data
  }

  // Buscar categorias com contagem de produtos
  async getAllWithProductCount(): Promise<(Category & { product_count: number })[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        id,
        name,
        created_at,
        products:products(count)
      `)
      .order("name")

    if (error) {
      throw new Error(`Erro ao buscar categorias com contagem: ${error.message}`)
    }

    // Tipagem segura para evitar erro "never"
    type CategoryWithJoinedProducts = Category & {
      products?: { count: number }[] | null
    }

    const safeData = (data ?? []) as CategoryWithJoinedProducts[]

    return safeData.map((category) => ({
      ...category,
      product_count: category.products?.[0]?.count ?? 0,
    }))
  }
}

// Instância singleton do serviço
export const categoryService = new CategoryService()
