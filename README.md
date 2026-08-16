# Kanban Board

A full-stack Kanban board — projects, tasks with status swimlanes and labels, drag-and-drop
between columns. Built end-to-end as a learning project: the API came first (validation, auth,
transactions, tests, docs), then the React client was built against it.

This is a two-project monorepo — `client/` and `server/` are independent npm projects (their own
`package.json`, `node_modules`, lockfile).
`package.json`.

## Structure

| Path                          | What it is                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`server/`](server/README.md) | Express 5 + TypeScript API — JWT auth, Zod-validated REST endpoints, Knex/SQLite, auto-generated OpenAPI docs. |
| [`client/`](client/README.md) | React 19 + TypeScript + Vite frontend — Radix UI primitives, vanilla CSS, drag-and-drop board via `@dnd-kit`.  |

Each subproject's own README has the full tech stack, environment variables, and available
scripts — this file only covers how the two fit together.

## Running locally

Two terminals — there's no root script that starts both at once.

**1. API** (details in [`server/README.md`](server/README.md)):

```bash
cd server
npm install
cp .env.example .env   # fill in JWT_SECRET
npx knex migrate:latest --knexfile knexfile.ts
npx knex seed:run --knexfile knexfile.ts
npm run dev
```

Runs on `http://localhost:5001`.

**2. Client** (details in [`client/README.md`](client/README.md)):

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` (or the next free port). No env setup needed locally — Vite's
dev server proxies `/api/*` requests to `http://localhost:5001` (see `client/vite.config.ts`).

## Tech stack at a glance

- **Server**: Node.js, TypeScript (`tsx`), Express 5, Knex.js + SQLite, Zod validation,
  JWT (`jsonwebtoken`) + `bcrypt`, `helmet`/`cors`/`express-rate-limit`, `pino` structured
  logging, OpenAPI docs generated from the same Zod schemas via `@asteasolutions/zod-to-openapi`
  and rendered with Scalar.
- **Client**: React 19, TypeScript, Vite, `react-router-dom` v7, `radix-ui` (unstyled primitives)
  with hand-written vanilla CSS, `@dnd-kit` for drag-and-drop, React Context for shared state
  (auth session, toasts, users) with a per-resource hook (`useProjects`/`useTasks`/`useLabels`)
  layered over thin `fetch` wrappers.
