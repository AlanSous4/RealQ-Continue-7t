"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser, updateCurrentUserProfile } from "@/lib/services/user-service-extended"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    user_type: "",
    profile_image: "",
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true)
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser({
            id: currentUser.id,
            name: currentUser.name || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            user_type: currentUser.user_type || "",
            profile_image: currentUser.profile_image || "",
          })
        } else {
          // Usuário não autenticado, redirecionar para login
          router.push("/login")
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar as informações do seu perfil.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateCurrentUserProfile({
        name: user.name,
        phone: user.phone,
        profile_image: user.profile_image,
      })

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })

      // Recarregar a página para atualizar o cabeçalho
      router.refresh()
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Obter as iniciais do nome do usuário para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

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
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-24 w-24">
                  {user.profile_image ? <AvatarImage src={user.profile_image} alt={user.name} /> : null}
                  <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="profile_image">URL da Imagem de Perfil</Label>
                  <Input
                    id="profile_image"
                    name="profile_image"
                    value={user.profile_image}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-sm text-muted-foreground">Insira a URL de uma imagem para usar como seu avatar</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user_type">Tipo de Usuário</Label>
                  <Input
                    id="user_type"
                    value={
                      user.user_type === "admin-user"
                        ? "Administrador"
                        : user.user_type === "manager-user"
                          ? "Gestor"
                          : user.user_type === "quality-user"
                            ? "Profissional de Qualidade"
                            : user.user_type === "viewer-user"
                              ? "Visualizador"
                              : user.user_type
                    }
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O tipo de usuário só pode ser alterado por um administrador
                  </p>
                </div>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
