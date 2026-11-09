import Link from "next/link";

const abas = [
  { href: "/admin/textos", label: "Textos do site" },
  { href: "/admin/textos/perguntas", label: "Perguntas frequentes" },
  { href: "/admin/textos/depoimentos", label: "Depoimentos" },
  { href: "/admin/textos/garantias", label: "Garantias" },
];

export function TextTabs({ atual }: { atual: string }) {
  return (
    <nav className="mb-7 flex flex-wrap gap-2">
      {abas.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          aria-current={a.href === atual ? "page" : undefined}
          className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
            a.href === atual
              ? "bg-ink text-white"
              : "border border-line text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          {a.label}
        </Link>
      ))}
    </nav>
  );
}

/** Aviso quando a tabela ainda não foi criada no Supabase. */
export function FaltaMigracao({ tabela }: { tabela: string }) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
      <p className="text-[13px] font-bold text-amber-900">
        A tabela <code className="font-mono">{tabela}</code> ainda não existe no
        banco.
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-amber-900/80">
        Abra o Supabase → SQL Editor, cole o arquivo{" "}
        <code className="font-mono">supabase/02-categorias-e-textos.sql</code>{" "}
        do projeto e rode uma vez. Até lá o site continua no ar usando os textos
        originais, e esta tela fica somente para leitura.
      </p>
    </div>
  );
}
