import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre a Real Soluções</h1>
              <p className="text-muted-foreground md:text-xl">Conheça nossa história e missão</p>
            </div>

            <div className="relative mx-auto h-[300px] w-full overflow-hidden rounded-lg md:h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Equipe Real Soluções"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Nossa História</h2>
              <p>
                A Real Soluções nasceu da necessidade de oferecer soluções tecnológicas inovadoras para o setor de
                controle de qualidade na indústria alimentícia. Fundada em 2010, nossa empresa tem se dedicado a
                desenvolver ferramentas que simplificam processos e garantem a segurança e qualidade dos produtos.
              </p>
              <p>
                Com uma equipe multidisciplinar de especialistas em tecnologia, qualidade e segurança alimentar,
                desenvolvemos o RealQ, um sistema completo para gerenciamento de inspeções de qualidade que atende às
                necessidades específicas do setor.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Nossa Missão</h2>
              <p>
                Transformar a gestão da qualidade na indústria alimentícia através de soluções tecnológicas acessíveis,
                intuitivas e eficientes, contribuindo para a segurança dos consumidores e o sucesso de nossos clientes.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Nossos Valores</h2>
              <ul className="ml-6 list-disc space-y-2">
                <li>Excelência em tudo o que fazemos</li>
                <li>Inovação constante em nossas soluções</li>
                <li>Compromisso com a segurança alimentar</li>
                <li>Atendimento personalizado às necessidades dos clientes</li>
                <li>Responsabilidade social e ambiental</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button asChild>
                <Link href="/contato">
                  Entre em contato
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
