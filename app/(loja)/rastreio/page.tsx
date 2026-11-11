import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TrackingForm } from "@/components/rastreio/tracking-form";
import { getSettings } from "@/lib/settings";
import { getTexts } from "@/lib/db";
import { TRANSPORTADORA } from "@/lib/rastreio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Rastreie seu pedido",
  description: `Acompanhe sua encomenda pela ${TRANSPORTADORA.nomeCompleto}.`,
};

export default async function RastreioPage() {
  const [s, t] = await Promise.all([getSettings(), getTexts()]);

  return (
    <>
      <PageHeader title={t["rastreio.titulo"]} subtitle={t["rastreio.sub"]} />
      <Section className="py-10 sm:py-12">
        <TrackingForm textos={t} whatsapp={s.whatsapp} />
      </Section>
    </>
  );
}
