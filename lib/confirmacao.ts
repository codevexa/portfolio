import "server-only";
import { createAdminClient } from "./supabase/admin";
import { conferirPagamento, type AvisoWebhook } from "./infinitepay";

/**
 * Confirmação de pagamento — o ponto onde um pedido vira "aprovado".
 *
 * Vale tanto para o webhook quanto para a volta do comprador pela
 * redirect_url, porque os dois passam pela MESMA checagem:
 *
 *   1. o aviso nunca é prova de nada (o webhook da InfinitePay não tem
 *      assinatura — está na documentação deles);
 *   2. o servidor pergunta ao /payment_check, com a InfiniteTag da loja;
 *   3. só com paid === true e o valor batendo com o que o pedido fechou é
 *      que a função do banco grava o pagamento, aprova e baixa o estoque,
 *      numa transação só e à prova de repetição.
 */

export type ResultadoConfirmacao = {
  aprovado: boolean;
  jaProcessado?: boolean;
  motivo?: string;
  pago?: number;
  metodo?: string;
};

export async function confirmarEAtualizar(dados: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<ResultadoConfirmacao> {
  const conferido = await conferirPagamento(dados);

  if (!conferido.ok || !conferido.resposta) {
    return { aprovado: false, motivo: conferido.erro ?? "consulta_falhou" };
  }

  const r = conferido.resposta;

  // A documentação diz: a API responde 200 com success:false ou paid:false
  // quando algo não bate. paid:true só vem quando está tudo certo.
  if (!r.success) return { aprovado: false, motivo: "nao_confere" };
  if (!r.paid) return { aprovado: false, motivo: "nao_pago" };

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("confirmar_pagamento", {
    p_order_nsu: dados.orderNsu,
    p_transaction_nsu: dados.transactionNsu,
    p_invoice_slug: dados.slug,
    p_payment_method: r.capture_method ?? null,
    p_amount: r.amount ?? null,
    p_paid_amount: r.paid_amount ?? null,
    p_installments: r.installments ?? null,
    p_receipt_url: null,
  });

  if (error) {
    console.error("[confirmacao] erro no banco:", error.message);
    return { aprovado: false, motivo: "erro_no_banco" };
  }

  const res = data as { ok?: boolean; motivo?: string; ja_processado?: boolean } | null;

  if (!res?.ok) {
    // Inclui o caso mais importante: valor divergente do que o pedido fechou.
    return { aprovado: false, motivo: res?.motivo ?? "recusado_pelo_banco" };
  }

  return {
    aprovado: true,
    jaProcessado: Boolean(res.ja_processado),
    pago: r.paid_amount ?? r.amount,
    metodo: r.capture_method,
  };
}

/** Status do pedido para os eventos que não são pagamento aprovado. */
export function statusDoEvento(evento: string): string | null {
  switch (evento) {
    case "canceled":
      return "cancelado";
    case "refunded":
      return "estornado";
    case "payment_failed":
      return "recusado";
    default:
      return null;
  }
}

/** Lê o que importa do corpo do aviso, sem confiar em nada dele. */
export function lerAviso(payload: unknown): AvisoWebhook {
  if (!payload || typeof payload !== "object") return {};
  const p = payload as Record<string, unknown>;
  const texto = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  const numero = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? v : undefined;

  return {
    invoice_slug: texto(p.invoice_slug),
    order_nsu: texto(p.order_nsu),
    transaction_nsu: texto(p.transaction_nsu),
    receipt_url: texto(p.receipt_url),
    capture_method: texto(p.capture_method),
    amount: numero(p.amount),
    paid_amount: numero(p.paid_amount),
    installments: numero(p.installments),
  };
}
