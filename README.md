# Mission Workflow Map

Visual knowledge graph for mission ministry workflows. Helps workers understand how common workflows connect, what tools are used at each step, and what each workflow leads to next.

## Stack

- **Next.js 16** (App Router)
- **@xyflow/react** (React Flow) — graph visualization
- **Supabase** — database + auth
- **Tailwind CSS**
- **dagre** — auto-layout for graph

## Setup

### 1. Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Run `supabase/seed.sql` in the SQL editor (7 workflows + 25 tools + all steps/links)
4. Create an auth user (Authentication > Users > Add user)

### 2. Environment

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run

```bash
npm install
npm run dev
```

## Routes

| Route | Description |
|---|---|
| `/` | Homepage with workflow cards |
| `/workflows` | All workflows grouped by category |
| `/workflows/[slug]` | Workflow detail + React Flow graph |
| `/tools` | All tools with cost/difficulty/offline info |
| `/admin` | Admin dashboard |
| `/admin/login` | Supabase auth login |
| `/admin/workflows` | Workflow CRUD |
| `/admin/workflows/[id]/edit` | Edit workflow + steps + links |
| `/admin/tools` | Tool CRUD |

## Database Schema

```
workflows
workflow_steps   → belongs to workflow
workflow_inputs  → belongs to workflow
workflow_outputs → belongs to workflow
tools
step_tools       → many-to-many (step ↔ tool)
workflow_links   → graph edges (workflow → workflow)
```

Relationship types in `workflow_links`:
- `feeds_into` — output becomes input
- `enables` — unlocks or empowers
- `requires` — must come before
- `alternative_to` — different path to similar goal

## Seeded Workflows

1. Bible Translation
2. Bible App Publishing
3. Audio Bible Recording
4. Jesus Film / LUMO Dubbing
5. Media to Movements Campaign
6. Online Chat Follow-up
7. Discipleship Resource Distribution

## Graph

Each workflow page shows a React Flow graph:
- **Inputs** (amber) → **Steps** (purple) → **Outputs** (red)
- **Tools** (green) — attached to specific steps
- **Linked Workflows** (blue) — downstream connections

Click any node to open a side panel with details.
