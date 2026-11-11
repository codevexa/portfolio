/**
 * Todo texto fixo que o cliente lê no site.
 *
 * O padrão vive aqui (o site nunca fica sem texto). O vendedor sobrescreve
 * no painel, em /admin/textos, e o valor salvo no banco vence o padrão.
 *
 * Marcadores aceitos em qualquer texto:
 *   {loja}        -> nome da loja (Configurações)
 *   {pagamentos}  -> formas de pagamento (Configurações)
 *   {n}           -> número, só onde o texto é sobre quantidade
 */

export const TEXTOS_PADRAO = {
  /* Topo e menu ---------------------------------------------------- */
  "menu.inicio": "INÍCIO",
  "menu.catalogo": "CATÁLOGO",
  "menu.carrinho": "Meu carrinho",
  "menu.rastreio": "RASTREIE SEU PEDIDO",
  "menu.categorias": "CATEGORIAS",
  "menu.ligas": "LIGAS",
  "header.zap": "Chamar no Zap",
  "header.busca": "Buscar manto, time, liga…",

  /* Home ----------------------------------------------------------- */
  "home.destaques.titulo": "Destaques",
  "home.destaques.sub": "Os mantos mais procurados da loja:",
  "home.destaques.botao": "VER TODOS",
  "home.times.titulo": "Compre por Time",
  "home.times.sub": "Separamos os clubes das melhores ligas para você:",
  "home.categorias.titulo": "Compre por Categoria",
  "home.categorias.sub": "Separamos diversas coleções de produtos para você:",
  "home.categorias.cta": "Ver coleção",
  "home.ligas.titulo": "Ligas",
  "home.ligas.sub": "Escolha o campeonato e veja todos os times:",
  "home.ligas.cta": "Ver o manto",
  "home.feedback.titulo": "FEEDBACK",
  "home.feedback.sub":
    "Quem já comprou e recebeu — relatos reais dos nossos clientes",
  "home.faq.titulo": "Perguntas frequentes",

  /* Página do produto ---------------------------------------------- */
  "produto.avaliacao": "Avaliação dos clientes",
  "produto.pagamento": "à vista no PIX · ou no cartão de crédito",
  "produto.estoque_baixo": "Últimas {n} peças em estoque",
  "produto.selo_esgotado": "ESGOTADO",
  "produto.tamanho": "Tamanho",
  "produto.escolha_tamanho": "Escolha um tamanho",
  "produto.erro_tamanho": "Escolha um tamanho antes de adicionar.",
  "produto.quantidade": "Quantidade",
  "produto.botao_adicionar": "Adicionar ao carrinho",
  "produto.adicionado": "Adicionado ao carrinho.",
  "produto.ver_carrinho": "Ver carrinho",
  "produto.botao_zap": "Pedir só este no WhatsApp",
  "produto.esgotado_aviso":
    "Esgotado no momento. Chama no WhatsApp que a gente avisa assim que chegar.",
  "produto.botao_avise": "Avise-me quando chegar",
  "produto.bullet_prazo": "Entrega em até 10 dias, combinada no WhatsApp",
  "produto.bullet_esgotado": "Sem estoque agora — avisamos assim que chegar",
  "produto.bullet_envio": "Envio para todo o Brasil com código de rastreio",
  "produto.bullet_troca": "Troca em até 7 dias se o tamanho não servir",
  "produto.bullet_pagamento": "Pagamento no PIX ou cartão de crédito",
  "produto.relacionados": "Quem viu esse, viu também",

  /* Carrinho -------------------------------------------------------- */
  "carrinho.titulo": "Meu carrinho",
  "carrinho.sub": "Confira os itens, ajuste as quantidades e feche o pedido.",
  "carrinho.vazio.titulo": "Seu carrinho está vazio",
  "carrinho.vazio.texto": "Escolha os mantos que você quer e eles aparecem aqui.",
  "carrinho.continuar": "← Continuar comprando",
  "carrinho.esvaziar": "Esvaziar carrinho",
  "carrinho.resumo": "RESUMO",
  "carrinho.frete_label": "Frete",
  "carrinho.frete": "combinado no WhatsApp",
  "carrinho.total": "Total",
  "carrinho.botao": "Fechar pedido no WhatsApp",
  "carrinho.aviso":
    "A conversa abre com todos os itens e o total já escritos. O frete e o pagamento a gente combina por lá.",

  /* Listas e busca -------------------------------------------------- */
  "catalogo.titulo": "Catálogo",
  "catalogo.sub": "Todos os mantos da loja, de clube a seleção.",
  "busca.titulo": "Buscar manto",
  "busca.sub": "Procure por time, liga, temporada ou modelo.",
  "busca.placeholder": "Ex.: Flamengo titular, retrô, chuteira…",
  "busca.botao": "Buscar",
  "busca.vazio": "Digite o nome do time ou do manto que você procura.",
  "grid.vazio":
    "Nada por aqui ainda. Chama no WhatsApp que a gente procura o seu manto.",

  /* Rodapé ---------------------------------------------------------- */
  "rodape.chamada":
    "Envio para todo o Brasil com rastreio · atendimento humano no WhatsApp",
  "rodape.selos": "Loja Verificada, Site Seguro (SSL), Compra Garantida",
  "rodape.fale": "Fale conosco",
  "rodape.acompanhar": "Acompanhar pedido",

  /* Página "Sobre a loja" ------------------------------------------- */
  "sobre.loja.titulo": "Sobre a loja",
  "sobre.loja.texto":
    "A {loja} nasceu da resenha: gente que gosta de futebol vendendo manto pra quem gosta de futebol. Trabalhamos com camisas de clubes brasileiros e europeus, seleções, retrô, kits infantis, chuteiras e acessórios — com atendimento humano, sem robô, direto no WhatsApp.",
  "sobre.entrega.titulo": "Prazo de entrega",
  "sobre.entrega.texto":
    "Enviamos para todo o Brasil. O prazo é combinado com você no WhatsApp antes de fechar o pedido — em geral até 10 dias. Todo envio sai com código de rastreio, que mandamos assim que o pacote é postado.",
  "sobre.trocas.titulo": "Trocas e devoluções",
  "sobre.trocas.texto":
    "Você tem 7 dias corridos a partir do recebimento para pedir troca ou devolução, com a peça sem uso, sem lavar e com a etiqueta. É só chamar no WhatsApp com o número do pedido que a gente organiza tudo.",
  "sobre.pagamento.titulo": "Formas de pagamento",
  "sobre.pagamento.texto":
    "Aceitamos {pagamentos}. No PIX a confirmação é imediata e o pedido já entra na fila de envio. No cartão, combinamos o parcelamento pelo WhatsApp antes de gerar o link.",
  "sobre.botao": "Tirar dúvida no WhatsApp",

  /* Rastreio ------------------------------------------------------- */
  "rastreio.titulo": "Acompanhe seu pedido",
  "rastreio.sub": "Saiba onde está sua encomenda em tempo real.",
  "rastreio.transportadora": "J&T Express Brasil",
  "rastreio.label": "Código de rastreio",
  "rastreio.placeholder": "Cole aqui o código do seu envio",
  "rastreio.botao": "Rastrear pedido",
  "rastreio.erro_vazio": "Digite o código de rastreio para continuar.",
  "rastreio.erro_curto": "Esse código parece curto demais. Confira o que mandamos no WhatsApp.",
  "rastreio.erro_longo": "Código longo demais. Veja se não colou mais de um de uma vez.",
  "rastreio.aviso":
    "A consulta é feita no site oficial da J&T Express, que abre em uma nova aba.",
  "rastreio.copiado.titulo": "Código copiado",
  "rastreio.copiado.texto":
    "Abrimos o site da J&T em outra aba. É só colar no campo de busca de lá e consultar.",
  "rastreio.aberto.titulo": "Site da J&T aberto em outra aba",
  "rastreio.aberto.texto":
    "Copie o código abaixo e cole no campo de busca da página que abriu.",
  "rastreio.bloqueado.titulo": "Seu navegador bloqueou a nova aba",
  "rastreio.bloqueado.texto":
    "Copie o código abaixo e toque em “Abrir o site da J&T” para consultar.",
  "rastreio.copiar": "Copiar o código",
  "rastreio.abrir": "Abrir o site da J&T",
  "rastreio.ajuda": "Não achou o seu código?",
  "rastreio.ajuda_link": "Chama a gente no WhatsApp.",

  /* Página 404 ------------------------------------------------------ */
  "404.etiqueta": "ERRO 404",
  "404.titulo": "Esse manto saiu de linha",
  "404.texto": "A página que você procurou não existe ou mudou de endereço.",
  "404.botao_inicio": "Voltar ao início",
  "404.botao_catalogo": "Ver o catálogo",
} as const;

