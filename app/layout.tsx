// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RealQ - Sistema de Controle de Qualidade",
  description: "Ferramenta de qualidade para cadastro e controle de produtos alimentícios",
  generator: "v0.app",
  openGraph: {
    title: "RealQ - Sistema de Controle de Qualidade",
    description: "Ferramenta de qualidade para cadastro e controle de produtos alimentícios",
    url: "https://real-q-continue-7t.vercel.app/",
    siteName: "RealQ",
    images: [
      {
        url: "https://real-q-continue-7t.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "RealQ - Controle de Qualidade",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealQ - Sistema de Controle de Qualidade",
    description: "Ferramenta de qualidade para cadastro e controle de produtos alimentícios",
    images: ["https://real-q-continue-7t.vercel.app/preview.png"],
  },
}

function safeString(value: unknown): string | undefined {
  if (typeof value === "string") return value
  if (typeof value === "object" && value !== null && "default" in value) {
    const defaultValue = (value as { default?: string }).default
    return typeof defaultValue === "string" ? defaultValue : undefined
  }
  return undefined
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta property="og:title" content={safeString(metadata.openGraph?.title)} />
        <meta property="og:description" content={safeString(metadata.openGraph?.description)} />
        <meta property="og:url" content={safeString(metadata.openGraph?.url)} />
        <meta property="og:site_name" content={safeString(metadata.openGraph?.siteName)} />
        <meta property="og:type" content={safeString(metadata.openGraph?.type)} />
        <meta property="og:image" content={safeString(metadata.openGraph?.images?.[0]?.url)} />
        <meta property="og:image:width" content={metadata.openGraph?.images?.[0]?.width?.toString()} />
        <meta property="og:image:height" content={metadata.openGraph?.images?.[0]?.height?.toString()} />
        <meta property="og:image:alt" content={safeString(metadata.openGraph?.images?.[0]?.alt)} />

        <meta name="twitter:card" content={safeString(metadata.twitter?.card)} />
        <meta name="twitter:title" content={safeString(metadata.twitter?.title)} />
        <meta name="twitter:description" content={safeString(metadata.twitter?.description)} />
        <meta name="twitter:image" content={safeString(metadata.twitter?.images?.[0])} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
