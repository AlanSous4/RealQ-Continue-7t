import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"


// 🔒 Garantindo que variáveis de ambiente existem
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Variáveis de ambiente do Supabase não configuradas corretamente.")
}

// ✅ Uma única instância do cliente
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ✅ Compatibilidade com código legado
export function getSupabaseClient() {
  return supabaseClient
}

// ✅ Permitir importação direta
export default supabaseClient
