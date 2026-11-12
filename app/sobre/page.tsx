import type { Metadata } from "next";
import Image from "next/image";
import { founder, studioPillars } from "@/content/founder";
import { site } from "@/content/site";
import PageHeader from "@/components/layout/PageHeader";
import ClosingCTA from "@/components/home/ClosingCTA";
import Eyebrow from "@/components/ui/Eyebrow";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import LineReveal from "@/components/motion/LineReveal";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A VEXA é um estúdio independente de tecnologia e experiências digitais fundado por Juan Oliveira. Criatividade, estratégia, tecnologia e desenvolvimento no mesmo lugar.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Sobre — VEXA",
    description:
      "Estúdio independente de tecnologia e experiências digitais fundado por Juan Oliveira.",
    url: "/sobre",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: founder.name,
  jobTitle: founder.role,
  worksFor: { "@type": "Organization", name: site.name },
  url: `${site.url}/sobre`,
  sameAs: [site.contact.instagram.founder.url],
};

export default function SobrePage() {
  const blocks = [founder.vision, founder.philosophy, founder.triad];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <PageHeader
        eyebrow="Quem somos"
        lines={["Sobre", "a VEXA"]}
        lead="Um estúdio independente de tecnologia e experiências digitais. Pequeno por escolha, direto por princípio."
      />

      {/* ── O conceito da marca ─────────────────────────────── */}
      <section className="border-t border-line py-24 md:py-36">
        <div className="container-vx grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <Eyebrow>O conceito</Eyebrow>
            <p className="display mt-7 text-[1.8rem] leading-[1.08] text-bone sm:text-[2.4rem]">
              <LineReveal lines={["Ideias que", "viram", "interface."]} animateOnView />
            </p>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <p className="text-[1.15rem] leading-relaxed text-bone sm:text-[1.35rem]">
              VEXA é o nome que demos ao ponto em que uma ideia para de ser conversa e
              começa a ser produto.
            </p>
            <p className="leading-relaxed text-muted">
              Boa parte do que trava um projeto digital não é falta de ideia — é a
              distância entre quem imagina, quem desenha e quem constrói. A cada passagem
              de mão, a intenção original perde um pedaço.
            </p>
            <p className="leading-relaxed text-muted">
              A VEXA foi montada para eliminar essa distância. Conceito, direção de arte e
              desenvolvimento acontecem no mesmo lugar, com as mesmas mãos. O que foi
              combinado no começo é o que entra no ar no fim.
            </p>
            <p className="leading-relaxed text-muted">
              Não trabalhamos com template nem com entrega de etapa solta. Cada projeto é
              construído a partir do problema que ele precisa resolver — e termina
              publicado, funcionando, com você sabendo exatamente o que tem em mãos.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Pilares ─────────────────────────────────────────── */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-vx">
          <Reveal>
            <Eyebrow>Pilares</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {studioPillars.map((pillar) => (
              <RevealItem
                key={pillar.index}
                className="group bg-ink p-8 transition-colors duration-500 hover:bg-surface md:p-10"
              >
                <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] text-dim transition-colors duration-500 group-hover:text-lime">
                  {pillar.index}
                </span>
                <h3 className="display mt-5 text-[1.3rem] text-bone">{pillar.title}</h3>
                <p className="mt-3.5 text-sm leading-relaxed text-muted">{pillar.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── O fundador ──────────────────────────────────────── */}
      <section id="fundador" className="scroll-mt-28 border-t border-line bg-surface py-24 md:py-36">
        <div className="container-vx">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-line">
                <Image
                  src={founder.photos.primary.src}
                  alt={founder.photos.primary.alt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  className="object-cover object-[55%_14%]"
                />
              </div>
              <p className="eyebrow mt-5">{founder.signature}</p>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>O fundador</Eyebrow>
                <h2 className="display mt-7 text-[2.6rem] leading-[0.95] text-bone sm:text-[3.6rem] lg:text-[4.4rem]">
                  <LineReveal lines={["Juan", "Oliveira"]} animateOnView />
                </h2>
                <p className="eyebrow mt-5 normal-case tracking-[0.1em]">
                  {founder.role} · {founder.discipline}
                </p>

                <p className="mt-10 text-[1.3rem] leading-snug text-bone sm:text-[1.6rem]">
                  {founder.headline}
                </p>

                <div className="mt-7 space-y-5">
                  {founder.intro.map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>

              {/* Visão, filosofia e tríade */}
              <div className="mt-16 space-y-px bg-line">
                {blocks.map((block, i) => (
                  <Reveal key={block.title} delay={i * 0.05} className="bg-surface pt-8">
                    <h3 className="display text-[1.15rem] text-bone">{block.title}</h3>
                    <div className="mt-5 space-y-4">
                      {block.text.map((paragraph, j) => (
                        <p key={j} className="leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Bloco biográfico — renderizado apenas quando preenchido. */}
              {founder.biography.paragraphs.length > 0 && (
                <Reveal className="mt-16 border-t border-line pt-8">
                  <h3 className="display text-[1.15rem] text-bone">
                    {founder.biography.title}
                  </h3>
                  <div className="mt-5 space-y-4">
                    {founder.biography.paragraphs.map((paragraph, i) => (
                      <p key={i} className="leading-relaxed text-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Reveal>
              )}

              <Reveal className="mt-14 flex flex-wrap gap-3">
                <ButtonLink href={site.contact.instagram.founder.url} variant="outline" external>
                  {site.contact.instagram.founder.handle}
                </ButtonLink>
                <ButtonLink href="/projetos" variant="ghost">
                  Ver os projetos
                </ButtonLink>
              </Reveal>
            </div>
          </div>

          {/* Faixa fotográfica */}
          <Reveal className="mt-20 grid gap-px bg-line sm:grid-cols-[1.4fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[22rem]">
              <Image
                src="/images/portrait-wide.webp"
                alt="Retrato editorial em preto e branco de Juan Oliveira."
                fill
                sizes="(max-width: 640px) 100vw, 55vw"
                className="object-cover object-[25%_center]"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-auto">
              <Image
                src={founder.photos.secondary.src}
                alt={founder.photos.secondary.alt}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover object-[50%_18%]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
