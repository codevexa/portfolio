import type { Metadata } from "next";
import { ArrowUpRight, AtSign, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import PageHeader from "@/components/layout/PageHeader";
import ProjectBriefForm from "@/components/contact/ProjectBriefForm";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a VEXA pelo WhatsApp ou envie uma solicitação de projeto. Estúdio digital de Juan Oliveira.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Contato — VEXA",
    description: "Fale com a VEXA pelo WhatsApp ou envie uma solicitação de projeto.",
    url: "/contato",
  },
};

const channels = [
  {
    label: "WhatsApp",
    value: site.contact.whatsappDisplay,
    note: "Resposta mais rápida. A conversa já começa com o contexto do site.",
    href: whatsappLink(),
    Icon: MessageCircle,
    primary: true,
  },
  {
    label: "Instagram do estúdio",
    value: site.contact.instagram.studio.handle,
    note: "Projetos, bastidores e o que está sendo construído agora.",
    href: site.contact.instagram.studio.url,
    Icon: AtSign,
    primary: false,
  },
  {
    label: "Instagram do fundador",
    value: site.contact.instagram.founder.handle,
    note: "O lado pessoal de quem está por trás da VEXA.",
    href: site.contact.instagram.founder.url,
    Icon: AtSign,
    primary: false,
  },
];

export default function ContatoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fale com a VEXA"
        lines={["Contato"]}
        lead="Conte a ideia do seu jeito. Eu respondo com um caminho possível — escopo, prazo e o que dá para fazer primeiro."
      />

      {/* ── Canais ──────────────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-vx">
          <ul className="grid gap-px bg-line lg:grid-cols-3">
            {channels.map(({ label, value, note, href, Icon, primary }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between gap-12 bg-ink p-8 transition-colors duration-500 hover:bg-surface md:p-10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      aria-hidden
                      className={`h-5 w-5 transition-colors duration-500 ${
                        primary ? "text-lime" : "text-muted group-hover:text-lime"
                      }`}
                      strokeWidth={1.75}
                    />
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 text-dim transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                    />
                  </div>
                  <div>
                    <p className="eyebrow">{label}</p>
                    <p className="display mt-3.5 text-[1.3rem] text-bone transition-colors duration-500 group-hover:text-lime sm:text-[1.6rem]">
                      {value}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{note}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Briefing ────────────────────────────────────────── */}
      <section className="border-t border-line py-24 md:py-36">
        <div className="container-vx grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <Reveal>
            <Eyebrow>Solicitação de projeto</Eyebrow>
            <h2 className="display mt-7 max-w-[11ch] text-[2.2rem] leading-[0.98] text-bone sm:text-[2.9rem]">
              Conte o que você precisa
            </h2>
            <p className="mt-7 max-w-sm leading-relaxed text-muted">
              Preencha os campos e o formulário monta a mensagem para você. É só revisar
              e enviar — a conversa continua direto no WhatsApp.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-dim">
              Prefere falar primeiro e detalhar depois? Use o botão de WhatsApp acima.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ProjectBriefForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
