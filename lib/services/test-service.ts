// /lib/services/test-service.ts

import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

// 🔹 Tipo derivado automaticamente do schema
export type Test = Database["public"]["Tables"]["tests"]["Row"]

// ========================================================
// 🔹 Buscar todos os testes
// ========================================================
export async function getAllTests(): Promise<Test[]> {
  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .order("name")

  if (error) {
    console.error("Erro ao buscar testes:", error)
    throw error
  }

  return data ?? []
}

// ========================================================
// 🔹 Buscar teste por ID
// ========================================================
export async function getTestById(id: string): Promise<Test | null> {
  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // Registro não encontrado
      return null
    }
    console.error(`Erro ao buscar teste com ID ${id}:`, error)
    throw error
  }

  return data
}

// ========================================================
// 🔹 Criar novo teste
// ========================================================
export async function createTest(data: { name: string; description?: string }): Promise<Test> {
  const { data: inserted, error } = await supabase
    .from("tests")
    .insert({
      name: data.name,
      description: data.description ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar teste:", error)
    throw error
  }

  if (!inserted) throw new Error("Nenhum registro retornado ao criar teste.")

  return inserted
}

// ========================================================
// 🔹 Atualizar teste existente
// ========================================================
export async function updateTest(
  id: string,
  data: { name?: string; description?: string }
): Promise<Test> {
  const { data: updated, error } = await supabase
    .from("tests")
    .update({
      name: data.name,
      description: data.description ?? null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao atualizar teste com ID ${id}:`, error)
    throw error
  }

  if (!updated) throw new Error(`Nenhum teste encontrado com ID ${id}.`)

  return updated
}

// ========================================================
// 🔹 Excluir teste
// ========================================================
export async function deleteTest(id: string): Promise<void> {
  const { error } = await supabase
    .from("tests")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(`Erro ao excluir teste com ID ${id}:`, error)
    throw error
  }
}
