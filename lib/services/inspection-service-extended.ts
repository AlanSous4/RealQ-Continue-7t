import { createClient } from "@/lib/supabase/client"
import { supabaseClient } from "@/lib/supabase/client"

// Função para completar uma inspeção
export async function completeInspection(inspectionId: string, data: any) {
  const supabase = createClient()

  // Atualizar a inspeção com os dados fornecidos
  const { error } = await supabase
    .from("inspections")
    .update({
      color: data.color,
      odor: data.odor,
      appearance: data.appearance,
      texture: data.texture,
      temperature: data.temperature,
      humidity: data.humidity,
      notes: data.notes,
      status:
        data.result === "approved"
          ? "Aprovado"
          : data.result === "approved_with_restrictions"
            ? "Aprovado com Restrições"
            : "Reprovado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", inspectionId)

  if (error) {
    throw new Error(`Erro ao atualizar inspeção: ${error.message}`)
  }

  return { success: true }
}

// Função para obter testes disponíveis
export async function getAvailableTests() {
  const supabase = createClient()

  const { data, error } = await supabase.from("tests").select("*").order("name")

  if (error) {
    throw new Error(`Erro ao buscar testes: ${error.message}`)
  }

  return data || []
}

// Função para adicionar testes a uma inspeção
export async function addTestsToInspection(inspectionId: string, tests: any[]) {
  const supabase = createClient()

  // Criar registros de testes para a inspeção
  const testRecords = tests.map((test) => ({
    inspection_id: inspectionId,
    test_id: test.testId,
    result: test.result,
    notes: test.notes,
    created_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("inspection_tests").insert(testRecords)

  if (error) {
    throw new Error(`Erro ao adicionar testes: ${error.message}`)
  }

  // Atualizar o status da inspeção se necessário
  await supabase
    .from("inspections")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", inspectionId)

  return { success: true }
}

// Função para registrar uma não conformidade
export async function registerNonConformity(inspectionId: string, data: any) {
  const supabase = createClient()

  // Criar registro de não conformidade
  const { data: ncData, error: ncError } = await supabase
    .from("non_conformities")
    .insert({
      inspection_id: inspectionId,
      description: data.description,
      severity: data.severity,
      category: data.category,
      impact: data.impact,
      status: "Aberta",
      created_at: new Date().toISOString(),
    })
    .select()

  if (ncError) {
    throw new Error(`Erro ao registrar não conformidade: ${ncError.message}`)
  }

  // Se for para criar um plano de ação
  if (data.createActionPlan && ncData && ncData.length > 0) {
    const { error: apError } = await supabase.from("action_plans").insert({
      non_conformity_id: ncData[0].id,
      description: data.actionPlanDescription,
      status: "Pendente",
      due_date: data.actionPlanDueDate,
      responsible: data.actionPlanResponsible,
      created_at: new Date().toISOString(),
    })

    if (apError) {
      throw new Error(`Erro ao criar plano de ação: ${apError.message}`)
    }
  }

  return { success: true }
}

// Função para criar um produto (manter a exportação existente)
export async function createProduct(data: {
  name: string
  description?: string
  category_id: string
}) {
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
      console.error("Erro ao criar produto:", error)
      throw error
    }

    return product
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    throw error
  }
}

// Função para obter todas as categorias (manter a exportação existente)
export async function getCategories() {
  try {
    const { data, error } = await supabaseClient.from("categories").select("*").order("name")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Erro ao obter categorias:", error)
    throw error
  }
}

// Função para criar uma categoria (manter a exportação existente)
export async function createCategory(name: string) {
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
