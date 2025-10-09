import type { ReactNode } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { DebugSession } from "@/components/debug-session"

// Configuração temporária para permitir acesso sem autenticação
const BYPASS_AUTH = true // Defina como false para reativar a autenticação

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  let session = null

  if (!BYPASS_AUTH) {
    const supabase = createServerSupabaseClient()
    // Get session
    const sessionResult = await supabase.auth.getSession()
    session = sessionResult.data.session

    // Redirect if no session - comentado temporariamente
    // if (!session) {
    //   redirect("/login")
    // }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="hidden md:block" />
        <main className="flex-1 p-4 md:p-6 pb-16 md:pb-6">{children}</main>
      </div>
      <MobileNav className="md:hidden" />
      {session?.user && <DebugSession userId={session.user.id} />}
    </div>
  )
}
