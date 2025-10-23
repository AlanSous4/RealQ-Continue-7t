import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Variáveis de ambiente do Supabase não configuradas corretamente.")
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
export const supabase = supabaseClient // ✅ compatível com imports antigos
export function getSupabaseClient() {
  return supabaseClient
}
export default supabaseClient
export { createClient } // ✅ opcional, se quiser importar direto
