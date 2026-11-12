import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import Eyebrow from "@/components/ui/Eyebrow";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal from "@/components/motion/Reveal";

export default function SelectedWork() {
  return (
    <section className="relative border-t border-line py-28 md:py-40">
      <div className="container-vx">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>Projetos selecionados</Eyebrow>
            <h2 className="display mt-7 text-[2.4rem] text-bone sm:text-[3.4rem] lg:text-[4.2rem]">
              O trabalho
            </h2>
          </div>
          <ButtonLink href="/projetos" variant="outline">
            Ver todos
          </ButtonLink>
        </Reveal>

        <ul className="mt-16 border-t border-line">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Reveal delay={i * 0.05}>
                <Link
                  href={`/projetos/${project.slug}`}
                  className="group grid grid-cols-1 items-center gap-6 border-b border-line py-8 transition-colors duration-500 hover:bg-surface md:grid-cols-[auto_1.1fr_1fr_auto] md:gap-10 md:py-10"
                >
                  <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] text-dim transition-colors duration-500 group-hover:text-lime md:w-10">
                    {project.index}
                  </span>

                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-[3.4rem] shrink-0 overflow-hidden rounded-lg border border-line md:h-28 md:w-16">
                      <Image
                        src={project.cover.src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover object-top grayscale transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>
                    <div>
                      <h3 className="display text-[1.7rem] text-bone transition-colors duration-500 group-hover:text-lime sm:text-[2.2rem]">
                        {project.name}
                      </h3>
                      <p className="eyebrow mt-2 normal-case tracking-[0.1em]">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    {project.excerpt}
                  </p>

                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-500 group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
