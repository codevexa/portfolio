import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getNextProject, getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import DeviceFrame from "@/components/projects/DeviceFrame";
import Eyebrow from "@/components/ui/Eyebrow";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import LineReveal from "@/components/motion/LineReveal";
import { whatsappLink } from "@/lib/whatsapp";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.excerpt,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${site.name}`,
      description: project.excerpt,
      url: `/projetos/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjetoPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(slug);

  return (
    <article>
      {/* ── Abertura ───────────────────────────────────────── */}
      <header className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-52">
        <div aria-hidden className="grid-veil absolute inset-0 opacity-25" />
        <div
          aria-hidden
          className="vx-glow -top-20 right-0 h-80 w-80 opacity-60"
          style={{ backgroundColor: `${project.accent}1f` }}
        />

        <div className="container-vx relative">
          <nav aria-label="Trilha" className="eyebrow flex items-center gap-2.5">
            <Link href="/projetos" className="transition-colors hover:text-bone">
              Projetos
            </Link>
            <span aria-hidden>/</span>
            <span className="text-bone">{project.index}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
            <div>
              <h1 className="display text-[3rem] leading-[0.92] text-bone sm:text-[4.6rem] lg:text-[6rem]">
                <LineReveal lines={[project.name]} delay={0.1} />
              </h1>
              <p className="eyebrow mt-6 normal-case tracking-[0.1em]">{project.category}</p>
              <p className="mt-9 max-w-xl text-[1.3rem] leading-snug text-bone sm:text-[1.6rem]">
                {project.tagline}
              </p>
            </div>

            <Reveal delay={0.3} className="lg:pb-3">
              <p className="leading-relaxed text-muted">{project.excerpt}</p>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-lime"
                >
                  {project.liveUrl.replace(/^https?:\/\//, "")}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <dl className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {project.meta.map((item) => (
                <div key={item.label} className="bg-ink p-6">
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-2.5 text-sm leading-relaxed text-bone">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </header>

      {/* ── Capa ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-line bg-surface py-20 md:py-28">
        <div
          aria-hidden
          className="vx-glow left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: `${project.accent}1a` }}
        />
        <div className="container-vx relative flex justify-center">
          <Reveal className="w-[62%] max-w-[18rem] sm:w-[44%] lg:w-[24%]">
            <DeviceFrame
              frame={project.cover.frame}
              src={project.cover.src}
              alt={project.cover.alt}
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* ── Conceito ───────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container-vx grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Conceito</Eyebrow>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6">
            {project.concept.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-[1.2rem] leading-relaxed text-bone sm:text-[1.4rem]"
                    : "leading-relaxed text-muted"
                }
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Problema e solução ─────────────────────────────── */}
      <section className="border-y border-line">
        <div className="container-vx">
          <div className="grid gap-px bg-line md:grid-cols-2">
            <Reveal className="bg-ink p-9 md:p-14">
              <Eyebrow dot={false}>
                <span className="text-dim">01 —</span> O problema
              </Eyebrow>
              <p className="mt-7 text-[1.05rem] leading-relaxed text-muted">{project.problem}</p>
            </Reveal>
            <Reveal delay={0.1} className="bg-ink p-9 md:p-14">
              <Eyebrow>
                <span className="text-dim">02 —</span> A proposta
              </Eyebrow>
              <p className="mt-7 text-[1.05rem] leading-relaxed text-bone">{project.solution}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Funcionalidades ────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container-vx grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Funcionalidades</Eyebrow>
            <p className="mt-5 max-w-[22ch] text-sm leading-relaxed text-dim">
              O que já existe nas telas do projeto.
            </p>
          </Reveal>

          <RevealGroup className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {project.features.map((feature) => (
              <RevealItem
                key={feature}
                y={14}
                className="flex items-start gap-3.5 bg-ink p-5 transition-colors duration-500 hover:bg-surface"
              >
                <Check
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: project.accent }}
                  strokeWidth={2.5}
                />
                <span className="text-sm leading-relaxed text-bone">{feature}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ── Direção visual ─────────────────────────────────── */}
      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className="container-vx grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Direção visual</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
              {project.palette.map((color) => (
                <li key={color.name} className="bg-ink p-5">
                  <span
                    aria-hidden
                    className="block h-16 w-full rounded-sm border border-white/10"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="mt-4 text-sm text-bone">{color.name}</p>
                  <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.1em] text-dim">
                    {color.value}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Galeria ────────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container-vx">
          <Reveal>
            <Eyebrow>Galeria</Eyebrow>
          </Reveal>

          <div
            className={`mt-14 grid gap-14 ${
              project.gallery.length === 1
                ? "mx-auto max-w-xs"
                : project.gallery.length === 2
                  ? "mx-auto max-w-3xl sm:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {project.gallery.map((shot, i) => (
              <Reveal key={shot.src + i} delay={i * 0.08}>
                <figure>
                  <div className="mx-auto w-[66%] max-w-[16rem] sm:w-full">
                    <DeviceFrame frame={shot.frame} src={shot.src} alt={shot.alt} />
                  </div>
                  {shot.caption && (
                    <figcaption className="mt-6 text-center text-sm leading-relaxed text-muted sm:text-left">
                      {shot.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Próximo projeto ────────────────────────────────── */}
      <section className="border-t border-line">
        <Link
          href={`/projetos/${next.slug}`}
          className="group block py-20 transition-colors duration-500 hover:bg-surface md:py-28"
        >
          <div className="container-vx flex flex-wrap items-center justify-between gap-8">
            <div>
              <Eyebrow>Próximo projeto</Eyebrow>
              <p className="display mt-6 text-[2.4rem] leading-none text-bone transition-colors duration-500 group-hover:text-lime sm:text-[3.6rem]">
                {next.name}
              </p>
            </div>
            <div className="flex items-center gap-7">
              <div className="relative hidden h-28 w-16 overflow-hidden rounded-lg border border-line sm:block">
                <Image
                  src={next.cover.src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </div>
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-muted transition-all duration-500 group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
              >
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Chamada ────────────────────────────────────────── */}
      <section className="border-t border-line py-24 text-center md:py-32">
        <div className="container-vx">
          <Reveal>
            <p className="display mx-auto max-w-[16ch] text-[1.9rem] leading-[1.05] text-bone sm:text-[2.6rem]">
              Tem um projeto parecido em mente?
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href={whatsappLink(
                  `Olá, Juan. Vi o case ${project.name} no site da VEXA e quero conversar sobre um projeto.`,
                )}
                variant="primary"
                external
              >
                Falar sobre o meu
              </ButtonLink>
              <ButtonLink href="/projetos" variant="outline">
                Todos os projetos
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
