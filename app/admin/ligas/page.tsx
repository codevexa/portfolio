import { createClient } from "@/lib/supabase/server";
import { toLeague, type LeagueRow } from "@/lib/db";
import { LeagueForm } from "@/components/admin/league-form";

export const dynamic = "force-dynamic";

export default async function AdminLigas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leagues")
    .select("id,nome,descricao,cor_fundo,cor_destaque,ativo,ordem")
    .order("ordem", { ascending: true });

  const ligas = (data ?? []).map((r) => toLeague(r as LeagueRow));

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight">Ligas</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        Os campeonatos que aparecem no menu, no rodapé e nos cards da home.
      </p>

      <div className="space-y-4">
        {ligas.map((l) => (
          <LeagueForm key={l.id} liga={l} />
        ))}

        <div>
          <p className="mb-2 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
            NOVA LIGA
          </p>
          <LeagueForm />
        </div>
      </div>
    </>
  );
}
