import Link from "next/link"
import { ArrowLeft, Database, Server, Code, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function SetupGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Voltar</span>
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Guia de Configuração do RealQ</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Configuração do Banco de Dados</CardTitle>
                <CardDescription>Siga este guia para configurar o banco de dados do RealQ no Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="automatic" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="automatic">Configuração Automática</TabsTrigger>
                    <TabsTrigger value="manual">Configuração Manual</TabsTrigger>
                  </TabsList>

                  <TabsContent value="automatic" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Database className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">1. Acesse o Supabase</h3>
                          <p className="text-muted-foreground">
                            Faça login no{" "}
                            <a
                              href="https://supabase.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Supabase
                            </a>{" "}
                            e acesse seu projeto.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Server className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">2. Acesse o SQL Editor</h3>
                          <p className="text-muted-foreground">
                            No menu lateral, clique em "SQL Editor" e depois em "New query".
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Code className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">3. Cole o Script SQL</h3>
                          <p className="text-muted-foreground">Cole o script SQL abaixo no editor e clique em "Run".</p>
                          <div className="mt-2 p-4 bg-muted rounded-md overflow-auto text-sm">
                            <pre>{`-- Criação das tabelas necessárias para o RealQ

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
CREATE POLICY "Usuários autenticados podem ler todos os usuários" 
ON public.users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as categorias" 
ON public.categories FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os produtos" 
ON public.products FOR SELECT 
TO authenticated 
USING (true);

-- Inserir dados iniciais
INSERT INTO public.categories (name) VALUES 
('Farináceos'),
('Açúcares'),
('Lácteos'),
('Óleos'),
('Fermentos'),
('Chocolates')
ON CONFLICT (name) DO NOTHING;

-- Trigger para criar automaticamente um registro na tabela users após o cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, user_type)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone', COALESCE(new.raw_user_meta_data->>'user_type', 'quality-user'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`}</pre>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">4. Verifique a Configuração</h3>
                          <p className="text-muted-foreground">
                            Após executar o script, verifique se as tabelas foram criadas corretamente na seção "Table
                            Editor".
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-4">
                      <p>Para configurar manualmente o banco de dados, siga os passos abaixo:</p>

                      <ol className="space-y-4 list-decimal pl-5">
                        <li>
                          <p className="font-semibold">Crie as tabelas necessárias</p>
                          <p className="text-muted-foreground">
                            Acesse o Table Editor no Supabase e crie as seguintes tabelas: users, categories, products,
                            suppliers, manufacturers, tests, tools, inspections, inspection_details, non_conformities,
                            action_plans.
                          </p>
                        </li>
                        <li>
                          <p className="font-semibold">Configure as relações entre as tabelas</p>
                          <p className="text-muted-foreground">
                            Configure as chaves estrangeiras para estabelecer as relações entre as tabelas.
                          </p>
                        </li>
                        <li>
                          <p className="font-semibold">Configure as políticas de segurança (RLS)</p>
                          <p className="text-muted-foreground">
                            Configure as políticas de Row Level Security para controlar o acesso aos dados.
                          </p>
                        </li>
                        <li>
                          <p className="font-semibold">Crie o trigger para novos usuários</p>
                          <p className="text-muted-foreground">
                            Crie um trigger que insere automaticamente um registro na tabela users quando um novo
                            usuário é criado na autenticação.
                          </p>
                        </li>
                      </ol>

                      <p>
                        Para mais detalhes sobre a configuração manual, consulte a{" "}
                        <a
                          href="https://supabase.com/docs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          documentação do Supabase
                        </a>
                        .
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button asChild>
                <Link href="/">Voltar para a Página Inicial</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
