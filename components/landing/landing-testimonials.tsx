import { Quote } from "lucide-react"

export function LandingTestimonials() {
  const testimonials = [
    {
      quote:
        "O RealQ transformou completamente nosso processo de controle de qualidade. Conseguimos reduzir o tempo de inspeção em 40% e praticamente eliminamos os erros de documentação.",
      author: "Maria Silva",
      role: "Gerente de Qualidade",
      company: "Alimentos Premium S.A.",
    },
    {
      quote:
        "A rastreabilidade que o sistema oferece nos deu muito mais segurança. Agora conseguimos identificar rapidamente a origem de qualquer problema e tomar ações corretivas imediatas.",
      author: "Carlos Oliveira",
      role: "Diretor de Operações",
      company: "Laticínios do Vale",
    },
    {
      quote:
        "Os alertas de vencimento de matéria-prima reduziram nossas perdas em mais de 30%. O investimento no RealQ se pagou em menos de 6 meses.",
      author: "Ana Pereira",
      role: "Coordenadora de Produção",
      company: "Grãos & Cereais",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12 backdrop-blur-sm bg-background/70 p-6 rounded-lg">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">O que Nossos Clientes Dizem</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Empresas de diversos segmentos da indústria alimentícia já transformaram seus processos de qualidade com o
            RealQ.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg border p-6 transition-all hover:shadow-md relative">
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {testimonial.author
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
