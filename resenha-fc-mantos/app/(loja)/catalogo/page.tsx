import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { getAllProducts, getTexts } from "@/lib/db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Todos os mantos da loja: clubes brasileiros e europeus, seleções, retrô e kits.",
};

export default async function CatalogoPage() {
  const [items, t] = await Promise.all([getAllProducts(), getTexts()]);
  return (
    <>
      <PageHeader
        title={t["catalogo.titulo"]}
        subtitle={t["catalogo.sub"]}
        count={items.length}
      />
      <Section className="py-10">
        <ProductGrid products={items} vazio={t["grid.vazio"]} />
      </Section>
    </>
  );
}
