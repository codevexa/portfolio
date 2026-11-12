import ButtonLink from "@/components/ui/ButtonLink";
import Eyebrow from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden py-32">
      <div aria-hidden className="grid-veil absolute inset-0 opacity-25" />
      <div aria-hidden className="vx-glow left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bg-lime/[0.06]" />

      <div className="container-vx relative text-center">
        <Eyebrow>Erro 404</Eyebrow>
        <h1 className="display mt-8 text-[4rem] leading-none text-bone sm:text-[7rem]">
          Página não
          <br />
          encontrada
        </h1>
        <p className="mx-auto mt-8 max-w-sm leading-relaxed text-muted">
          O endereço que você abriu não existe — ou deixou de existir. O resto do
          estúdio continua no lugar.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Voltar ao início
          </ButtonLink>
          <ButtonLink href="/projetos" variant="outline">
            Ver projetos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
