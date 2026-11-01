# KR Cozinheiro

Caderno pessoal de receitas: salve, busque e consulte suas receitas do celular ou do computador. Acesso protegido por login (um único usuário).

**Stack:** Next.js 16.4.3 (App Router, Server Actions, Proxy) · Tailwind CSS v4 · shadcn/ui · Lucide React · Drizzle ORM · Neon Postgres · jose (sessão JWT em cookie HttpOnly) · Zod.

## Funcionalidades

- Login com e-mail e senha (definidos em variáveis de ambiente; a senha fica só como hash scrypt).
- Criar, editar e excluir receitas: nome, descrição, categoria, tempo, porções, dificuldade, ingredientes, modo de preparo, observações, fonte e foto opcional.
- Busca por nome, descrição, observações **ou ingrediente**, filtro por categoria e favoritas.
- Página da receita com lista de ingredientes que dá para ir marcando enquanto cozinha.
- Linhas terminadas com `:` (ex.: `Cobertura:`) viram subtítulos nos ingredientes e no preparo.
- Fotos são redimensionadas e comprimidas no navegador (máx. 1400 px, WebP/JPEG) e guardadas no próprio banco.
- Layout responsivo (barra lateral no computador, barra superior no celular), visual claro "papel" com um único acento verde-azulado, e pode ser instalado na tela de início do celular (manifest PWA).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | O que é |
| --- | --- |
| `DATABASE_URL` | String de conexão da Neon (use a *pooled connection*). |
| `AUTH_EMAIL` | E-mail usado para entrar. |
| `AUTH_PASSWORD_HASH` | Hash da senha. Gere com `npm run hash-password -- "sua-senha"`. |
| `AUTH_SECRET` | Segredo aleatório (32+ caracteres) para assinar a sessão. Gere com `openssl rand -base64 32`. |

> Alternativa: em vez de `AUTH_PASSWORD_HASH`, é possível definir `AUTH_PASSWORD` com a senha em texto. O hash é o recomendado.
>
> **Nunca** faça commit do `.env.local`: ele já está no `.gitignore`.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # e preencha os valores
npm run dev
```

Abra http://localhost:3000.

A tabela `recipes` é criada automaticamente na primeira requisição (`CREATE TABLE IF NOT EXISTS`). Se preferir criar antes, rode `npm run db:push` (Drizzle Kit, usa o `DATABASE_URL` do `.env.local`). A migração SQL está em `drizzle/0000_init.sql`.

## Deploy na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `kryvon-io/kr-cozinheiro`. O framework (Next.js) é detectado sozinho.
2. Em **Environment Variables**, adicione `DATABASE_URL`, `AUTH_EMAIL`, `AUTH_PASSWORD_HASH` e `AUTH_SECRET` (para Production e Preview).
3. Clique em **Deploy**. Pronto: abra a URL, faça login e salve a primeira receita.

Dica: escolha a região da função perto do banco (o Neon está em `sa-east-1`, São Paulo → região `gru1` na Vercel, em *Settings → Functions*).

## Estrutura

```
src/
  app/
    login/                 # tela de login
    (app)/                 # área logada (cabeçalho comum)
      page.tsx             # lista + busca + filtros
      receitas/nova        # nova receita
      receitas/[id]        # detalhes, /editar e /foto (imagem protegida)
    actions.ts             # Server Actions (login, salvar, favoritar, excluir)
  components/              # UI do app + components/ui (shadcn)
  lib/
    auth.ts                # verificação de senha e sessão
    session-token.ts       # JWT (usado também pelo proxy)
    recipes.ts             # camada de acesso a dados (sempre exige sessão)
    db/                    # Drizzle + Neon
  proxy.ts                 # redireciona para /login quem não está logado
```
