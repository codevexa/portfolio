import Eyebrow from "@/components/ui/Eyebrow";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import LineReveal from "@/components/motion/LineReveal";
import { studioPillars } from "@/content/founder";

export default function Manifesto() {
  return (
    <section className="relative border-t border-line py-28 md:py-40">
      <div className="container-vx">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <Eyebrow>O estúdio</Eyebrow>
            <p className="display mt-7 text-[1.9rem] leading-[1.08] text-bone sm:text-[2.5rem]">
              <LineReveal
                lines={["Estúdio", "independente", "de criação e", "desenvolvimento."]}
                animateOnView
              />
            </p>
          </Reveal>

          <Reveal delay={0.1} className="space-y-7">
            <p className="text-[1.15rem] leading-relaxed text-bone sm:text-[1.35rem]">
              A VEXA existe para transformar ideias em produtos digitais. Não vendemos
              etapas soltas — entregamos o caminho inteiro, do conceito à interface que
              entra no ar.
            </p>
            <p className="leading-relaxed text-muted">
              Trabalhamos como um estúdio, não como uma fábrica. Cada projeto começa de
              uma página em branco, com a pergunta certa, e termina com algo funcionando
              de verdade na mão de quem vai usar.
            </p>
            <p className="leading-relaxed text-muted">
              Inteligência artificial faz parte do nosso processo criativo e técnico. Ela
              acelera o trabalho e amplia o que um estúdio independente consegue entregar —
              mas quem define o resultado continua sendo a decisão de projeto.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-24 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {studioPillars.map((pillar) => (
            <RevealItem
              key={pillar.index}
              className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-surface md:p-10"
            >
              <span className="font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] text-dim transition-colors duration-500 group-hover:text-lime">
                {pillar.index}
              </span>
              <h3 className="display mt-5 text-[1.25rem] text-bone">{pillar.title}</h3>
              <p className="mt-3.5 text-sm leading-relaxed text-muted">{pillar.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
