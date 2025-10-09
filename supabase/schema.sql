-- Criação das tabelas necessárias para o RealQ

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

CREATE POLICY "Usuários autenticados podem ler todos os fornecedores" 
ON public.suppliers FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os fabricantes" 
ON public.manufacturers FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os testes" 
ON public.tests FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as ferramentas" 
ON public.tools FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as inspeções" 
ON public.inspections FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os detalhes de inspeção" 
ON public.inspection_details FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as não conformidades" 
ON public.non_conformities FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários autenticados podem ler todos os planos de ação" 
ON public.action_plans FOR SELECT 
TO authenticated 
USING (true);

-- Políticas de inserção
CREATE POLICY "Usuários autenticados podem inserir usuários" 
ON public.users FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem inserir categorias" 
ON public.categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem inserir produtos" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

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
