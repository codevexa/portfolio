import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import PageHeader from "@/components/layout/PageHeader";
import ClosingCTA from "@/components/home/ClosingCTA";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos desenvolvidos pela VEXA: Refúgio, Jotah 26 e Resenha FC Mantos — aplicativos, plataformas e experiências digitais.",
  alternates: { canonical: "/projetos" },
  openGraph: {
    title: "Projetos — VEXA",
    description: "Aplicativos, plataformas e experiências digitais desenvolvidos pela VEXA.",
    url: "/projetos",
  },
};

export default function ProjetosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfólio"
        lines={["Projetos"]}
        lead="Três projetos, três problemas diferentes. Cada case mostra o conceito, a decisão de projeto e as funcionalidades que existem de fato."
      />

      <section className="border-t border-line">
        {projects.map((project, i) => (
          <article key={project.slug} className="border-b border-line">
            <Reveal>
              <Link
                href={`/projetos/${project.slug}`}
                className="group block py-16 transition-colors duration-500 hover:bg-surface md:py-24"
              >
                <div className="container-vx">
                  <div
                    className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                      i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="relative mx-auto w-[58%] max-w-[16rem] sm:w-[42%] lg:mx-0 lg:w-[72%]">
                      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.8rem] border border-white/12 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
                        <Image
                          src={project.cover.src}
                          alt={project.cover.alt}
                          fill
                          sizes="(max-width: 1024px) 50vw, 300px"
                          className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                        />
                      </div>
                      <div
                        aria-hidden
                        className="vx-glow left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        style={{ backgroundColor: `${project.accent}22` }}
                      />
                    </div>

                    <div>
                      <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] text-dim">
                        {project.index} / {String(projects.length).padStart(2, "0")}
                      </span>
                      <h2 className="display mt-5 text-[2.4rem] leading-[0.95] text-bone transition-colors duration-500 group-hover:text-lime sm:text-[3.4rem]">
                        {project.name}
                      </h2>
                      <p className="eyebrow mt-4 normal-case tracking-[0.1em]">
                        {project.category}
                      </p>
                      <p className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-bone">
                        {project.tagline}
                      </p>
                      <p className="mt-4 max-w-md leading-relaxed text-muted">
                        {project.excerpt}
                      </p>
                      <span className="mt-9 inline-flex items-center gap-3 font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-bone">
                        Ver o case
                        <span
                          aria-hidden
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </article>
        ))}
      </section>

      <ClosingCTA />
    </>
  );
}
