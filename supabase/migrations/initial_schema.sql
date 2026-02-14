-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for resumes
create table resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  template_id text not null default 'modern-professional',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for resumes
alter table resumes enable row level security;

create policy "Users can view own resumes." on resumes
  for select using (auth.uid() = user_id);

create policy "Users can create own resumes." on resumes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own resumes." on resumes
  for update using (auth.uid() = user_id);

create policy "Users can delete own resumes." on resumes
  for delete using (auth.uid() = user_id);

-- Create a table for cover letters
create table cover_letters (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  job_title text,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for cover letters
alter table cover_letters enable row level security;

create policy "Users can view own cover letters." on cover_letters
  for select using (auth.uid() = user_id);

create policy "Users can create own cover letters." on cover_letters
  for insert with check (auth.uid() = user_id);

create policy "Users can update own cover letters." on cover_letters
  for update using (auth.uid() = user_id);

create policy "Users can delete own cover letters." on cover_letters
  for delete using (auth.uid() = user_id);

-- Handle user creation (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
