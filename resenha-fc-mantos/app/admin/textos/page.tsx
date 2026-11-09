import { createClient } from "@/lib/supabase/server";
import { GRUPOS_TEXTO, TEXTOS_PADRAO } from "@/lib/texts";
import { TextGroupForm } from "@/components/admin/text-group-form";
import { FaltaMigracao, TextTabs } from "@/components/admin/text-tabs";

export const dynamic = "force-dynamic";

export default async function AdminTextos() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_texts").select("chave,valor");

  const valores: Record<string, string> = { ...TEXTOS_PADRAO };
  for (const r of data ?? []) {
    const row = r as { chave: string; valor: string };
    if (row.valor?.trim()) valores[row.chave] = row.valor;
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">
        Textos do site
      </h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        Tudo que o cliente lê, por bloco. Cada bloco salva sozinho.
      </p>

      <TextTabs atual="/admin/textos" />

      {error ? (
        <FaltaMigracao tabela="site_texts" />
      ) : (
        <>
          <nav className="mb-6 flex flex-wrap gap-2">
            {GRUPOS_TEXTO.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="rounded-full border border-line px-3.5 py-1.5 text-[12px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
              >
                {g.titulo}
              </a>
            ))}
          </nav>

          <div className="space-y-5">
            {GRUPOS_TEXTO.map((g) => (
              <TextGroupForm key={g.id} grupo={g} valores={valores} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
