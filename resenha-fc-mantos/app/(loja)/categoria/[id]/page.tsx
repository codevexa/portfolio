import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { getByCategory, getCategories, getTexts } from "@/lib/db";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cat = (await getCategories()).find((c) => c.id === id);
  return {
    title: cat?.name ?? "Categoria",
    description: cat?.blurb || undefined,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = (await getCategories()).find((c) => c.id === id);
  if (!cat) notFound();

  // A pronta entrega tem página própria: evita duas URLs com a mesma lista.
  if (cat.id === "pronta-entrega") redirect("/pronta-entrega");

  const [items, t] = await Promise.all([getByCategory(cat.id), getTexts()]);

  return (
    <>
      <PageHeader title={cat.name} subtitle={cat.blurb} count={items.length} />
      <Section className="py-10">
        <ProductGrid products={items} vazio={t["grid.vazio"]} />
      </Section>
    </>
  );
}
