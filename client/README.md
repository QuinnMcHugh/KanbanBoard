# Kanban Client

React 19 + TypeScript + Vite frontend for the Kanban board. Talks to the API in
[`../server`](../server/README.md).

This is the `client/` half of a monorepo — see the [root README](../README.md) for how the two
halves fit together and how to run both at once.

## Tech stack

- **Framework:** React 19, TypeScript, Vite
- **Routing:** `react-router-dom` v7
- **UI:** `radix-ui` (unstyled/headless primitives) with hand-written vanilla CSS — no CSS
  framework
- **Drag-and-drop:** `@dnd-kit` (board columns, task cards)
- **State:** React Context for cross-cutting state (auth session, toasts, users), paired with a
  small custom hook per API resource (`useProjects`, `useTasks`, `useLabels`) that wraps thin
  `fetch` calls in `src/api/`

## Getting started

### Prerequisites

- Node.js (recent LTS)
- npm
- The API running (see [`../server/README.md`](../server/README.md)) — this app has nothing to
  talk to without it

### Setup

```bash
npm install
npm run dev
```

Starts on `http://localhost:5173` (or the next free port). In dev, no environment setup is
needed — Vite's dev server proxies `/api/*` requests to `http://localhost:5001` (see
`vite.config.ts`), so it talks to a locally running server automatically.

## Environment variables

| Variable       | Required | Default                         | Notes                                                                                                                                                                                           |
| -------------- | -------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | No       | unset (relative `/api/*` paths) | Base URL of the API, e.g. `https://api.example.com` (no trailing slash). Only needed for a production build where the client isn't served from the same origin as the API — see `.env.example`. |

`.env`/`.env.local` are gitignored. Copy `.env.example` to `.env` and fill in real values if you
need to point a build at a non-default API URL.

## Storybook

A dev-only Storybook instance showcases every component and route in isolation, with mock data
instead of a live backend.

```bash
npm run storybook
```

Starts on `http://localhost:6006`. `npm run build-storybook` produces a static export (into
`storybook-static/`, gitignored) if you want to check that everything actually builds.

Story files (`*.stories.tsx`) live colocated next to the component they cover. Shared mock data
and decorators (fake auth/users context, a `window.fetch` stub for the few components that call
real data-fetching hooks, a `MemoryRouter` wrapper, a `DndContext` wrapper) live in `src/mocks/`.
Storybook is dev-only tooling — `tsconfig.app.json` excludes `*.stories.tsx` from the production
type-check/build (`npm run build`), so nothing here ships or gates a real deploy.

## Project structure

```
src/
├── api/          # Thin fetch wrappers per backend resource
├── components/   
├── context/      # React Context providers
├── hooks/        # Per-resource data hooksbuilt on api/
├── lib/          # Shared client-side utilities
├── mocks/        # Storybook-only fixtures/decorators
├── routes/       
├── styles/       
└── types/        # TypeScript types mirroring the server's Zod schemas
```
