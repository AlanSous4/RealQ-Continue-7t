import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Criar tabela de características de inspeção (se não existir)
    const { error: characteristicsError } = await supabase.rpc("exec_sql", {
      sql_string: `
        CREATE TABLE IF NOT EXISTS public.inspection_characteristics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
          color TEXT,
          odor TEXT,
          appearance TEXT,
          texture TEXT,
          temperature TEXT,
          humidity TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        ALTER TABLE public.inspection_characteristics ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todas as características de inspeção" 
        ON public.inspection_characteristics FOR SELECT 
        TO authenticated 
        USING (true);

        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem inserir características de inspeção" 
        ON public.inspection_characteristics FOR INSERT 
        TO authenticated 
        WITH CHECK (true);

        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem atualizar características de inspeção" 
        ON public.inspection_characteristics FOR UPDATE 
        TO authenticated 
        USING (true);
      `,
    })

    if (characteristicsError) {
      console.error("Erro ao criar tabela de características:", characteristicsError)
      return NextResponse.json({ error: "Erro ao criar tabela de características" }, { status: 500 })
    }

    // Campos em non_conformities
    const { error: nonConformityCategoryError } = await supabase.rpc("exec_sql", {
      sql_string: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'non_conformities' 
            AND column_name = 'category'
          ) THEN
            ALTER TABLE public.non_conformities ADD COLUMN category TEXT;
          END IF;

          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'non_conformities' 
            AND column_name = 'impact'
          ) THEN
            ALTER TABLE public.non_conformities ADD COLUMN impact TEXT;
          END IF;
        END
        $$;
      `,
    })

    if (nonConformityCategoryError) {
      console.error("Erro ao adicionar campos à tabela de não conformidades:", nonConformityCategoryError)
      return NextResponse.json({ error: "Erro ao atualizar tabela de não conformidades" }, { status: 500 })
    }

    // Campos em action_plans
    const { error: actionPlanNonConformityError } = await supabase.rpc("exec_sql", {
      sql_string: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'action_plans' 
            AND column_name = 'non_conformity_id'
          ) THEN
            ALTER TABLE public.action_plans ADD COLUMN non_conformity_id UUID REFERENCES public.non_conformities(id) ON DELETE SET NULL;
          END IF;

          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'action_plans' 
            AND column_name = 'responsible'
          ) THEN
            ALTER TABLE public.action_plans ADD COLUMN responsible TEXT;
          END IF;
        END
        $$;
      `,
    })

    if (actionPlanNonConformityError) {
      console.error("Erro ao adicionar campos à tabela de planos de ação:", actionPlanNonConformityError)
      return NextResponse.json({ error: "Erro ao atualizar tabela de planos de ação" }, { status: 500 })
    }

    // Inserir testes padrão
    const { error: testsError } = await supabase.rpc("exec_sql", {
      sql_string: `
        INSERT INTO public.tests (name, description)
        VALUES 
          ('Análise Visual', 'Verificação visual do produto quanto a cor, aparência e integridade'),
          ('Análise de Umidade', 'Medição do teor de umidade do produto'),
          ('Análise de pH', 'Medição do pH do produto'),
          ('Análise Microbiológica', 'Verificação da presença de microorganismos no produto'),
          ('Análise de Textura', 'Avaliação da textura do produto'),
          ('Análise de Sabor', 'Avaliação do sabor do produto'),
          ('Análise de Odor', 'Avaliação do odor do produto')
        ON CONFLICT DO NOTHING;
      `,
    })

    if (testsError) {
      console.error("Erro ao inserir testes padrão:", testsError)
      return NextResponse.json({ error: "Erro ao inserir testes padrão" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Banco de dados configurado com sucesso" })
  } catch (error) {
    console.error("Erro ao configurar banco de dados:", error)
    return NextResponse.json({ error: "Erro ao configurar banco de dados" }, { status: 500 })
  }
}
