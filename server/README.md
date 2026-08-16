# Kanban API

A REST API for a Kanban board — projects, tasks (with status swimlanes and labels), and a global labeling system. Built as a learning project, with an emphasis on getting the backend fundamentals (validation, transactions, auth, testing, docs) right before any frontend exists.

This is the `server/` half of a monorepo; `client/` is where the React half of the monorepo lives. 

## Tech stack

- **Runtime/language:** Node.js, TypeScript (`tsx` for dev — no `ts-node`/`nodemon`)
- **Framework:** Express 5
- **Database:** SQLite via Knex.js (query builder, migrations, seeds), foreign keys enforced via `PRAGMA foreign_keys = ON`
- **Validation:** Zod — request bodies and route params are validated by schema
- **Auth:** JWT bearer tokens (`jsonwebtoken`), passwords hashed with `bcrypt`
- **Testing:** Vitest + Supertest, against a dedicated SQLite test database (migrated + reseeded per test, isolated from dev data)
- **Observability:** `pino`/`pino-http` structured logging, per-request correlation IDs
- **Hardening:** `helmet` (security headers), `cors` (explicit origin allowlist), `express-rate-limit` (auth endpoints)
- **API docs:** Generated from the same Zod schemas via `@asteasolutions/zod-to-openapi`, rendered with Scalar

## Getting started

### Prerequisites

- Node.js (recent LTS)
- npm

### Setup

```bash
cd server
npm install
cp .env.example .env   # then fill in JWT_SECRET — see Environment variables below
npx knex migrate:latest --knexfile knexfile.ts
npx knex seed:run --knexfile knexfile.ts
npm run dev
```

The server starts on `http://localhost:5001` (configurable via `PORT`).

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `JWT_SECRET` | **Yes, always** | — | Server refuses to boot without it (see `src/env.ts`). |
| `CORS_ALLOWED_ORIGINS` | **Yes, in production** | `http://localhost:5173` outside production | Comma-separated list of allowed frontend origins. Server refuses to boot if `NODE_ENV=production` and this is unset. |
| `PORT` | No | `5001` | |
| `NODE_ENV` | No | `development` | Set to `test` automatically by the Vitest config; set to `production` for a real deployment. |
| `LOG_LEVEL` | No | `info` (`silent` when `NODE_ENV=test`) | Any pino level (`trace`/`debug`/`info`/`warn`/`error`/`fatal`/`silent`). |

`.env` is gitignored. Copy `.env.example` and fill in real values — never commit actual secrets.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (`tsx watch`, auto-restarts on file changes) |
| `npm run build` | Type-check the project (`tsc --noEmit`) — no compiled output. `moduleResolution: "bundler"` and extensionless relative imports mean this project isn't currently set up to emit runnable plain-Node JS; `start` runs the TypeScript directly via `tsx` instead, same as `dev`. |
| `npm start` | Run the server for production (`tsx src/server.ts`, no watch/hot-reload). Requires migrations to have already been applied — see below. |
| `npm test` | Run the full test suite once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

### Database (migrations & seeds)

Knex config (`knexfile.ts`) defines separate `development` and `test` environments, pointing at separate SQLite files (`src/db/kanban.sqlite3` and `src/db/kanban.test.sqlite3` respectively) so running tests never touches your dev data.

```bash
# Apply migrations (defaults to the `development` environment)
npx knex migrate:latest --knexfile knexfile.ts

# Roll back the most recent migration
npx knex migrate:rollback --knexfile knexfile.ts

# Create a new migration
npx knex migrate:make <name> --knexfile knexfile.ts -x ts

# Seed with fixed sample data
npx knex seed:run --knexfile knexfile.ts
```

The test database is migrated and reseeded automatically by the test suite itself (`tests/setup.ts`) — you don't need to run these manually before `npm test`.

## API documentation

Once the server is running:
- **`GET /docs`** — interactive API reference (Scalar UI)
- **`GET /openapi.json`** — the raw OpenAPI 3.1 spec, generated at startup from the same Zod schemas that validate requests at runtime

Both are currently public/unauthenticated. 

## Project structure

```
src/
├── app.ts                 # Express app construction — middleware, route mounting 
├── server.ts               # Entry point: imports app, calls app.listen()
├── env.ts                  # dotenv load + fail-fast checks for required env vars
├── logger.ts                
├── corsOptions.ts           
├── errors.ts                
├── controllers/            
├── routes/                 
├── schemas/                  # Zod schemas — request validation, response shapes
├── middleware/               
├── openapi/                  # Registers every route + schema against zod-to-openapi
└── db/
    ├── db.ts                 # Knex instance, environment-aware (development/test)
    ├── knex-tables.d.ts        # Compile-time column typing for every db("table") call
    ├── migrations/
    └── seeds/

tests/                       # Vitest + Supertest
knexfile.ts                    
```

## Key design decisions

- **Tenant-wide authorization, not per-owner.** Any authenticated user can read, edit, or delete any project/task/label — there's no ownership-based access control. `owner_id`/`assigned_to_user_id` are metadata (who's currently responsible), not a security boundary. This is a deliberate choice for a small trusted-team tool, not an oversight.
- **Validation lives in schemas, not controllers.** Every request body/param is validated by a Zod schema (`src/schemas/`) via `validateBody`/`validateParams` middleware, before a controller ever runs. Controllers assume their input already matches the schema.
- **Multi-table writes are transactional.** Anything that touches more than one table together (e.g. creating a task and its label associations) runs inside `db.transaction()`, so a failure partway through can't leave orphaned data.

## Testing

```bash
npm test
```

Runs against `src/db/kanban.test.sqlite3` — a completely separate database from your dev data, migrated once and reseeded before every individual test (see `tests/setup.ts`) so tests never depend on execution order or leak state into each other.
