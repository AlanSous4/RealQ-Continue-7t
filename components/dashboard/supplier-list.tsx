"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2, MoreHorizontal, Loader2 } from "lucide-react"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllSuppliers, deleteSupplier, type Supplier } from "@/lib/services/supplier-service-extended"

interface SupplierListProps {
  searchTerm: string
}

export function SupplierList({ searchTerm }: SupplierListProps) {
  const { toast } = useToast()
  const [deleteSupplierId, setDeleteSupplierId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])

  // Carregar fornecedores do Supabase
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setIsLoading(true)
        const data = await getAllSuppliers()
        setSuppliers(data)
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error)
        toast({
          title: "Erro ao carregar fornecedores",
          description: "Não foi possível carregar a lista de fornecedores.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSuppliers()
  }, [toast])

  // Filtrar fornecedores com base no termo de busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuppliers(suppliers)
    } else {
      const filtered = suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (supplier.contact && supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (supplier.phone && supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredSuppliers(filtered)
    }
  }, [searchTerm, suppliers])

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteSupplier(id)

      // Atualizar a lista de fornecedores após a exclusão
      setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id))

      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error)
      toast({
        title: "Erro ao excluir fornecedor",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao excluir o fornecedor. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteSupplierId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[150px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-[80px] ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contact || "-"}</TableCell>
                <TableCell>{supplier.email || "-"}</TableCell>
                <TableCell>{supplier.phone || "-"}</TableCell>
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
                        <Link href={`/dashboard/revendedores/${supplier.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/revendedores/${supplier.id}/editar`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setDeleteSupplierId(supplier.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {searchTerm ? "Nenhum fornecedor encontrado com o termo de busca." : "Nenhum fornecedor cadastrado."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteSupplierId} onOpenChange={(open) => !open && setDeleteSupplierId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o fornecedor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSupplierId && handleDelete(deleteSupplierId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
