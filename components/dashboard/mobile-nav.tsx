"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, ClipboardCheck, FileCheck, AlertTriangle } from "lucide-react"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Qualidade",
      href: "/dashboard/qualidade",
      icon: ClipboardCheck,
    },
    {
      title: "Inspeções",
      href: "/dashboard/inspecoes",
      icon: FileCheck,
    },
    {
      title: "Ações",
      href: "/dashboard/acoes",
      icon: AlertTriangle,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
  ]

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 border-t bg-background z-10", className)}>
      <nav className="flex items-center justify-around">
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-3 text-xs font-medium",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
