import "server-only";

/**
 * Cliente da API de Checkout da InfinitePay.
 *
 * Tudo aqui segue a documentação oficial vigente
 * (https://www.infinitepay.io/checkout-documentacao), conferida em
 * 11/11/2026. Nenhum endpoint, campo ou evento foi inventado:
 *
 *   POST https://api.checkout.infinitepay.io/links          -> cria o link
 *   POST https://api.checkout.infinitepay.io/payment_check  -> confirma
 *
 * Pontos da documentação que mudam o desenho desta integração:
 *
 * - O valor de cada item vai em CENTAVOS. O mínimo de um pagamento é
 *   R$ 1,00, ou seja, 100.
 * - A API Key (header X-Api-Key) é opcional para criar o link, mas
 *   obrigatória para o objeto `options`. Ela nunca sai do servidor.
 * - O webhook NÃO tem assinatura. Por isso nenhum aviso é tratado como
 *   prova de pagamento: cada um é reconferido no /payment_check.
 * - Não existe sandbox. Nada aqui simula pagamento.
 * - Não há cancelamento nem estorno pela API: isso é feito no app da
 *   InfinitePay.
 */

const BASE = "https://api.checkout.infinitepay.io";

export const handleDaLoja = () => process.env.INFINITEPAY_HANDLE ?? "";
export const temApiKey = () => Boolean(process.env.INFINITEPAY_API_KEY);

/* ------------------------------------------------------------------ */
/* Tipos do corpo que a documentação descreve                          */
/* ------------------------------------------------------------------ */

export type ItemCheckout = {
  /** Texto mostrado na página de pagamento. */
  description: string;
  /** Em centavos: R$ 10,00 = 1000. */
  price: number;
  quantity: number;
};

export type EventoWebhook =
  | "created"
  | "paid"
  | "settled"
  | "canceled"
  | "refunded"
  | "payment_failed";

type CorpoLink = {
  handle: string;
  items: ItemCheckout[];
  order_nsu: string;
  redirect_url?: string;
  /** Formato simples, o do exemplo de início rápido da documentação. */
  webhook_url?: string;
  webhook?: { url: string; events: EventoWebhook[] };
  customer?: { name?: string; email?: string; phone_number?: string };
  address?: Record<string, string>;
  options?: Record<string, unknown>;
};

/** O que a InfinitePay devolve no /payment_check. */
export type RespostaPaymentCheck = {
  success: boolean;
  paid?: boolean;
  amount?: number;
  paid_amount?: number;
  installments?: number;
  capture_method?: string;
  message?: string;
};

/** O corpo que chega no webhook quando o pagamento é aprovado. */
export type AvisoWebhook = {
  invoice_slug?: string;
  amount?: number;
  paid_amount?: number;
  installments?: number;
  capture_method?: string;
  transaction_nsu?: string;
  order_nsu?: string;
  receipt_url?: string;
  items?: unknown;
};

export type ResultadoLink =
  | { ok: true; url: string; bruto: unknown }
  | { ok: false; status: number; erro: string };

/* ------------------------------------------------------------------ */

function cabecalhos() {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const chave = process.env.INFINITEPAY_API_KEY;
  if (chave) h["X-Api-Key"] = chave;
  return h;
}

/** Procura a URL do link na resposta sem presumir um formato só. */
function extrairUrl(dados: unknown): string | null {
  if (!dados || typeof dados !== "object") return null;
  const o = dados as Record<string, unknown>;
  for (const chave of ["url", "link", "checkout_url", "payment_url"]) {
    const v = o[chave];
    if (typeof v === "string" && v.startsWith("http")) return v;
  }
  for (const v of Object.values(o)) {
    if (v && typeof v === "object") {
      const achou = extrairUrl(v);
      if (achou) return achou;
    }
  }
  return null;
}

/** POST /links — devolve a URL para onde o comprador é mandado. */
export async function criarLinkDeCheckout(corpo: {
  items: ItemCheckout[];
  orderNsu: string;
  redirectUrl: string;
  webhookUrl: string;
  cliente?: { nome?: string; email?: string; telefone?: string };
  /** Pré-preenche o endereço na página da InfinitePay. */
  endereco?: Record<string, string>;
  /** Só é enviado quando existe API Key: a documentação exige a chave. */
  validoAte?: string;
}): Promise<ResultadoLink> {
  const handle = handleDaLoja();
  if (!handle) {
    return { ok: false, status: 0, erro: "INFINITEPAY_HANDLE não configurada." };
  }

  const payload: CorpoLink = {
    handle,
    items: corpo.items,
    order_nsu: corpo.orderNsu,
    redirect_url: corpo.redirectUrl,
    // Os dois formatos descritos na documentação. Na prática o objeto
    // sozinho não disparou nenhuma chamada, então o webhook_url vai junto.
    webhook_url: corpo.webhookUrl,
    webhook: {
      url: corpo.webhookUrl,
      events: ["paid", "canceled", "refunded", "payment_failed"],
    },
  };

  if (corpo.cliente?.nome || corpo.cliente?.email || corpo.cliente?.telefone) {
    payload.customer = {
      ...(corpo.cliente.nome ? { name: corpo.cliente.nome } : {}),
      ...(corpo.cliente.email ? { email: corpo.cliente.email } : {}),
      ...(corpo.cliente.telefone ? { phone_number: corpo.cliente.telefone } : {}),
    };
  }

  if (corpo.endereco) payload.address = corpo.endereco;

  // `options` exige API Key. single_payment impede que o mesmo link seja
  // pago duas vezes; valid_until faz o link morrer sozinho.
  if (temApiKey()) {
    payload.options = {
      single_payment: true,
      ...(corpo.validoAte ? { valid_until: corpo.validoAte } : {}),
    };
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${BASE}/links`, {
      method: "POST",
      headers: cabecalhos(),
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, status: 0, erro: `Falha de rede: ${String(e)}` };
  }

  const texto = await resposta.text();
  let dados: unknown = null;
  try {
    dados = JSON.parse(texto);
  } catch {
    /* resposta não-JSON: fica no texto cru abaixo */
  }

  if (!resposta.ok) {
    return { ok: false, status: resposta.status, erro: texto.slice(0, 500) };
  }

  const url = extrairUrl(dados);
  if (!url) {
    return {
      ok: false,
      status: resposta.status,
      erro: `A resposta não trouxe a URL do link: ${texto.slice(0, 300)}`,
    };
  }

  return { ok: true, url, bruto: dados };
}

/**
 * POST /payment_check — a ÚNICA fonte de verdade sobre um pagamento.
 * A documentação é explícita: o webhook não tem assinatura, então cada
 * aviso precisa ser conferido aqui antes de liberar qualquer coisa.
 */
export async function conferirPagamento(dados: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<{ ok: boolean; resposta?: RespostaPaymentCheck; erro?: string }> {
  const handle = handleDaLoja();
  if (!handle) return { ok: false, erro: "INFINITEPAY_HANDLE não configurada." };

  try {
    const r = await fetch(`${BASE}/payment_check`, {
      method: "POST",
      headers: cabecalhos(),
      body: JSON.stringify({
        handle,
        order_nsu: dados.orderNsu,
        transaction_nsu: dados.transactionNsu,
        slug: dados.slug,
      }),
      cache: "no-store",
    });

    const texto = await r.text();
    if (!r.ok) return { ok: false, erro: `HTTP ${r.status}: ${texto.slice(0, 300)}` };

    return { ok: true, resposta: JSON.parse(texto) as RespostaPaymentCheck };
  } catch (e) {
    return { ok: false, erro: String(e) };
  }
}
