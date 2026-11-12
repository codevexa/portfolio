/**
 * VEXA — Projetos.
 *
 * REGRA DE CONTEÚDO: tudo que está descrito como funcionalidade abaixo foi
 * observado nas telas reais de cada projeto. Nada aqui é suposição.
 * Campos marcados com `editavel: true` existem para serem preenchidos por você
 * (Juan) quando quiser acrescentar informação que o site ainda não afirma.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  /** "phone" renderiza dentro de um mockup de celular; "browser" dentro de um navegador. */
  frame: "phone" | "browser";
  caption?: string;
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  wordmark?: string;
  category: string;
  tagline: string;
  /** Resumo curto usado nas listagens. */
  excerpt: string;
  /** Parágrafos do conceito. */
  concept: string[];
  problem: string;
  solution: string;
  /** Funcionalidades confirmadas nas telas do projeto. */
  features: string[];
  /** Campos opcionais — preencha quando quiser. */
  pending?: { label: string; hint: string }[];
  meta: { label: string; value: string }[];
  liveUrl?: string;
  cover: ProjectImage;
  gallery: ProjectImage[];
  /** Cor de acento do próprio projeto, usada com parcimônia na página do case. */
  accent: string;
  palette: { name: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "refugio",
    index: "01",
    name: "Refúgio",
    category: "Aplicativo · Plataforma digital",
    tagline: "Um espaço de paz, no bolso.",
    excerpt:
      "Aplicativo de vida espiritual com reflexão diária, confessionário privado, leitura da Bíblia, orações, diário e comunidade.",
    concept: [
      "Refúgio nasce de uma pergunta simples: como seria um aplicativo que, ao ser aberto, baixa a frequência em vez de aumentá-la?",
      "A interface foi construída no sentido oposto ao de um feed. Sem contadores, sem disputa por atenção, sem ruído. A primeira tela cumprimenta a pessoa pelo nome e pelo horário do dia, e a partir dali oferece poucos caminhos, todos claros.",
      "A direção visual trabalha com luz difusa, azul sereno e creme, tipografia serifada nos títulos e muito espaço em branco — um ambiente que comunica calma antes de comunicar função.",
    ],
    problem:
      "Prática espiritual costuma ficar espalhada: a Bíblia em um app, as anotações em outro, o desabafo sem lugar nenhum. A dispersão desgasta justamente o hábito que deveria acolher.",
    solution:
      "Reunir leitura, oração, escuta e registro pessoal em um único ambiente silencioso, com um ponto de entrada diário que convida a voltar sem cobrar.",
    features: [
      "Reflexão do dia na tela inicial, com estado próprio enquanto o conteúdo é preparado",
      "Confessionário — espaço privado para desabafar em formato de conversa",
      "Leitura da Bíblia em modo tranquilo",
      "Orações e reflexões",
      "Encontrar apoio — acesso à comunidade",
      "Diário espiritual",
      "Perfil do usuário",
      "Notificações com indicador de novidades",
      "Saudação contextual por período do dia",
      "Navegação inferior fixa: Início, Confessionário, Bíblia, Comunidade, Perfil",
    ],
    pending: [
      { label: "Status", hint: "Em desenvolvimento, em testes ou publicado?" },
      { label: "Plataformas", hint: "iOS, Android, PWA — confirmar antes de divulgar." },
      { label: "Stack", hint: "Tecnologias que você quer tornar públicas." },
    ],
    meta: [
      { label: "Tipo", value: "Aplicativo mobile" },
      { label: "Segmento", value: "Bem-estar e vida espiritual" },
      { label: "Atuação", value: "Conceito, UI/UX e desenvolvimento" },
      { label: "Direção", value: "Luz difusa, azul sereno, serifa editorial" },
    ],
    accent: "#8FB3DC",
    palette: [
      { name: "Céu", value: "#DCE8F5" },
      { name: "Luz", value: "#F7EBD2" },
      { name: "Traço", value: "#8FB3DC" },
      { name: "Texto", value: "#2C2F33" },
    ],
    cover: {
      src: "/images/projetos/refugio-02.webp",
      alt: "Tela inicial do aplicativo Refúgio com a saudação ao usuário e os atalhos de confessionário, Bíblia e oração.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/images/projetos/refugio-01.webp",
        alt: "Tela de abertura do Refúgio com o símbolo do sol nascendo sobre nuvens.",
        frame: "phone",
        caption: "Abertura — o símbolo antes da interface.",
      },
      {
        src: "/images/projetos/refugio-02.webp",
        alt: "Tela inicial do Refúgio com reflexão do dia, confessionário, Bíblia, oração, apoio e diário.",
        frame: "phone",
        caption: "Início — poucos caminhos, todos claros.",
      },
    ],
  },

  {
    slug: "jotah-26",
    index: "02",
    name: "Jotah 26",
    wordmark: "JOTAH.26",
    category: "Plataforma digital · Evento esportivo",
    tagline: "O convite virou plataforma.",
    excerpt:
      "Plataforma de um torneio de Futebol 7 com galeto: apresentação do evento, confirmação de presença e programação em uma página só.",
    concept: [
      "Jotah 26 resolve a logística de um evento esportivo no lugar onde ela realmente acontece: no celular, enquanto a pessoa decide se vai.",
      "Em vez de um grupo de mensagens com listas perdidas, o projeto concentra data, formato, regras e confirmação em uma experiência única, direta, feita para ser respondida em segundos.",
      "A direção visual puxa para o lado competitivo: preto e vinho profundo, tipografia condensada pesada, o campo iluminado ao fundo. Um convite que parece cartaz de jogo.",
    ],
    problem:
      "Organizar um torneio amador significa repetir a mesma informação dezenas de vezes e perder a conta de quem confirmou.",
    solution:
      "Uma plataforma que apresenta o evento, explica o funcionamento, publica a programação e recolhe as confirmações — com estado visível quando as inscrições encerram.",
    features: [
      "Hero do evento com data e horário de início",
      "Identificação do formato: torneio de Futebol 7 com galeto",
      "Confirmação de presença, com ação fixa no topo",
      "Estado de confirmações encerradas quando o prazo termina",
      "Seção “Como vai funcionar”",
      "Programação do dia",
      "Marcação de aniversário e dia da semana",
      "Experiência construída para leitura em celular",
    ],
    pending: [
      {
        label: "Gestão de equipes",
        hint: "Se o sistema organiza times, chaves ou tabela, me passe os detalhes e eu descrevo o recurso aqui.",
      },
      { label: "Painel do organizador", hint: "Existe área administrativa? Quais dados ela mostra?" },
    ],
    meta: [
      { label: "Tipo", value: "Plataforma de evento" },
      { label: "Evento", value: "Torneio de Futebol 7 · Galeto" },
      { label: "Data", value: "31 de outubro de 2026, a partir das 12h" },
      { label: "Atuação", value: "Identidade, UI/UX e desenvolvimento" },
    ],
    liveUrl: "https://jotah-26.vercel.app",
    accent: "#C8213A",
    palette: [
      { name: "Noite", value: "#120A12" },
      { name: "Vinho", value: "#2A1326" },
      { name: "Sangue", value: "#C8213A" },
      { name: "Osso", value: "#F2EDE6" },
    ],
    cover: {
      src: "/images/projetos/jotah-01.webp",
      alt: "Página do Jotah 26 com o título do evento, data, descrição e botões de confirmação.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/images/projetos/jotah-01.webp",
        alt: "Hero do Jotah 26 com tipografia condensada, data do torneio e ações de confirmação.",
        frame: "phone",
        caption: "Hero — cartaz de jogo que responde ao toque.",
      },
    ],
  },

  {
    slug: "resenha-fc-mantos",
    index: "03",
    name: "Resenha FC Mantos",
    category: "Projeto digital · Camisas de futebol",
    tagline: "A loja fala a língua da arquibancada.",
    excerpt:
      "Experiência de compra de camisas de futebol: catálogo por ligas, destaques, carrinho, rastreio de pedido e atendimento direto no WhatsApp.",
    concept: [
      "Resenha FC Mantos parte de um público que não navega: procura o manto. A estrutura inteira foi montada em torno dessa pressa.",
      "O catálogo se organiza pelo vocabulário de quem compra — Brasileirão, Premier League, La Liga, Seleções, Torcedor Feminina — em vez de categorias genéricas de e-commerce.",
      "A identidade usa preto, escudo dourado e um amarelo-limão de sinalização nos pontos de ação: carrinho, avisos, chamadas. O percurso da vitrine ao atendimento é curto e deliberado.",
    ],
    problem:
      "Loja de camisa compete por decisão rápida. Catálogo confuso, preço escondido ou dúvida sem resposta derrubam a venda antes do carrinho.",
    solution:
      "Vitrine com preço e desconto visíveis desde o primeiro toque, navegação organizada por liga, rastreio de pedido acessível e canal de atendimento sempre à mão.",
    features: [
      "Catálogo navegável por categorias (Camisas, Seleções Mundiais)",
      "Recorte por ligas: Brasileirão, Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Mundiais e Torcedor Feminina",
      "Banner rotativo na abertura da loja",
      "Seção de destaques com os produtos mais procurados",
      "Preço promocional com valor anterior comparado e selo de desconto",
      "Avaliações por estrelas nos produtos",
      "Busca de produtos",
      "Carrinho com contador de itens",
      "Rastreio de pedido e histórico “Meus pedidos”",
      "Barra de avisos com compra segura e atendimento",
      "Horário de atendimento exibido no cabeçalho",
      "Botão flutuante de WhatsApp em toda a navegação",
      "Menu lateral completo em mobile",
    ],
    pending: [
      { label: "Meio de pagamento", hint: "Qual gateway está integrado, se já estiver." },
      { label: "Estoque e envio", hint: "Como é feita a gestão hoje — para eu descrever com precisão." },
    ],
    meta: [
      { label: "Tipo", value: "Loja digital" },
      { label: "Segmento", value: "Camisas de futebol" },
      { label: "Atuação", value: "Experiência de navegação e desenvolvimento" },
      { label: "Atendimento", value: "Segunda a sábado, 09h às 18h" },
    ],
    accent: "#D8E600",
    palette: [
      { name: "Preto", value: "#0B0B0B" },
      { name: "Sinal", value: "#D8E600" },
      { name: "Escudo", value: "#C9A227" },
      { name: "Papel", value: "#FFFFFF" },
    ],
    cover: {
      src: "/images/projetos/resenha-01.webp",
      alt: "Loja Resenha FC Mantos com banner, destaques e produtos com desconto.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/images/projetos/resenha-01.webp",
        alt: "Página inicial da loja com banner rotativo e grade de destaques com preços.",
        frame: "phone",
        caption: "Vitrine — preço e desconto no primeiro toque.",
      },
      {
        src: "/images/projetos/resenha-02.webp",
        alt: "Menu lateral da loja com início, catálogo, carrinho, rastreio, categorias e ligas.",
        frame: "phone",
        caption: "Menu — organizado pelo vocabulário da arquibancada.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
