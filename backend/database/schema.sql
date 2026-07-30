-- ==========================================
-- OmniMind AI - Supabase PostgreSQL Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- pdf, docx, pptx, txt, image, code, zip
    file_size BIGINT NOT NULL, -- Size in bytes
    mime_type TEXT,
    summary TEXT,
    status VARCHAR(30) DEFAULT 'pending', -- pending, processing, indexed, error
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- extra file properties (page_count, resolution, language, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DOCUMENT CHUNKS TABLE (Tracks text chunks embedded in ChromaDB)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding_id TEXT NOT NULL, -- Reference ID stored inside ChromaDB collection
    token_count INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DOCUMENT TAGS TABLE
CREATE TABLE IF NOT EXISTS public.document_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, tag_name)
);

-- ==========================================
-- INDEXES FOR FAST QUERYING & FILTERS
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON public.documents(file_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_user_id ON public.document_chunks(user_id);

CREATE INDEX IF NOT EXISTS idx_tags_document_id ON public.document_tags(document_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_tag ON public.document_tags(user_id, tag_name);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can ONLY see & edit their OWN data
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Documents Policies
CREATE POLICY "Users can view their own documents" 
    ON public.documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" 
    ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
    ON public.documents FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
    ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Document Chunks Policies
CREATE POLICY "Users can view their own document chunks" 
    ON public.document_chunks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document chunks" 
    ON public.document_chunks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own document chunks" 
    ON public.document_chunks FOR DELETE USING (auth.uid() = user_id);

-- Document Tags Policies
CREATE POLICY "Users can view their own tags" 
    ON public.document_tags FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tags" 
    ON public.document_tags FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
