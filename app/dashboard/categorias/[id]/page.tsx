/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { categoryService } from "@/lib/services/category-service";

import {
  WhiteCard,
  WhiteCardHeader,
  WhiteCardTitle,
  WhiteCardDescription,
  WhiteCardContent,
} from "@/components/ui/white-card";

export default async function CategoriaDetalhesPage({
  params,
}: {
  params: { id: string };
}) {
  // Busca da categoria via serviço oficial
  const category = await categoryService.getById(params.id);

  if (!category) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
          <p className="text-muted-foreground">Detalhes da categoria</p>
        </div>

        <Link href={`/dashboard/categorias/${category.id}/editar`}>
          <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </button>
        </Link>
      </div>

      <WhiteCard>
        <WhiteCardHeader>
          <WhiteCardTitle>Informações da Categoria</WhiteCardTitle>
          <WhiteCardDescription>
            Informações detalhadas sobre esta categoria
          </WhiteCardDescription>
        </WhiteCardHeader>

        <WhiteCardContent className="space-y-6">
          {/* Nome */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
            <p className="mt-1 text-base">{category.name}</p>
          </div>

          <hr />

          {/* Dados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
              <p className="mt-1">{category.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Data de Cadastro
              </h3>
              <p className="mt-1">
                {category.created_at
                  ? new Date(category.created_at).toLocaleDateString("pt-BR")
                  : "—"}
              </p>
            </div>
          </div>
        </WhiteCardContent>
      </WhiteCard>
    </div>
  );
}
