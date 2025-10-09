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

  // Métodos específicos para categorias

  // Buscar categorias com contagem de produtos
  async getAllWithProductCount(): Promise<(Category & { product_count: number })[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        products:products(count)
      `)
      .order("name")

    if (error) {
      throw new Error(`Erro ao buscar categorias com contagem: ${error.message}`)
    }

    // Transformar o resultado para incluir a contagem de produtos
    return data.map((category) => ({
      ...category,
      product_count: category.products?.[0]?.count || 0,
    })) as (Category & { product_count: number })[]
  }
}

// Instância singleton do serviço
export const categoryService = new CategoryService()
