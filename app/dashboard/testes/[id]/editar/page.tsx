// app/dashboard/testes/[id]/editar/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

import { getTestById, updateTest } from "@/lib/services/test-service"
import type { Test } from "@/lib/services/test-service"

export default function EditTestPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const { toast } = useToast()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // ------------------------------------------
  // 🔹 Carregar dados do teste ao abrir página
  // ------------------------------------------
  useEffect(() => {
    if (!id) return

    let mounted = true

    ;(async () => {
      try {
        const data = await getTestById(id)

        if (!data) {
          toast({
            title: "Não encontrado",
            description: "Teste não foi encontrado.",
            variant: "destructive",
          })
          router.push("/dashboard/testes")
          return
        }

        if (!mounted) return

        setName(data.name)
        setDescription(data.description ?? "")
      } catch (err) {
        console.error(err)
        toast({
          title: "Erro",
          description: "Não foi possível carregar o teste.",
          variant: "destructive",
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [id, router, toast])

  // ------------------------------------------
  // 🔹 Salvar edição
  // ------------------------------------------
  async function handleUpdate() {
    setSaving(true)
    try {
      await updateTest(id, {
        name,
        description,
      })

      toast({
        title: "Atualizado",
        description: "O teste foi atualizado com sucesso.",
      })

      router.push(`/dashboard/testes/${id}`)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Teste</h1>

      {/* Nome */}
      <label className="font-medium">Nome</label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
        required
      />

      {/* Descrição */}
      <label className="font-medium">Descrição</label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-6"
      />

      {/* Botões */}
      <div className="flex gap-3">
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => router.push(`/dashboard/testes/${id}`)}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}
