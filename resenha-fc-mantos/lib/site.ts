/** Identidade fixa da loja (o que não muda no dia a dia). */
export const site = {
  name: "Resenha FC Mantos",
  shortName: "Resenha FC",
  tagline: "Catálogo de camisas de futebol",
  description:
    "Resenha FC Mantos — camisas de futebol de clubes e seleções, com envio para todo o Brasil e código de rastreio.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://resenha-fc-mantos.vercel.app",
} as const;

/** Tudo abaixo o vendedor edita no painel (/admin/config). */
export type StoreSettings = {
  storeName: string;
  whatsapp: string;
  instagram: string;
  hours: string;
  openFrom: number;
  openTo: number;
  openDays: number[];
  marquee: string[];
  payments: string[];
  /** Frete somado a todo pedido, em centavos. 0 = grátis. */
  shippingCents: number;
  /** Desconto geral da loja, em %. */
  discountPercent: number;
};

export const defaultSettings: StoreSettings = {
  storeName: site.name,
  whatsapp: "",
  instagram: "",
  hours: "Seg a Sáb, 08h às 18h",
  openFrom: 8,
  openTo: 18,
  openDays: [1, 2, 3, 4, 5, 6],
  marquee: [
    "ENVIO PARA TODO O BRASIL",
    "COMPRA SEGURA",
    "ATENDIMENTO NO WHATSAPP",
  ],
  payments: ["PIX", "Cartão de crédito"],
  shippingCents: 0,
  discountPercent: 0,
};

/**
 * Monta o link do WhatsApp. Sem número cadastrado, devolve o link
 * do painel para o vendedor perceber que falta configurar.
 */
export function waLink(whatsapp: string, message: string) {
  const digits = (whatsapp || "").replace(/\D/g, "");
  if (!digits) return "/admin/config";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function isOpenNow(s: StoreSettings, date = new Date()) {
  const br = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
  );
  return (
    s.openDays.includes(br.getDay()) &&
    br.getHours() >= s.openFrom &&
    br.getHours() < s.openTo
  );
}

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
