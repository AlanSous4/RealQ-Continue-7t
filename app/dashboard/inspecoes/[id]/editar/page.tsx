"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  WhiteCard,
  WhiteCardHeader,
  WhiteCardTitle,
  WhiteCardDescription,
  WhiteCardContent,
} from "@/components/ui/white-card"
import { useToast } from "@/hooks/use-toast"

interface Inspection {
  id: string
  product: string
  batch: string
  supplier: string
  manufacturer: string
  arrivalDate: string
  expiryDate: string
  status: string
}

export default function EditInspectionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mockData: Record<string, Inspection> = {
    "1": {
      id: "1",
      product: "Farinha de Trigo",
      batch: "FT-2023-05-001",
      supplier: "Moinho Paulista",
      manufacturer: "Moinho Nacional",
      arrivalDate: "2023-05-25",
      expiryDate: "2024-05-25",
      status: "Aprovado",
    },
    "2": {
      id: "2",
      product: "Açúcar Refinado",
      batch: "C-2023-06-010",
      supplier: "Açúcar Ltda",
      manufacturer: "Açúcar Nacional",
      arrivalDate: "2023-06-10",
      expiryDate: "2024-06-10",
      status: "Pendente",
    },
  }

  useEffect(() => {
    const fetchInspection = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = mockData[params.id as string] || null
      setInspection(data)
      setIsLoading(false)
    }

    fetchInspection()
  }, [params.id])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Alterações salvas com sucesso!",
      description: "Os dados da inspeção foram atualizados.",
    })
    router.push(`/dashboard/inspecoes/${params.id}`)
  }

  if (!inspection && !isLoading) {
    return (
      <div className="p-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/inspecoes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Link>
        </Button>
        <p className="mt-4 text-lg font-medium">Inspeção não encontrada.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/inspecoes/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Editar Inspeção #{inspection?.id}
        </h2>
      </div>

      <WhiteCard>
        <WhiteCardHeader>
          <WhiteCardTitle>Detalhes da Inspeção do Produto</WhiteCardTitle>
          <WhiteCardDescription>
            Edite as informações da inspeção abaixo.
          </WhiteCardDescription>
        </WhiteCardHeader>

        <WhiteCardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Produto
                </label>
                <Input
                  defaultValue={inspection?.product}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Lote
                </label>
                <Input
                  defaultValue={inspection?.batch}
                  placeholder="Código do lote"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fornecedor
                </label>
                <Input
                  defaultValue={inspection?.supplier}
                  placeholder="Nome do fornecedor"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fabricante
                </label>
                <Input
                  defaultValue={inspection?.manufacturer}
                  placeholder="Nome do fabricante"
                  required
                />
              </div>

              {/* 🔹 Campo com cursor pointer */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Data de Chegada
                </label>
                <Input
                  type="date"
                  defaultValue={inspection?.arrivalDate}
                  placeholder="Selecione a data"
                  required
                  className="cursor-pointer"
                />
              </div>

              {/* 🔹 Campo com cursor pointer */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Data de Validade
                </label>
                <Input
                  type="date"
                  defaultValue={inspection?.expiryDate}
                  placeholder="Selecione a data"
                  required
                  className="cursor-pointer"
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </WhiteCardContent>
      </WhiteCard>
    </div>
  )
}
