# NotionPulse

Checklist por comando de voz. App mobile-first em Next.js 15 (App Router) com
criação de tarefas por voz e por imagem, Pomodoro e Design System no Storybook.

## Começando

```bash
npm install            # roda prisma generate automaticamente (postinstall)
npm run db:migrate     # cria o banco SQLite local (dev.db)
npm run dev            # http://localhost:3000
```

O app abre na splash → onboarding → home. **Funciona imediatamente em modo
demo**, sem precisar de nenhuma conta externa.

## Configurar as integrações reais

Copie `.env.example` para `.env.local` e cole suas chaves. Veja o passo a passo
detalhado em **[SETUP.md](SETUP.md)**. Resumo:

| Variável | Para quê | Sem ela |
|---|---|---|
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Login com Google | Botão entra em modo demo |
| `AUTH_SECRET` | Sessão do Auth.js | — |
| `OPENAI_API_KEY` | Voz (Whisper) e imagem (vision) | Endpoints retornam mock |

Depois de colar, reinicie `npm run dev`. Nenhuma mudança de código é necessária.

## Scripts

- `npm run dev` / `npm run build` — Next.js
- `npm run db:migrate` / `npm run db:studio` — Prisma
- `npm run storybook` — Design System

## Stack

Next.js 15 · TypeScript · Tailwind 4 · shadcn/ui · TanStack Query · Prisma 7
(SQLite) · Zod · Auth.js v5 · Storybook.

## Produção

Para deploy (ex.: Vercel + Neon Postgres), veja a seção **Produção** em
[SETUP.md](SETUP.md).
