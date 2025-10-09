"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Camera, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function NewInspectionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    batch: "",
    supplierId: "",
    manufacturerId: "",
    expiryDate: "",
    notes: "",
    color: "",
    odor: "",
    appearance: "",
    photos: [] as string[],
  })

  // Mock data - in a real app, this would come from an API
  const products = [
    { id: "1", name: "Farinha de Trigo" },
    { id: "2", name: "Açúcar Refinado" },
    { id: "3", name: "Leite em Pó" },
    { id: "4", name: "Óleo de Soja" },
  ]

  const suppliers = [
    { id: "1", name: "Moinho Paulista" },
    { id: "2", name: "Usina Santa Clara" },
    { id: "3", name: "Laticínios do Vale" },
    { id: "4", name: "Grãos do Sul" },
  ]

  const manufacturers = [
    { id: "1", name: "Moinho Nacional" },
    { id: "2", name: "Açúcar Brasil" },
    { id: "3", name: "Laticínios Unidos" },
    { id: "4", name: "Óleos e Grãos SA" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker or camera
    // For this example, we'll just add a placeholder
    const newPhoto = `/placeholder.svg?height=200&width=200&text=Photo ${formData.photos.length + 1}`
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto],
    }))
  }

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would call an API to create the inspection
      console.log("Form submitted:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Inspeção criada",
        description: "A inspeção foi criada com sucesso.",
      })

      // Redirect to inspections list
      router.push("/dashboard/inspecoes")
    } catch (error) {
      toast({
        title: "Erro ao criar inspeção",
        description: "Ocorreu um erro ao criar a inspeção. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const canProceedToQuality =
    formData.productId && formData.batch && formData.supplierId && formData.manufacturerId && formData.expiryDate
  const canSubmit = canProceedToQuality && formData.color && formData.odor && formData.appearance

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/inspecoes">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Nova Inspeção</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Inspeção</CardTitle>
          <CardDescription>Preencha os dados para registrar uma nova inspeção de produto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="quality" disabled={!canProceedToQuality}>
                  Análise de Qualidade
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="productId">Produto</Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) => handleSelectChange("productId", value)}
                      required
                    >
                      <SelectTrigger id="productId">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="batch">Lote</Label>
                    <Input
                      id="batch"
                      name="batch"
                      placeholder="Digite o número do lote"
                      value={formData.batch}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="supplierId">Fornecedor</Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) => handleSelectChange("supplierId", value)}
                      required
                    >
                      <SelectTrigger id="supplierId">
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="manufacturerId">Fabricante</Label>
                    <Select
                      value={formData.manufacturerId}
                      onValueChange={(value) => handleSelectChange("manufacturerId", value)}
                      required
                    >
                      <SelectTrigger id="manufacturerId">
                        <SelectValue placeholder="Selecione um fabricante" />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers.map((manufacturer) => (
                          <SelectItem key={manufacturer.id} value={manufacturer.id}>
                            {manufacturer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Data de Validade</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Observações adicionais sobre o produto"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => handleTabChange("quality")} disabled={!canProceedToQuality}>
                    Próximo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      name="color"
                      placeholder="Descreva a cor do produto"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="odor">Odor</Label>
                    <Input
                      id="odor"
                      name="odor"
                      placeholder="Descreva o odor do produto"
                      value={formData.odor}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="appearance">Aspecto</Label>
                    <Input
                      id="appearance"
                      name="appearance"
                      placeholder="Descreva o aspecto do produto"
                      value={formData.appearance}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fotos</Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative rounded-md border">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Foto ${index + 1}`}
                          className="h-32 w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-1 top-1 h-6 w-6"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed"
                      onClick={handleAddPhoto}
                    >
                      <Camera className="mb-2 h-6 w-6" />
                      <span>Adicionar Foto</span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => handleTabChange("basic")}>
                    Voltar
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting ? "Salvando..." : "Salvar Inspeção"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
