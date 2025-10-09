import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"

// Tipo para o fornecedor
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"]
export type SupplierInput = Omit<Supplier, "id" | "created_at">
export type SupplierUpdate = Partial<SupplierInput>

export class SupplierService extends ApiService<Supplier> {
  constructor() {
    super("suppliers")
  }
}

// Instância singleton do serviço
export const supplierService = new SupplierService()
