import Link from "next/link";
import { createAdminClient, temServiceRole } from "@/lib/supabase/admin";
import { emReais } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Pedido = {
  id: string;
  order_nsu: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  created_at: string;
};

const ROTULO: Record<string, { texto: string; cls: string }> = {
  aprovado: { texto: "aprovado", cls: "bg-brand/30 text-ink" },
  pendente: { texto: "pendente", cls: "bg-amber-50 text-amber-800" },
  recusado: { texto: "recusado", cls: "bg-red-50 text-red-700" },
  cancelado: { texto: "cancelado", cls: "bg-surface text-ink-soft" },
  estornado: { texto: "estornado", cls: "bg-surface text-ink-soft" },
};

function Cartao({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${destaque ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
      <p className={`text-[11px] font-bold tracking-[0.1em] ${destaque ? "text-white/60" : "text-ink-soft"}`}>
        {titulo}
      </p>
      <p className="mt-1.5 text-xl font-extrabold tracking-tight">{valor}</p>
    </div>
  );
}

export default async function AdminPagamentos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;

  if (!temServiceRole()) {
    return (
      <>
        <h1 className="text-2xl font-extrabold tracking-tight">Pagamentos</h1>
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="text-[13px] font-bold text-amber-900">
            Falta a variável SUPABASE_SERVICE_ROLE_KEY na Vercel.
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-amber-900/80">
            Sem ela o servidor não consegue ler os pedidos. Os passos estão em
            COMO-ATIVAR.md.
          </p>
        </div>
      </>
    );
  }

  const supabase = createAdminClient();

  let consulta = supabase
    .from("orders")
    .select("id,order_nsu,customer_name,customer_email,amount,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) consulta = consulta.eq("status", status);
  if (q.trim()) {
    const termo = q.trim();
    consulta = consulta.or(
      `order_nsu.ilike.%${termo}%,customer_name.ilike.%${termo}%,customer_email.ilike.%${termo}%`,
    );
  }

  const [{ data }, { data: todos }] = await Promise.all([
    consulta,
    supabase.from("orders").select("status,amount"),
  ]);

  const pedidos = (data ?? []) as Pedido[];
  const universo = (todos ?? []) as { status: string; amount: number }[];

  const contar = (s: string) => universo.filter((p) => p.status === s).length;
  const somar = (s: string) =>
    universo.filter((p) => p.status === s).reduce((t, p) => t + p.amount, 0);

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Pagamentos</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        Todo pedido aberto na loja, com o estado conferido na InfinitePay.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Cartao titulo="RECEBIDO" valor={emReais(somar("aprovado"))} destaque />
        <Cartao titulo="VENDAS" valor={String(universo.length)} />
        <Cartao titulo="APROVADOS" valor={String(contar("aprovado"))} />
        <Cartao titulo="PENDENTES" valor={String(contar("pendente"))} />
        <Cartao titulo="RECUSADOS" valor={String(contar("recusado"))} />
        <Cartao titulo="ESTORNADOS" valor={String(contar("estornado"))} />
      </div>

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nº do pedido, nome ou e-mail"
          className="min-w-[220px] flex-1 rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink"
        >
          <option value="">Todos os estados</option>
          {Object.keys(ROTULO).map((s) => (
            <option key={s} value={s}>
              {ROTULO[s].texto}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
        >
          Buscar
        </button>
      </form>

      <div className="mt-5 space-y-2">
        {pedidos.length === 0 && (
          <p className="rounded-2xl border border-line bg-white px-5 py-10 text-center text-sm text-ink-soft">
            {q || status
              ? "Nenhum pedido com esse filtro."
              : "Nenhum pedido ainda."}
          </p>
        )}

        {pedidos.map((p) => {
          const r = ROTULO[p.status] ?? ROTULO.pendente;
          return (
            <Link
              key={p.id}
              href={`/admin/pagamentos/${p.id}`}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 transition hover:border-ink"
            >
              <span className="min-w-[150px] flex-1">
                <span className="block text-sm font-bold">{p.customer_name}</span>
                <span className="text-[12px] text-ink-soft">{p.customer_email}</span>
              </span>
              <span className="font-mono text-[12px] text-ink-soft">
                {p.order_nsu}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${r.cls}`}>
                {r.texto}
              </span>
              <span className="text-[12px] text-ink-soft">
                {new Date(p.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="ml-auto text-base font-extrabold">
                {emReais(p.amount)}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
