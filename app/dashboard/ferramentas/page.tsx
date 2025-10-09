"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  WhiteCard,
  WhiteCardContent,
  WhiteCardDescription,
  WhiteCardHeader,
  WhiteCardTitle,
} from "@/components/ui/white-card"
import { Input } from "@/components/ui/input"
import { ToolList } from "@/components/dashboard/tool-list"

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ferramentas</h2>
          <p className="text-muted-foreground">Gerencie as ferramentas utilizadas nas inspeções</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/ferramentas/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Ferramenta
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline">Filtrar</Button>
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      <WhiteCard>
        <WhiteCardHeader>
          <WhiteCardTitle>Todas as Ferramentas</WhiteCardTitle>
          <WhiteCardDescription>Lista de todas as ferramentas cadastradas no sistema</WhiteCardDescription>
        </WhiteCardHeader>
        <WhiteCardContent>
          <ToolList searchTerm={searchTerm} />
        </WhiteCardContent>
      </WhiteCard>
    </div>
  )
}
