# BlueTech

pnpm monorepo containing two independent systems. Each system has a Next.js frontend and a NestJS backend.

## Folder Structure

```
BlueTech/
├── apps/
│   ├── BlueTech-JobBoard/
│   │   ├── web/             # Next.js (bluetech-jobboard-web)
│   │   └── api/             # NestJS  (bluetech-jobboard-api)
│   └── BlueTech-HRMS/
│       ├── web/             # Next.js (bluetech-hrms-web)
│       └── api/             # NestJS  (bluetech-hrms-api)
├── packages/                # reserved for shared code
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Ports

| App | Package | Port |
|---|---|---|
| JobBoard frontend | bluetech-jobboard-web | 3000 |
| JobBoard backend | bluetech-jobboard-api | 4000 |
| HRMS frontend | bluetech-hrms-web | 3001 |
| HRMS backend | bluetech-hrms-api | 5000 |

Each backend exposes `GET /health`, which returns `{"status":"ok"}`.

## Install

Requires Node.js and pnpm. Always use pnpm, never npm or yarn.

```bash
pnpm install
```

Then create the local env files from the committed examples:

```bash
cp apps/BlueTech-JobBoard/api/.env.example  apps/BlueTech-JobBoard/api/.env
cp apps/BlueTech-HRMS/api/.env.example  apps/BlueTech-HRMS/api/.env
cp apps/BlueTech-JobBoard/web/.env.example apps/BlueTech-JobBoard/web/.env.local
cp apps/BlueTech-HRMS/web/.env.example apps/BlueTech-HRMS/web/.env.local
```

## Run

| Command | What it starts |
|---|---|
| `pnpm dev` | All four apps |
| `pnpm dev:jobboard` | JobBoard frontend and backend |
| `pnpm dev:hrms` | HRMS frontend and backend |
| `pnpm build` | Builds all four apps |

To run a single app, use a filter, e.g. `pnpm --filter bluetech-jobboard-api dev`.
