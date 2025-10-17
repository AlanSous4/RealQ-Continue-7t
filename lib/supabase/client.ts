import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.")
}

console.log("[Supabase] Initializing client with URL:", supabaseUrl)

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export function getSupabaseClient() {
  return supabase
}

export { supabase }
