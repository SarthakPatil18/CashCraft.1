# CashCraft

## Overview

CashCraft is a premium, gamified personal finance app with a black-and-white minimalist dark design. Users interact with their Present Self, Disciplined Future Self, and Chaotic Future Self. Every financial action updates a Future Score and shows simulated consequences.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts

## Artifacts

- **CashCraft Web App** (`/`) — Main React + Vite frontend
- **API Server** (`/api`) — Express backend

## App Screens

1. **Onboarding** (`/`) — 3-step flow: income, spending habits, goals
2. **Dashboard** (`/dashboard`) — Command Center with balance, Future Score meter, spending chart, transactions
3. **Simulation** (`/simulation`) — Split-screen Disciplined vs Chaotic future simulation
4. **Money Quests** (`/quests`) — Daily missions with XP, streaks, progress bars
5. **Boss Battle** (`/boss`) — Dramatic risky-spending alerts with Fight/Give In
6. **Future Messages** (`/messages`) — Messages from future self
7. **Profile** (`/profile`) — Level, XP, avatar evolution, settings

## Design

- Dark/black theme as primary, white accents
- Glassmorphism cards with backdrop blur
- Inter font stack
- Framer Motion animations throughout
- Responsive: sidebar on desktop, bottom nav on mobile

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/cashcraft run dev` — run frontend locally

## Database Schema

- `users` — user profile, level, XP, future score, streak, avatar stage
- `transactions` — financial transactions with impact scores
- `quests` — money quests with progress tracking
- `messages` — future self messages (disciplined/chaotic/neutral)
- `bosses` — boss battle encounters for risky spending

## API Routes

- `GET /api/user/profile`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/spending-chart`
- `GET /api/transactions`
- `GET /api/quests`
- `POST /api/quests/:id/complete`
- `POST /api/simulation/run`
- `GET /api/messages/future`
- `GET /api/boss/current`
- `POST /api/boss/:id/fight`
- `POST /api/boss/:id/surrender`
