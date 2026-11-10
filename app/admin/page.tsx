import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_COLUMNS,
  PRODUCT_COLUMNS,
  toCategory,
  toProduct,
  type CategoryRow,
  type ProductRow,
} from "@/lib/db";
import { brl } from "@/lib/site";
import {
  CATEGORIAS_PADRAO,
  categoryName,
  soldOut,
  stockTotal,
} from "@/lib/products";
import { KitImage } from "@/components/kit-image";
import { Toggle } from "@/components/admin/toggle";

export const dynamic = "force-dynamic";

export default async function AdminProdutos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; salvo?: string; excluido?: string }>;
}) {
  const { q = "", salvo, excluido } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`${PRODUCT_COLUMNS},clubs(id,nome,cor1,cor2,padrao,logo_url)`)
    .order("ordem", { ascending: true });

  if (q.trim()) query = query.ilike("nome", `%${q.trim()}%`);

  const [{ data, error }, { data: cats }] = await Promise.all([
    query,
    supabase
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .order("ordem", { ascending: true }),
  ]);
  const produtos = (data ?? []).map((r) => toProduct(r as unknown as ProductRow));
  const categorias = cats?.length
    ? cats.map((r) => toCategory(r as CategoryRow))
    : CATEGORIAS_PADRAO;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
            {q ? ` encontrados para “${q}”` : " no catálogo"}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="ml-auto rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
        >
          + Novo produto
        </Link>
      </div>

      {salvo && <Aviso tipo="ok">Produto salvo e já publicado no site.</Aviso>}
      {excluido && <Aviso tipo="ok">Produto excluído.</Aviso>}
      {error && <Aviso tipo="erro">{error.message}</Aviso>}

      <form action="/admin" className="mb-5 flex max-w-md gap-2">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Buscar produto pelo nome…"
          className="flex-1 rounded-full border border-line bg-white px-5 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="rounded-full border border-line bg-white px-5 py-2.5 text-[13px] font-bold transition hover:border-ink"
        >
          Buscar
        </button>
      </form>

      {produtos.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-5 py-12 text-center text-sm text-ink-soft">
          Nenhum produto aqui ainda.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {produtos.map((p) => {
            const total = stockTotal(p);
            const esgotado = soldOut(p);
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-4 border-b border-line p-4 last:border-b-0"
              >
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface p-1.5">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt=""
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <KitImage product={p} className="h-full w-full" />
                  )}
                </div>

                <div className="min-w-[180px] flex-1">
                  <p className="text-sm font-bold leading-tight">{p.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink-soft">
                    {categoryName(p.category, categorias)}
                    {p.club && ` · ${p.club.name}`}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold">{brl(p.price)}</span>
                    {p.oldPrice && (
                      <span className="text-[12px] text-ink-soft line-through">
                        {brl(p.oldPrice)}
                      </span>
                    )}
                    {total !== null && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          esgotado
                            ? "bg-red-50 text-red-700"
                            : total <= 5
                              ? "bg-amber-50 text-amber-800"
                              : "bg-surface text-ink-soft"
                        }`}
                      >
                        {esgotado ? "esgotado" : `${total} em estoque`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Toggle
                    id={p.id}
                    campo="ativo"
                    valor={p.active}
                    ligado="No ar"
                    desligado="Oculto"
                  />
                  <Link
                    href={`/admin/produtos/${p.id}`}
                    className="rounded-full border border-line px-4 py-2 text-[12px] font-bold transition hover:border-ink"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Aviso({
  tipo,
  children,
}: {
  tipo: "ok" | "erro";
  children: React.ReactNode;
}) {
  return (
    <p
      className={`mb-5 rounded-xl px-4 py-3 text-[13px] font-semibold ${
        tipo === "ok" ? "bg-brand/25 text-ink" : "bg-red-50 text-red-700"
      }`}
    >
      {children}
    </p>
  );
}
