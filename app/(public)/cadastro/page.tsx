"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { useToast } from "@/hooks/use-toast"
import { signUp, signInWithProvider } from "@/lib/supabase/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "quality-user",
    agreeTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Pre-fill form data from URL parameters
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const type = searchParams.get("type")

    if (name || email || type) {
      setFormData((prev) => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        userType: type || prev.userType,
      }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    // Validar senha
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      setIsSubmitting(false)
      return
    }

    // Validar termos
    if (!formData.agreeTerms) {
      setError("Você precisa concordar com os termos de serviço e políticas de privacidade.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("[Cadastro] Iniciando processo de cadastro", { email: formData.email })

      const result = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
      })

      console.log("[Cadastro] Cadastro realizado com sucesso", { userId: result.user?.id })

      setSuccessMessage("Cadastro realizado com sucesso! Verifique seu email para confirmar o cadastro.")

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro.",
      })

      // Redirecionar para a página de confirmação após 3 segundos
      setTimeout(() => {
        router.push("/cadastro/confirmacao")
      }, 3000)
    } catch (error) {
      console.error("❌ Erro no processo de cadastro:", error)

      let errorMessage = "Ocorreu um erro ao realizar o cadastro. Tente novamente."

      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está cadastrado. Tente fazer login ou use outro email."
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Email inválido. Verifique o formato do email."
        } else if (error.message.includes("Password")) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres."
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)

      toast({
        title: "Erro ao cadastrar",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProviderSignIn = async (provider: "google" | "github") => {
    try {
      await signInWithProvider(provider)
    } catch (error) {
      console.error(`Erro ao fazer login com ${provider}:`, error)
      toast({
        title: `Erro ao fazer login com ${provider}`,
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Crie sua conta</h1>
              <p className="text-muted-foreground">Preencha os dados abaixo para se cadastrar no RealQ</p>
            </div>
            <div className="space-y-4 rounded-lg border p-6">
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

              {successMessage && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                  <AlertTitle className="text-green-800 dark:text-green-300">Sucesso!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting || !!successMessage}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting || !!successMessage}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting || !!successMessage}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting || !!successMessage}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting || !!successMessage}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de usuário</Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, userType: value }))}
                    className="grid grid-cols-2 gap-4"
                    disabled={isSubmitting || !!successMessage}
                  >
                    <div>
                      <RadioGroupItem value="quality-user" id="register-quality-user" className="peer sr-only" />
                      <Label
                        htmlFor="register-quality-user"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-semibold">Profissional QA</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="admin-user" id="register-admin-user" className="peer sr-only" />
                      <Label
                        htmlFor="register-admin-user"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-semibold">Gestor QA</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                    required
                    disabled={isSubmitting || !!successMessage}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    Concordo com os{" "}
                    <Link href="/termos" className="text-primary hover:underline">
                      termos de serviço
                    </Link>{" "}
                    e{" "}
                    <Link href="/politicas" className="text-primary hover:underline">
                      políticas de privacidade
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || !!successMessage}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : successMessage ? (
                    <>Redirecionando...</>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleProviderSignIn("google")}
                  disabled={isSubmitting || !!successMessage}
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleProviderSignIn("github")}
                  disabled={isSubmitting || !!successMessage}
                >
                  GitHub
                </Button>
              </div>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Faça login
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
