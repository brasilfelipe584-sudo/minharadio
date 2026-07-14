import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed — popula o banco Neon com dados de demonstração (idempotente)
export async function POST() {
  const results: Record<string, number> = {};

  // ─── Locutores ─────────────────────────────────────────────
  const locutoresData = [
    { name: "DJ Flash", bio: "Locutor principal da manhã, especialista em pop e flashbacks. Voz inconfundível da Flash Mix Digital.", instagram: "@djflash", avatarUrl: "https://i.pravatar.cc/300?img=12" },
    { name: "Marina Costa", bio: "Apresenta o programa Tarde Mix, apaixonada por sertanejo e pop nacional.", instagram: "@marinacosta", avatarUrl: "https://i.pravatar.cc/300?img=45" },
    { name: "Rick Oliveira", bio: "Voz da noite, comandando os melhores hits eletrônicos e o Hora do Rock.", instagram: "@rickoliveira", avatarUrl: "https://i.pravatar.cc/300?img=33" },
    { name: "Bia Lagoa", bio: "Apresenta Lagoa News, jornalista e âncora dos noticiários da cidade.", instagram: "@bialagoa", avatarUrl: "https://i.pravatar.cc/300?img=47" },
    { name: "Carlos Mendes", bio: "Especialista em flashbacks e clássicos dos anos 80 e 90.", instagram: "@carlosmendes", avatarUrl: "https://i.pravatar.cc/300?img=51" },
    { name: "Ana Beatriz", bio: "Comanda a madrugada com o melhor da música gospel e inspiracional.", instagram: "@anabeatriz", avatarUrl: "https://i.pravatar.cc/300?img=23" },
  ];
  let count = 0;
  for (const l of locutoresData) {
    const exists = await db.locutor.findFirst({ where: { name: l.name } });
    if (!exists) {
      await db.locutor.create({ data: l });
      count++;
    }
  }
  results.locutores = count;

  const locutores = await db.locutor.findMany();
  const djFlash = locutores.find((l) => l.name === "DJ Flash");
  const marina = locutores.find((l) => l.name === "Marina Costa");
  const rick = locutores.find((l) => l.name === "Rick Oliveira");
  const bia = locutores.find((l) => l.name === "Bia Lagoa");
  const carlos = locutores.find((l) => l.name === "Carlos Mendes");
  const ana = locutores.find((l) => l.name === "Ana Beatriz");

  // ─── Programação completa (Seg a Dom) ──────────────────────
  // dayOfWeek: 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  const programasData: any[] = [];

  // Grade padrão da semana (Seg-Sex)
  for (let day = 1; day <= 5; day++) {
    programasData.push(
      { title: "Madrugada Flash", description: "A melhor seleção musical para acompanhar sua madrugada.", imageUrl: "https://picsum.photos/seed/madrugada/600/400", dayOfWeek: day, startTime: "00:00", endTime: "05:00", locutorId: ana?.id, isLive: false },
      { title: "Manhã Flash", description: "Despertar com os melhores hits da manhã e muito bate-papo.", imageUrl: "https://picsum.photos/seed/flash-manha/600/400", dayOfWeek: day, startTime: "06:00", endTime: "09:00", locutorId: djFlash?.id, isLive: day === 1 },
      { title: "Lagoa News Manhã", description: "Jornal da manhã com as principais notícias de Campo Grande e do mundo.", imageUrl: "https://picsum.photos/seed/lagoa-news/600/400", dayOfWeek: day, startTime: "07:00", endTime: "08:00", locutorId: bia?.id, isLive: false },
      { title: "Conectados com Você", description: "Programa de variedades com participação dos ouvintes e bastidores.", imageUrl: "https://picsum.photos/seed/conectados/600/400", dayOfWeek: day, startTime: "09:00", endTime: "12:00", locutorId: marina?.id, isLive: false },
      { title: "Tarde Mix", description: "A trilha sonora perfeita para sua tarde com os hits do momento.", imageUrl: "https://picsum.photos/seed/tarde-mix/600/400", dayOfWeek: day, startTime: "13:00", endTime: "17:00", locutorId: marina?.id, isLive: false },
      { title: "Hora do Rock", description: "As melhores do rock clássico e moderno para encerrar a tarde.", imageUrl: "https://picsum.photos/seed/rock-hour/600/400", dayOfWeek: day, startTime: "17:00", endTime: "19:00", locutorId: rick?.id, isLive: false },
      { title: "Flashback Night", description: "Os clássicos dos anos 80, 90 e 2000 que você nunca esquece.", imageUrl: "https://picsum.photos/seed/flashback/600/400", dayOfWeek: day, startTime: "19:00", endTime: "22:00", locutorId: carlos?.id, isLive: false },
      { title: "Night Club", description: "Sets eletrônicos para aquecer a noite com o melhor da dance music.", imageUrl: "https://picsum.photos/seed/night-club/600/400", dayOfWeek: day, startTime: "22:00", endTime: "23:59", locutorId: rick?.id, isLive: false },
    );
  }

  // Sábado
  programasData.push(
    { title: "Sábado Animado", description: "Manhã de sábado com os hits mais tocados da semana.", imageUrl: "https://picsum.photos/seed/sabado-animado/600/400", dayOfWeek: 6, startTime: "06:00", endTime: "10:00", locutorId: djFlash?.id, isLive: false },
    { title: "Sertanejo na Veia", description: "Tudo do universo sertanejo, do clássico ao universitário.", imageUrl: "https://picsum.photos/seed/sertanejo/600/400", dayOfWeek: 6, startTime: "10:00", endTime: "13:00", locutorId: marina?.id, isLive: false },
    { title: "Sábado Sertanejo", description: "O melhor do sertanejo brasileiro para seu almoço.", imageUrl: "https://picsum.photos/seed/sabado-sertanejo/600/400", dayOfWeek: 6, startTime: "13:00", endTime: "17:00", locutorId: marina?.id, isLive: false },
    { title: "Sábado Pop", description: "Os hits pop que bombaram nos últimos tempos.", imageUrl: "https://picsum.photos/seed/sabado-pop/600/400", dayOfWeek: 6, startTime: "17:00", endTime: "20:00", locutorId: djFlash?.id, isLive: false },
    { title: "Balada Sábado", description: "A pista da Flash Mix Digital abre com funk, eletro e hip-hop.", imageUrl: "https://picsum.photos/seed/balada-sabado/600/400", dayOfWeek: 6, startTime: "20:00", endTime: "23:59", locutorId: rick?.id, isLive: false },
  );

  // Domingo
  programasData.push(
    { title: "Manhã Gospel", description: "Inicie seu domingo com música gospel e mensagens inspiradoras.", imageUrl: "https://picsum.photos/seed/manha-gospel/600/400", dayOfWeek: 0, startTime: "06:00", endTime: "10:00", locutorId: ana?.id, isLive: false },
    { title: "Domingo Descontraído", description: "Música boa para toda a família no domingo pela manhã.", imageUrl: "https://picsum.photos/seed/domingo-desc/600/400", dayOfWeek: 0, startTime: "10:00", endTime: "13:00", locutorId: djFlash?.id, isLive: false },
    { title: "Lagoa News Especial", description: "Resumo da semana e os principais acontecimentos do domingo.", imageUrl: "https://picsum.photos/seed/lagoa-especial/600/400", dayOfWeek: 0, startTime: "13:00", endTime: "15:00", locutorId: bia?.id, isLive: false },
    { title: "Flashback Domingo", description: "Clássicos atemporais para uma tarde nostálgica.", imageUrl: "https://picsum.photos/seed/flashback-dom/600/400", dayOfWeek: 0, startTime: "15:00", endTime: "19:00", locutorId: carlos?.id, isLive: false },
    { title: "Domingo à Noite", description: "Encerrando o fim de semana com o melhor da música.", imageUrl: "https://picsum.photos/seed/domingo-noite/600/400", dayOfWeek: 0, startTime: "19:00", endTime: "23:59", locutorId: djFlash?.id, isLive: false },
  );

  count = 0;
  for (const p of programasData) {
    // Verifica duplicata por título + dia
    const exists = await db.programa.findFirst({
      where: { title: p.title, dayOfWeek: p.dayOfWeek },
    });
    if (!exists) {
      await db.programa.create({ data: p });
      count++;
    }
  }
  results.programas = count;

  // ─── Músicas ───────────────────────────────────────────────
  const musicasData = [
    { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", coverUrl: "https://picsum.photos/seed/song1/300/300", category: "Pop", duration: 200 },
    { title: "Leão", artist: "Marília Mendonça", album: "Todos os Cantos", coverUrl: "https://picsum.photos/seed/song2/300/300", category: "Sertanejo", duration: 188 },
    { title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", coverUrl: "https://picsum.photos/seed/song3/300/300", category: "Pop", duration: 233 },
    { title: "Sentina", artist: "Major Lazer", album: "Music Is the Weapon", coverUrl: "https://picsum.photos/seed/song4/300/300", category: "Eletrônica", duration: 195 },
    { title: "Baile de Favela", artist: "MC João", album: "Single", coverUrl: "https://picsum.photos/seed/song5/300/300", category: "Funk", duration: 167 },
    { title: "Evidências", artist: "Chitãozinho & Xororó", album: "Coração de Brasil", coverUrl: "https://picsum.photos/seed/song6/300/300", category: "Sertanejo", duration: 276 },
    { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", coverUrl: "https://picsum.photos/seed/song7/300/300", category: "Rock", duration: 354 },
    { title: "Asa Branca", artist: "Luiz Gonzaga", album: "O Nordeste", coverUrl: "https://picsum.photos/seed/song8/300/300", category: "Forró", duration: 198 },
    { title: "Closer", artist: "The Chainsmokers", album: "Collage", coverUrl: "https://picsum.photos/seed/song9/300/300", category: "Eletrônica", duration: 244 },
    { title: "Coração de Cristal", artist: "Mamonas Assassinas", album: "Mamonas Assassinas", coverUrl: "https://picsum.photos/seed/song10/300/300", category: "Rock", duration: 180 },
    { title: "Despacito", artist: "Luis Fonsi", album: "Single", coverUrl: "https://picsum.photos/seed/song11/300/300", category: "Pop", duration: 228 },
    { title: "Vai Malandra", artist: "Anitta", album: "Single", coverUrl: "https://picsum.photos/seed/song12/300/300", category: "Funk", duration: 195 },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", coverUrl: "https://picsum.photos/seed/song13/300/300", category: "Rock", duration: 301 },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", coverUrl: "https://picsum.photos/seed/song14/300/300", category: "Rock", duration: 356 },
    { title: "Take on Me", artist: "a-ha", album: "Hunting High and Low", coverUrl: "https://picsum.photos/seed/song15/300/300", category: "Flashback", duration: 226 },
    { title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", coverUrl: "https://picsum.photos/seed/song16/300/300", category: "Flashback", duration: 294 },
  ];
  count = 0;
  for (const m of musicasData) {
    const exists = await db.musica.findFirst({ where: { title: m.title, artist: m.artist } });
    if (!exists) {
      await db.musica.create({
        data: {
          ...m,
          isPlaying: m.title === "Blinding Lights",
          playedAt: new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)),
        },
      });
      count++;
    }
  }
  results.musicas = count;

  // ─── Notícias ──────────────────────────────────────────────
  const noticiasData = [
    { title: "Flash Mix Digital lança novo aplicativo mobile", summary: "Rádio inova com plataforma digital premium dark mode neon.", content: "A Flash Mix Digital acaba de lançar seu novo aplicativo mobile com design premium, dark mode e neon. A plataforma traz player em segundo plano, recados dos ouvintes e programação completa. O objetivo é oferecer uma experiência moderna inspirada nos melhores apps de streaming do mercado, mantendo a identidade visual da rádio com a paleta preto, azul escuro, vermelho e branco. O app já está disponível para acesso via web e em breve nas lojas Android e iOS.", imageUrl: "https://picsum.photos/seed/news1/600/400", category: "Tecnologia", isFeatured: true },
    { title: "Campo Grande sedia festival de música neste fim de semana", summary: "Evento ocorre no próximo final de semana com entrada gratuita.", content: "A prefeitura municipal de Campo Grande anunciou nesta semana a realização de um grande festival cultural que vai movimentar a cidade. O evento contará com apresentações musicais, gastronomia local e atrações para toda a família. A Flash Mix Digital será a rádio oficial do evento com transmissão ao vivo durante todo o final de semana. Os ouvintes poderão acompanhar os bastidores pelo nosso app e enviar recados para os locutores.", imageUrl: "https://picsum.photos/seed/news2/600/400", category: "Cultura", isFeatured: true },
    { title: "Promoção Verão Flash Mix tem prêmios de R$ 10 mil", summary: "Participe e concorra a prêmios incríveis.", content: "A promoção Verão Flash Mix está sorteando R$ 10 mil em prêmios para os ouvintes. Para participar, basta enviar um recado pelo app ou WhatsApp e aguardar o sorteio ao vivo no programa Manhã Flash. Não perca essa chance de levar prêmios para casa! O regulamento completo está disponível no nosso aplicativo, na seção Promoções.", imageUrl: "https://picsum.photos/seed/news3/600/400", category: "Promoção", isFeatured: false },
    { title: "Entrevista exclusiva com artista local", summary: "Bate-papo com quem está fazendo sucesso na cena musical.", content: "No programa Conectados com Você desta sexta-feira teremos uma entrevista exclusiva com um artista local que está em ascensão. Ele vai falar sobre carreira, inspirações e os próximos projetos. A entrevista será transmitida ao vivo e os ouvintes poderão enviar perguntas pelo nosso app, na seção Recados. Será uma conversa descontraída e cheia de surpresas para os fãs de música nova.", imageUrl: "https://picsum.photos/seed/news4/600/400", category: "Música", isFeatured: false },
    { title: "Top 10 mais tocadas da semana", summary: "Confira as músicas que bombaram na Flash Mix Digital.", content: "A Flash Mix Digital divulga o Top 10 das músicas mais tocadas da semana. O ranking é baseado nos pedidos dos ouvintes e nas execuções na programação. Confira a lista completa no app, na seção Busca, e veja se sua música favorita está entre as mais tocadas. A cada semana atualizamos o ranking com os hits que mais bombaram.", imageUrl: "https://picsum.photos/seed/news5/600/400", category: "Música", isFeatured: false },
  ];
  count = 0;
  for (const n of noticiasData) {
    const exists = await db.noticia.findFirst({ where: { title: n.title } });
    if (!exists) {
      await db.noticia.create({ data: n });
      count++;
    }
  }
  results.noticias = count;

  // ─── Promoções ─────────────────────────────────────────────
  const promocoesData = [
    { title: "Verão Flash Mix", description: "Concorra a R$ 10 mil em prêmios!", rules: "Para participar, envie um recado pelo app ou WhatsApp. Sorteio ao vivo no programa Manhã Flash. Válido até 28/02. Ouvintes podem participar quantas vezes quiserem. Os ganhadores serão contatados pelo telefone/email cadastrado. Prêmios não são cumulativos.", prize: "R$ 10.000,00", imageUrl: "https://picsum.photos/seed/promo1/600/400", endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true, participants: 1247 },
    { title: "Ingressos VIP Festival", description: "Venha para o nosso evento exclusivo!", rules: "Os 50 primeiros ouvintes que enviarem recado ganham. Sorteio no programa Conectados com Você. Os ingressos dão direito a área VIP, open bar e meet & greet com os artistas. Retirada presencial com documento de identidade.", prize: "Ingressos VIP", imageUrl: "https://picsum.photos/seed/promo2/600/400", endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), isActive: true, participants: 432 },
    { title: "Flash Back Friday", description: "Sexta-feira de clássicos com prêmios!", rules: "Toda sexta, sorteio de kit Flash Mix (camiseta, caneca, adesivos) entre os ouvintes ativos que enviarem recado. O sorteio acontece durante o programa Flashback Night, das 19h às 22h.", prize: "Kit Flash Mix", imageUrl: "https://picsum.photos/seed/promo3/600/400", endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isActive: true, participants: 89 },
  ];
  count = 0;
  for (const p of promocoesData) {
    const exists = await db.promocao.findFirst({ where: { title: p.title } });
    if (!exists) {
      await db.promocao.create({ data: p });
      count++;
    }
  }
  results.promocoes = count;

  // ─── Podcasts ──────────────────────────────────────────────
  const podcastsData = [
    { title: "Lagoa News - Edição Completa", description: "Notícias da cidade em 30 minutos.", imageUrl: "https://picsum.photos/seed/pod1/600/400", audioUrl: "https://example.com/pod1.mp3", duration: 1800, category: "Notícias", episode: 1, season: 1 },
    { title: "Bate-Papo com DJ Flash", description: "Entrevistas com artistas locais e nacionais.", imageUrl: "https://picsum.photos/seed/pod2/600/400", audioUrl: "https://example.com/pod2.mp3", duration: 2400, category: "Música", episode: 1, season: 1 },
    { title: "Hora do Rock - Especial", description: "Histórias das maiores bandas do rock mundial.", imageUrl: "https://picsum.photos/seed/pod3/600/400", audioUrl: "https://example.com/pod3.mp3", duration: 3600, category: "Rock", episode: 1, season: 1 },
    { title: "Sertanejo na Veia", description: "Tudo sobre o universo sertanejo, do clássico ao universitário.", imageUrl: "https://picsum.photos/seed/pod4/600/400", audioUrl: "https://example.com/pod4.mp3", duration: 2700, category: "Sertanejo", episode: 1, season: 1 },
  ];
  count = 0;
  for (const p of podcastsData) {
    const exists = await db.podcast.findFirst({ where: { title: p.title } });
    if (!exists) {
      await db.podcast.create({ data: p });
      count++;
    }
  }
  results.podcasts = count;

  // ─── Vídeos ────────────────────────────────────────────────
  const videosData = [
    { title: "Clipe: Manhã Flash Ao Vivo", description: "Os melhores momentos do programa.", youtubeId: "dQw4w9WgXcQ", thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg", duration: 240 },
    { title: "Entrevista Exclusiva", description: "Bate-papo com artista convidado.", youtubeId: "9bZkp7q19f0", thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/0.jpg", duration: 480 },
    { title: "Backstage Night Club", description: "Bastidores da noite eletrônica.", youtubeId: "kJQP7kiw5Fk", thumbnailUrl: "https://img.youtube.com/vi/kJQP7kiw5Fk/0.jpg", duration: 360 },
  ];
  count = 0;
  for (const v of videosData) {
    const exists = await db.video.findFirst({ where: { youtubeId: v.youtubeId } });
    if (!exists) {
      await db.video.create({ data: v });
      count++;
    }
  }
  results.videos = count;

  // ─── Banners ───────────────────────────────────────────────
  const bannersData = [
    { title: "Ao Vivo Agora", subtitle: "Manhã Flash - 06:00 às 09:00", imageUrl: "https://picsum.photos/seed/banner1/1200/400", position: "home", order: 1, isActive: true },
    { title: "Promoção Verão", subtitle: "R$ 10 mil em prêmios", imageUrl: "https://picsum.photos/seed/banner2/1200/400", position: "home", order: 2, isActive: true },
  ];
  count = 0;
  for (const b of bannersData) {
    const exists = await db.banner.findFirst({ where: { title: b.title } });
    if (!exists) {
      await db.banner.create({ data: b });
      count++;
    }
  }
  results.banners = count;

  // ─── Categorias ────────────────────────────────────────────
  const categoriasData = [
    { name: "Pop", slug: "pop", iconName: "Music", color: "#E30613", order: 1 },
    { name: "Rock", slug: "rock", iconName: "Guitar", color: "#E30613", order: 2 },
    { name: "Forró", slug: "forro", iconName: "Accordion", color: "#E30613", order: 3 },
    { name: "Sertanejo", slug: "sertanejo", iconName: "HatCowboy", color: "#E30613", order: 4 },
    { name: "Eletrônica", slug: "eletronica", iconName: "Waves", color: "#E30613", order: 5 },
    { name: "Flashback", slug: "flashback", iconName: "History", color: "#E30613", order: 6 },
    { name: "Funk", slug: "funk", iconName: "Drum", color: "#E30613", order: 7 },
    { name: "Gospel", slug: "gospel", iconName: "Church", color: "#E30613", order: 8 },
    { name: "Notícias", slug: "noticias", iconName: "Newspaper", color: "#E30613", order: 9 },
    { name: "Podcasts", slug: "podcasts", iconName: "Mic", color: "#E30613", order: 10 },
  ];
  count = 0;
  for (const c of categoriasData) {
    const exists = await db.categoria.findUnique({ where: { slug: c.slug } });
    if (!exists) {
      await db.categoria.create({ data: c });
      count++;
    }
  }
  results.categorias = count;

  // ─── RadioConfig (stream real) ─────────────────────────────
  const streamUrl = process.env.STREAM_URL || "http://s02.taaqui.org:8874/stream";
  const configExists = await db.radioConfig.findFirst();
  if (!configExists) {
    await db.radioConfig.create({
      data: {
        streamUrl,
        streamName: "Flash Mix Digital",
        isLive: true,
        nowPlayingTitle: "Flash Mix Digital - Ao Vivo",
        nowPlayingArtist: "Campo Grande / MS",
      },
    });
    results.radioConfig = 1;
  } else {
    // Atualiza URL se mudou
    if (configExists.streamUrl !== streamUrl) {
      await db.radioConfig.update({
        where: { id: configExists.id },
        data: { streamUrl },
      });
    }
    results.radioConfig = 0;
  }

  // ─── Admin user (admin@flashmix.com / admin123) ───────────
  const adminEmail = "admin@flashmix.com";
  const adminExists = await db.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const bcrypt = (await import("bcryptjs")).default;
    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.user.create({
      data: {
        email: adminEmail,
        name: "Administrador",
        passwordHash,
        role: "ADMIN",
        isGuest: false,
        city: "Campo Grande",
        state: "MS",
      },
    });
    results.adminUser = 1;
  } else {
    results.adminUser = 0;
  }

  // ─── Notificações demo ─────────────────────────────────────
  const notifsData = [
    { title: "Bem-vindo ao Flash Mix Digital!", message: "Obrigado por baixar nosso app. Aproveite a rádio ao vivo!", type: "INFO" },
    { title: "Promoção ativa", message: "Participe da Promoção Verão Flash Mix e concorra a R$ 10 mil!", type: "PROMO" },
    { title: "Programa ao vivo", message: "Manhã Flash está no ar agora! Não perca.", type: "PROGRAMA" },
  ];
  count = 0;
  for (const n of notifsData) {
    const exists = await db.notification.findFirst({ where: { title: n.title } });
    if (!exists) {
      await db.notification.create({ data: n });
      count++;
    }
  }
  results.notifications = count;

  return NextResponse.json({ ok: true, results });
}
