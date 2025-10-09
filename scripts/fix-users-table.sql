-- Verificar se a tabela users existe e tem a estrutura correta
DO $$
BEGIN
    -- Verificar se a tabela users existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Criar a tabela users se não existir
        CREATE TABLE users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            user_type VARCHAR(50) DEFAULT 'quality-user',
            profile_image TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar índices
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_user_type ON users(user_type);
        
        RAISE NOTICE 'Tabela users criada com sucesso';
    ELSE
        RAISE NOTICE 'Tabela users já existe';
        
        -- Verificar se a coluna profile_image existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profile_image') THEN
            ALTER TABLE users ADD COLUMN profile_image TEXT;
            RAISE NOTICE 'Coluna profile_image adicionada à tabela users';
        END IF;
        
        -- Verificar se a coluna updated_at existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
            ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Coluna updated_at adicionada à tabela users';
        END IF;
    END IF;
    
    -- Criar ou atualizar a função de trigger para updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    -- Criar o trigger se não existir
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
    RAISE NOTICE 'Trigger de updated_at configurado';
    
    -- Criar função para criar usuário automaticamente
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO public.users (id, email, name, phone, user_type)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'phone', ''),
            COALESCE(NEW.raw_user_meta_data->>'user_type', 'quality-user')
        );
        RETURN NEW;
    EXCEPTION
        WHEN unique_violation THEN
            -- Usuário já existe, não fazer nada
            RETURN NEW;
        WHEN OTHERS THEN
            -- Log do erro mas não falhar
            RAISE WARNING 'Erro ao criar perfil do usuário: %', SQLERRM;
            RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Criar o trigger se não existir
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
    RAISE NOTICE 'Trigger de criação automática de usuário configurado';
    
END $$;
