"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createTest } from "@/lib/services/test-service"

export default function NewTestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Salvar no Supabase
      await createTest({
        name: formData.name,
        description: formData.description,
      })

      toast({
        title: "Teste criado",
        description: "O teste foi criado com sucesso.",
      })

      // Redirect to tests list
      router.push("/dashboard/testes")
    } catch (error) {
      console.error("Erro ao criar teste:", error)
      toast({
        title: "Erro ao criar teste",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o teste. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/testes">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Novo Teste</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Teste</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo teste</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Teste</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Digite o nome do teste"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Digite uma descrição detalhada do teste"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Teste"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/testes">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
