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

interface InspectionListProps {
  searchTerm: string
}

export function InspectionList({ searchTerm }: InspectionListProps) {
  // Mock data - in a real app, this would come from an API
  const mockInspections = [
    {
      id: "1",
      product: "Farinha de Trigo",
      batch: "FT-2023-05-001",
      supplier: "Moinho Paulista",
      arrivalDate: "25/05/2023",
      expiryDate: "25/05/2024",
      status: "Aprovado",
    },
    {
      id: "2",
      product: "Açúcar Refinado",
      batch: "AR-2023-05-002",
      supplier: "Usina Santa Clara",
      arrivalDate: "26/05/2023",
      expiryDate: "26/11/2023",
      status: "Pendente",
    },
    {
      id: "3",
      product: "Leite em Pó",
      batch: "LP-2023-05-003",
      supplier: "Laticínios do Vale",
      arrivalDate: "27/05/2023",
      expiryDate: "27/05/2024",
      status: "Pendente",
    },
    {
      id: "4",
      product: "Óleo de Soja",
      batch: "OS-2023-05-004",
      supplier: "Grãos do Sul",
      arrivalDate: "20/05/2023",
      expiryDate: "20/05/2024",
      status: "Incompleto",
    },
    {
      id: "5",
      product: "Fermento Biológico",
      batch: "FB-2023-05-005",
      supplier: "BioFermentos",
      arrivalDate: "22/05/2023",
      expiryDate: "22/08/2023",
      status: "Incompleto",
    },
    {
      id: "6",
      product: "Chocolate em Pó",
      batch: "CP-2022-11-006",
      supplier: "Cacau Brasil",
      arrivalDate: "15/11/2022",
      expiryDate: "15/05/2023",
      status: "Vencido",
    },
    {
      id: "7",
      product: "Leite Condensado",
      batch: "LC-2022-10-007",
      supplier: "Laticínios do Vale",
      arrivalDate: "10/10/2022",
      expiryDate: "10/04/2023",
      status: "Vencido",
    },
  ]

  const inspections = mockInspections.filter(
    (inspection) =>
      inspection.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Data de Chegada</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.length > 0 ? (
            inspections.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell className="font-medium">{inspection.product}</TableCell>
                <TableCell>{inspection.batch}</TableCell>
                <TableCell>{inspection.supplier}</TableCell>
                <TableCell>{inspection.arrivalDate}</TableCell>
                <TableCell>{inspection.expiryDate}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      inspection.status === "Aprovado"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : inspection.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : inspection.status === "Incompleto"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {inspection.status}
                  </span>
                </TableCell>
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
                        <Link href={`/dashboard/inspecoes/${inspection.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Completar inspeção</DropdownMenuItem>
                      <DropdownMenuItem>Adicionar testes</DropdownMenuItem>
                      <DropdownMenuItem>Registrar não conformidade</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhuma inspeção encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
