-- Migration: private workflows + share links
-- Run in Supabase SQL editor

-- ============================================================
-- WORKFLOW COLUMNS
-- ============================================================

alter table minflow.workflows
  add column if not exists visibility text not null default 'public'
    check (visibility in ('public', 'private')),
  add column if not exists share_token text unique
    default encode(gen_random_bytes(24), 'hex');

-- Populate share_token for any rows missing it
update minflow.workflows
set share_token = encode(gen_random_bytes(24), 'hex')
where share_token is null;

-- Now enforce not null
alter table minflow.workflows alter column share_token set not null;

-- ============================================================
-- RLS — update workflow read policy
-- ============================================================

-- Drop the multi-user policy and replace with visibility-aware one
drop policy if exists "public read published workflows" on minflow.workflows;
drop policy if exists "read workflows" on minflow.workflows;

create policy "read workflows" on minflow.workflows for select using (
  (visibility = 'public' and status = 'published')
  or created_by = auth.uid()
  or exists (select 1 from minflow.profiles where id = auth.uid() and is_admin = true)
);
-- Note: private workflow access via share_token is handled at the
-- app layer using the service role client after token validation.

-- ============================================================
-- STEP CONTACTS
-- ============================================================

create table if not exists minflow.step_contacts (
  id uuid primary key default uuid_generate_v4(),
  step_id uuid not null references minflow.workflow_steps(id) on delete cascade,
  name text not null,
  email text,
  organization text,
  role text,
  notes text,
  created_at timestamptz default now()
);

alter table minflow.step_contacts enable row level security;

-- Only authenticated users can read/write contacts (sensitive data)
create policy "auth read step_contacts" on minflow.step_contacts for select
  using (auth.uid() is not null);

create policy "auth write step_contacts" on minflow.step_contacts for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_minflow_workflows_share_token on minflow.workflows(share_token);
create index if not exists idx_minflow_workflows_visibility on minflow.workflows(visibility);
create index if not exists idx_minflow_step_contacts_step_id on minflow.step_contacts(step_id);
