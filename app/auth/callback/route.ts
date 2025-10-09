import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

export async function GET(request: NextRequest) {
  try {
    console.log("[Auth Callback] Processing authentication callback")
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (!code) {
      console.error("[Auth Callback] No code parameter found in URL")
      return NextResponse.redirect(new URL("/login?error=no_code", request.url))
    }

    console.log("[Auth Callback] Code parameter found, exchanging for session")
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[Auth Callback] Error exchanging code for session:", error)
      return NextResponse.redirect(new URL("/login?error=auth_error", request.url))
    }

    console.log("[Auth Callback] Successfully exchanged code for session", {
      userId: data.session?.user.id,
      email: data.session?.user.email,
      expiresAt: data.session?.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : "unknown",
    })

    // Verify the session was created correctly
    const verifySession = await supabase.auth.getSession()
    if (verifySession.error || !verifySession.data.session) {
      console.error("[Auth Callback] Session verification failed:", verifySession.error)
      return NextResponse.redirect(new URL("/login?error=session_verification", request.url))
    }

    console.log("[Auth Callback] Session verified successfully")

    // Redirect to dashboard with a cache-busting parameter
    console.log("[Auth Callback] Redirecting to dashboard")
    const dashboardUrl = new URL("/dashboard", request.url)
    dashboardUrl.searchParams.set("auth", Date.now().toString())
    return NextResponse.redirect(dashboardUrl)
  } catch (error) {
    // In case of error, redirect to login with error parameter
    console.error("[Auth Callback] Unexpected error:", error)
    return NextResponse.redirect(new URL("/login?error=unexpected", request.url))
  }
}
