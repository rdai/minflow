-- ============================================================
-- Mission Workflow Map — minflow schema
--
-- BEFORE RUNNING: In Supabase dashboard go to
-- Settings → API → "Extra schemas to expose in your API"
-- and add: minflow
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create schema
create schema if not exists minflow;

-- Grant usage to Supabase roles
grant usage on schema minflow to anon, authenticated, service_role;
grant all on all tables in schema minflow to anon, authenticated, service_role;
grant all on all sequences in schema minflow to anon, authenticated, service_role;
alter default privileges in schema minflow grant all on tables to anon, authenticated, service_role;
alter default privileges in schema minflow grant all on sequences to anon, authenticated, service_role;

-- ============================================================
-- TABLES
-- ============================================================

-- Workflows
create table if not exists minflow.workflows (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  category text,   -- ministry goal: Scripture Access / Evangelism / Follow-up / Discipleship / etc.
  medium text,     -- output medium: Text / Audio / Film / Digital / Print / In-Person / Mixed
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workflow Steps
create table if not exists minflow.workflow_steps (
  id uuid primary key default uuid_generate_v4(),
  workflow_id uuid not null references minflow.workflows(id) on delete cascade,
  title text not null,
  description text,
  step_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workflow Outputs
create table if not exists minflow.workflow_outputs (
  id uuid primary key default uuid_generate_v4(),
  workflow_id uuid not null references minflow.workflows(id) on delete cascade,
  title text not null,
  description text
);

-- Workflow Inputs
create table if not exists minflow.workflow_inputs (
  id uuid primary key default uuid_generate_v4(),
  workflow_id uuid not null references minflow.workflows(id) on delete cascade,
  title text not null,
  description text
);

-- Tools
create table if not exists minflow.tools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  url text,
  category text,
  cost_level text check (cost_level in ('free', 'freemium', 'paid')),
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  offline_capable boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Step Tools (many-to-many)
create table if not exists minflow.step_tools (
  id uuid primary key default uuid_generate_v4(),
  step_id uuid not null references minflow.workflow_steps(id) on delete cascade,
  tool_id uuid not null references minflow.tools(id) on delete cascade,
  role text,
  notes text,
  recommended_level text,
  unique(step_id, tool_id)
);

-- Workflow Links (graph edges)
create table if not exists minflow.workflow_links (
  id uuid primary key default uuid_generate_v4(),
  source_workflow_id uuid not null references minflow.workflows(id) on delete cascade,
  target_workflow_id uuid not null references minflow.workflows(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('enables', 'requires', 'feeds_into', 'alternative_to')),
  description text,
  unique(source_workflow_id, target_workflow_id, relationship_type)
);

-- ============================================================
-- RLS
-- ============================================================

alter table minflow.workflows enable row level security;
alter table minflow.workflow_steps enable row level security;
alter table minflow.workflow_outputs enable row level security;
alter table minflow.workflow_inputs enable row level security;
alter table minflow.tools enable row level security;
alter table minflow.step_tools enable row level security;
alter table minflow.workflow_links enable row level security;

-- Public read
create policy "public read workflows" on minflow.workflows for select using (true);
create policy "public read steps" on minflow.workflow_steps for select using (true);
create policy "public read outputs" on minflow.workflow_outputs for select using (true);
create policy "public read inputs" on minflow.workflow_inputs for select using (true);
create policy "public read tools" on minflow.tools for select using (true);
create policy "public read step_tools" on minflow.step_tools for select using (true);
create policy "public read links" on minflow.workflow_links for select using (true);

-- Authenticated write
create policy "admin write workflows" on minflow.workflows for all using (auth.role() = 'authenticated');
create policy "admin write steps" on minflow.workflow_steps for all using (auth.role() = 'authenticated');
create policy "admin write outputs" on minflow.workflow_outputs for all using (auth.role() = 'authenticated');
create policy "admin write inputs" on minflow.workflow_inputs for all using (auth.role() = 'authenticated');
create policy "admin write tools" on minflow.tools for all using (auth.role() = 'authenticated');
create policy "admin write step_tools" on minflow.step_tools for all using (auth.role() = 'authenticated');
create policy "admin write links" on minflow.workflow_links for all using (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_minflow_steps_workflow_id on minflow.workflow_steps(workflow_id);
create index if not exists idx_minflow_steps_order on minflow.workflow_steps(workflow_id, step_order);
create index if not exists idx_minflow_outputs_workflow_id on minflow.workflow_outputs(workflow_id);
create index if not exists idx_minflow_inputs_workflow_id on minflow.workflow_inputs(workflow_id);
create index if not exists idx_minflow_step_tools_step_id on minflow.step_tools(step_id);
create index if not exists idx_minflow_links_source on minflow.workflow_links(source_workflow_id);
create index if not exists idx_minflow_links_target on minflow.workflow_links(target_workflow_id);
create index if not exists idx_minflow_workflows_slug on minflow.workflows(slug);
create index if not exists idx_minflow_tools_slug on minflow.tools(slug);
