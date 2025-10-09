"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllUserTypes, type UserType } from "@/lib/services/user-service-extended"
import { Badge } from "@/components/ui/badge"

interface UserTypeListProps {
  searchTerm: string
}

export function UserTypeList({ searchTerm }: UserTypeListProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [filteredUserTypes, setFilteredUserTypes] = useState<UserType[]>([])

  // Carregar tipos de usuários
  useEffect(() => {
    const loadUserTypes = async () => {
      try {
        setIsLoading(true)
        const data = getAllUserTypes()
        setUserTypes(data)
      } catch (error) {
        console.error("Erro ao carregar tipos de usuários:", error)
        toast({
          title: "Erro ao carregar tipos de usuários",
          description: "Não foi possível carregar a lista de tipos de usuários.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserTypes()
  }, [toast])

  // Filtrar tipos de usuários com base no termo de busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUserTypes(userTypes)
    } else {
      const filtered = userTypes.filter(
        (userType) =>
          userType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userType.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUserTypes(filtered)
    }
  }, [searchTerm, userTypes])

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "admin-user":
        return <Badge className="bg-red-500">Administrador</Badge>
      case "manager-user":
        return <Badge className="bg-orange-500">Gestor</Badge>
      case "quality-user":
        return <Badge className="bg-blue-500">Profissional QA</Badge>
      case "viewer-user":
        return <Badge className="bg-green-500">Visualizador</Badge>
      default:
        return <Badge>{userType}</Badge>
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
              {[...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[200px]" />
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
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Permissões</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUserTypes.length > 0 ? (
            filteredUserTypes.map((userType) => (
              <TableRow key={userType.id}>
                <TableCell>{getUserTypeBadge(userType.name)}</TableCell>
                <TableCell>{userType.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {userType.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <Shield className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tipos-usuarios/${userType.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {searchTerm
                  ? "Nenhum tipo de usuário encontrado com o termo de busca."
                  : "Nenhum tipo de usuário cadastrado."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
