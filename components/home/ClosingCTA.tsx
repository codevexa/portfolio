import ButtonLink from "@/components/ui/ButtonLink";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/motion/Reveal";
import LineReveal from "@/components/motion/LineReveal";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

export default function ClosingCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line py-32 md:py-48">
      <div aria-hidden className="grid-veil absolute inset-0 opacity-30" />
      <div aria-hidden className="vx-glow left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 bg-lime/[0.07]" />

      <div className="container-vx relative text-center">
        <Reveal>
          <Eyebrow>Vamos conversar</Eyebrow>
        </Reveal>

        <h2 className="display mx-auto mt-8 max-w-[13ch] text-[2.8rem] leading-[0.95] text-bone sm:text-[4.4rem] lg:text-[6rem]">
          <LineReveal lines={["Vamos", "construir", "algo."]} animateOnView />
        </h2>

        <Reveal delay={0.15}>
          <p className="text-balance-vx mx-auto mt-9 max-w-md leading-relaxed text-muted">
            Conte a ideia. Eu respondo com um caminho possível — prazo, escopo e o que
            dá para fazer primeiro.
          </p>

          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={whatsappLink()} variant="primary" external>
              Chamar no WhatsApp
            </ButtonLink>
            <ButtonLink href="/contato" variant="outline">
              Enviar briefing
            </ButtonLink>
          </div>

          <p className="eyebrow mt-12">{site.contact.whatsappDisplay}</p>
        </Reveal>
      </div>
    </section>
  );
}
