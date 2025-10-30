"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  ClipboardCheck,
  FileCheck,
  AlertTriangle,
  Menu,
  Bell,
  UserCircle,
  Sun,
  Moon,
  TrendingUp,
  Lightbulb,
  DollarSign,
  Clock,
  Eye,
} from "lucide-react"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase/client"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // 🔹 Protege a rota e mantém o usuário sincronizado
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Erro ao obter sessão:", error)
        return
      }

      if (!session) {
        // 🔸 Redireciona se não estiver logado
        window.location.href = "/login"
        return
      }

      // 🔹 Define o email do usuário logado
      setUserEmail(session.user?.email ?? null)

      // 🔹 Mantém o estado sincronizado com mudanças de login/logout
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUserEmail(session.user.email ?? null)
          } else {
            window.location.href = "/login"
          }
        }
      )

      return () => {
        listener.subscription.unsubscribe()
      }
    }

    checkUser()
  }, [])

  const footerItems = [
    { title: "Qualidade", href: "/dashboard/qualidade", icon: ClipboardCheck },
    { title: "Inspeções", href: "/dashboard/inspecoes", icon: FileCheck },
    { title: "Ações", href: "/dashboard/acoes", icon: AlertTriangle },
    { title: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { title: "Menu", href: "#", icon: Menu },
  ]

  const FOOTER_HEIGHT = 80

  const notifications = [
    {
      icon: TrendingUp,
      title: "Meta alcançada",
      description: "Você atingiu 75% da sua meta de aposentadoria.",
    },
    {
      icon: Lightbulb,
      title: "Nova recomendação disponível",
      description: "Temos uma sugestão de investimento para você.",
    },
    {
      icon: DollarSign,
      title: "Despesa acima do esperado",
      description: "Seus gastos este mês estão 15% acima da média.",
    },
    {
      icon: Clock,
      title: "Lembrete de contribuição",
      description: "Não esqueça de fazer sua contribuição mensal.",
    },
    {
      icon: Eye,
      title: "Análise 360° atualizada",
      description: "Ver todas as notificações.",
      highlight: true,
    },
  ]

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 🔹 Topbar Desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b bg-background sticky top-0 z-50">
        <h1 className="text-lg font-semibold tracking-tight">Painel de Controle</h1>

        <div className="flex items-center gap-4">
          {/* Botão de tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Alternar tema"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* 🔔 Notificações */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notificações">
                <Bell className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                {notifications.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-2 rounded-lg ${
                      item.highlight
                        ? "bg-muted font-semibold"
                        : "hover:bg-muted/60"
                    }`}
                  >
                    <item.icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* 👤 Usuário logado */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {userEmail ?? "Carregando..."}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <p className="text-sm font-medium mb-2">{userEmail}</p>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* 🔹 Conteúdo principal */}
      <div className="flex flex-1 w-full overflow-x-hidden">
        <DashboardSidebar
          className="hidden md:block flex-shrink-0"
          isMobile={false}
        />
        <main
          className="flex-1 p-4 md:p-6 max-w-full"
          style={{ paddingBottom: FOOTER_HEIGHT }}
        >
          {children}
        </main>
      </div>

      {/* 🔹 Rodapé mobile fixo */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t bg-background z-50 md:hidden"
        style={{ height: FOOTER_HEIGHT }}
      >
        <nav className="flex items-center justify-between h-full px-1">
          {footerItems.map((item) =>
            item.title !== "Menu" ? (
              <Link key={item.title} href={item.href}>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center text-center px-1 w-[56px] sm:w-[64px]"
                >
                  <item.icon className="mb-1 w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="truncate text-xs">{item.title}</span>
                </Button>
              </Link>
            ) : (
              <Sheet key="menu" open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center text-center px-1 w-[56px] sm:w-[64px]"
                  >
                    <Menu className="mb-1 w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="truncate text-xs">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="pr-0 animate-slide-in-left w-[80vw] max-w-[280px]"
                >
                  <DashboardSidebar isMobile={true} />
                </SheetContent>
              </Sheet>
            )
          )}
        </nav>
      </div>
    </div>
  )
}
