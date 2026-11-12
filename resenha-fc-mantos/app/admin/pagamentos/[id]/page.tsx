import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient, temServiceRole } from "@/lib/supabase/admin";
import { emReais } from "@/lib/orders";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function DetalheDoPedido({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!temServiceRole()) notFound();

  const supabase = createAdminClient();

  const [{ data: pedido }, { data: itens }, { data: pagamentos }, { data: eventos }] =
    await Promise.all([
      supabase.from("orders").select("*").eq("id", id).maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", id),
      supabase.from("payments").select("*").eq("order_id", id).order("created_at"),
      supabase
        .from("payment_events")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!pedido) notFound();
  const p = pedido as Record<string, string | number | null>;

  return (
    <>
      <Link
        href="/admin/pagamentos"
        className="text-[13px] font-semibold text-ink-soft transition hover:text-ink"
      >
        ← Voltar
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-extrabold tracking-tight">
        {String(p.customer_name)}
      </h1>
      <p className="mb-4 font-mono text-[13px] text-ink-soft">
        {String(p.order_nsu)}
      </p>

      <EnviarNoWhats
        telefone={p.customer_phone ? String(p.customer_phone) : ""}
        nsu={String(p.order_nsu)}
        id={String(p.id)}
        nome={String(p.customer_name)}
      />

      <div className="space-y-4">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            PEDIDO
          </h2>
          <dl className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
            <Linha r="Estado" v={String(p.status)} />
            <Linha r="Total" v={emReais(Number(p.amount))} />
            <Linha r="Produtos" v={emReais(Number(p.items_amount))} />
            <Linha
              r="Frete"
              v={Number(p.shipping_amount) === 0 ? "Grátis" : emReais(Number(p.shipping_amount))}
            />
            <Linha r="E-mail" v={String(p.customer_email)} />
            <Linha r="WhatsApp" v={p.customer_phone ? String(p.customer_phone) : "—"} />
            <Linha
              r="Aberto em"
              v={new Date(String(p.created_at)).toLocaleString("pt-BR")}
            />
            <Linha
              r="Atualizado"
              v={new Date(String(p.updated_at)).toLocaleString("pt-BR")}
            />
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            ITENS
          </h2>
          <ul className="space-y-2 text-sm">
            {(itens ?? []).map((i) => {
              const it = i as Record<string, string | number | null>;
              return (
                <li key={String(it.id)} className="flex justify-between gap-4">
                  <span>
                    <span className="font-semibold">{String(it.quantity)}x</span>{" "}
                    {String(it.product_name)}
                    {it.size ? (
                      <span className="text-ink-soft"> — tam. {String(it.size)}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {emReais(Number(it.subtotal))}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            TRANSAÇÕES CONFIRMADAS
          </h2>
          {(pagamentos ?? []).length === 0 ? (
            <p className="text-[13px] text-ink-soft">
              Nenhum pagamento confirmado na InfinitePay até agora.
            </p>
          ) : (
            <ul className="space-y-3">
              {(pagamentos ?? []).map((g) => {
                const pg = g as Record<string, string | number | null>;
                return (
                  <li key={String(pg.id)} className="rounded-xl border border-line p-4">
                    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      <Linha r="Meio" v={pg.payment_method ? String(pg.payment_method) : "—"} />
                      <Linha r="Parcelas" v={pg.installments ? String(pg.installments) : "—"} />
                      <Linha r="Cobrado" v={emReais(Number(pg.amount))} />
                      <Linha
                        r="Pago"
                        v={pg.paid_amount ? emReais(Number(pg.paid_amount)) : "—"}
                      />
                      <Linha r="Transação" v={String(pg.transaction_nsu)} mono />
                      <Linha r="Fatura" v={pg.provider_payment_id ? String(pg.provider_payment_id) : "—"} mono />
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            AVISOS RECEBIDOS
          </h2>
          {(eventos ?? []).length === 0 ? (
            <p className="text-[13px] text-ink-soft">Nenhum aviso ainda.</p>
          ) : (
            <ul className="space-y-2 text-[13px]">
              {(eventos ?? []).map((e) => {
                const ev = e as Record<string, string | number | boolean | null>;
                return (
                  <li
                    key={String(ev.id)}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-line px-4 py-2.5"
                  >
                    <span className="font-bold">{String(ev.event_type)}</span>
                    <span className="text-ink-soft">{String(ev.result ?? "—")}</span>
                    <span className="ml-auto text-[12px] text-ink-soft">
                      {new Date(String(ev.created_at)).toLocaleString("pt-BR")}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Linha({ r, v, mono }: { r: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/60 pb-2">
      <dt className="text-ink-soft">{r}</dt>
      <dd className={`text-right font-semibold ${mono ? "break-all font-mono text-[12px]" : ""}`}>
        {v}
      </dd>
    </div>
  );
}

/** Manda ao cliente o número do pedido e o link para acompanhar. */
function EnviarNoWhats({
  telefone,
  nsu,
  id,
  nome,
}: {
  telefone: string;
  nsu: string;
  id: string;
  nome: string;
}) {
  const digitos = telefone.replace(/\D/g, "");
  if (!digitos) {
    return (
      <p className="mb-6 text-[12px] text-ink-soft">
        Esse cliente não deixou WhatsApp no checkout.
      </p>
    );
  }

  const texto = [
    `Olá, ${nome.split(" ")[0]}! Aqui é da ${site.name}.`,
    "",
    `O nº do seu pedido é ${nsu}.`,
    "Acompanhe por aqui:",
    `${site.url}/pedido/${id}`,
  ].join("\n");

  return (
    <a
      href={`https://wa.me/${digitos}?text=${encodeURIComponent(texto)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[12px] font-bold text-white transition hover:brightness-95"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" />
      </svg>
      Mandar o nº ao cliente
    </a>
  );
}
