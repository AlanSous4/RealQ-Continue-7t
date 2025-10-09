import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Entre em Contato</h1>
              <p className="text-muted-foreground md:text-xl">
                Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais breve possível.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
