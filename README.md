# Code Connect

Uma rede social para devs, feita como projeto de estudo em **Next.js 14 (App Router)**. O app exibe um feed paginado de posts, páginas individuais com conteúdo em Markdown e uma arquitetura de dados desacoplada via API mockada.

> Projeto desenvolvido durante um curso de especialização, com foco em fundamentos do Next.js: Server Components, roteamento dinâmico, `searchParams`/`params`, CSS Modules e integração com uma API REST.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Decisões técnicas](#decisões-técnicas)
- [Roadmap](#roadmap)

## Funcionalidades

- **Feed de posts** — listagem paginada de posts, buscados via `fetch` em uma API mockada (Server Component).
- **Paginação dirigida pela API** — os botões "Voltar"/"Próximo" aparecem ou somem com base nos campos `prev`/`next` retornados pela própria API, sem números fixos no código.
- **Paginação via URL** — a página atual é controlada por `?page=N` na URL (`searchParams`), não por estado local, seguindo o padrão idiomático do App Router.
- **Página de post individual** — rota dinâmica (`/posts/[slug]`) que busca um post específico e renderiza seu conteúdo em Markdown como HTML.
- **Logging estruturado** — requisições à API são registradas com [Winston](https://github.com/winstonjs/winston) (`combined.log` e `error.log`).

## Tecnologias

| Categoria | Ferramenta |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) |
| Estilização | CSS Modules |
| Ícones | [lucide-react](https://lucide.dev/) |
| Markdown → HTML | [remark](https://github.com/remarkjs/remark) + [remark-html](https://github.com/remarkjs/remark-html) |
| Logging | [winston](https://github.com/winstonjs/winston) |
| API mockada (dev) | [json-server](https://github.com/typicode/json-server) |

## Estrutura do projeto

```
src/
├── app/
│   ├── components/
│   │   ├── Aside/          # Barra lateral com a logo
│   │   ├── Avatar/         # Avatar + username do autor do post
│   │   ├── CardPost/       # Card de post exibido no feed
│   │   └── ChangePage/     # Botões de paginação (Voltar/Próximo)
│   ├── posts/[slug]/       # Página dinâmica de um post individual
│   ├── globals.css         # Estilos globais e layout base (.app-container)
│   ├── layout.js           # Layout raiz (Aside + conteúdo)
│   └── page.js             # Página inicial (feed paginado)
└── logger.js                # Configuração do Winston
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (instalado junto com o Node.js)

O arquivo `posts.json` (dados mockados dos posts) já está incluído no repositório, na raiz do projeto.

## Como rodar o projeto

O projeto depende de **duas aplicações rodando ao mesmo tempo**: a API mockada (json-server) e o servidor de desenvolvimento do Next.js.

### 1. Instale as dependências

```bash
npm install
```

### 2. Suba a API mockada

Em um terminal separado, instale o `json-server` globalmente (se ainda não tiver) e suba a API a partir do `posts.json`:

```bash
npm install -g json-server@1.0.0-alpha.22
json-server posts.json -p 3042
```

Isso deixa a API disponível em `http://localhost:3042/posts`, com suporte a paginação via `?_page=` e `?_per_page=`.

### 3. Suba o Next.js

Em outro terminal:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> **Atenção:** a URL da API (`http://localhost:3042`) está fixa no código (`src/app/page.js` e `src/app/posts/[slug]/page.js`). Se você mudar a porta do `json-server`, atualize essas referências.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor com o build de produção |
| `npm run lint` | Roda o linter do Next.js |

## Decisões técnicas

- **Paginação via `searchParams`, não `useState`**: a página atual vive na URL (`/?page=2`), o que permite compartilhar/atualizar a página sem perder o estado e mantém `Home` como Server Component (sem precisar de `"use client"` só para paginar).
- **`prev`/`next` como fonte da verdade**: os botões de paginação não calculam limites no front-end — eles refletem exatamente o que a API retorna, evitando números de página "mágicos" hardcoded.
- **CSS Modules por componente**: cada componente tem seu próprio arquivo `*.module.css`, evitando vazamento de estilos entre componentes.
- **Imagens externas via `next/image`**: `next.config.mjs` autoriza o host `raw.githubusercontent.com` em `images.remotePatterns`, necessário para o Next.js otimizar imagens hospedadas fora do domínio da aplicação.

## Roadmap

Itens conhecidos que ficaram fora do escopo deste curso e podem ser retomados futuramente:

- [ ] Sanitizar o HTML gerado a partir do Markdown antes de renderizar (`dangerouslySetInnerHTML`) — a dependência `isomorphic-dompurify` já está instalada, mas ainda não foi conectada ao fluxo de renderização.
- [ ] Extrair a URL da API mockada para uma variável de ambiente (`.env`), em vez de hardcoded no código.
- [ ] Adicionar barra de busca e menu de navegação lateral completo (Feed, Perfil, Sobre nós, Sair).
- [ ] Sintaxe colorida real nos blocos de código (ex: `rehype-highlight` ou `shiki`), hoje o Markdown é convertido para HTML sem highlighting.
- [ ] Substituir a API mockada (json-server) por um backend real.
