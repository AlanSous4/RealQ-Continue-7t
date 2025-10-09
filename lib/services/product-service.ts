import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"
import { supabaseClient } from "@/lib/supabase/client"

// Tipo para o produto
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInput = Omit<Product, "id" | "created_at">
export type ProductUpdate = Partial<ProductInput>

export class ProductService extends ApiService<Product> {
  constructor() {
    super("products")
  }

  // Métodos específicos para produtos

  // Buscar produtos por categoria
  async getByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select("*")
      .eq("category_id", categoryId)
      .order("name")

    if (error) {
      throw new Error(`Erro ao buscar produtos da categoria ${categoryId}: ${error.message}`)
    }

    return data as Product[]
  }

  // Buscar produtos com detalhes da categoria
  async getAllWithCategory(): Promise<(Product & { category: { name: string } })[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        category:categories(name)
      `)
      .order("name")

    if (error) {
      throw new Error(`Erro ao buscar produtos com categorias: ${error.message}`)
    }

    return data as (Product & { category: { name: string } })[]
  }

  // Buscar um produto com detalhes da categoria
  async getByIdWithCategory(id: string): Promise<(Product & { category: { name: string } }) | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
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
      throw new Error(`Erro ao buscar produto com ID ${id}: ${error.message}`)
    }

    return data as Product & { category: { name: string } }
  }
}

// Instância singleton do serviço
export const productService = new ProductService()
