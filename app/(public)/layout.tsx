import type React from "react"
import { AnimatedBackground } from "@/components/animated-background"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimatedBackground />
      {children}
    </>
  )
}
