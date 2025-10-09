"use client"
import { useState } from "react"
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
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CompleteInspectionForm } from "../forms/complete-inspection-form"
import { AddTestsForm } from "../forms/add-tests-form"
import { NonConformityForm } from "../forms/non-conformity-form"

interface QualityInspectionListProps {
  type: "pending" | "incomplete" | "expired"
  searchTerm: string
}

export function QualityInspectionList({ type, searchTerm }: QualityInspectionListProps) {
  const router = useRouter()
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [testsDialogOpen, setTestsDialogOpen] = useState(false)
  const [nonConformityDialogOpen, setNonConformityDialogOpen] = useState(false)

  // Mock data - in a real app, this would come from an API
  const mockInspections = {
    pending: [
      {
        id: "1",
        product: "Farinha de Trigo",
        batch: "FT-2023-05-001",
        supplier: "Moinho Paulista",
        arrivalDate: "25/05/2023",
        expiryDate: "25/05/2024",
        status: "Pendente",
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
    ],
    incomplete: [
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
    ],
    expired: [
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
    ],
  }

  const inspections = mockInspections[type].filter(
    (inspection) =>
      inspection.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (inspection: any) => {
    router.push(`/dashboard/inspecoes/${inspection.id}`)
  }

  const handleCompleteInspection = (inspection: any) => {
    setSelectedInspection(inspection)
    setCompleteDialogOpen(true)
  }

  const handleAddTests = (inspection: any) => {
    setSelectedInspection(inspection)
    setTestsDialogOpen(true)
  }

  const handleNonConformity = (inspection: any) => {
    setSelectedInspection(inspection)
    setNonConformityDialogOpen(true)
  }

  return (
    <>
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
                        inspection.status === "Pendente"
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
                        <DropdownMenuItem onClick={() => handleViewDetails(inspection)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCompleteInspection(inspection)}>
                          Completar inspeção
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddTests(inspection)}>Adicionar testes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNonConformity(inspection)}>
                          Registrar não conformidade
                        </DropdownMenuItem>
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

      {/* Dialog para completar inspeção */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Completar Inspeção</DialogTitle>
            <DialogDescription>
              Complete os dados da inspeção para o produto {selectedInspection?.product} (Lote:{" "}
              {selectedInspection?.batch})
            </DialogDescription>
          </DialogHeader>
          {selectedInspection && (
            <CompleteInspectionForm inspection={selectedInspection} onComplete={() => setCompleteDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar testes */}
      <Dialog open={testsDialogOpen} onOpenChange={setTestsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar Testes</DialogTitle>
            <DialogDescription>
              Adicione testes para a inspeção do produto {selectedInspection?.product} (Lote:{" "}
              {selectedInspection?.batch})
            </DialogDescription>
          </DialogHeader>
          {selectedInspection && (
            <AddTestsForm inspection={selectedInspection} onComplete={() => setTestsDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para registrar não conformidade */}
      <Dialog open={nonConformityDialogOpen} onOpenChange={setNonConformityDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registrar Não Conformidade</DialogTitle>
            <DialogDescription>
              Registre uma não conformidade para o produto {selectedInspection?.product} (Lote:{" "}
              {selectedInspection?.batch})
            </DialogDescription>
          </DialogHeader>
          {selectedInspection && (
            <NonConformityForm inspection={selectedInspection} onComplete={() => setNonConformityDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
