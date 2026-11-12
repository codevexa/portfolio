import { site, whatsappGreeting } from "@/content/site";

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappLink(message: string = whatsappGreeting): string {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type BriefFields = {
  nome: string;
  empresa: string;
  contato: string;
  tipo: string;
  descricao: string;
};

/**
 * Transforma o formulário de briefing em uma mensagem de WhatsApp.
 * Não existe backend: a solicitação é encaminhada pelo próprio WhatsApp.
 */
export function briefToWhatsapp(fields: BriefFields): string {
  const lines = [
    "*Nova solicitação de projeto — site VEXA*",
    "",
    `*Nome:* ${fields.nome.trim()}`,
    fields.empresa.trim() ? `*Empresa:* ${fields.empresa.trim()}` : null,
    `*Contato:* ${fields.contato.trim()}`,
    `*Tipo de projeto:* ${fields.tipo}`,
    "",
    "*Descrição:*",
    fields.descricao.trim(),
  ].filter(Boolean);

  return whatsappLink(lines.join("\n"));
}
