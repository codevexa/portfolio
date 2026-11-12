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
    tagline: "Um lugar seguro para respirar.",
    excerpt:
      "Plataforma de acolhimento espiritual com reflexão diária, confessionário privado, leitura da Bíblia, orações, diário e comunidade.",
    concept: [
      "Refúgio nasce de uma pergunta simples: como seria um aplicativo que, ao ser aberto, baixa a frequência em vez de aumentá-la?",
      "A interface foi construída no sentido oposto ao de um feed. Sem contadores, sem disputa por atenção, sem ruído. A tela inicial cumprimenta a pessoa pelo nome e pelo horário do dia, e a partir dali oferece poucos caminhos, todos claros.",
      "A promessa aparece já na porta de entrada — “Converse, reflita, leia e ore — no seu tempo, do seu jeito, sem julgamentos” — e se sustenta na direção visual: luz difusa, azul sereno e creme, tipografia serifada nos títulos e muito espaço em branco. Um ambiente que comunica calma antes de comunicar função.",
      "A decisão mais importante do projeto, porém, não é estética. O rodapé de todas as páginas afirma que apoio espiritual não substitui ajuda profissional e deixa o 188 do CVV a um toque de distância. Um produto que lida com fragilidade precisa saber reconhecer o próprio limite.",
    ],
    problem:
      "Prática espiritual costuma ficar espalhada: a Bíblia em um app, as anotações em outro, o desabafo sem lugar nenhum. A dispersão desgasta justamente o hábito que deveria acolher — e, quando o assunto é sofrimento real, improviso não basta.",
    solution:
      "Reunir leitura, oração, escuta e registro pessoal em um único ambiente silencioso, com um ponto de entrada diário que convida a voltar sem cobrar — e com encaminhamento responsável para ajuda profissional sempre visível.",
    features: [
      "Página de entrada com proposta clara e dois caminhos: criar conta ou entrar",
      "Cadastro com nome de tratamento, e-mail e senha de no mínimo 8 caracteres",
      "Aceite explícito dos Termos de Uso e da Política de Privacidade no cadastro",
      "Login com recuperação de senha",
      "Reflexão do dia na tela inicial, com estado próprio enquanto o conteúdo é preparado",
      "Confessionário — espaço privado para desabafar em formato de conversa",
      "Leitura da Bíblia em modo tranquilo",
      "Orações e reflexões",
      "Encontrar apoio — acesso à comunidade",
      "Diário espiritual",
      "Perfil do usuário e notificações com indicador de novidades",
      "Saudação contextual por período do dia",
      "Navegação inferior fixa: Início, Confessionário, Bíblia, Comunidade, Perfil",
      "Aviso permanente de que o apoio não substitui ajuda profissional, com link direto para o 188 (CVV)",
      "Páginas próprias de Termos de Uso e Política de Privacidade",
    ],
    pending: [
      { label: "Status", hint: "Em testes ou já aberto ao público?" },
      { label: "Plataformas", hint: "Hoje é web; vai virar app nas lojas?" },
      { label: "Stack", hint: "Tecnologias que você quer tornar públicas." },
    ],
    meta: [
      { label: "Tipo", value: "Aplicativo web" },
      { label: "Segmento", value: "Acolhimento e vida espiritual" },
      { label: "Atuação", value: "Conceito, UI/UX e desenvolvimento" },
      { label: "Direção", value: "Luz difusa, azul sereno, serifa editorial" },
    ],
    liveUrl: "https://refugio-seven-phi.vercel.app",
    accent: "#6C93C0",
    palette: [
      { name: "Céu", value: "#DCE8F5" },
      { name: "Luz", value: "#F7EBD2" },
      { name: "Traço", value: "#6C93C0" },
      { name: "Texto", value: "#2C2F33" },
    ],
    cover: {
      src: "/images/projetos/refugio-01-landing.webp",
      alt: "Página de entrada do Refúgio com o título “Um lugar seguro para respirar”.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/images/projetos/refugio-01-landing.webp",
        alt: "Entrada do Refúgio: símbolo do sol nascendo, título e os botões criar conta e entrar.",
        frame: "phone",
        caption: "Entrada — a promessa antes da interface.",
      },
      {
        src: "/images/projetos/refugio-03-cadastro.webp",
        alt: "Tela de cadastro do Refúgio com nome de tratamento, e-mail, senha e aceite dos termos.",
        frame: "phone",
        caption: "Cadastro — consentimento explícito, sem letra miúda.",
      },
      {
        src: "/images/projetos/refugio-02-app.webp",
        alt: "Tela inicial do Refúgio com reflexão do dia, confessionário, Bíblia, oração, apoio e diário.",
        frame: "phone",
        caption: "Início — poucos caminhos, todos claros.",
      },
      {
        src: "/images/projetos/refugio-04-entrar.webp",
        alt: "Tela de login do Refúgio com a mensagem “Que bom ter você de volta”.",
        frame: "phone",
        caption: "Retorno — a mesma voz da primeira visita.",
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
      "Plataforma de um torneio de Futebol 7 com galeto: apresentação do evento, confirmação de presença, programação e painel do organizador.",
    concept: [
      "Jotah 26 resolve a logística de um evento esportivo no lugar onde ela realmente acontece: no celular, enquanto a pessoa decide se vai.",
      "Em vez de um grupo de mensagens com listas perdidas, o projeto concentra data, formato, regras e confirmação em uma experiência única, direta, feita para ser respondida em segundos.",
      "O conteúdo foi organizado pela única pergunta que o convidado faz: o que vai acontecer e o que eu preciso fazer. Daí os três blocos numerados — Futebol 7, Galeto, Comemoração — e uma seção explícita de “o que levar”. Quem só quer assistir também tem lugar reservado no texto.",
      "A direção visual puxa para o lado competitivo: preto e vinho profundo, tipografia condensada pesada, o campo iluminado ao fundo. Um convite que parece cartaz de jogo.",
    ],
    problem:
      "Organizar um torneio amador significa repetir a mesma informação dezenas de vezes, perder a conta de quem confirmou e descobrir na véspera quem realmente vai jogar.",
    solution:
      "Uma plataforma que apresenta o evento, explica o funcionamento, publica a programação e recolhe as confirmações — com estado visível quando as inscrições encerram e uma área administrativa para o organizador.",
    features: [
      "Hero do evento com data, horário e formato",
      "Três blocos numerados explicando o dia: Futebol 7, Galeto e Comemoração",
      "Regra de participação explícita — quem confirma que vai jogar entra na divisão do aluguel da quadra",
      "Lugar previsto para quem vai só assistir e comemorar",
      "Página dedicada de confirmação de presença, com ação fixa no topo de toda a navegação",
      "Estado de confirmações encerradas, com orientação de como falar direto com o organizador",
      "Programação com data, horário e local",
      "Seção “O que levar?”",
      "Aviso aos convidados",
      "Área administrativa com acesso restrito por login",
      "Experiência construída para leitura em celular",
    ],
    pending: [
      {
        label: "Painel do organizador",
        hint: "A área /admin existe. Me diga o que ela mostra (lista de confirmados, divisão de custos, times) e eu detalho no case.",
      },
      { label: "Gestão de equipes", hint: "O sistema monta times ou chaveamento?" },
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
      src: "/images/projetos/jotah-01-hero.webp",
      alt: "Abertura do Jotah 26 com o título do evento, data e ações de confirmação.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/images/projetos/jotah-01-hero.webp",
        alt: "Hero do Jotah 26 com tipografia condensada, data do torneio e ações de confirmação.",
        frame: "phone",
        caption: "Hero — cartaz de jogo que responde ao toque.",
      },
      {
        src: "/images/projetos/jotah-02-formato.webp",
        alt: "Blocos numerados do Jotah 26 explicando o futebol 7 e o galeto.",
        frame: "phone",
        caption: "Formato — o dia inteiro em três blocos.",
      },
      {
        src: "/images/projetos/jotah-03-programacao.webp",
        alt: "Programação do Jotah 26 com data, horário e local do evento.",
        frame: "phone",
        caption: "Programação — a resposta sem rolagem extra.",
      },
      {
        src: "/images/projetos/jotah-04-confirmar.webp",
        alt: "Página de confirmação de presença do Jotah 26 com o aviso de confirmações encerradas.",
        frame: "phone",
        caption: "Confirmação — inclusive quando a resposta é “já fechou”.",
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
      "Loja de camisas de futebol com 73 produtos: catálogo por clube e liga, página de produto, carrinho, rastreio de pedido e atendimento no WhatsApp.",
    concept: [
      "Resenha FC Mantos parte de um público que não navega: procura o manto. A estrutura inteira foi montada em torno dessa pressa.",
      "O catálogo se organiza pelo vocabulário de quem compra — Flamengo, Palmeiras, Corinthians, São Paulo, Santos, Vasco, Real Madrid, Seleções — e cada clube tem página própria, com escudo, liga e contagem de produtos. Dentro de cada um, a variação que o torcedor realmente pede: titular, reserva, terceira, jogador, torcedor, feminina, goleiro, baby look.",
      "A identidade usa preto, escudo dourado e um amarelo-limão de sinalização nos pontos de ação: carrinho, avisos, chamadas. O percurso da vitrine ao atendimento é curto e deliberado — o botão de WhatsApp acompanha a navegação inteira.",
      "O pós-venda recebeu o mesmo cuidado da vitrine. O rastreio tem página própria, diz com todas as letras que a consulta é feita no site oficial da transportadora e oferece o WhatsApp para quem não achou o código. Até o carrinho vazio tem texto e saída.",
    ],
    problem:
      "Loja de camisa compete por decisão rápida. Catálogo confuso, preço escondido ou dúvida sem resposta derrubam a venda antes do carrinho — e, depois da compra, “cadê meu pedido?” vira trabalho manual.",
    solution:
      "Vitrine com preço e desconto visíveis desde o primeiro toque, navegação organizada por clube e liga, rastreio com página própria e canal de atendimento sempre à mão.",
    features: [
      "Catálogo com 73 produtos, de clube e de seleção",
      "Página própria por clube, com escudo, liga e contagem de produtos",
      "Recorte por ligas: Brasileirão, Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Mundiais e Torcedor Feminina",
      "Variações por tipo: titular, reserva, terceira, jogador, torcedor, feminina, goleiro e baby look",
      "Página de produto com trilha de navegação por liga e clube",
      "Banner rotativo na abertura da loja",
      "Seção de destaques com os produtos mais procurados",
      "Preço promocional com valor anterior comparado e selo de desconto",
      "Avaliações por estrelas nos produtos",
      "Busca de produtos",
      "Carrinho com contador de itens, ajuste de quantidade e estado vazio com saída",
      "Rastreio de pedido integrado à J&T Express, com aviso de que a consulta abre no site oficial",
      "Histórico “Meus pedidos”",
      "Barra de avisos com compra segura e atendimento",
      "Horário de atendimento exibido no cabeçalho",
      "Botão flutuante de WhatsApp em toda a navegação",
      "Menu lateral completo em mobile",
    ],
    pending: [
      { label: "Meio de pagamento", hint: "Qual gateway está integrado — posso citar no case?" },
      { label: "Estoque e envio", hint: "Como é feita a gestão hoje, para eu descrever com precisão." },
    ],
    meta: [
      { label: "Tipo", value: "Loja digital" },
      { label: "Catálogo", value: "73 produtos, de clube e seleção" },
      { label: "Atuação", value: "Experiência de navegação e desenvolvimento" },
      { label: "Atendimento", value: "Segunda a sábado, 09h às 18h" },
    ],
    liveUrl: "https://resenha-fc-mantos.vercel.app",
    accent: "#D8E600",
    palette: [
      { name: "Preto", value: "#0B0B0B" },
      { name: "Sinal", value: "#D8E600" },
      { name: "Escudo", value: "#C9A227" },
      { name: "Papel", value: "#FFFFFF" },
    ],
    cover: {
      src: "/images/projetos/resenha-01-home.webp",
      alt: "Loja Resenha FC Mantos com banner, destaques e produtos com desconto.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/images/projetos/resenha-01-home.webp",
        alt: "Página inicial da loja com banner rotativo e grade de destaques com preços.",
        frame: "phone",
        caption: "Vitrine — preço e desconto no primeiro toque.",
      },
      {
        src: "/images/projetos/resenha-02-catalogo.webp",
        alt: "Catálogo da loja com a contagem de produtos e a grade de camisas.",
        frame: "phone",
        caption: "Catálogo — 73 mantos, de clube e seleção.",
      },
      {
        src: "/images/projetos/resenha-05-time.webp",
        alt: "Página do Flamengo na loja, com escudo, liga e produtos do clube.",
        frame: "phone",
        caption: "Clube — cada time com página própria.",
      },
      {
        src: "/images/projetos/resenha-03-produto.webp",
        alt: "Página de produto da loja com trilha de navegação, foto da camisa e desconto.",
        frame: "phone",
        caption: "Produto — trilha de navegação por liga e clube.",
      },
      {
        src: "/images/projetos/resenha-04-rastreio.webp",
        alt: "Página de rastreio da loja com campo de código e integração com a J&T Express.",
        frame: "phone",
        caption: "Rastreio — o pós-venda com o mesmo cuidado da vitrine.",
      },
      {
        src: "/images/projetos/resenha-06-menu.webp",
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
