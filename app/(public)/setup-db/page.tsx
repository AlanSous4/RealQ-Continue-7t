"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client" // Usando a exportação supabase

export default function SetupDatabasePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const setupDatabase = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Executar o script SQL para criar as tabelas
      const { error: createTablesError } = await supabase.rpc("exec_sql", {
        sql_string: `
        -- Tabela de usuários (complementar à autenticação do Supabase)
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          phone TEXT,
          user_type TEXT NOT NULL DEFAULT 'quality-user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de categorias de produtos
        CREATE TABLE IF NOT EXISTS public.categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de produtos
        CREATE TABLE IF NOT EXISTS public.products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de fornecedores
        CREATE TABLE IF NOT EXISTS public.suppliers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          contact TEXT,
          email TEXT,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de fabricantes
        CREATE TABLE IF NOT EXISTS public.manufacturers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          contact TEXT,
          email TEXT,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de testes
        CREATE TABLE IF NOT EXISTS public.tests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de ferramentas
        CREATE TABLE IF NOT EXISTS public.tools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de inspeções
        CREATE TABLE IF NOT EXISTS public.inspections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
          batch TEXT NOT NULL,
          supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
          manufacturer_id UUID NOT NULL REFERENCES public.manufacturers(id) ON DELETE CASCADE,
          expiry_date DATE NOT NULL,
          status TEXT NOT NULL DEFAULT 'Pendente',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
        );
        
        -- Tabela de detalhes de inspeção
        CREATE TABLE IF NOT EXISTS public.inspection_details (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
          test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
          result TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
        
        -- Tabela de não conformidades
        CREATE TABLE IF NOT EXISTS public.non_conformities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
          description TEXT NOT NULL,
          severity TEXT NOT NULL DEFAULT 'Média',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
        );
        
        -- Tabela de planos de ação
        CREATE TABLE IF NOT EXISTS public.action_plans (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
          description TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Pendente',
          due_date DATE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
        );
        `,
      })

      if (createTablesError) {
        throw new Error(`Erro ao criar tabelas: ${createTablesError.message}`)
      }

      // Configurar RLS e políticas
      const { error: configRLSError } = await supabase.rpc("exec_sql", {
        sql_string: `
        -- Configurar RLS (Row Level Security)
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.inspection_details ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.non_conformities ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
        
        -- Criar políticas de acesso
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os usuários" 
        ON public.users FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todas as categorias" 
        ON public.categories FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os produtos" 
        ON public.products FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os fornecedores" 
        ON public.suppliers FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os fabricantes" 
        ON public.manufacturers FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os testes" 
        ON public.tests FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todas as ferramentas" 
        ON public.tools FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todas as inspeções" 
        ON public.inspections FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os detalhes de inspeção" 
        ON public.inspection_details FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todas as não conformidades" 
        ON public.non_conformities FOR SELECT 
        TO authenticated 
        USING (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem ler todos os planos de ação" 
        ON public.action_plans FOR SELECT 
        TO authenticated 
        USING (true);
        
        -- Políticas de inserção
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem inserir usuários" 
        ON public.users FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem inserir categorias" 
        ON public.categories FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
        
        CREATE POLICY IF NOT EXISTS "Usuários autenticados podem inserir produtos" 
        ON public.products FOR INSERT 
        TO authenticated 
        WITH CHECK (true);
        `,
      })

      if (configRLSError) {
        throw new Error(`Erro ao configurar RLS: ${configRLSError.message}`)
      }

      // Inserir dados iniciais
      const { error: insertDataError } = await supabase.rpc("exec_sql", {
        sql_string: `
        -- Inserir dados iniciais
        INSERT INTO public.categories (name) VALUES 
        ('Farináceos'),
        ('Açúcares'),
        ('Lácteos'),
        ('Óleos'),
        ('Fermentos'),
        ('Chocolates')
        ON CONFLICT (name) DO NOTHING;
        
        -- Inserir alguns fornecedores de exemplo
        INSERT INTO public.suppliers (name, contact, email, phone) VALUES 
        ('Moinho Paulista', 'João Silva', 'contato@moinhopaulista.com.br', '(11) 1234-5678'),
        ('Usina Santa Clara', 'Maria Oliveira', 'contato@usinasantaclara.com.br', '(11) 2345-6789'),
        ('Laticínios do Vale', 'Pedro Santos', 'contato@laticiniosdovale.com.br', '(11) 3456-7890'),
        ('Grãos do Sul', 'Ana Costa', 'contato@graosdosul.com.br', '(11) 4567-8901')
        ON CONFLICT DO NOTHING;
        
        -- Inserir alguns fabricantes de exemplo
        INSERT INTO public.manufacturers (name, contact, email, phone) VALUES 
        ('Moinho Nacional', 'Roberto Alves', 'contato@moinhonacional.com.br', '(11) 5678-9012'),
        ('Açúcar Brasil', 'Carla Mendes', 'contato@acucarbrasil.com.br', '(11) 6789-0123'),
        ('Laticínios Unidos', 'Fernando Lima', 'contato@laticiniosunidos.com.br', '(11) 7890-1234'),
        ('Óleos e Grãos SA', 'Juliana Ferreira', 'contato@oleosgraos.com.br', '(11) 8901-2345')
        ON CONFLICT DO NOTHING;
        
        -- Inserir alguns testes de exemplo
        INSERT INTO public.tests (name, description) VALUES 
        ('Análise Visual', 'Verificação visual do produto quanto a cor, aparência e integridade'),
        ('Análise de Umidade', 'Medição do teor de umidade do produto'),
        ('Análise de pH', 'Medição do pH do produto'),
        ('Análise Microbiológica', 'Verificação da presença de microorganismos no produto')
        ON CONFLICT DO NOTHING;
        `,
      })

      if (insertDataError) {
        throw new Error(`Erro ao inserir dados iniciais: ${insertDataError.message}`)
      }

      // Criar triggers
      const { error: createTriggersError } = await supabase.rpc("exec_sql", {
        sql_string: `
        -- Trigger para criar automaticamente um registro na tabela users após o cadastro
        CREATE OR REPLACE FUNCTION public.handle_new_user() 
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.users (id, email, name, phone, user_type)
          VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
                  COALESCE(new.raw_user_meta_data->>'phone', ''), 
                  COALESCE(new.raw_user_meta_data->>'user_type', 'quality-user'))
          ON CONFLICT (id) DO NOTHING;
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        
        -- Trigger para atualizar o registro na tabela users quando o usuário for atualizado
        CREATE OR REPLACE FUNCTION public.handle_user_update() 
        RETURNS TRIGGER AS $$
        BEGIN
          UPDATE public.users
          SET 
            email = new.email,
            name = COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
            phone = COALESCE(new.raw_user_meta_data->>'phone', ''),
            user_type = COALESCE(new.raw_user_meta_data->>'user_type', 'quality-user')
          WHERE id = new.id;
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
        CREATE TRIGGER on_auth_user_updated
        AFTER UPDATE ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();
        `,
      })

      if (createTriggersError) {
        throw new Error(`Erro ao criar triggers: ${createTriggersError.message}`)
      }

      // Verificar se o usuário atual existe na tabela users
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: userExists } = await supabase.from("users").select("id").eq("id", session.user.id).maybeSingle()

        if (!userExists) {
          // Criar o usuário na tabela users
          const { error: createUserError } = await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.name || session.user.email?.split("@")[0] || "Usuário",
            phone: session.user.user_metadata.phone || "",
            user_type: session.user.user_metadata.user_type || "quality-user",
          })

          if (createUserError) {
            console.error("Erro ao criar usuário:", createUserError)
          }
        }
      }

      setSuccess(true)
    } catch (err) {
      console.error("Erro ao configurar banco de dados:", err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao configurar o banco de dados")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuração do Banco de Dados</CardTitle>
          <CardDescription>
            Configure o banco de dados do RealQ com todas as tabelas e dados iniciais necessários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <AlertTitle className="text-green-800 dark:text-green-300">Sucesso!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                Banco de dados configurado com sucesso! Agora você pode acessar o sistema.
              </AlertDescription>
            </Alert>
          )}

          <p className="text-sm text-muted-foreground mb-4">
            Este processo irá criar todas as tabelas necessárias para o funcionamento do RealQ, configurar as políticas
            de segurança e inserir dados iniciais.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Voltar
          </Button>
          <Button onClick={setupDatabase} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              "Configurar Banco de Dados"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
