# Reservvo

Front-end da plataforma de agendamento Reservvo. Next.js consumindo a API REST (Spring Boot). Prestadores cadastram recursos, configuram disponibilidade e recebem reservas via link público; clientes agendam horários.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS 4
- Zustand com `persist` (auth, UI)
- TanStack Query v5 (server state)
- React Hook Form + Zod (formulários)
- Axios com interceptor de JWT
- date-fns (pt-BR)

## Estrutura

```
src/
├── app/
│   ├── (auth)/             /login, /register — públicas
│   ├── (platform)/         rotas protegidas (auth via middleware)
│   │   ├── dashboard/
│   │   ├── resources/      CRUD de recursos + editor de disponibilidade
│   │   ├── reservations/
│   │   └── profile/        perfil do prestador, upgrade de role
│   ├── booking/[slug]/     página pública de agendamento
│   ├── how-it-works/
│   └── about/
├── components/
│   ├── ui/                 Button, Input, Modal, Card, Skeleton, etc.
│   └── features/           ResourceCard, SlotPicker, ReservationTable, ...
├── lib/
│   ├── api/                axios + endpoints (um arquivo por domínio)
│   ├── hooks/              React Query hooks
│   ├── stores/             Zustand (auth, ui)
│   ├── validators/         schemas Zod (espelham DTOs da API)
│   └── utils/
├── types/                  interfaces TS espelhando os DTOs
└── middleware.ts           gate de auth nas rotas /(platform)/*
```

Convenções: chamada de API só em `lib/api/` (componentes consomem hooks, não Axios); schemas Zod refletem 1:1 os DTOs; toda tela com dados trata loading (Skeleton), empty e error.

## Setup

Requer Docker e Docker Compose. A API Reservvo precisa estar acessível (default `http://localhost:8080`).

```bash
cp .env.local.example .env.local
docker compose up --build
```

App em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Default | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | URL base da API Reservvo |

## Páginas

| Rota | Auth | Descrição |
|---|---|---|
| `/login`, `/register` | — | Autenticação |
| `/booking/[slug]` | — | Agendamento público (cliente) |
| `/how-it-works`, `/about` | — | Marketing |
| `/dashboard` | sim | Visão geral do prestador |
| `/resources` | sim | CRUD de recursos + editor de disponibilidade |
| `/reservations` | sim | Reservas (provider/client), paginadas e filtradas por status |
| `/profile` | sim | Perfil, upgrade de role |

UI baseada em role: features de prestador só aparecem com `PROVIDER` ou `BOTH`.

## Decisões técnicas

Contexto e trade-offs das principais escolhas (invalidação narrow de cache, paginação por aba, editor com dirty state): **[devdiegofernandes.com/projects/reservvo](https://devdiegofernandes.com/projects/reservvo)**
