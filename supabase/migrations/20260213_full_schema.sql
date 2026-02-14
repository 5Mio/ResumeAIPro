-- Comprehensive Schema Setup for ResumeAI Pro

-- 1. Profiles (User Metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    subscription_tier TEXT DEFAULT 'free'
);

-- 2. admin_templates (AI-Generated and System Templates)
CREATE TABLE IF NOT EXISTS public.admin_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    template_id TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    source_file_url TEXT,
    ai_provider TEXT NOT NULL,
    generation_prompt TEXT,
    generation_time_ms INTEGER,
    component_path TEXT NOT NULL,
    component_code TEXT NOT NULL,
    component_name TEXT NOT NULL,
    preview_image_url TEXT,
    status TEXT DEFAULT 'active',
    is_pro BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    version INTEGER DEFAULT 1,
    parent_template_id UUID
);

-- 3. template_generation_logs
CREATE TABLE IF NOT EXISTS public.template_generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    template_id UUID REFERENCES public.admin_templates(id),
    ai_provider TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    execution_time_ms INTEGER,
    request_payload JSONB,
    response_payload JSONB,
    created_by UUID REFERENCES auth.users(id)
);

-- 4. cover_letters
CREATE TABLE IF NOT EXISTS public.cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_job_title TEXT,
    target_company TEXT
);

-- 5. newsletter_subscriptions
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 6. contact_submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new'
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for admin_templates
CREATE POLICY "Admins can do everything on admin_templates" ON public.admin_templates
    FOR ALL USING (auth.jwt() ->> 'email' = 'adnan1981@gmx.de');
CREATE POLICY "Public can read active templates" ON public.admin_templates
    FOR SELECT USING (status = 'active');

-- Policies for template_generation_logs
CREATE POLICY "Admins can view logs" ON public.template_generation_logs
    FOR SELECT USING (auth.jwt() ->> 'email' = 'adnan1981@gmx.de');
CREATE POLICY "Admins can insert logs" ON public.template_generation_logs
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'adnan1981@gmx.de');

-- Policies for cover_letters
CREATE POLICY "Users can manage own cover letters" ON public.cover_letters
    FOR ALL USING (auth.uid() = user_id);

-- Policies for newsletter_subscriptions
CREATE POLICY "Admins can view subscriptions" ON public.newsletter_subscriptions
    FOR SELECT USING (auth.jwt() ->> 'email' = 'adnan1981@gmx.de');
CREATE POLICY "Public can subscribe" ON public.newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Policies for contact_submissions
CREATE POLICY "Admins can view submissions" ON public.contact_submissions
    FOR SELECT USING (auth.jwt() ->> 'email' = 'adnan1981@gmx.de');
CREATE POLICY "Public can submit contact form" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);
