"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  WhiteCard,
  WhiteCardContent,
  WhiteCardDescription,
  WhiteCardHeader,
  WhiteCardTitle,
} from "@/components/ui/white-card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  color?: string
  odor?: string
  appearance?: string
  texture?: string
  temperature?: string
  humidity?: string
  notes?: string
  tests?: Array<{
    id: string
    name: string
    result: string
    notes?: string
  }>
  nonConformities?: Array<{
    id: string
    description: string
    severity: string
    date: string
    status: string
  }>
  actionPlans?: Array<{
    id: string
    description: string
    status: string
    dueDate: string
    responsible: string
  }>
}

export default function InspectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockInspection: Inspection = {
          id: params.id as string,
          product: "Farinha de Trigo",
          batch: "FT-2023-05-001",
          supplier: "Moinho Paulista",
          manufacturer: "Moinho Nacional",
          arrivalDate: "25/05/2023",
          expiryDate: "25/05/2024",
          status: "Pendente",
          color: "Branco",
          odor: "Característico",
          appearance: "Pó fino",
          texture: "Macia",
          temperature: "22",
          humidity: "12",
          notes: "Produto recebido em boas condições, embalagem íntegra.",
          tests: [
            {
              id: "1",
              name: "Análise Visual",
              result: "Conforme",
              notes: "Produto com aparência normal, sem sinais de contaminação.",
            },
            {
              id: "2",
              name: "Análise de Umidade",
              result: "12%",
              notes: "Dentro dos parâmetros aceitáveis (máx. 14%).",
            },
          ],
          nonConformities: [
            {
              id: "1",
              description: "Embalagem com pequeno rasgo na parte inferior",
              severity: "Baixa",
              date: "25/05/2023",
              status: "Resolvida",
            },
          ],
          actionPlans: [
            {
              id: "1",
              description:
                "Verificar com o fornecedor a qualidade das embalagens e solicitar maior cuidado no transporte",
              status: "Em andamento",
              dueDate: "10/06/2023",
              responsible: "João Silva",
            },
          ],
        }

        setInspection(mockInspection)
      } catch (error) {
        toast({
          title: "Erro ao carregar inspeção",
          description: "Não foi possível carregar os detalhes da inspeção.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInspection()
  }, [params.id, toast])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/inspecoes">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <Skeleton className="h-10 w-[250px]" />
        </div>

        <WhiteCard>
          <WhiteCardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </WhiteCardHeader>
          <WhiteCardContent className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </div>
          </WhiteCardContent>
        </WhiteCard>
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/inspecoes">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Inspeção não encontrada</h2>
        </div>

        <WhiteCard>
          <WhiteCardContent className="pt-6">
            <p>A inspeção que você está procurando não foi encontrada.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/inspecoes">Voltar para a lista de inspeções</Link>
            </Button>
          </WhiteCardContent>
        </WhiteCard>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <Badge className="bg-green-500">Aprovado</Badge>
      case "Pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>
      case "Incompleto":
        return <Badge className="bg-blue-500">Incompleto</Badge>
      case "Reprovado":
        return <Badge className="bg-red-500">Reprovado</Badge>
      case "Vencido":
        return <Badge className="bg-red-500">Vencido</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "baixa":
        return <Badge className="bg-blue-500">Baixa</Badge>
      case "média":
        return <Badge className="bg-yellow-500">Média</Badge>
      case "alta":
        return <Badge className="bg-orange-500">Alta</Badge>
      case "crítica":
        return <Badge className="bg-red-500">Crítica</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  const getActionStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluído":
        return <Badge className="bg-green-500">Concluído</Badge>
      case "em andamento":
        return <Badge className="bg-blue-500">Em andamento</Badge>
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>
      case "atrasado":
        return <Badge className="bg-red-500">Atrasado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/inspecoes">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{inspection.product}</h2>
            <p className="text-muted-foreground">Lote: {inspection.batch}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/inspecoes/${inspection.id}/editar`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/inspecoes/${inspection.id}/relatorio`}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="nonconformities">Não Conformidades</TabsTrigger>
          <TabsTrigger value="actionplans">Planos de Ação</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <WhiteCard>
            <WhiteCardHeader>
              <div className="flex justify-between items-center">
                <WhiteCardTitle>Informações da Inspeção</WhiteCardTitle>
                {getStatusBadge(inspection.status)}
              </div>
              <WhiteCardDescription>Detalhes da inspeção do produto</WhiteCardDescription>
            </WhiteCardHeader>
            <WhiteCardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Produto</h3>
                  <p className="text-lg">{inspection.product}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Lote</h3>
                  <p className="text-lg">{inspection.batch}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Fornecedor</h3>
                  <p className="text-lg">{inspection.supplier}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Fabricante</h3>
                  <p className="text-lg">{inspection.manufacturer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Chegada</h3>
                  <p className="text-lg">{inspection.arrivalDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Validade</h3>
                  <p className="text-lg">{inspection.expiryDate}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Características do Produto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {inspection.color && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Cor</h4>
                      <p>{inspection.color}</p>
                    </div>
                  )}
                  {inspection.odor && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Odor</h4>
                      <p>{inspection.odor}</p>
                    </div>
                  )}
                  {inspection.appearance && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Aspecto</h4>
                      <p>{inspection.appearance}</p>
                    </div>
                  )}
                  {inspection.texture && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Textura</h4>
                      <p>{inspection.texture}</p>
                    </div>
                  )}
                  {inspection.temperature && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Temperatura</h4>
                      <p>{inspection.temperature}°C</p>
                    </div>
                  )}
                  {inspection.humidity && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Umidade</h4>
                      <p>{inspection.humidity}%</p>
                    </div>
                  )}
                </div>
              </div>

              {inspection.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Observações</h3>
                    <p className="text-muted-foreground">{inspection.notes}</p>
                  </div>
                </>
              )}
            </WhiteCardContent>
          </WhiteCard>
        </TabsContent>

        <TabsContent value="tests">
          <WhiteCard>
            <WhiteCardHeader>
              <WhiteCardTitle>Testes Realizados</WhiteCardTitle>
              <WhiteCardDescription>Resultados dos testes realizados na inspeção</WhiteCardDescription>
            </WhiteCardHeader>
            <WhiteCardContent>
              {inspection.tests && inspection.tests.length > 0 ? (
                <div className="space-y-6">
                  {inspection.tests.map((test) => (
                    <div key={test.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{test.name}</h3>
                        <Badge className="bg-green-500">{test.result}</Badge>
                      </div>
                      {test.notes && <p className="text-muted-foreground">{test.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum teste registrado</h3>
                  <p className="text-muted-foreground mb-4">Não há testes registrados para esta inspeção.</p>
                  <Button asChild>
                    <Link href={`/dashboard/inspecoes/${inspection.id}/testes/novo`}>Adicionar Teste</Link>
                  </Button>
                </div>
              )}
            </WhiteCardContent>
          </WhiteCard>
        </TabsContent>

        <TabsContent value="nonconformities">
          <WhiteCard>
            <WhiteCardHeader>
              <WhiteCardTitle>Não Conformidades</WhiteCardTitle>
              <WhiteCardDescription>Não conformidades identificadas na inspeção</WhiteCardDescription>
            </WhiteCardHeader>
            <WhiteCardContent>
              {inspection.nonConformities && inspection.nonConformities.length > 0 ? (
                <div className="space-y-6">
                  {inspection.nonConformities.map((nc) => (
                    <div key={nc.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">Não Conformidade</h3>
                        <div className="flex gap-2">
                          {getSeverityBadge(nc.severity)}
                          <Badge className={nc.status === "Resolvida" ? "bg-green-500" : "bg-yellow-500"}>
                            {nc.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="mb-2">{nc.description}</p>
                      <p className="text-sm text-muted-foreground">Registrada em: {nc.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma não conformidade</h3>
                  <p className="text-muted-foreground mb-4">Não há não conformidades registradas para esta inspeção.</p>
                  <Button asChild>
                    <Link href={`/dashboard/inspecoes/${inspection.id}/nao-conformidades/nova`}>
                      Registrar Não Conformidade
                    </Link>
                  </Button>
                </div>
              )}
            </WhiteCardContent>
          </WhiteCard>
        </TabsContent>

        <TabsContent value="actionplans">
          <WhiteCard>
            <WhiteCardHeader>
              <WhiteCardTitle>Planos de Ação</WhiteCardTitle>
              <WhiteCardDescription>Planos de ação relacionados a esta inspeção</WhiteCardDescription>
            </WhiteCardHeader>
            <WhiteCardContent>
              {inspection.actionPlans && inspection.actionPlans.length > 0 ? (
                <div className="space-y-6">
                  {inspection.actionPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">Plano de Ação</h3>
                        {getActionStatusBadge(plan.status)}
                      </div>
                      <p className="mb-4">{plan.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Prazo: {plan.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Responsável: {plan.responsible}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum plano de ação</h3>
                  <p className="text-muted-foreground mb-4">Não há planos de ação registrados para esta inspeção.</p>
                  <Button asChild>
                    <Link href={`/dashboard/inspecoes/${inspection.id}/planos-acao/novo`}>Criar Plano de Ação</Link>
                  </Button>
                </div>
              )}
            </WhiteCardContent>
          </WhiteCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
