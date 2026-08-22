# Code Connect

Uma rede social para devs, feita como projeto de estudo em **Next.js 14 (App Router)** com **PostgreSQL** e **Prisma ORM**. O app exibe um feed paginado de posts, busca por título, páginas individuais com conteúdo em Markdown e páginas de erro customizadas.

🔗 **Aplicação no ar:** [code-connect-seven-phi.vercel.app](https://code-connect-seven-phi.vercel.app)

> Projeto desenvolvido durante um curso de especialização, cobrindo o ciclo completo de uma aplicação full-stack: Server Components, roteamento dinâmico, ORM com banco relacional, containerização do banco em desenvolvimento e deploy em produção.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Deploy](#deploy)
- [Decisões técnicas](#decisões-técnicas)
- [Roadmap](#roadmap)

## Funcionalidades

- **Feed de posts** — listagem paginada, buscada diretamente do PostgreSQL via Prisma em um Server Component, com os dados do autor incluídos na mesma consulta (`include`).
- **Paginação real no banco** — implementada com `skip`/`take` (equivalentes a `OFFSET`/`LIMIT` no SQL), com o total de páginas calculado a partir de `count()`.
- **Busca por título** — filtro com `contains` e `mode: 'insensitive'`, acessível pela barra de busca fixa no layout.
- **Estado na URL, não em memória** — página atual (`?page=N`) e termo buscado (`?q=termo`) vivem na URL e são preservados juntos ao navegar entre páginas de resultados.
- **Página de post individual** — rota dinâmica (`/posts/[slug]`) que busca o post pelo slug e renderiza o conteúdo em Markdown como HTML.
- **Páginas de erro customizadas** — `error.js` (error boundary com opção de nova tentativa) e `/not-found`, ambas com identidade visual própria.
- **Logging estruturado** — falhas de consulta são registradas com [Winston](https://github.com/winstonjs/winston).

## Tecnologias

| Categoria | Ferramenta |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) |
| Banco de dados | [PostgreSQL 15](https://www.postgresql.org/) |
| ORM | [Prisma 7](https://www.prisma.io/) + driver adapter (`@prisma/adapter-pg`) |
| Banco em desenvolvimento | [Docker Compose](https://docs.docker.com/compose/) |
| Estilização | CSS Modules |
| Ícones | [lucide-react](https://lucide.dev/) |
| Markdown → HTML | [remark](https://github.com/remarkjs/remark) + [remark-html](https://github.com/remarkjs/remark-html) |
| Logging | [winston](https://github.com/winstonjs/winston) |
| Hospedagem | [Vercel](https://vercel.com/) + Prisma Postgres |

## Estrutura do projeto

```
├── prisma/
│   ├── migrations/          # Histórico versionado do schema
│   ├── db.js                # Instância única do Prisma Client (singleton)
│   ├── schema.prisma        # Modelos User e Post e suas relações
│   └── seed.js              # Popula o banco com autor e posts iniciais
├── public/                  # Imagens das páginas de erro (404 / 500)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Aside/       # Barra lateral com a logo
│   │   │   ├── Avatar/      # Avatar + username do autor
│   │   │   ├── CardPost/    # Card de post exibido no feed
│   │   │   ├── ChangePage/  # Botões de paginação (Voltar/Próximo)
│   │   │   └── SearchBar/   # Barra de busca fixa no layout
│   │   ├── not-found/       # Página 404 customizada
│   │   ├── posts/[slug]/    # Página de um post individual
│   │   ├── error.js         # Error boundary com design próprio
│   │   ├── globals.css      # Estilos globais e layout base
│   │   ├── layout.js        # Layout raiz (Aside + busca + conteúdo)
│   │   └── page.js          # Feed com paginação e busca
│   └── logger.js            # Configuração do Winston
├── docker-compose.yaml      # PostgreSQL para desenvolvimento
└── prisma.config.ts         # Configuração do Prisma CLI
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- [Docker](https://www.docker.com/) (para subir o PostgreSQL local)
- npm

## Como rodar o projeto

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Os valores padrão do `.env.example` já apontam para o banco que o Docker Compose sobe localmente — não é preciso alterar nada para desenvolvimento.

### 3. Suba o PostgreSQL

```bash
docker compose up -d
```

Isso sobe um container PostgreSQL 15 na porta `5432`, com o banco `codeconnect_dev` já criado.

### 4. Crie as tabelas e popule o banco

```bash
npx prisma migrate dev
npx prisma db seed
```

O seed é idempotente (usa `upsert`), então pode ser executado várias vezes sem duplicar registros.

### 5. Suba a aplicação

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o Prisma Client e faz o build de produção |
| `npm run start` | Inicia o servidor com o build de produção |
| `npm run lint` | Roda o linter do Next.js |
| `npx prisma studio` | Abre uma interface web para inspecionar o banco |
| `npx prisma migrate dev` | Cria e aplica uma nova migration |
| `npx prisma db seed` | Popula o banco com os dados iniciais |

## Deploy

A aplicação está hospedada na **Vercel**, com banco **Prisma Postgres** conectado via Marketplace. Pontos que valem atenção ao reproduzir esse deploy:

- **`prisma generate` no build** — o Prisma Client é código gerado e não é versionado (`src/generated/` está no `.gitignore`). Por isso o script de build o gera antes do `next build`; sem isso, o deploy falha por módulo ausente.
- **`DATABASE_URL` e `DIRECT_URL`** — o `prisma.config.ts` usa `DIRECT_URL` (conexão sem pooler, necessária para migrations) e cai para `DATABASE_URL` quando ela não existe, que é o caso de provedores que não expõem uma URL direta separada.
- **Migrations em produção rodam à parte** — o deploy não aplica migrations automaticamente. Após publicar, aplique-as apontando para o banco de produção:

  ```bash
  npx vercel env pull .env.production.local --environment=production
  npx dotenv-cli -e .env.production.local -- npx prisma migrate deploy
  ```

  Use `migrate deploy` (não `migrate dev`): ele apenas aplica migrations existentes, sem gerar novas nem resetar dados.

- **Variáveis marcadas como "Sensitive"** na Vercel não têm o valor retornado pelo `env pull` — nesses casos, copie a connection string do painel do provedor de banco e preencha manualmente no arquivo local antes de rodar as migrations.

## Decisões técnicas

- **Estado de navegação na URL, não em `useState`** — página e termo de busca vivem em `searchParams`. Isso mantém `Home` como Server Component, permite compartilhar links de resultados e faz a navegação funcionar com o botão "voltar" do navegador.
- **Instância única do Prisma Client** — `prisma/db.js` guarda a instância em `globalThis` fora de produção. Sem isso, o hot reload do Next.js criaria uma conexão nova a cada alteração de arquivo, esgotando o limite de conexões do banco.
- **Driver adapter explícito** — a partir do Prisma 7 o client não conecta sozinho: a conexão é montada com `@prisma/adapter-pg` sobre o driver `pg` e passada ao construtor. Isso substitui o binário nativo das versões anteriores e permite rodar em ambientes serverless.
- **`orderBy` obrigatório na paginação** — sem uma ordenação determinística, o PostgreSQL não garante a mesma ordem entre consultas, o que faria posts se repetirem ou sumirem entre páginas.
- **Filtro aplicado também no `count()`** — o total de páginas é calculado sobre o resultado filtrado, não sobre a tabela inteira, para que a paginação continue correta durante uma busca.
- **Banco em container no desenvolvimento** — evita instalar PostgreSQL na máquina e mantém a versão idêntica entre ambientes.
- **CSS Modules por componente** — cada componente tem seu próprio arquivo `*.module.css`, evitando vazamento de estilos.

## Roadmap

- [ ] Estender a busca ao corpo do post (hoje filtra apenas o título), combinando as condições com `OR`.
- [ ] Sanitizar o HTML gerado a partir do Markdown antes de renderizar (`dangerouslySetInnerHTML`) — a dependência `isomorphic-dompurify` já está instalada, mas ainda não foi conectada ao fluxo.
- [ ] Adicionar `sharp` para otimização de imagens em produção (recomendado pelo Next.js no build).
- [ ] Completar o menu lateral (Perfil, Sobre nós, Sair) e a ação de publicar.
- [ ] Sintaxe colorida nos blocos de código (ex: `rehype-highlight` ou `shiki`).
- [ ] Remover `posts.json` da raiz — resquício da API mockada usada antes do PostgreSQL, hoje sem referência no código.
- [ ] Containerizar também a aplicação Next.js, orquestrando app e banco no mesmo `docker-compose`.
