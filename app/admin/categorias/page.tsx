import { createClient } from "@/lib/supabase/server";
import { CATEGORY_COLUMNS, toCategory, type CategoryRow } from "@/lib/db";
import { CATEGORIAS_PADRAO } from "@/lib/products";
import { CategoryForm } from "@/components/admin/category-form";
import { FaltaMigracao } from "@/components/admin/text-tabs";

export const dynamic = "force-dynamic";

export default async function AdminCategorias({
  searchParams,
}: {
  searchParams: Promise<{ excluido?: string; emuso?: string }>;
}) {
  const { excluido, emuso } = await searchParams;
  const supabase = await createClient();

  const [{ data, error }, { data: produtos }] = await Promise.all([
    supabase
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .order("ordem", { ascending: true }),
    supabase.from("products").select("categoria"),
  ]);

  const contagem = new Map<string, number>();
  for (const p of produtos ?? []) {
    const c = (p as { categoria: string }).categoria;
    contagem.set(c, (contagem.get(c) ?? 0) + 1);
  }

  const categorias = error
    ? CATEGORIAS_PADRAO
    : (data ?? []).map((r) => toCategory(r as CategoryRow));

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Categorias</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        O que o cliente vê no menu, nos cards da home e no rodapé. Cada produto
        fica em uma categoria.
      </p>

      {excluido && (
        <p className="mb-5 rounded-xl bg-surface px-4 py-3 text-[13px] font-semibold">
          Categoria excluída.
        </p>
      )}
      {emuso && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-900">
          Essa categoria tem produtos, então ela foi apenas desativada — assim
          nenhum produto fica sem lugar. Mova os produtos antes de excluir.
        </p>
      )}

      {error ? (
        <div className="space-y-5">
          <FaltaMigracao tabela="categories" />
          <div className="space-y-3">
            {categorias.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4"
              >
                <span className="text-sm font-bold">{c.name}</span>
                <span className="text-[12px] text-ink-soft">
                  /categoria/{c.id} · {contagem.get(c.id) ?? 0} produto(s)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {categorias.map((c) => (
            <CategoryForm
              key={c.id}
              categoria={c}
              produtos={contagem.get(c.id) ?? 0}
            />
          ))}

          <div className="pt-2">
            <p className="mb-2 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
              NOVA CATEGORIA
            </p>
            <CategoryForm />
          </div>
        </div>
      )}
    </>
  );
}
