"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllUserTypes, type UserType } from "@/lib/services/user-service-extended"

export default function UserTypesPage() {
  const [userTypes, setUserTypes] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserTypes = async () => {
      try {
        setIsLoading(true)
        const types = getAllUserTypes()
        setUserTypes(types)
      } catch (error) {
        console.error("Erro ao carregar tipos de usuários:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserTypes()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tipos de Usuários</h2>
        <p className="text-muted-foreground">Visualize os diferentes tipos de usuários e suas permissões</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {userTypes.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <CardTitle>{type.description}</CardTitle>
              <CardDescription>Código: {type.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.permissions.includes("read") && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        Leitura
                      </Badge>
                    )}
                    {type.permissions.includes("write") && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                        Escrita
                      </Badge>
                    )}
                    {type.permissions.includes("delete") && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                        Exclusão
                      </Badge>
                    )}
                    {type.permissions.includes("admin") && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                        Administração
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Descrição:</h4>
                  <p className="text-sm text-muted-foreground">
                    {type.id === "admin-user" &&
                      "Acesso completo ao sistema, incluindo gerenciamento de usuários e configurações."}
                    {type.id === "manager-user" &&
                      "Pode gerenciar inspeções, produtos e planos de ação, mas não pode alterar configurações do sistema."}
                    {type.id === "quality-user" &&
                      "Pode realizar inspeções, registrar não conformidades e acompanhar planos de ação."}
                    {type.id === "viewer-user" && "Acesso somente leitura a todas as informações do sistema."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
