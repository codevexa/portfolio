import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { createAdminClient, temServiceRole } from "@/lib/supabase/admin";
import { confirmarEAtualizar } from "@/lib/confirmacao";
import { emReais } from "@/lib/orders";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seu pedido",
  robots: { index: false, follow: false },
};

type Pedido = {
  id: string;
  order_nsu: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  items_amount: number;
  shipping_amount: number;
  status: string;
  checkout_url: string | null;
  created_at: string;
};

type Item = {
  product_name: string;
  product_slug: string;
  size: string | null;
  quantity: number;
  subtotal: number;
};

const CENAS: Record<
  string,
  { etiqueta: string; titulo: string; texto: string; cor: string }
> = {
  aprovado: {
    etiqueta: "PAGAMENTO CONFIRMADO",
    titulo: "Pagamento aprovado!",
    texto:
      "Recebemos o seu pagamento e já estamos separando o seu manto. Assim que postarmos, mandamos o código de rastreio no WhatsApp.",
    cor: "text-gold-deep",
  },
  pendente: {
    etiqueta: "AGUARDANDO PAGAMENTO",
    titulo: "Ainda não recebemos o pagamento",
    texto:
      "Se você acabou de pagar no PIX, pode levar alguns instantes. Atualize esta página em um minuto. O pedido só é separado depois da confirmação.",
    cor: "text-ink-soft",
  },
  recusado: {
    etiqueta: "PAGAMENTO NÃO CONCLUÍDO",
    titulo: "O pagamento não foi concluído",
    texto:
      "Nada foi cobrado de você. Dá para tentar de novo, com outro cartão ou no PIX.",
    cor: "text-red-700",
  },
  cancelado: {
    etiqueta: "PEDIDO CANCELADO",
    titulo: "Esse pedido foi cancelado",
    texto: "A cobrança foi cancelada antes de ser concluída. Nada foi cobrado.",
    cor: "text-ink-soft",
  },
  estornado: {
    etiqueta: "PAGAMENTO ESTORNADO",
    titulo: "O pagamento foi estornado",
    texto:
      "O valor volta para você pelo mesmo meio de pagamento, no prazo do seu banco ou da operadora do cartão.",
    cor: "text-ink-soft",
  },
};

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const q = await searchParams;

  if (!temServiceRole()) notFound();

  const supabase = createAdminClient();

  const { data: inicial } = await supabase
    .from("orders")
    .select(
      "id,order_nsu,customer_name,customer_email,amount,items_amount,shipping_amount,status,checkout_url,created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!inicial) notFound();
  let pedido = inicial as Pedido;

  /**
   * O comprador volta da InfinitePay com transaction_nsu e slug na URL.
   * Esses valores NÃO são prova de nada: servem só para perguntar ao
   * /payment_check agora, em vez de esperar o webhook. A aprovação passa
   * pela mesma conferência de sempre.
   */
  if (pedido.status === "pendente" && q.transaction_nsu && q.slug) {
    const r = await confirmarEAtualizar({
      orderNsu: pedido.order_nsu,
      transactionNsu: q.transaction_nsu,
      slug: q.slug,
    });

    if (r.aprovado) {
      const { data: atualizado } = await supabase
        .from("orders")
        .select(
          "id,order_nsu,customer_name,customer_email,amount,items_amount,shipping_amount,status,checkout_url,created_at",
        )
        .eq("id", id)
        .maybeSingle();
      if (atualizado) pedido = atualizado as Pedido;
    }
  }

  const [{ data: itensData }, s] = await Promise.all([
    supabase
      .from("order_items")
      .select("product_name,product_slug,size,quantity,subtotal")
      .eq("order_id", id),
    getSettings(),
  ]);

  const itens = (itensData ?? []) as Item[];
  const cena = CENAS[pedido.status] ?? CENAS.pendente;

  return (
    <>
      <PageHeader title="Seu pedido" subtitle={`Nº ${pedido.order_nsu}`} />
      <Section className="py-10">
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="rounded-3xl border border-line bg-white p-6 text-center sm:p-8">
            <p className={`text-[11px] font-bold tracking-[0.18em] ${cena.cor}`}>
              {cena.etiqueta}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {cena.titulo}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              {cena.texto}
            </p>

            {pedido.status === "pendente" && (
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {pedido.checkout_url && (
                  <a
                    href={pedido.checkout_url}
                    className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
                  >
                    Voltar para o pagamento
                  </a>
                )}
                <Link
                  href={`/pedido/${pedido.id}`}
                  className="rounded-full border border-line px-7 py-3 text-[13px] font-bold transition hover:border-ink"
                >
                  Já paguei, atualizar
                </Link>
              </div>
            )}

            {pedido.status === "recusado" && (
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/catalogo"
                  className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
                >
                  Tentar de novo
                </Link>
              </div>
            )}

            {pedido.status === "aprovado" && (
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/rastreio"
                  className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
                >
                  Acompanhar entrega
                </Link>
                <Link
                  href="/catalogo"
                  className="rounded-full border border-line px-7 py-3 text-[13px] font-bold transition hover:border-ink"
                >
                  Continuar comprando
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h3 className="text-[13px] font-bold tracking-[0.1em] text-ink-soft">
              RESUMO
            </h3>
            <ul className="mt-4 space-y-2.5">
              {itens.map((i, n) => (
                <li key={n} className="flex items-start justify-between gap-4 text-sm">
                  <span>
                    <span className="font-semibold">{i.quantity}x</span>{" "}
                    {i.product_name}
                    {i.size && (
                      <span className="text-ink-soft"> — tam. {i.size}</span>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {emReais(i.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Produtos</dt>
                <dd>{emReais(pedido.items_amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Frete</dt>
                <dd>
                  {pedido.shipping_amount === 0
                    ? "Grátis"
                    : emReais(pedido.shipping_amount)}
                </dd>
              </div>
              <div className="flex justify-between pt-1 text-base font-extrabold">
                <dt>Total</dt>
                <dd>{emReais(pedido.amount)}</dd>
              </div>
            </dl>

            <p className="mt-4 border-t border-line pt-4 text-[12px] text-ink-soft">
              Pedido de {pedido.customer_name} · {pedido.customer_email}
            </p>
          </div>

          <p className="text-center text-[13px] text-ink-soft">
            Alguma dúvida sobre esse pedido?{" "}
            <a
              href={waLink(
                s.whatsapp,
                `Olá! É sobre o pedido ${pedido.order_nsu}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ink underline underline-offset-2"
            >
              Chama a gente no WhatsApp.
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
