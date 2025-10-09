import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

console.log("[Supabase] Initializing client with URL:", supabaseUrl)

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
    console.log("[Supabase] Client instance created")
  }
  return supabaseInstance
}

// Named export for compatibility
export function createClient() {
  return getSupabaseClient()
}

// Export the client instance with different names for backward compatibility
export const supabaseClient = getSupabaseClient()
export const supabase = getSupabaseClient()

// Default export
export default getSupabaseClient()
