"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabaseClient } from "@/lib/supabase/auth"

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [cookies, setCookies] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)
        setError(null)

        // Get session
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession()
        if (sessionError) {
          throw sessionError
        }
        setSessionInfo(sessionData)

        // Get user
        if (sessionData.session) {
          const { data: userData, error: userError } = await supabaseClient.auth.getUser()
          if (userError) {
            throw userError
          }
          setUserInfo(userData)
        }

        // Get cookies (browser only)
        if (typeof document !== "undefined") {
          setCookies(document.cookie.split(";").map((cookie) => cookie.trim()))
        }
      } catch (err) {
        console.error("Debug page error:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const refreshSession = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabaseClient.auth.refreshSession()

      if (error) {
        throw error
      }

      setSessionInfo({ session: data.session })
      setUserInfo({ user: data.user })

      if (typeof document !== "undefined") {
        setCookies(document.cookie.split(";").map((cookie) => cookie.trim()))
      }
    } catch (err) {
      console.error("Session refresh error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const clearSession = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabaseClient.auth.signOut()

      if (error) {
        throw error
      }

      setSessionInfo({ session: null })
      setUserInfo({ user: null })

      if (typeof document !== "undefined") {
        setCookies(document.cookie.split(";").map((cookie) => cookie.trim()))
      }
    } catch (err) {
      console.error("Sign out error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>Current authentication session details</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading session information...</p>
            ) : (
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Current user details</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading user information...</p>
            ) : (
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80">{JSON.stringify(userInfo, null, 2)}</pre>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
            <CardDescription>Current browser cookies</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading cookie information...</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {cookies.length > 0 ? (
                  cookies.map((cookie, index) => (
                    <li key={index} className="text-sm font-mono">
                      {cookie}
                    </li>
                  ))
                ) : (
                  <li>No cookies found</li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={refreshSession} disabled={loading}>
          Refresh Session
        </Button>
        <Button onClick={clearSession} disabled={loading} variant="destructive">
          Clear Session
        </Button>
      </div>
    </div>
  )
}
