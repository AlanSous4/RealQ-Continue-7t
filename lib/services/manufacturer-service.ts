import { ApiService } from "./api"
import type { Database } from "@/lib/database.types"

// Tipo para o fabricante
export type Manufacturer = Database["public"]["Tables"]["manufacturers"]["Row"]
export type ManufacturerInput = Omit<Manufacturer, "id" | "created_at">
export type ManufacturerUpdate = Partial<ManufacturerInput>

export class ManufacturerService extends ApiService<Manufacturer> {
  constructor() {
    super("manufacturers")
  }
}

// Instância singleton do serviço
export const manufacturerService = new ManufacturerService()
