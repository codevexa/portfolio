/**
 * VEXA — configuração central da marca e do site.
 * Altere aqui: contatos, domínio, textos institucionais e navegação.
 */

export const site = {
  name: "VEXA",
  signature: "VEXA by Juan Oliveira",
  positioning: "Digital Experience Studio",
  founder: "Juan Oliveira",
  slogan: "Ideias que viram interface.",
  description:
    "Estúdio independente de criação e desenvolvimento digital. Transformamos conceitos em experiências, plataformas, produtos e sistemas.",

  /** Ajuste para o domínio final antes de publicar (usado em SEO, sitemap e Open Graph). */
  url: "https://vexa.studio",
  locale: "pt-BR",

  contact: {
    whatsappNumber: "5551981392606",
    whatsappDisplay: "+55 51 98139-2606",
    whatsappUrl: "https://wa.me/5551981392606",
    instagram: {
      studio: { handle: "@mkt_vexa", url: "https://instagram.com/mkt_vexa" },
      founder: { handle: "@jotahp7_", url: "https://instagram.com/jotahp7_" },
    },
  },

  nav: [
    { label: "Início", href: "/" },
    { label: "Projetos", href: "/projetos" },
    { label: "Serviços", href: "/servicos" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contato", href: "/contato" },
  ],
} as const;

/** Mensagem inicial automática do WhatsApp. */
export const whatsappGreeting =
  "Olá, Juan. Vim pelo site da VEXA e quero conversar sobre um projeto.";
