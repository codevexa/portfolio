import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { site, waLink } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { getTexts } from "@/lib/db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sobre a loja",
  description: `Como funciona a ${site.name}: entrega, trocas e pagamento.`,
};

export default async function SobrePage() {
  const [s, t] = await Promise.all([getSettings(), getTexts()]);

  const blocks = [
    { id: "loja", title: t["sobre.loja.titulo"], body: t["sobre.loja.texto"] },
    { id: "entrega", title: t["sobre.entrega.titulo"], body: t["sobre.entrega.texto"] },
    { id: "trocas", title: t["sobre.trocas.titulo"], body: t["sobre.trocas.texto"] },
    { id: "pagamento", title: t["sobre.pagamento.titulo"], body: t["sobre.pagamento.texto"] },
  ];

  return (
    <>
      <PageHeader title={t["sobre.loja.titulo"]} subtitle={s.hours} />
      <Section className="py-12">
        <div className="mx-auto max-w-3xl space-y-10">
          {blocks.map((b) => (
            <section key={b.id} id={b.id} className="scroll-mt-32">
              <h2 className="text-xl font-extrabold tracking-tight">{b.title}</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                {b.body}
              </p>
            </section>
          ))}

          <a
            href={waLink(s.whatsapp, `Olá! Tenho uma dúvida sobre a ${s.storeName}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-ink px-7 py-3.5 text-[13px] font-bold text-white transition hover:bg-ink/85"
          >
            {t["sobre.botao"]}
          </a>
        </div>
      </Section>
    </>
  );
}
