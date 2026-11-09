import { createClient } from "@/lib/supabase/server";
import { DEPOIMENTOS_PADRAO, type Depoimento } from "@/lib/texts";
import { ReviewForm } from "@/components/admin/review-form";
import { FaltaMigracao, TextTabs } from "@/components/admin/text-tabs";

export const dynamic = "force-dynamic";

export default async function AdminDepoimentos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("depoimentos")
    .select("id,nome,cidade,texto,ativo,ordem")
    .order("ordem", { ascending: true });

  const itens = (data ?? []) as Depoimento[];

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Depoimentos</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        Os relatos que passam na faixa “Feedback”. Publique só o que o cliente
        realmente escreveu.
      </p>

      <TextTabs atual="/admin/textos/depoimentos" />

      {error ? (
        <div className="space-y-5">
          <FaltaMigracao tabela="depoimentos" />
          <div className="space-y-3">
            {DEPOIMENTOS_PADRAO.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-line bg-white px-5 py-4"
              >
                <p className="text-[13px] text-ink-soft">{d.texto}</p>
                <p className="mt-1.5 text-[12px] font-bold">
                  {d.nome} · {d.cidade}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {itens.map((d) => (
            <ReviewForm key={d.id} item={d} />
          ))}
          <div className="pt-2">
            <p className="mb-2 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
              NOVO DEPOIMENTO
            </p>
            <ReviewForm />
          </div>
        </div>
      )}
    </>
  );
}
