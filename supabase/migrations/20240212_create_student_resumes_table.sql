-- Create a separate table for student resumes
create table if not exists public.student_resumes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  user_id uuid references auth.users not null,
  content jsonb not null default '{}'::jsonb,
  school_name text,
  graduation_year text,
  is_public boolean default false
);

-- Enable Row Level Security (RLS)
alter table public.student_resumes enable row level security;

-- Create policies so users can only access their own student resumes
create policy "Users can view their own student resumes"
  on public.student_resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own student resumes"
  on public.student_resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own student resumes"
  on public.student_resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own student resumes"
  on public.student_resumes for delete
  using (auth.uid() = user_id);
