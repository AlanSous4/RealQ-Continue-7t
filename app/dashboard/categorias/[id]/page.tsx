"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Converte ID corretamente para string
  const rawId = params?.id ?? "";
  const categoryId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================
  // FETCH CATEGORY DETAILS
  // ==========================
  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setCategory(data);
      }

      setLoading(false);
    };

    fetchCategory();
  }, [categoryId]);

  // ==========================
  // DELETE CATEGORY
  // ==========================
  async function handleDelete() {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }

    alert("Categoria excluída com sucesso!");
    router.push("/dashboard/categories");
  }

  // ==========================
  // UI STATES
  // ==========================
  if (loading) return <div className="p-4 text-gray-500">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;
  if (!category) return <div className="p-4">Categoria não encontrada.</div>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Detalhes da Categoria</h1>

      <div className="mb-2">
        <span className="font-semibold">ID:</span> {category.id}
      </div>

      <div className="mb-2">
        <span className="font-semibold">Nome:</span> {category.name}
      </div>

      <div className="mb-2">
        <span className="font-semibold">Criado em:</span>{" "}
        {new Date(category.created_at).toLocaleString()}
      </div>

      {/* Ações */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() =>
            router.push(`/dashboard/categories/${categoryId}/edit`)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Editar
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
