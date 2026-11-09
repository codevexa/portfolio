import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { getReadyToShip, getTexts } from "@/lib/db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pronta Entrega",
  description:
    "Camisas em estoque com envio imediato — despacho no mesmo dia e rastreio no WhatsApp.",
};

export default async function ProntaEntregaPage() {
  const [items, t] = await Promise.all([getReadyToShip(), getTexts()]);
  return (
    <>
      <PageHeader
        title={t["pronta.titulo"]}
        subtitle={t["pronta.sub"]}
        count={items.length}
      />
      <Section className="py-10">
        <ProductGrid products={items} vazio={t["grid.vazio"]} />
      </Section>
    </>
  );
}
