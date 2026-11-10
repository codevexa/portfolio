import Link from "next/link";
import { Section } from "@/components/section";
import { getTexts } from "@/lib/db";

export default async function NotFound() {
  const t = await getTexts();

  return (
    <Section className="py-24 text-center">
      <p className="text-[11px] font-bold tracking-[0.2em] text-gold-deep">
        {t["404.etiqueta"]}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {t["404.titulo"]}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
        {t["404.texto"]}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
        >
          {t["404.botao_inicio"]}
        </Link>
        <Link
          href="/catalogo"
          className="rounded-full border border-line px-7 py-3 text-[13px] font-bold transition hover:border-ink"
        >
          {t["404.botao_catalogo"]}
        </Link>
      </div>
    </Section>
  );
}
