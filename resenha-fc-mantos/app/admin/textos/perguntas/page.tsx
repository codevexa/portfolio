import { createClient } from "@/lib/supabase/server";
import { PERGUNTAS_PADRAO, type Pergunta } from "@/lib/texts";
import { FaqForm } from "@/components/admin/faq-form";
import { FaltaMigracao, TextTabs } from "@/components/admin/text-tabs";

export const dynamic = "force-dynamic";

export default async function AdminPerguntas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id,pergunta,resposta,ativo,ordem")
    .order("ordem", { ascending: true });

  const itens = (data ?? []) as Pergunta[];

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">
        Perguntas frequentes
      </h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        A lista que abre no fim da página inicial.
      </p>

      <TextTabs atual="/admin/textos/perguntas" />

      {error ? (
        <div className="space-y-5">
          <FaltaMigracao tabela="faqs" />
          <div className="space-y-3">
            {PERGUNTAS_PADRAO.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-line bg-white px-5 py-4"
              >
                <p className="text-sm font-bold">{p.pergunta}</p>
                <p className="mt-1 text-[13px] text-ink-soft">{p.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {itens.map((p) => (
            <FaqForm key={p.id} item={p} />
          ))}
          <div className="pt-2">
            <p className="mb-2 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
              NOVA PERGUNTA
            </p>
            <FaqForm />
          </div>
        </div>
      )}
    </>
  );
}
