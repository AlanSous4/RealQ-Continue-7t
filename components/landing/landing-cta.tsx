import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingCTA() {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center backdrop-blur-sm bg-background/70 p-6 rounded-lg">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Pronto para Transformar seu Controle de Qualidade?
            </h2>
            <p className="text-lg mb-8">
              Junte-se a centenas de empresas que já estão utilizando o RealQ para garantir a qualidade e segurança de
              seus produtos alimentícios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/cadastro">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contato">Solicitar Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
