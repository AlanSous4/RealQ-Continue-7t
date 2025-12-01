"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import { ArrowLeft, Pencil } from "lucide-react";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CategoryDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Conserta o ID
  const rawId = params?.id ?? "";
  const categoryId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load category
  useEffect(() => {
    if (!categoryId) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (error) setError(error.message);
      else setCategory(data);

      setLoading(false);
    };

    load();
  }, [categoryId]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!category) return <div className="p-4">Categoria não encontrada.</div>;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/categorias")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>

        <button
          onClick={() =>
            router.push(`/dashboard/categorias/${categoryId}/editar`)
          }
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Pencil size={18} />
          Editar
        </button>
      </div>

      {/* Main Box */}
      <div className="bg-white border rounded-xl p-8 shadow-sm">

        {/* Section Title */}
        <h2 className="text-xl font-semibold mb-1">Detalhes da Categoria</h2>
        <p className="text-gray-500 mb-6">
          Informações detalhadas sobre esta categoria
        </p>

        {/* Campo Nome */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600">Nome</h3>
          <p className="text-lg">{category.name}</p>
          <div className="border-b mt-4"></div>
        </div>

        {/* Data de criação */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">ID</h3>
            <p className="text-lg">{category.id}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600">
              Data de Cadastro
            </h3>
            <p className="text-lg">
              {new Date(category.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="border-b mb-6"></div>

        {/* Sessão semelhante a "Inspeções Recentes" */}
        <h3 className="text-lg font-semibold mb-2">Produtos Relacionados</h3>
        <p className="text-gray-500">
          (Esta seção pode futuramente listar produtos dessa categoria.)
        </p>
      </div>
    </div>
  );
}
