"use client"

import type { ReactNode } from "react"
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
} from "lucide-react"

// Accordion para mobile
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const footerItems = [
    { title: "Qualidade", href: "/dashboard/qualidade", icon: ClipboardCheck },
    { title: "Inspeções", href: "/dashboard/inspecoes", icon: FileCheck },
    { title: "Ações", href: "/dashboard/acoes", icon: AlertTriangle },
    { title: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { title: "Menu", href: "#", icon: Menu },
  ]

  const FOOTER_HEIGHT = 80

  return (
    <div className="flex min-h-screen flex-col">
      {/* Conteúdo principal */}
      <div className="flex flex-1 w-full overflow-x-hidden">
        {/* Sidebar fixa md+ */}
        <DashboardSidebar className="hidden md:block flex-shrink-0" isMobile={false} />

        <main
          className="flex-1 p-4 md:p-6 max-w-full"
          style={{ paddingBottom: FOOTER_HEIGHT }}
        >
          {children}
        </main>
      </div>

      {/* Rodapé mobile fixo */}
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
                  className="flex flex-col items-center justify-center text-center px-1 w-[56px] sm:w-[64px] md:w-[72px]"
                >
                  <item.icon className="mb-1 w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="truncate text-xs">{item.title}</span>
                </Button>
              </Link>
            ) : (
              <Sheet key="menu">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center text-center px-1 w-[56px] sm:w-[64px] md:w-[72px]"
                  >
                    <Menu className="mb-1 w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="truncate text-xs">Menu</span>
                  </Button>
                </SheetTrigger>

                {/* ✅ Sem window: responsividade via Tailwind */}
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