export type TextKey = keyof typeof TEXTOS_PADRAO;
export type Textos = Record<TextKey, string>;

export const CHAVES_TEXTO = Object.keys(TEXTOS_PADRAO) as TextKey[];

/** Troca os marcadores por valores reais. */
export function aplicar(
  texto: string,
  vars: { loja?: string; pagamentos?: string; n?: number | string } = {},
) {
  let out = texto;
  if (vars.loja !== undefined) out = out.replaceAll("{loja}", vars.loja);
  if (vars.pagamentos !== undefined)
    out = out.replaceAll("{pagamentos}", vars.pagamentos);
  if (vars.n !== undefined) out = out.replaceAll("{n}", String(vars.n));
  return out;
}

/* ------------------------------------------------------------------ */
/* Agrupamento para a tela do painel                                   */
/* ------------------------------------------------------------------ */

export type CampoTexto = { chave: TextKey; label: string; longo?: boolean };
export type GrupoTexto = { id: string; titulo: string; dica: string; campos: CampoTexto[] };

export const GRUPOS_TEXTO: GrupoTexto[] = [
  {
    id: "menu",
    titulo: "Topo e menu",
    dica: "O que aparece no cabeçalho e no menu do celular.",
    campos: [
      { chave: "menu.inicio", label: "Link “Início”" },
      { chave: "menu.catalogo", label: "Link “Catálogo”" },
      { chave: "menu.carrinho", label: "Link do carrinho" },
      { chave: "menu.rastreio", label: "Link “Rastreie seu pedido”" },
      { chave: "menu.categorias", label: "Título da lista de categorias" },
      { chave: "menu.ligas", label: "Título da lista de ligas" },
      { chave: "header.zap", label: "Botão do WhatsApp" },
      { chave: "header.busca", label: "Texto do campo de busca" },
    ],
  },
  {
    id: "home",
    titulo: "Página inicial",
    dica: "Títulos e subtítulos de cada faixa da home.",
    campos: [
      { chave: "home.destaques.titulo", label: "Destaques — título" },
      { chave: "home.destaques.sub", label: "Destaques — subtítulo" },
      { chave: "home.destaques.botao", label: "Destaques — botão" },
      { chave: "home.times.titulo", label: "Times — título" },
      { chave: "home.times.sub", label: "Times — subtítulo" },
      { chave: "home.categorias.titulo", label: "Categorias — título" },
      { chave: "home.categorias.sub", label: "Categorias — subtítulo" },
      { chave: "home.categorias.cta", label: "Categorias — texto do botão do card" },
      { chave: "home.ligas.titulo", label: "Ligas — título" },
      { chave: "home.ligas.sub", label: "Ligas — subtítulo" },
      { chave: "home.ligas.cta", label: "Ligas — texto do botão do card" },
      { chave: "home.feedback.titulo", label: "Depoimentos — título" },
      { chave: "home.feedback.sub", label: "Depoimentos — subtítulo" },
      { chave: "home.faq.titulo", label: "Perguntas frequentes — título" },
    ],
  },
  {
    id: "produto",
    titulo: "Página do produto",
    dica: "Selos, botões e as garantias listadas abaixo do preço.",
    campos: [
      { chave: "produto.selo_esgotado", label: "Selo de esgotado" },
      { chave: "produto.avaliacao", label: "Texto ao lado das estrelas" },
      { chave: "produto.pagamento", label: "Linha abaixo do preço" },
      { chave: "produto.estoque_baixo", label: "Aviso de estoque baixo", },
      { chave: "produto.tamanho", label: "Rótulo “Tamanho”" },
      { chave: "produto.escolha_tamanho", label: "Dica para escolher o tamanho" },
      { chave: "produto.erro_tamanho", label: "Erro: sem tamanho escolhido" },
      { chave: "produto.quantidade", label: "Rótulo “Quantidade”" },
      { chave: "produto.botao_adicionar", label: "Botão principal" },
      { chave: "produto.adicionado", label: "Aviso “adicionado”" },
      { chave: "produto.ver_carrinho", label: "Botão “ver carrinho”" },
      { chave: "produto.botao_zap", label: "Botão secundário (WhatsApp)" },
      { chave: "produto.esgotado_aviso", label: "Aviso de produto esgotado", longo: true },
      { chave: "produto.botao_avise", label: "Botão “avise-me”" },
      { chave: "produto.bullet_prazo", label: "Garantia 1 — prazo" },
      { chave: "produto.bullet_esgotado", label: "Garantia 1 — esgotado" },
      { chave: "produto.bullet_envio", label: "Garantia 2 — envio" },
      { chave: "produto.bullet_troca", label: "Garantia 3 — troca" },
      { chave: "produto.bullet_pagamento", label: "Garantia 4 — pagamento" },
      { chave: "produto.relacionados", label: "Título dos relacionados" },
    ],
  },
  {
    id: "carrinho",
    titulo: "Carrinho",
    dica: "Inclusive o que o cliente lê quando o carrinho está vazio.",
    campos: [
      { chave: "carrinho.titulo", label: "Título da página" },
      { chave: "carrinho.sub", label: "Subtítulo da página" },
      { chave: "carrinho.vazio.titulo", label: "Carrinho vazio — título" },
      { chave: "carrinho.vazio.texto", label: "Carrinho vazio — texto" },
      { chave: "carrinho.continuar", label: "Botão “continuar comprando”" },
      { chave: "carrinho.esvaziar", label: "Link “esvaziar carrinho”" },
      { chave: "carrinho.resumo", label: "Título do resumo" },
      { chave: "carrinho.frete_label", label: "Rótulo do frete" },
      { chave: "carrinho.frete", label: "Valor do frete" },
      { chave: "carrinho.total", label: "Rótulo do total" },
      { chave: "carrinho.botao", label: "Botão de fechar pedido" },
      { chave: "carrinho.aviso", label: "Aviso abaixo do botão", longo: true },
    ],
  },
  {
    id: "listas",
    titulo: "Listas e busca",
    dica: "Páginas de catálogo, categoria e busca.",
    campos: [
      { chave: "catalogo.titulo", label: "Catálogo — título da página" },
      { chave: "catalogo.sub", label: "Catálogo — subtítulo" },
      { chave: "busca.titulo", label: "Busca — título" },
      { chave: "busca.sub", label: "Busca — subtítulo" },
      { chave: "busca.placeholder", label: "Busca — texto do campo" },
      { chave: "busca.botao", label: "Busca — botão" },
      { chave: "busca.vazio", label: "Busca — sem termo digitado" },
      { chave: "grid.vazio", label: "Lista sem produtos", longo: true },
    ],
  },
  {
    id: "rodape",
    titulo: "Rodapé",
    dica: "Os selos são separados por vírgula.",
    campos: [
      { chave: "rodape.chamada", label: "Chamada abaixo da logo", longo: true },
      { chave: "rodape.selos", label: "Selos (separe por vírgula)" },
      { chave: "rodape.fale", label: "Link “fale conosco”" },
      { chave: "rodape.acompanhar", label: "Link “acompanhar pedido”" },
    ],
  },
  {
    id: "sobre",
    titulo: "Página “Sobre a loja”",
    dica: "Use {loja} e {pagamentos} para puxar os dados das Configurações.",
    campos: [
      { chave: "sobre.loja.titulo", label: "Bloco 1 — título" },
      { chave: "sobre.loja.texto", label: "Bloco 1 — texto", longo: true },
      { chave: "sobre.entrega.titulo", label: "Bloco 2 — título" },
      { chave: "sobre.entrega.texto", label: "Bloco 2 — texto", longo: true },
      { chave: "sobre.trocas.titulo", label: "Bloco 3 — título" },
      { chave: "sobre.trocas.texto", label: "Bloco 3 — texto", longo: true },
      { chave: "sobre.pagamento.titulo", label: "Bloco 4 — título" },
      { chave: "sobre.pagamento.texto", label: "Bloco 4 — texto", longo: true },
      { chave: "sobre.botao", label: "Botão do WhatsApp" },
    ],
  },
  {
    id: "rastreio",
    titulo: "Rastreie seu pedido",
    dica: "A página que leva o cliente ao rastreio oficial da J&T Express.",
    campos: [
      { chave: "rastreio.titulo", label: "Título da página" },
      { chave: "rastreio.sub", label: "Subtítulo" },
      { chave: "rastreio.transportadora", label: "Nome da transportadora" },
      { chave: "rastreio.label", label: "Rótulo do campo" },
      { chave: "rastreio.placeholder", label: "Texto dentro do campo" },
      { chave: "rastreio.botao", label: "Botão" },
      { chave: "rastreio.erro_vazio", label: "Erro: campo vazio" },
      { chave: "rastreio.erro_curto", label: "Erro: código curto" },
      { chave: "rastreio.erro_longo", label: "Erro: código longo" },
      { chave: "rastreio.aviso", label: "Aviso abaixo do botão", longo: true },
      { chave: "rastreio.copiado.titulo", label: "Copiou — título" },
      { chave: "rastreio.copiado.texto", label: "Copiou — texto", longo: true },
      { chave: "rastreio.aberto.titulo", label: "Não copiou — título" },
      { chave: "rastreio.aberto.texto", label: "Não copiou — texto", longo: true },
      { chave: "rastreio.bloqueado.titulo", label: "Aba bloqueada — título" },
      { chave: "rastreio.bloqueado.texto", label: "Aba bloqueada — texto", longo: true },
      { chave: "rastreio.copiar", label: "Botão de copiar" },
      { chave: "rastreio.abrir", label: "Botão de abrir a J&T" },
      { chave: "rastreio.ajuda", label: "Ajuda — texto" },
      { chave: "rastreio.ajuda_link", label: "Ajuda — link" },
    ],
  },
  {
    id: "404",
    titulo: "Página não encontrada",
    dica: "O que o cliente lê quando cai num link quebrado.",
    campos: [
      { chave: "404.etiqueta", label: "Etiqueta" },
      { chave: "404.titulo", label: "Título" },
      { chave: "404.texto", label: "Texto" },
      { chave: "404.botao_inicio", label: "Botão 1" },
      { chave: "404.botao_catalogo", label: "Botão 2" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Listas editáveis: perguntas, depoimentos e garantias                */
/* ------------------------------------------------------------------ */

export type Pergunta = { id: string; pergunta: string; resposta: string; ativo: boolean; ordem: number };
export type Depoimento = { id: string; nome: string; cidade: string; texto: string; ativo: boolean; ordem: number };
export type Garantia = { id: string; texto: string; icone: string; ativo: boolean; ordem: number };

export const ICONES_GARANTIA: { id: string; nome: string; path: string }[] = [
  { id: "card", nome: "Cartão", path: "M3 7h18v10H3zM3 10h18" },
  { id: "box", nome: "Caixa", path: "M12 3 3 7.5V17l9 4 9-4V7.5zM3 7.5 12 12l9-4.5M12 12v9" },
  { id: "search", nome: "Rastreio", path: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-3.2-3.2" },
  { id: "bolt", nome: "Rápido", path: "M13 2 4 14h7l-1 8 9-12h-7z" },
  { id: "chat", nome: "WhatsApp", path: "M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" },
  { id: "lock", nome: "Segurança", path: "M6 11h12v9H6zM9 11V8a3 3 0 1 1 6 0v3" },
  { id: "star", nome: "Qualidade", path: "m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.8 6.4 20l1.4-6.2L3 9.5l6.4-.6z" },
];

export const iconePath = (id: string) =>
  ICONES_GARANTIA.find((i) => i.id === id)?.path ?? ICONES_GARANTIA[6].path;

export const PERGUNTAS_PADRAO: Pergunta[] = [
  {
    id: "p1",
    pergunta: "Qual o prazo de entrega?",
    resposta:
      "Enviamos para todo o Brasil. Após a confirmação do pagamento, o prazo varia conforme a sua região — combinamos tudo pelo WhatsApp e você recebe o código de rastreio assim que o pedido é postado.",
    ativo: true,
    ordem: 1,
  },
  {
    id: "p2",
    pergunta: "Como faço para comprar?",
    resposta:
      'É simples: escolha o manto, adicione ao carrinho e clique em "Fechar pedido no WhatsApp". A conversa já abre com os itens e o total preenchidos. A gente confirma disponibilidade, forma de pagamento e endereço por lá.',
    ativo: true,
    ordem: 2,
  },
  {
    id: "p3",
    pergunta: "As camisas são de qualidade?",
    resposta:
      "Sim. Trabalhamos com versões torcedor e jogador em tecido dry, costura reforçada e escudo aplicado. Se algo chegar diferente do combinado, a gente resolve.",
    ativo: true,
    ordem: 3,
  },
  {
    id: "p4",
    pergunta: "Posso trocar se o tamanho não servir?",
    resposta:
      "Pode. Você tem 7 dias corridos após receber para pedir a troca, com a peça sem uso e com etiqueta. Chame no WhatsApp que a gente organiza o envio.",
    ativo: true,
    ordem: 4,
  },
  {
    id: "p5",
    pergunta: "Quais as formas de pagamento?",
    resposta:
      "{pagamentos}. No PIX a confirmação é na hora e o pedido entra na fila de envio do mesmo dia.",
    ativo: true,
    ordem: 5,
  },
];

export const DEPOIMENTOS_PADRAO: Depoimento[] = [
  { id: "d1", nome: "Joseane", cidade: "Jaboatão dos Guararapes PE", texto: "Passando pra dizer que já recebi a camisa, chegou rapidinho e é linda. Obrigada pelo atendimento!", ativo: true, ordem: 1 },
  { id: "d2", nome: "Elyellton", cidade: "Campina Grande PB", texto: "Qualidade muito acima do que eu esperava pelo preço. Já virei cliente.", ativo: true, ordem: 2 },
  { id: "d3", nome: "Luma Sofia", cidade: "Campina Grande PB", texto: "Comprei o kit do meu time e veio tudo certinho, com rastreio desde o primeiro dia.", ativo: true, ordem: 3 },
  { id: "d4", nome: "Andrei Lima", cidade: "Serra Branca PB", texto: "Atendimento no zap é rápido demais, tirei todas as dúvidas antes de fechar.", ativo: true, ordem: 4 },
  { id: "d5", nome: "Charles", cidade: "João Pessoa PB", texto: "Manto retrô impecável, costura e tecido muito bons. Recomendo.", ativo: true, ordem: 5 },
];

export const GARANTIAS_PADRAO: Garantia[] = [
  { id: "g1", texto: "PIX ou cartão", icone: "card", ativo: true, ordem: 1 },
  { id: "g2", texto: "Enviamos pro Brasil todo", icone: "box", ativo: true, ordem: 2 },
  { id: "g3", texto: "Código de rastreio no envio", icone: "search", ativo: true, ordem: 3 },
  { id: "g4", texto: "Envio rápido", icone: "bolt", ativo: true, ordem: 4 },
  { id: "g5", texto: "Atendimento no WhatsApp", icone: "chat", ativo: true, ordem: 5 },
  { id: "g6", texto: "Compra segura", icone: "lock", ativo: true, ordem: 6 },
  { id: "g7", texto: "Qualidade garantida", icone: "star", ativo: true, ordem: 7 },
];
