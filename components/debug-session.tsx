"use client"

import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DebugSession({ userId }: { userId: string }) {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabaseClient.auth.getSession()

        if (error) {
          setError(error.message)
          return
        }

        setSessionInfo({
          hasSession: !!data.session,
          sessionUserId: data.session?.user?.id || "none",
          expectedUserId: userId,
          match: data.session?.user?.id === userId,
          expiresAt: data.session?.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : "unknown",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [userId])

  if (!sessionInfo && !error) return null

  if (error) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 right-4 w-96 z-50">
        <AlertTitle>Erro de Sessão</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (sessionInfo && !sessionInfo.match) {
    return (
      <Alert className="fixed bottom-4 right-4 w-96 z-50 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900">
        <AlertTitle>Incompatibilidade de Sessão</AlertTitle>
        <AlertDescription className="text-xs">
          <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
