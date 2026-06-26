# Setup — deixar tudo pronto colando as chaves

O app já funciona em **modo demo** sem nenhuma chave. Para ativar as integrações
reais, copie `.env.example` para `.env.local` e cole os valores abaixo. Depois de
colar qualquer chave, reinicie o servidor (`npm run dev`). **Não precisa mexer em
código** — o app detecta sozinho o que está configurado.

```bash
cp .env.example .env.local   # (PowerShell: Copy-Item .env.example .env.local)
```

---

## 1. Login com Google (Auth.js)

1. Acesse https://console.cloud.google.com → **APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID → Web application**.
3. Em **Authorized redirect URIs**, adicione exatamente:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (em produção, troque pelo seu domínio: `https://SEU_DOMINIO/api/auth/callback/google`)
4. Copie o **Client ID** e o **Client Secret** para o `.env.local`:
   ```
   AUTH_GOOGLE_ID="...apps.googleusercontent.com"
   AUTH_GOOGLE_SECRET="GOCSPX-..."
   ```
5. Gere o segredo de sessão e cole em `AUTH_SECRET`:
   ```bash
   npx auth secret
   ```

Enquanto `AUTH_GOOGLE_ID` for `placeholder`, o botão "Login com o Google" entra
no app em modo demo. Assim que você colar credenciais válidas, o mesmo botão
passa a fazer o login real do Google — automaticamente.

## 2. OpenAI (voz e imagem)

1. Crie uma chave em https://platform.openai.com/api-keys (começa com `sk-`).
2. Cole no `.env.local`:
   ```
   OPENAI_API_KEY="sk-..."
   ```

- **Voz** (`/api/voice`): transcreve o áudio com Whisper (`whisper-1`).
- **Imagem** (`/api/image`): extrai tarefas com visão (`gpt-4o-mini`).

Sem uma chave válida, ambos retornam uma resposta mock para o fluxo continuar
funcionando localmente.

---

## Produção (Postgres + Vercel)

Localmente o banco é SQLite. Para produção, recomendado Postgres (ex.: Neon):

1. Em `prisma/schema.prisma`, troque o provider:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. Troque o driver adapter em `src/lib/prisma.ts` pelo adapter de Postgres
   (`@prisma/adapter-pg`) e instale-o:
   ```bash
   npm i @prisma/adapter-pg pg
   ```
3. Aponte `DATABASE_URL` para o Postgres (no `.env.local` e nas variáveis de
   ambiente da Vercel).
4. Rode a migração:
   ```bash
   npm run db:migrate
   ```
5. Na Vercel, configure todas as variáveis do `.env.example` e use o redirect
   URI de produção no Google Console.
