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
import { InspectionList } from "@/components/dashboard/inspection-list"

export default function InspectionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inspeções</h2>
          <p className="text-muted-foreground">Gerencie todas as inspeções de produtos</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/inspecoes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Inspeção
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Buscar por produto, lote ou fornecedor..."
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
          <WhiteCardTitle>Todas as Inspeções</WhiteCardTitle>
          <WhiteCardDescription>Lista de todas as inspeções cadastradas no sistema</WhiteCardDescription>
        </WhiteCardHeader>
        <WhiteCardContent>
          <InspectionList searchTerm={searchTerm} />
        </WhiteCardContent>
      </WhiteCard>
    </div>
  )
}
