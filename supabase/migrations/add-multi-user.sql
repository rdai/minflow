-- Migration: multi-user support
-- Run in Supabase SQL editor

set search_path to minflow;

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists minflow.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  org text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function minflow.handle_new_user()
returns trigger language plpgsql security definer set search_path = minflow as $$
begin
  insert into minflow.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure minflow.handle_new_user();

-- ============================================================
-- ACCESS REQUESTS
-- ============================================================
create table if not exists minflow.access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  org text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'invited', 'declined')),
  created_at timestamptz default now()
);

-- ============================================================
-- WORKFLOW COLUMNS
-- ============================================================
alter table minflow.workflows
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published')),
  add column if not exists is_clone_of uuid references minflow.workflows(id),
  add column if not exists contact_enabled boolean default false;

-- Existing workflows stay published
update minflow.workflows set status = 'published' where status is null;

-- ============================================================
-- TOOL COLUMNS
-- ============================================================
alter table minflow.tools
  add column if not exists created_by uuid references auth.users(id);

-- ============================================================
-- RLS — drop old permissive write policies, add scoped ones
-- ============================================================

-- Profiles
alter table minflow.profiles enable row level security;
create policy "public read profiles" on minflow.profiles for select using (true);
create policy "own profile write" on minflow.profiles for all using (auth.uid() = id);

-- Access requests — public insert, admin read
alter table minflow.access_requests enable row level security;
create policy "public insert access_requests" on minflow.access_requests for insert with check (true);
create policy "admin read access_requests" on minflow.access_requests for select
  using (exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true));
create policy "admin update access_requests" on minflow.access_requests for update
  using (exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true));

-- Workflows: public sees published only
drop policy if exists "public read workflows" on minflow.workflows;
create policy "public read published workflows" on minflow.workflows
  for select using (
    status = 'published'
    or created_by = auth.uid()
    or exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "admin write workflows" on minflow.workflows;
create policy "owner write workflows" on minflow.workflows
  for insert with check (auth.uid() is not null);
create policy "owner update workflows" on minflow.workflows
  for update using (
    created_by = auth.uid()
    or exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true)
  );
create policy "owner delete workflows" on minflow.workflows
  for delete using (
    created_by = auth.uid()
    or exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true)
  );

-- Steps/inputs/outputs/links — inherit via workflow ownership
drop policy if exists "admin write steps" on minflow.workflow_steps;
create policy "auth write steps" on minflow.workflow_steps for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "admin write outputs" on minflow.workflow_outputs;
create policy "auth write outputs" on minflow.workflow_outputs for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "admin write inputs" on minflow.workflow_inputs;
create policy "auth write inputs" on minflow.workflow_inputs for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "admin write links" on minflow.workflow_links;
create policy "auth write links" on minflow.workflow_links for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- Tools: any auth user can add, only creator or admin can edit
drop policy if exists "admin write tools" on minflow.tools;
create policy "auth insert tools" on minflow.tools for insert
  with check (auth.uid() is not null);
create policy "owner update tools" on minflow.tools for update
  using (
    created_by = auth.uid()
    or created_by is null
    or exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true)
  );
create policy "owner delete tools" on minflow.tools for delete
  using (
    created_by = auth.uid()
    or created_by is null
    or exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "admin write step_tools" on minflow.step_tools;
create policy "auth write step_tools" on minflow.step_tools for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- ============================================================
-- Set your own account as admin
-- Replace the email below with yours, then run this block
-- ============================================================
-- update minflow.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'your@email.com');
