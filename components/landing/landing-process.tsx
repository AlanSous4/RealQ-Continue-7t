export function LandingProcess() {
  const steps = [
    {
      number: "01",
      title: "Análise de Necessidades",
      description:
        "Entendemos os processos atuais e identificamos oportunidades de melhoria específicas para sua operação.",
    },
    {
      number: "02",
      title: "Configuração Personalizada",
      description:
        "Configuramos o RealQ de acordo com suas necessidades, incluindo formulários, fluxos de trabalho e integrações.",
    },
    {
      number: "03",
      title: "Treinamento da Equipe",
      description: "Treinamos sua equipe para utilizar o sistema de forma eficiente, garantindo a adoção completa.",
    },
    {
      number: "04",
      title: "Implementação Gradual",
      description:
        "Implementamos o sistema em fases, garantindo uma transição suave e minimizando impactos na operação.",
    },
    {
      number: "05",
      title: "Suporte Contínuo",
      description: "Oferecemos suporte técnico e consultoria contínua para garantir o sucesso a longo prazo.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="text-center mb-12 backdrop-blur-sm bg-background/70 p-6 rounded-lg">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Processo de Implementação Simplificado</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Nossa metodologia de implementação garante uma transição suave e resultados rápidos para sua empresa.
          </p>
        </div>

        <div className="relative">
          {/* Linha de conexão */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row gap-8 md:gap-16 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="md:w-1/2 flex justify-center md:justify-end items-start">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {step.number}
                    </div>
                    {/* Conector horizontal */}
                    <div
                      className={`absolute top-1/2 w-8 h-0.5 bg-primary/20 hidden md:block ${index % 2 !== 0 ? "left-full" : "right-full"}`}
                    ></div>
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center backdrop-blur-sm bg-background/70 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
