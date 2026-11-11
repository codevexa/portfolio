import { NextResponse } from "next/server";
import { createAdminClient, temServiceRole } from "@/lib/supabase/admin";
import { confirmarEAtualizar, lerAviso, statusDoEvento } from "@/lib/confirmacao";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook da InfinitePay.
 *
 * A documentação deles é clara em dois pontos que mandam neste arquivo:
 *   - o aviso NÃO tem assinatura, então ele não prova pagamento nenhum;
 *   - responder algo fora de 2xx faz a InfinitePay reenviar o aviso.
 *
 * Então aqui: grava o evento (auditoria), responde rápido, e só muda o
 * pedido depois de confirmar no /payment_check. Avisos repetidos são
 * barrados por índice único, tanto no evento quanto no pagamento.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ erro: "corpo inválido" }, { status: 400 });
  }

  if (!temServiceRole()) {
    console.error("[webhook] service role ausente: evento não pôde ser gravado");
    // 500 e não 400: é falha nossa, e a InfinitePay vai reenviar.
    return NextResponse.json({ erro: "servidor não configurado" }, { status: 500 });
  }

  const aviso = lerAviso(payload);
  const supabase = createAdminClient();

  // O tipo do evento pode vir no corpo; quando não vier, o que importa é
  // se a transação está paga, e quem decide isso é o /payment_check.
  const tipo =
    typeof (payload as Record<string, unknown>)?.event === "string"
      ? String((payload as Record<string, unknown>).event)
      : "paid";

  const chave = `${tipo}:${aviso.transaction_nsu ?? aviso.invoice_slug ?? "sem-id"}`;

  const { data: pedido } = aviso.order_nsu
    ? await supabase
        .from("orders")
        .select("id")
        .eq("order_nsu", aviso.order_nsu)
        .maybeSingle()
    : { data: null };

  const { error: erroEvento } = await supabase.from("payment_events").insert({
    order_id: pedido?.id ?? null,
    event_type: tipo,
    event_key: chave,
    payload: payload as object,
    processed: false,
  });

  // Índice único: aviso repetido não entra de novo nem é reprocessado.
  if (erroEvento) {
    if (erroEvento.code === "23505") {
      return NextResponse.json({ ok: true, repetido: true });
    }
    console.error("[webhook] não gravou o evento:", erroEvento.message);
    return NextResponse.json({ erro: "falha ao registrar" }, { status: 500 });
  }

  async function fecharEvento(resultado: string, processado = true) {
    await supabase
      .from("payment_events")
      .update({ processed: processado, result: resultado })
      .eq("event_key", chave);
  }

  if (!aviso.order_nsu) {
    await fecharEvento("sem order_nsu", true);
    return NextResponse.json({ ok: true, ignorado: "sem order_nsu" });
  }

  // Eventos que não são pagamento aprovado só mudam o status do pedido.
  const statusDireto = statusDoEvento(tipo);
  if (statusDireto) {
    await supabase
      .from("orders")
      .update({ status: statusDireto, updated_at: new Date().toISOString() })
      .eq("order_nsu", aviso.order_nsu)
      // Um pedido já aprovado só pode virar estornado.
      .in("status", statusDireto === "estornado"
        ? ["pendente", "aprovado", "recusado", "cancelado"]
        : ["pendente"]);

    await fecharEvento(`status -> ${statusDireto}`);
    return NextResponse.json({ ok: true, status: statusDireto });
  }

  if (!aviso.transaction_nsu || !aviso.invoice_slug) {
    await fecharEvento("faltou transaction_nsu ou invoice_slug");
    return NextResponse.json({ ok: true, ignorado: "dados insuficientes" });
  }

  const resultado = await confirmarEAtualizar({
    orderNsu: aviso.order_nsu,
    transactionNsu: aviso.transaction_nsu,
    slug: aviso.invoice_slug,
  });

  await fecharEvento(
    resultado.aprovado
      ? resultado.jaProcessado
        ? "já estava aprovado"
        : "aprovado"
      : `não aprovado: ${resultado.motivo}`,
  );

  // 200 mesmo quando não aprova: o aviso foi recebido e registrado. Se
  // devolvesse erro, a InfinitePay reenviaria para sempre.
  return NextResponse.json({ ok: true, aprovado: resultado.aprovado });
}

/** GET só para conferir que a rota está no ar. Não expõe nada. */
export async function GET() {
  return NextResponse.json({ ok: true, rota: "webhook infinitepay" });
}
