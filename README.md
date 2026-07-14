# 🎵 Flash Mix Digital — Rádio Online Premium

Aplicativo web completo (Next.js 16 + Prisma + Neon.tech PostgreSQL) para a rádio **Flash Mix Digital** de Campo Grande/MS. Stream ao vivo real via `play.radios.com.br/161770`, com landing page TOP, app do ouvinte completo, painel administrativo e arquitetura otimizada para deploy no Vercel.

## 🎨 Visual

- **Dark Mode Premium** com neon vermelho (`#E30613`) e azul (`#0B1836`)
- **Glassmorphism** + gradientes radiais
- **Equalizer animado**, ondas sonoras, anéis neon girando no player
- **Splash screen** com glow pulsante
- Totalmente **responsivo** (mobile-first)

## 🚀 Stack

- **Next.js 16** (App Router, Turbopack, ISR)
- **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (tema dark customizado)
- **Prisma ORM** + **PostgreSQL** (Neon.tech)
- **NextAuth.js v5** (Credentials + modo Visitante, JWT sessions)
- **Zustand** (player state) + **HTML5 Audio** + **Media Session API** (background playback)
- **Framer Motion** + CSS keyframes

## 📂 Estrutura

```
src/app/
├── page.tsx                  # Landing page TOP da rádio (com player AO VIVO)
├── landing-content.tsx       # Conteúdo da landing page
├── app/                      # App do ouvinte (rota /app/*)
│   ├── page.tsx              # Home do app
│   ├── radio/                # Player gigante
│   ├── noticias/             # Lista + [id] detalhe
│   ├── programacao/          # Calendário por dia + locutores
│   ├── promocoes/            # Lista + [id] detalhe
│   ├── podcasts/             # Categorias + player
│   ├── videos/               # YouTube embed
│   ├── recados/              # Enviar + listar
│   ├── favoritos/            # Por tipo
│   ├── historico/            # Filtro por período
│   ├── busca/                # Top 10 + busca global
│   ├── perfil/               # Conta + estatísticas
│   ├── configuracoes/        # Notif, player, tema, cache
│   ├── notificacoes/         # Lista com status leitura
│   └── sobre/                # App info + contato
├── admin/                    # Painel admin (/admin)
│   ├── page.tsx              # Dashboard
│   ├── radio/                # Now Playing config
│   ├── programas/            # CRUD
│   ├── locutores/            # CRUD
│   ├── musicas/              # CRUD
│   ├── noticias/             # CRUD
│   ├── podcasts/             # CRUD
│   ├── promocoes/            # CRUD
│   ├── videos/               # CRUD
│   ├── banners/              # CRUD
│   ├── recados/              # CRUD (responder)
│   ├── usuarios/             # CRUD
│   └── categorias/           # CRUD
├── login/                    # Login
└── api/                      # APIs REST
```

## 🎵 Stream Ao Vivo Real

O stream real da Flash Mix Digital foi descoberto via o link público `play.radios.com.br/161770`:

```
STREAM_URL=http://s02.taaqui.org:8874/stream
```

É um stream Shoutcast AAC+ 64kbps, totalmente compatível com HTML5 Audio.

## ⚙️ Configuração Local

```bash
# 1. Instalar dependências
bun install

# 2. Configurar .env (use .env.example como base)
cp .env.example .env
# Edite .env com suas credenciais Neon.tech

# 3. Sincronizar banco Neon
bunx prisma db push

# 4. Popular com dados demo (opcional)
node scripts/seed-db.js
# ou
curl -X POST http://localhost:3000/api/seed

# 5. Rodar
bun run dev
```

**Login admin demo**: `admin@flashmix.com` / `admin123`

## ☁️ Deploy no Vercel + Neon.tech

