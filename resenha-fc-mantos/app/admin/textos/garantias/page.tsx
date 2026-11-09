import { createClient } from "@/lib/supabase/server";
import { GARANTIAS_PADRAO, iconePath, type Garantia } from "@/lib/texts";
import { BadgeForm } from "@/components/admin/badge-form";
import { FaltaMigracao, TextTabs } from "@/components/admin/text-tabs";

export const dynamic = "force-dynamic";

export default async function AdminGarantias() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("garantias")
    .select("id,texto,icone,ativo,ordem")
    .order("ordem", { ascending: true });

  const itens = (data ?? []) as Garantia[];

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Garantias</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        A faixa de selos entre os depoimentos e as perguntas frequentes.
      </p>

      <TextTabs atual="/admin/textos/garantias" />

      {error ? (
        <div className="space-y-5">
          <FaltaMigracao tabela="garantias" />
          <div className="flex flex-wrap gap-3">
            {GARANTIAS_PADRAO.map((g) => (
              <span
                key={g.id}
                className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[12px] font-bold"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-gold-deep)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={iconePath(g.icone)} />
                </svg>
                {g.texto}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {itens.map((g) => (
            <BadgeForm key={g.id} item={g} />
          ))}
          <div className="pt-2">
            <p className="mb-2 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
              NOVA GARANTIA
            </p>
            <BadgeForm />
          </div>
        </div>
      )}
    </>
  );
}
