"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Buscar dados existentes da categoria
  useEffect(() => {
    async function fetchCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle<Category>();

      if (error) {
        console.error("Erro ao carregar categoria:", error.message);
        return;
      }

      if (!data) {
        console.error("Categoria não encontrada");
        return;
      }

      setNome(data.name ?? "");
      setDescricao(data.description ?? "");
      setLoading(false);
    }

    fetchCategory();
  }, [id]);

  // Atualizar os dados
  async function handleUpdate() {
    setSaving(true);

    const { error } = await supabase
      .from("categories")
      .update({
        name: nome,
        description: descricao,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Erro ao atualizar categoria: " + error.message);
      return;
    }

    router.push(`/dashboard/categorias/${id}/view`);
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Categoria</h1>

      <label className="font-medium">Nome</label>
      <Input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="mb-4"
      />

      <label className="font-medium">Descrição</label>
      <Textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="mb-6"
      />

      <div className="flex gap-3">
        <Button onClick={handleUpdate} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => router.push(`/dashboard/categorias/${id}/view`)}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
