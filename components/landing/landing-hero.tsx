"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function LandingHero() {
  const [userType, setUserType] = useState("quality-user")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to registration with pre-filled data
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      type: userType,
    })
    window.location.href = `/cadastro?${params.toString()}`
  }

  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2 backdrop-blur-sm bg-background/70 p-4 rounded-lg">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Controle de Qualidade Simplificado
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Gerencie inspeções de produtos alimentícios com eficiência e precisão. Documentação completa,
              rastreabilidade e conformidade em um só lugar.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <RadioGroup
              defaultValue="quality-user"
              value={userType}
              onValueChange={setUserType}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="quality-user" id="quality-user" className="peer sr-only" />
                <Label
                  htmlFor="quality-user"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="font-semibold">Profissional QA</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="admin-user" id="admin-user" className="peer sr-only" />
                <Label
                  htmlFor="admin-user"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="font-semibold">Gestor QA</span>
                </Label>
              </div>
            </RadioGroup>
            <div className="space-y-4 rounded-lg border p-4 bg-white">
              {userType === "quality-user" ? (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Para Profissionais de Qualidade</h3>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Registre inspeções de forma rápida e padronizada</li>
                    <li>Acesse histórico completo de produtos e fornecedores</li>
                    <li>Gerencie não conformidades e planos de ação</li>
                    <li>Receba alertas de produtos próximos ao vencimento</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Para Gestores de Qualidade</h3>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Visualize métricas e indicadores em tempo real</li>
                    <li>Acompanhe o desempenho da equipe de qualidade</li>
                    <li>Gere relatórios personalizados para tomada de decisão</li>
                    <li>Implemente o sistema em sua empresa com facilidade</li>
                  </ul>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[400px] w-full md:h-[500px]">
            <Image
              src="/placeholder.svg?height=500&width=500&text=RealQ+Dashboard"
              alt="RealQ Dashboard"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
