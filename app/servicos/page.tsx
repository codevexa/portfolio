import type { Metadata } from "next";
import { processSteps, services } from "@/content/services";
import PageHeader from "@/components/layout/PageHeader";
import ServiceList from "@/components/ui/ServiceList";
import ClosingCTA from "@/components/home/ClosingCTA";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Sites institucionais, landing pages, aplicações web, sistemas personalizados, plataformas SaaS, painéis administrativos, automação e integrações com inteligência artificial.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    title: "Serviços — VEXA",
    description:
      "Desenvolvimento de sites, aplicações web, sistemas, plataformas SaaS, automação e integrações com IA.",
    url: "/servicos",
  },
};

export default function ServicosPage() {
  return (
    <>
      <PageHeader
        eyebrow="O que fazemos"
        lines={["Serviços"]}
        lead="Do site que apresenta a empresa ao sistema que sustenta a operação. Nove frentes, uma mesma forma de trabalhar."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-vx">
          <ServiceList services={services} />
        </div>
      </section>

      <section className="border-t border-line py-24 md:py-36">
        <div className="container-vx">
          <Reveal>
            <Eyebrow>Como trabalhamos</Eyebrow>
            <h2 className="display mt-7 max-w-[14ch] text-[2.2rem] leading-[0.98] text-bone sm:text-[3rem] lg:text-[3.6rem]">
              Quatro etapas, sem mistério
            </h2>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <RevealItem key={step.index} className="bg-ink p-8 md:p-9">
                <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] text-lime">
                  {step.index}
                </span>
                <h3 className="display mt-5 text-[1.3rem] text-bone">{step.title}</h3>
                <p className="mt-3.5 text-sm leading-relaxed text-muted">{step.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
