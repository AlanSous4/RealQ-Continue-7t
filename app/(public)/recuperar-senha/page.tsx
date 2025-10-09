"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { resetPassword } from "@/lib/supabase/auth"

export default function RecoverPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await resetPassword(email)
      setIsSubmitted(true)

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error)
      setError(
        error instanceof Error ? error.message : "Ocorreu um erro ao enviar o email de recuperação. Tente novamente.",
      )

      toast({
        title: "Erro ao enviar email",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Recuperar senha</h1>
              <p className="text-muted-foreground">Enviaremos um link para redefinir sua senha</p>
            </div>
            <div className="space-y-4 rounded-lg border p-6">
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar link de recuperação"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="rounded-full bg-primary/10 p-3 text-primary mx-auto w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Email enviado</h3>
                  <p className="text-muted-foreground">
                    Enviamos um link de recuperação para {email}. Verifique sua caixa de entrada e siga as instruções.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                    Tentar com outro email
                  </Button>
                </div>
              )}
              <div className="text-center text-sm">
                Lembrou sua senha?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </div>
            <Button variant="link" asChild className="mx-auto">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
