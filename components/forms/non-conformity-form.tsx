"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { registerNonConformity } from "@/lib/services/inspection-service-extended"

interface NonConformityFormProps {
  inspection: any
  onComplete: () => void
}

export function NonConformityForm({ inspection, onComplete }: NonConformityFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    severity: "medium",
    category: "",
    impact: "",
    createActionPlan: true,
    actionPlanDescription: "",
    actionPlanDueDate: "",
    actionPlanResponsible: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Salvar no Supabase
      await registerNonConformity(inspection.id, formData)

      toast({
        title: "Não conformidade registrada",
        description: formData.createActionPlan
          ? "A não conformidade e o plano de ação foram registrados com sucesso."
          : "A não conformidade foi registrada com sucesso.",
      })

      onComplete()
    } catch (error) {
      console.error("Erro ao registrar não conformidade:", error)
      toast({
        title: "Erro ao registrar não conformidade",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao registrar a não conformidade. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição da Não Conformidade</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva detalhadamente a não conformidade encontrada"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Severidade</Label>
        <RadioGroup
          value={formData.severity}
          onValueChange={(value) => handleSelectChange("severity", value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="severity-low" />
            <Label htmlFor="severity-low" className="text-sm font-normal">
              Baixa
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="severity-medium" />
            <Label htmlFor="severity-medium" className="text-sm font-normal">
              Média
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="severity-high" />
            <Label htmlFor="severity-high" className="text-sm font-normal">
              Alta
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="critical" id="severity-critical" />
            <Label htmlFor="severity-critical" className="text-sm font-normal">
              Crítica
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raw_material">Matéria-prima</SelectItem>
              <SelectItem value="process">Processo</SelectItem>
              <SelectItem value="equipment">Equipamento</SelectItem>
              <SelectItem value="personnel">Pessoal</SelectItem>
              <SelectItem value="environment">Ambiente</SelectItem>
              <SelectItem value="documentation">Documentação</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="impact">Impacto</Label>
          <Input
            id="impact"
            name="impact"
            placeholder="Descreva o impacto da não conformidade"
            value={formData.impact}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="createActionPlan" className="text-base">
            Criar Plano de Ação
          </Label>
          <Switch
            id="createActionPlan"
            checked={formData.createActionPlan}
            onCheckedChange={(checked) => handleSwitchChange("createActionPlan", checked)}
          />
        </div>
      </div>

      {formData.createActionPlan && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="space-y-2">
            <Label htmlFor="actionPlanDescription">Descrição do Plano de Ação</Label>
            <Textarea
              id="actionPlanDescription"
              name="actionPlanDescription"
              placeholder="Descreva as ações a serem tomadas para corrigir a não conformidade"
              value={formData.actionPlanDescription}
              onChange={handleChange}
              required={formData.createActionPlan}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="actionPlanDueDate">Data de Conclusão</Label>
              <Input
                id="actionPlanDueDate"
                name="actionPlanDueDate"
                type="date"
                value={formData.actionPlanDueDate}
                onChange={handleChange}
                required={formData.createActionPlan}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionPlanResponsible">Responsável</Label>
              <Input
                id="actionPlanResponsible"
                name="actionPlanResponsible"
                placeholder="Nome do responsável"
                value={formData.actionPlanResponsible}
                onChange={handleChange}
                required={formData.createActionPlan}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Registrar Não Conformidade"}
        </Button>
      </div>
    </form>
  )
}
