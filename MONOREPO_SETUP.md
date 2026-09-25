# BlueTech Monorepo Setup

Set up a pnpm monorepo containing two independent systems. Each system has a Next.js frontend and a NestJS backend. Follow the steps in order and do not skip the verification section.

## Target Structure

```
BlueTech/                    # repo root (Desktop/BlueTech)
├── apps/
│   ├── system-a/
│   │   ├── frontend/        # Next.js, port 3000
│   │   └── backend/         # NestJS, port 4000
│   └── system-b/
│       ├── frontend/        # Next.js, port 3001
│       └── backend/         # NestJS, port 5000
├── packages/                # reserved for shared code, leave empty for now
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Requirements

- Package manager: pnpm (use pnpm for every command, never npm or yarn)
- Frontends: Next.js with TypeScript, App Router, ESLint, `src/` directory
- Backends: NestJS with TypeScript
- One `.git` folder at the repo root only. No nested repositories.
- One `pnpm-lock.yaml` at the repo root only. No lockfiles inside app folders.

## Step 1: Initialize the Root

The repo root is the current working directory (`Desktop/BlueTech/`). Do not create a new `bluetech` folder. Run every command from this directory unless a step says otherwise.

```bash
git init
pnpm init
mkdir -p apps/system-a apps/system-b packages
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*/*"
  - "packages/*"
```

Create `.gitignore`:

```
node_modules
.env
dist
.next
build
coverage
```

## Step 2: Scaffold the Frontends

```bash
cd apps/system-a
pnpm create next-app@latest frontend --ts --eslint --app --src-dir --use-pnpm --skip-install --yes
cd ../system-b
pnpm create next-app@latest frontend --ts --eslint --app --src-dir --use-pnpm --skip-install --yes
cd ../..
```

If the CLI prompts despite the flags, accept defaults for anything not listed above.

## Step 3: Scaffold the Backends

```bash
cd apps/system-a
pnpm dlx @nestjs/cli new backend --package-manager pnpm --skip-git --skip-install
cd ../system-b
pnpm dlx @nestjs/cli new backend --package-manager pnpm --skip-git --skip-install
cd ../..
```

## Step 4: Clean Up Nested Git and Lockfiles

Delete any of these if they exist inside `apps/`:

- `.git` folders
- `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`
- `node_modules` folders

Only the repo root should have `.git` and a lockfile.

## Step 5: Set Package Names and Scripts

Set the `name` field in each app's `package.json`:

| Path | name |
|---|---|
| apps/system-a/frontend | system-a-frontend |
| apps/system-a/backend | system-a-backend |
| apps/system-b/frontend | system-b-frontend |
| apps/system-b/backend | system-b-backend |

Set the `dev` script in each app's `package.json`:

| App | dev script |
|---|---|
| system-a-frontend | `next dev -p 3000` |
| system-b-frontend | `next dev -p 3001` |
| system-a-backend | `nest start --watch` |
| system-b-backend | `nest start --watch` |

Keep all other scripts the generators created.

## Step 6: Configure the Backends

Install the config module in both backends:

```bash
pnpm --filter system-a-backend add @nestjs/config
pnpm --filter system-b-backend add @nestjs/config
```

In each backend's `src/app.module.ts`, add `ConfigModule` to imports:

```ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Replace each backend's `src/main.ts` with:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
```

Add a health endpoint to each backend's `src/app.controller.ts`:

```ts
@Get('health')
health() {
  return { status: 'ok' };
}
```

## Step 7: Environment Files

Create both `.env` and `.env.example` with identical contents in each backend:

`apps/system-a/backend/.env`
```
PORT=4000
FRONTEND_URL=http://localhost:3000
```

`apps/system-b/backend/.env`
```
PORT=5000
FRONTEND_URL=http://localhost:3001
```

Create both `.env.local` and `.env.example` in each frontend:

`apps/system-a/frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

`apps/system-b/frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`.env` and `.env.local` must stay gitignored. `.env.example` files must be committed.

## Step 8: Root Scripts

Update the root `package.json`:

```json
{
  "name": "bluetech",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:a": "pnpm --filter \"system-a-*\" --parallel dev",
    "dev:b": "pnpm --filter \"system-b-*\" --parallel dev",
    "build": "pnpm -r build"
  }
}
```

## Step 9: Install

From the repo root:

```bash
pnpm install
```

## Step 10: README

Create a root `README.md` that covers the folder structure, the port table, how to install, and how to run `pnpm dev`, `pnpm dev:a`, and `pnpm dev:b`.

## Verification

Confirm all of the following before finishing:

1. `find . -name ".git" -not -path "./.git"` returns nothing.
2. Only one `pnpm-lock.yaml` exists, at the root.
3. `pnpm dev` starts all four apps with no port conflicts.
4. `http://localhost:4000/health` and `http://localhost:5000/health` both return `{"status":"ok"}`.
5. `http://localhost:3000` and `http://localhost:3001` both load the Next.js default page.
6. `pnpm build` completes for all four apps.
7. `git status` shows no `.env` or `.env.local` files.

## Step 11: First Commit

```bash
git add .
git commit -m "Initial monorepo setup"
git branch -M main
```

Do not add a remote or push. I will do that myself.
