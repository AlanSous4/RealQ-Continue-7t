"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Ocorreu um erro</CardTitle>
          </div>
          <CardDescription>Não foi possível carregar o dashboard. Por favor, tente novamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Se o problema persistir, verifique se o banco de dados está configurado corretamente.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={reset}>
            Tentar novamente
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/setup-db">Configurar Banco de Dados</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
