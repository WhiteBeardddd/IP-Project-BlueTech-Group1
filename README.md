# BlueTech

pnpm monorepo containing two independent systems. Each system has a Next.js frontend and a NestJS backend.

## Folder Structure

```
BlueTech/
├── apps/
│   ├── system-a/
│   │   ├── frontend/        # Next.js (system-a-frontend)
│   │   └── backend/         # NestJS  (system-a-backend)
│   └── system-b/
│       ├── frontend/        # Next.js (system-b-frontend)
│       └── backend/         # NestJS  (system-b-backend)
├── packages/                # reserved for shared code
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Ports

| App | Package | Port |
|---|---|---|
| System A frontend | system-a-frontend | 3000 |
| System A backend | system-a-backend | 4000 |
| System B frontend | system-b-frontend | 3001 |
| System B backend | system-b-backend | 5000 |

Each backend exposes `GET /health`, which returns `{"status":"ok"}`.

## Install

Requires Node.js and pnpm. Always use pnpm, never npm or yarn.

```bash
pnpm install
```

Then create the local env files from the committed examples:

```bash
cp apps/system-a/backend/.env.example  apps/system-a/backend/.env
cp apps/system-b/backend/.env.example  apps/system-b/backend/.env
cp apps/system-a/frontend/.env.example apps/system-a/frontend/.env.local
cp apps/system-b/frontend/.env.example apps/system-b/frontend/.env.local
```

## Run

| Command | What it starts |
|---|---|
| `pnpm dev` | All four apps |
| `pnpm dev:a` | System A frontend and backend |
| `pnpm dev:b` | System B frontend and backend |
| `pnpm build` | Builds all four apps |

To run a single app, use a filter, e.g. `pnpm --filter system-a-backend dev`.
