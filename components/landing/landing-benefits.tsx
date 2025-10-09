import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export function LandingBenefits() {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1 backdrop-blur-sm bg-background/70 p-6 rounded-lg">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Transforme seu Processo de Qualidade</h2>
            <p className="text-muted-foreground text-lg mb-8">
              O RealQ foi desenvolvido para atender às necessidades específicas da indústria alimentícia, proporcionando
              um controle de qualidade rigoroso e eficiente em todas as etapas do processo.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Redução de Custos Operacionais</h3>
                  <p className="text-muted-foreground">
                    Minimize perdas por vencimento, otimize processos e reduza retrabalho com um sistema integrado.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Conformidade com Normas e Regulamentos</h3>
                  <p className="text-muted-foreground">
                    Mantenha-se em conformidade com normas como ISO 22000, FSSC 22000, BRC e legislações locais.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Tomada de Decisão Baseada em Dados</h3>
                  <p className="text-muted-foreground">
                    Acesse relatórios e dashboards em tempo real para tomar decisões estratégicas com confiança.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Melhoria Contínua dos Processos</h3>
                  <p className="text-muted-foreground">
                    Identifique tendências, problemas recorrentes e oportunidades de melhoria com análises detalhadas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=500&width=500&text=Dashboard+RealQ"
                alt="Dashboard RealQ"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-lg bg-primary/10 z-[-1]"></div>
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-lg bg-secondary/10 z-[-1]"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
