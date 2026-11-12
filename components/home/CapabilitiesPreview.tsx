import Link from "next/link";
import { services } from "@/content/services";
import Eyebrow from "@/components/ui/Eyebrow";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function CapabilitiesPreview() {
  return (
    <section className="relative border-t border-line py-28 md:py-40">
      <div className="container-vx">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>Serviços</Eyebrow>
            <h2 className="display mt-7 max-w-[14ch] text-[2.4rem] leading-[0.95] text-bone sm:text-[3.4rem] lg:text-[4.2rem]">
              O que construímos
            </h2>
          </div>
          <ButtonLink href="/servicos" variant="outline">
            Ver serviços
          </ButtonLink>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.index}>
              <Link
                href="/servicos"
                className="group flex h-full flex-col justify-between gap-10 bg-ink p-8 transition-colors duration-500 hover:bg-surface md:p-9"
              >
                <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] text-dim transition-colors duration-500 group-hover:text-lime">
                  {service.index}
                </span>
                <div>
                  <h3 className="display text-[1.15rem] leading-tight text-bone">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
