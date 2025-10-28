import type { ReactNode } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { DebugSession } from "@/components/debug-session"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// Configuração temporária para permitir acesso sem autenticação
const BYPASS_AUTH = true

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  let session = null

  if (!BYPASS_AUTH) {
    const supabase = createServerSupabaseClient()
    const sessionResult = await supabase.auth.getSession()
    session = sessionResult.data.session
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Conteúdo principal */}
      <div className="flex flex-1">
        {/* Sidebar visível em md+ */}
        <DashboardSidebar className="hidden md:block" />
        <main className="flex-1 p-4 md:p-6 pb-16 md:pb-6">{children}</main>
      </div>

      {/* Mobile nav do dashboard */}
      <MobileNav className="md:hidden" />
      
      {/* Debug session, se existir */}
      {session?.user && <DebugSession userId={session.user.id} />}
    </div>
  )
}
