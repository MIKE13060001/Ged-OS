-- GEDOS — Supabase schema
-- Run this in the Supabase SQL editor to initialize the database

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Folders
create table if not exists public.folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text,
  created_at  timestamptz default now()
);
alter table public.folders enable row level security;
create policy "Users manage own folders" on public.folders
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Documents
create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  original_name text,
  mime_type     text not null,
  size          bigint not null default 0,
  folder_id     uuid references public.folders(id) on delete set null,
  ocr_status    text not null default 'pending' check (ocr_status in ('pending','processing','completed','error')),
  ocr_text      text,
  tags          text[] default '{}',
  version       integer not null default 1,
  root_id       uuid references public.documents(id) on delete cascade,
  storage_path  text,
  preview_url   text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table public.documents enable row level security;
create policy "Users manage own documents" on public.documents
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger documents_updated_at before update on public.documents
  for each row execute function public.update_updated_at();

-- Audit events (append-only)
create table if not exists public.audit_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  action      text not null,
  detail      text not null,
  status      text not null default 'success' check (status in ('success','warning','error')),
  user_label  text not null default 'Utilisateur local',
  created_at  timestamptz default now()
);
alter table public.audit_events enable row level security;
create policy "Users read own audit events" on public.audit_events
  for select using (auth.uid() = user_id);
create policy "Users insert own audit events" on public.audit_events
  for insert with check (auth.uid() = user_id);

-- Storage bucket for documents
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
  on conflict (id) do nothing;
create policy "Users manage own files" on storage.objects
  for all using (auth.uid()::text = (storage.foldername(name))[1]);
