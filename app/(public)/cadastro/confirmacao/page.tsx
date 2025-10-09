import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function RegistrationConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-md space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Cadastro Realizado!</CardTitle>
                <CardDescription>Enviamos um email de confirmação para o seu endereço de email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center text-muted-foreground">
                  <p>
                    Por favor, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
                  </p>
                  <p className="mt-2">
                    Se você não receber o email em alguns minutos, verifique sua pasta de spam ou lixo eletrônico.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/login">Ir para o Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Voltar para a Página Inicial</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
