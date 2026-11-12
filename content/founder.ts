/**
 * VEXA — Fundador.
 *
 * REGRA DE CONTEÚDO: este arquivo não contém formação acadêmica, certificações,
 * anos de experiência, nomes de clientes ou métricas de resultado. Nada disso foi
 * inventado. Os parágrafos abaixo tratam de visão, filosofia e método.
 *
 * Os textos marcados abaixo vieram da versão anterior do site, escritos pelo
 * próprio Juan. Edite livremente quando quiser contar a história completa.
 */

export const founder = {
  name: "Juan Oliveira",
  role: "Fundador da VEXA",
  discipline: "Direção criativa e desenvolvimento",
  signature: "VEXA by Juan Oliveira",

  headline: "Eu sou a força por trás da VEXA.",

  /** Apresentação institucional. */
  intro: [
    // Texto de autoria do próprio Juan, mantido da versão anterior do site.
    "Comecei na área digital criando soluções simples que se transformaram em resultados reais. Hoje transformo ideias em presença digital sólida — desenvolvendo produtos, plataformas e experiências que conectam.",
    "A VEXA nasceu dessa prática. É um estúdio independente, sem camada de intermediário: quem conversa com você sobre a ideia é quem desenha a interface e escreve o código que a torna real.",
  ],

  /** Visão sobre tecnologia e inovação. */
  vision: {
    title: "Sobre tecnologia e inovação",
    text: [
      "Tecnologia não é o produto. É o meio. O produto é a experiência que alguém tem ao usar aquilo que construímos — e essa experiência precisa ser clara antes de ser sofisticada.",
      "Inteligência artificial faz parte do processo criativo e técnico da VEXA, mas não é o discurso. Ela acelera o trabalho, amplia o que um estúdio independente consegue entregar e desaparece no resultado. O que fica é o produto funcionando.",
      "Inovação, aqui, é escolher bem: a solução mais simples que resolve o problema inteiro quase sempre vence a mais impressionante que resolve metade.",
    ],
  },

  /** Filosofia de trabalho. */
  philosophy: {
    title: "Filosofia de trabalho",
    text: [
      "Toda interface comunica alguma coisa antes de ser usada. Comunica cuidado ou pressa, clareza ou confusão. Por isso o detalhe não é acabamento: é a mensagem.",
      "Trabalho com poucos projetos por vez e com envolvimento direto em cada etapa. Prazo combinado é prazo cumprido, e o que não puder ser entregue com qualidade é dito antes, não depois.",
      "Nada é entregue como promessa. É entregue no ar, funcionando, com você sabendo exatamente o que tem em mãos.",
    ],
  },

  /** Criatividade, estratégia e desenvolvimento. */
  triad: {
    title: "Criatividade, estratégia e desenvolvimento",
    text: [
      "Criatividade sem estratégia vira enfeite. Estratégia sem desenvolvimento vira apresentação. Desenvolvimento sem criatividade vira sistema que ninguém gosta de usar.",
      "A vantagem de um estúdio que reúne as três coisas na mesma cabeça é que nenhuma decisão se perde na tradução entre quem pensa, quem desenha e quem constrói.",
    ],
  },

  photos: {
    primary: {
      src: "/images/founder-01.webp",
      alt: "Juan Oliveira, fundador da VEXA.",
      width: 941,
      height: 1672,
    },
    secondary: {
      src: "/images/founder-02.webp",
      alt: "Juan Oliveira, fundador da VEXA, de perfil.",
      width: 941,
      height: 1672,
    },
    editorial: {
      src: "/images/portrait-tall.webp",
      alt: "Retrato editorial em preto e branco de Juan Oliveira.",
      width: 1170,
      height: 2532,
    },
  },

  /**
   * ESPAÇO EDITÁVEL — preencha quando quiser.
   * Enquanto os campos estiverem vazios, a seção não é renderizada no site.
   */
  biography: {
    title: "A história",
    /** Ex.: "Nasci em...", "Comecei a programar quando...". */
    paragraphs: [] as string[],
  },
} as const;

export const studioPillars = [
  {
    index: "01",
    title: "Criatividade",
    text: "Cada projeto começa de uma página em branco, não de um template. A forma nasce do problema.",
  },
  {
    index: "02",
    title: "Estratégia",
    text: "Antes do design existe uma decisão: o que esse produto precisa fazer acontecer. Tudo depois serve a isso.",
  },
  {
    index: "03",
    title: "Tecnologia",
    text: "Ferramentas escolhidas pelo que entregam, não pela moda. Base moderna, estável e sustentável.",
  },
  {
    index: "04",
    title: "Desenvolvimento",
    text: "Código limpo, componentes reutilizáveis e estrutura que aguenta crescer sem reescrita.",
  },
  {
    index: "05",
    title: "Inovação",
    text: "A solução mais simples que resolve o problema inteiro. Inclusive quando ela é a menos óbvia.",
  },
  {
    index: "06",
    title: "Experiência do usuário",
    text: "A pessoa do outro lado precisa entender em segundos. Clareza é o padrão, não o diferencial.",
  },
];