1. **Crie uma conta no [Neon.tech](https://neon.tech)** e um projeto PostgreSQL
2. **Faça push deste repositório para o GitHub**
3. Em **[Vercel](https://vercel.com/new)**, importe o repositório
4. **Configure as variáveis de ambiente** no Vercel:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | Connection string Neon (com `-pooler` e `?pgbouncer=true`) |
| `DIRECT_URL` | Connection string Neon (sem pgbouncer) |
| `AUTH_SECRET` | String aleatória 32+ chars (https://generate-secret.now.sh) |
| `NEXTAUTH_URL` | URL final do Vercel (ex: `https://radionova.vercel.app`) |
| `STREAM_URL` | `http://s02.taaqui.org:8874/stream` |

5. **Deploy!** 🚀
6. **Após o primeiro deploy, popule o banco**:
   ```bash
   curl -X POST https://sua-url.vercel.app/api/seed
   ```

## 🎯 Funcionalidades

### Landing Page (`/`)
- Hero com logo gigante + player AO VIVO compacto
- Status AO VIVO com nome do programa atual
- Atalhos rápidos para todos os recursos
- Programação de hoje (preview)
- Promoções em destaque
- Últimas notícias
- Features (player 2º plano, áudio HD, dark neon, etc.)
- CTA final + footer completo

### App do Ouvinte (`/app/*`)
- **Splash** + **Login** (email/senha + visitante + Google/Apple/Facebook placeholder)
- **Home** com LiveBanner + atalhos + destaques + categorias + últimas tocadas + promoções + notícias
- **Rádio** — player gigante com anéis neon girando, controles completos, sleep timer, volume
- **Notícias** — lista com filtros + busca + detalhe com relacionadas
- **Programação** — calendário por dia da semana (seg-dom) + aba locutores
- **Promoções** — lista + detalhe com regulamento, prêmio, participantes
- **Podcasts** — categorias + player
- **Vídeos** — YouTube embed + lista
- **Recados** — enviar + listar meus + públicos com status lido/respondido
- **Favoritos** — por tipo (música, notícia, podcast, etc.)
- **Histórico** — filtro hoje/semana/mês
- **Busca** — Top 10 + pesquisa global em 7 entidades
- **Perfil** — estatísticas + menu + sair
- **Configurações** — notificações, player, tema, idioma, qualidade, cache
- **Notificações** — com status leitura
- **Sobre** — app info + contato + legal
- **Background playback** via Media Session API

### Painel Admin (`/admin/*`)
- **Dashboard** com 10 métricas + audiência em tempo real + atividade recente + ações rápidas
- **Rádio** — configurar URL stream + now playing + AO VIVO
- **CRUD completo** de 11 entidades: Programas, Locutores, Músicas, Notícias, Podcasts, Promoções, Vídeos, Banners, Recados, Usuários, Categorias
- Tabela responsiva + form modal + busca + confirmação de exclusão
- Protegido por role ADMIN

## ⚡ Otimizações de Performance

- **ISR (Incremental Static Regeneration)** de 60s nas páginas de conteúdo
- **Prefetch** automático em todos os Links do Next.js
- **Cache de 30 dias** para imagens estáticas
- **Cache de 10s** na API now-playing (evita queries repetidas)
- **Optimize Package Imports** para `lucide-react` e `framer-motion`
- **Compressão** habilitada
- **Image optimization** AVIF/WebP
- **Player otimista** (UI reage instantaneamente, antes do áudio responder)
- **Persistência local** (localStorage) para volume/likes/histórico de sessão

## 🎨 Design System

Paleta: `#090909` `#0B1836` `#E30613` `#FFFFFF` `#B5B5B5`

Componentes visuais: `glass`, `glass-dark`, `glass-red`, `glow-red`, `glow-red-strong`, `glow-blue`, `eq-bar` (equalizer), `animate-wave` (ondas), `animate-glow-pulse`, `animate-spin-slow`, `animate-pulse-live`, `animate-splash-glow`

## 📊 Banco de Dados

15+ modelos Prisma: User, Account, Session, Locutor, Programa, Musica, Noticia, Podcast, Promocao, Video, Banner, Categoria, Recado, Favorite, History, Notification, RadioConfig

Seed cria: 6 locutores, 50 programas (grade completa seg-dom), 16 músicas, 5 notícias, 3 promoções, 4 podcasts, 3 vídeos, 2 banners, 10 categorias, 1 usuário admin (`admin@flashmix.com` / `admin123`), 1 RadioConfig com stream real, 3 notificações demo.

## 📱 Próximos Passos

- [ ] Converter para Flutter usando este app como referência visual
- [ ] Configurar OAuth real do Google/Apple/Facebook
- [ ] Push notifications com Vercel Web Push
- [ ] Service Worker para PWA offline
- [ ] Android Auto / Apple CarPlay

## 📄 Licença

© 2026 Flash Mix Digital. Todos os direitos reservados.
