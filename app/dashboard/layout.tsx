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
import { useEffect, useState } from "react"

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
  const [buttonSize, setButtonSize] = useState(64)
  const [iconSize, setIconSize] = useState(24)

  useEffect(() => {
    const updateSizes = () => {
      const screenWidth = window.innerWidth
      const maxButtonWidth = screenWidth / footerItems.length - 8
      const newButtonSize = Math.max(56, Math.min(maxButtonWidth, 80))
      const newIconSize = Math.max(20, Math.min(32, newButtonSize * 0.35))
      setButtonSize(newButtonSize)
      setIconSize(newIconSize)
    }
    updateSizes()
    window.addEventListener("resize", updateSizes)
    return () => window.removeEventListener("resize", updateSizes)
  }, [footerItems.length])

  // Accordion sections (mobile only)
  const navSections = [
    {
      title: "Principal",
      items: [
        { title: "Qualidade", href: "/dashboard/qualidade", icon: ClipboardCheck },
        { title: "Inspeções", href: "/dashboard/inspecoes", icon: FileCheck },
        { title: "Ações", href: "/dashboard/acoes", icon: AlertTriangle },
        { title: "Dashboard", href: "/dashboard", icon: BarChart3 },
      ],
    },
    {
      title: "Gerenciamento",
      items: [
        { title: "Produtos", href: "/dashboard/produtos", icon: BarChart3 },
        { title: "Categorias", href: "/dashboard/categorias", icon: BarChart3 },
      ],
    },
    {
      title: "Sistema",
      items: [
        { title: "Usuários", href: "/dashboard/usuarios", icon: BarChart3 },
        { title: "Configurações", href: "/dashboard/configuracoes", icon: BarChart3 },
      ],
    },
  ]

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
                  className="flex flex-col items-center justify-center text-center px-1"
                  style={{ width: buttonSize }}
                >
                  <item.icon
                    className="mb-1"
                    style={{ width: iconSize, height: iconSize }}
                  />
                  <span
                    className="truncate text-xs"
                    style={{ fontSize: iconSize * 0.45 }}
                  >
                    {item.title}
                  </span>
                </Button>
              </Link>
            ) : (
              <Sheet key="menu">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center justify-center text-center px-1"
                    style={{ width: buttonSize }}
                  >
                    <Menu
                      className="mb-1"
                      style={{ width: iconSize, height: iconSize }}
                    />
                    <span
                      className="truncate text-xs"
                      style={{ fontSize: iconSize * 0.45 }}
                    >
                      Menu
                    </span>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="pr-0 animate-slide-in-left"
                  style={{ width: Math.min(280, window.innerWidth * 0.8) }}
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
