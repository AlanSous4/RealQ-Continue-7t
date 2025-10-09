import {
  Search,
  BarChart2,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  Database,
  Shield,
  TrendingUp,
} from "lucide-react"

export function LandingFeatures() {
  const features = [
    {
      icon: Search,
      title: "Rastreabilidade Completa",
      description:
        "Acompanhe todo o ciclo de vida dos produtos, desde a matéria-prima até o produto final, garantindo conformidade e segurança.",
    },
    {
      icon: Calendar,
      title: "Gestão de Vencimentos",
      description:
        "Monitore datas de validade de matérias-primas e produtos, receba alertas automáticos e evite perdas por vencimento.",
    },
    {
      icon: Database,
      title: "Gestão de Estoque",
      description:
        "Controle eficiente de inventário, com visibilidade em tempo real dos níveis de estoque e histórico de movimentações.",
    },
    {
      icon: ClipboardCheck,
      title: "Admissão de Matéria-Prima",
      description:
        "Processo padronizado para recebimento e inspeção de matérias-primas, garantindo que apenas insumos aprovados entrem na produção.",
    },
    {
      icon: FileCheck,
      title: "Padronização de Inspeções",
      description:
        "Formulários e checklists personalizados para cada tipo de produto, garantindo consistência nas avaliações de qualidade.",
    },
    {
      icon: AlertTriangle,
      title: "Gestão de Não Conformidades",
      description:
        "Identificação, registro e tratamento de não conformidades, com acompanhamento de planos de ação corretiva.",
    },
    {
      icon: Shield,
      title: "Segurança Alimentar",
      description:
        "Garanta a segurança dos alimentos com monitoramento de pontos críticos de controle e análise de riscos.",
    },
    {
      icon: BarChart2,
      title: "Análise de Dados",
      description:
        "Dashboards e relatórios personalizados para análise de tendências e tomada de decisões baseadas em dados.",
    },
    {
      icon: TrendingUp,
      title: "Melhoria Contínua",
      description:
        "Ferramentas para identificar oportunidades de melhoria e implementar ações corretivas e preventivas.",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12 backdrop-blur-sm bg-background/70 p-6 rounded-lg">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Recursos Completos para Controle de Qualidade
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            O RealQ oferece todas as ferramentas necessárias para gerenciar a qualidade dos seus produtos alimentícios
            de forma eficiente e confiável.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border p-6 transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
