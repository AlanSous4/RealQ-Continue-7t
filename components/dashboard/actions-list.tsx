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

interface ActionsListProps {
  searchTerm: string
}

export function ActionsList({ searchTerm }: ActionsListProps) {
  // Mock data - in a real app, this would come from an API
  const mockActions = [
    {
      id: "1",
      product: "Farinha de Trigo",
      batch: "FT-2023-05-001",
      description: "Ajustar processo de peneiramento para reduzir impurezas",
      status: "Em andamento",
      dueDate: "15/06/2023",
      assignedTo: "João Silva",
    },
    {
      id: "2",
      product: "Açúcar Refinado",
      batch: "AR-2023-05-002",
      description: "Verificar calibração dos equipamentos de medição de umidade",
      status: "Pendente",
      dueDate: "20/06/2023",
      assignedTo: "Maria Costa",
    },
    {
      id: "3",
      product: "Leite em Pó",
      batch: "LP-2023-05-003",
      description: "Revisar procedimento de amostragem para testes microbiológicos",
      status: "Concluído",
      dueDate: "10/06/2023",
      assignedTo: "Pedro Alves",
    },
    {
      id: "4",
      product: "Óleo de Soja",
      batch: "OS-2023-05-004",
      description: "Implementar novo teste de acidez no processo de recebimento",
      status: "Em andamento",
      dueDate: "25/06/2023",
      assignedTo: "Ana Santos",
    },
  ]

  const actions = mockActions.filter(
    (action) =>
      action.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.length > 0 ? (
            actions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">{action.product}</TableCell>
                <TableCell>{action.batch}</TableCell>
                <TableCell>{action.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      action.status === "Concluído"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : action.status === "Em andamento"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {action.status}
                  </span>
                </TableCell>
                <TableCell>{action.dueDate}</TableCell>
                <TableCell>{action.assignedTo}</TableCell>
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
                        <Link href={`/dashboard/acoes/${action.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Atualizar status</DropdownMenuItem>
                      <DropdownMenuItem>Concluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum plano de ação encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
