import Image from "next/image";
import { founder } from "@/content/founder";
import Eyebrow from "@/components/ui/Eyebrow";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal from "@/components/motion/Reveal";
import LineReveal from "@/components/motion/LineReveal";

export default function FounderFeature() {
  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div aria-hidden className="vx-glow -left-40 top-1/4 h-80 w-80 bg-lime/[0.06]" />

      <div className="container-vx">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>O fundador</Eyebrow>
            <h2 className="display mt-7 text-[2.2rem] leading-[1.02] text-bone sm:text-[3rem] lg:text-[3.6rem]">
              <LineReveal lines={["Juan", "Oliveira"]} animateOnView />
            </h2>
            <p className="eyebrow mt-5 normal-case tracking-[0.1em]">
              {founder.role} · {founder.discipline}
            </p>

            <div className="mt-9 space-y-5">
              {founder.intro.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[1.08rem] leading-relaxed text-bone"
                      : "leading-relaxed text-muted"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10">
              <ButtonLink href="/sobre" variant="outline">
                Sobre o fundador
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-line">
                <Image
                  src={founder.photos.primary.src}
                  alt={founder.photos.primary.alt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  className="object-cover object-[55%_14%]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                />
              </div>

              {/* Assinatura sobreposta */}
              <div className="absolute -bottom-5 left-5 right-5 flex items-center justify-between border border-line bg-ink/90 px-5 py-4 backdrop-blur-sm sm:left-8 sm:right-auto sm:pr-16">
                <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                  {founder.signature}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
