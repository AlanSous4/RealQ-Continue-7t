"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { updatePassword, supabaseClient } from "@/lib/supabase/auth"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidLink, setIsValidLink] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está autenticado com um token de recuperação
    const checkSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession()

      if (error || !data.session) {
        setIsValidLink(false)
        toast({
          title: "Link inválido",
          description: "O link de redefinição de senha é inválido ou expirou.",
          variant: "destructive",
        })
      }
    }

    checkSession()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      setIsSubmitting(false)
      return
    }

    try {
      await updatePassword(password)

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })

      // Redirecionar para o login
      router.push("/login")
    } catch (error) {
      console.error("Erro ao atualizar senha:", error)
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a senha. Tente novamente.")

      toast({
        title: "Erro ao atualizar senha",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isValidLink) {
    return (
      <div className="flex min-h-screen flex-col">
        <LandingHeader />
        <main className="flex-1">
          <div className="container px-4 py-12 md:py-24">
            <div className="mx-auto max-w-md space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Link inválido</CardTitle>
                  <CardDescription>O link de redefinição de senha é inválido ou expirou.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Por favor, solicite um novo link de redefinição de senha.</p>
                  <div className="flex flex-col gap-2">
                    <Button asChild>
                      <Link href="/recuperar-senha">Solicitar novo link</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/login">Voltar para o login</Link>
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

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Redefinir senha</h1>
              <p className="text-muted-foreground">Digite sua nova senha</p>
            </div>
            <div className="space-y-4 rounded-lg border p-6">
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar senha"
                  )}
                </Button>
              </form>
            </div>
            <Button variant="link" asChild className="mx-auto">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
