import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { getTexts, searchProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Buscar manto",
  description: "Procure por time, liga, temporada ou modelo.",
};

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [results, t] = await Promise.all([searchProducts(q), getTexts()]);

  return (
    <>
      <PageHeader
        title={t["busca.titulo"]}
        subtitle={t["busca.sub"]}
        count={q ? results.length : undefined}
      />

      <Section className="py-10">
        <form action="/busca" className="mb-9 flex max-w-xl gap-2">
          <label htmlFor="q-page" className="sr-only">
            Buscar
          </label>
          <input
            id="q-page"
            name="q"
            type="search"
            defaultValue={q}
            placeholder={t["busca.placeholder"]}
            className="flex-1 rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
          >
            {t["busca.botao"]}
          </button>
        </form>

        {q ? (
          <>
            <p className="mb-6 text-sm text-ink-soft">
              Resultados para <strong className="text-ink">“{q}”</strong>
            </p>
            <ProductGrid products={results} vazio={t["grid.vazio"]} />
          </>
        ) : (
          <p className="rounded-2xl border border-line bg-surface px-5 py-10 text-center text-sm text-ink-soft">
            {t["busca.vazio"]}
          </p>
        )}
      </Section>
    </>
  );
}
