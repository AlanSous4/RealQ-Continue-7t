import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

// Configuração temporária para permitir acesso sem autenticação
const BYPASS_AUTH = true // Defina como false para reativar a autenticação

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next()

  // Skip middleware for static assets and API routes
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/static")
  ) {
    return res
  }

  console.log(`[Middleware] Processing request for: ${req.nextUrl.pathname}`)

  // Se o bypass de autenticação estiver ativado, permita o acesso a todas as rotas
  if (BYPASS_AUTH) {
    console.log(`[Middleware] Auth bypass enabled, allowing access to: ${req.nextUrl.pathname}`)
    return res
  }

  try {
    // Create Supabase client
    const supabase = createMiddlewareClient<Database>({ req, res })

    // Get session with additional logging
    console.log(`[Middleware] Checking session for: ${req.nextUrl.pathname}`)
    const sessionStart = Date.now()
    const sessionResult = await supabase.auth.getSession()
    const sessionEnd = Date.now()
    const session = sessionResult.data?.session

    console.log(`[Middleware] Session check took ${sessionEnd - sessionStart}ms`)

    if (sessionResult.error) {
      console.error(`[Middleware] Error getting session:`, sessionResult.error)
    }

    // Log detailed session information for debugging
    if (session) {
      console.log(`[Middleware] Session found:`, {
        userId: session.user?.id,
        email: session.user?.email,
        created: session.created_at,
        expires: new Date(session.expires_at * 1000).toISOString(),
        remaining: Math.floor((session.expires_at * 1000 - Date.now()) / 1000) + "s",
      })
    } else {
      console.log(`[Middleware] No session found`)
    }

    // Define protected and auth routes
    const isAuthRoute = ["/login", "/cadastro", "/recuperar-senha"].includes(req.nextUrl.pathname)
    const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard")

    console.log(
      `[Middleware] Route type: ${isAuthRoute ? "Auth route" : isProtectedRoute ? "Protected route" : "Public route"}`,
    )

    // Handle unauthenticated user trying to access protected route
    if (!session && isProtectedRoute) {
      console.log(`[Middleware] Redirecting unauthenticated user from ${req.nextUrl.pathname} to /login`)
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Handle authenticated user trying to access auth route
    if (session && isAuthRoute) {
      console.log(`[Middleware] Redirecting authenticated user from ${req.nextUrl.pathname} to /dashboard`)
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    console.log(`[Middleware] Request allowed to proceed to: ${req.nextUrl.pathname}`)
    return res
  } catch (error) {
    // In case of error, log and allow the request to continue
    console.error("[Middleware] Error in middleware:", error)
    return res
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
