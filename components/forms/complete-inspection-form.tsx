"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { completeInspection } from "@/lib/services/inspection-service-extended"

interface CompleteInspectionFormProps {
  inspection: any
  onComplete: () => void
}

export function CompleteInspectionForm({ inspection, onComplete }: CompleteInspectionFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    color: "",
    odor: "",
    appearance: "",
    texture: "",
    temperature: "",
    humidity: "",
    notes: "",
    result: "approved",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Salvar no Supabase
      await completeInspection(inspection.id, formData)

      toast({
        title: "Inspeção atualizada",
        description: "A inspeção foi atualizada com sucesso.",
      })

      onComplete()
    } catch (error) {
      console.error("Erro ao atualizar inspeção:", error)
      toast({
        title: "Erro ao atualizar inspeção",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a inspeção. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="texture">Textura</Label>
          <Input
            id="texture"
            name="texture"
            placeholder="Descreva a textura do produto"
            value={formData.texture}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperatura (°C)</Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            placeholder="Temperatura em °C"
            value={formData.temperature}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="humidity">Umidade (%)</Label>
          <Input
            id="humidity"
            name="humidity"
            type="number"
            placeholder="Umidade em %"
            value={formData.humidity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Observações adicionais sobre a inspeção"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="result">Resultado da Inspeção</Label>
        <Select value={formData.result} onValueChange={(value) => handleSelectChange("result", value)}>
          <SelectTrigger id="result">
            <SelectValue placeholder="Selecione o resultado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="approved_with_restrictions">Aprovado com Restrições</SelectItem>
            <SelectItem value="rejected">Reprovado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Inspeção"}
        </Button>
      </div>
    </form>
  )
}
