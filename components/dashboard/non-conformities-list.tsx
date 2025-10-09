"use client"
import Link from "next/link"
import { Eye, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface NonConformitiesListProps {
  searchTerm: string
}

export function NonConformitiesList({ searchTerm }: NonConformitiesListProps) {
  // Mock data - in a real app, this would come from an API
  const mockNonConformities = [
    {
      id: "1",
      product: "Farinha de Trigo",
      batch: "FT-2023-05-001",
      description: "Presença de impurezas acima do limite aceitável",
      severity: "Média",
      date: "25/05/2023",
      reportedBy: "João Silva",
    },
    {
      id: "2",
      product: "Açúcar Refinado",
      batch: "AR-2023-05-002",
      description: "Umidade acima do especificado",
      severity: "Baixa",
      date: "26/05/2023",
      reportedBy: "Maria Costa",
    },
    {
      id: "3",
      product: "Leite em Pó",
      batch: "LP-2023-05-003",
      description: "Contaminação microbiológica detectada",
      severity: "Alta",
      date: "27/05/2023",
      reportedBy: "Pedro Alves",
    },
    {
      id: "4",
      product: "Óleo de Soja",
      batch: "OS-2023-05-004",
      description: "Índice de acidez fora da especificação",
      severity: "Média",
      date: "20/05/2023",
      reportedBy: "Ana Santos",
    },
  ]

  const nonConformities = mockNonConformities.filter(
    (nc) =>
      nc.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Severidade</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Reportado por</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nonConformities.length > 0 ? (
            nonConformities.map((nc) => (
              <TableRow key={nc.id}>
                <TableCell className="font-medium">{nc.product}</TableCell>
                <TableCell>{nc.batch}</TableCell>
                <TableCell>{nc.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      nc.severity === "Alta"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : nc.severity === "Média"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    }`}
                  >
                    {nc.severity}
                  </span>
                </TableCell>
                <TableCell>{nc.date}</TableCell>
                <TableCell>{nc.reportedBy}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/acoes/nao-conformidades/${nc.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Criar plano de ação</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhuma não conformidade encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
