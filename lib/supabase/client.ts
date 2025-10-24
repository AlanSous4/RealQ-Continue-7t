// /lib/supabase/client.ts

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// 🔹 Lê as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 🔹 Garante que as variáveis estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Variáveis de ambiente do Supabase não configuradas corretamente.")
}

// 🔹 Cria o cliente tipado com seu schema do banco
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 🔹 Compatibilidade retroativa com imports antigos
export const supabase = supabaseClient

// 🔹 Função auxiliar para obter o cliente
export function getSupabaseClient() {
  return supabaseClient
}

// 🔹 Export default para importação direta
export default supabaseClient

// 🔹 Export opcional da função createClient (caso use em outros lugares)
export { createClient }
