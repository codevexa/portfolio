import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CLUB_COLUMNS, toClubFull, type ClubRow, type LeagueRow } from "@/lib/db";
import { ClubBadge } from "@/components/club-badge";
import { Toggle } from "@/components/admin/toggle";

export const dynamic = "force-dynamic";

export default async function AdminTimes({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; excluido?: string }>;
}) {
  const { salvo, excluido } = await searchParams;
  const supabase = await createClient();

  const [{ data: times }, { data: ligas }, { data: contagem }] = await Promise.all([
    supabase.from("clubs").select(CLUB_COLUMNS).order("ordem", { ascending: true }),
    supabase.from("leagues").select("id,nome"),
    supabase.from("products").select("clube"),
  ]);

  const clubes = (times ?? []).map((r) => toClubFull(r as ClubRow));
  const nomeLiga = new Map(
    (ligas ?? []).map((l) => [(l as LeagueRow).id, (l as LeagueRow).nome]),
  );
  const porTime = new Map<string, number>();
  for (const p of contagem ?? []) {
    const c = (p as { clube: string | null }).clube;
    if (c) porTime.set(c, (porTime.get(c) ?? 0) + 1);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Times</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {clubes.length} times · desative o que você não vende
          </p>
        </div>
        <Link
          href="/admin/times/novo"
          className="ml-auto rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
        >
          + Novo time
        </Link>
      </div>

      {salvo && <Aviso>Time salvo e já publicado no site.</Aviso>}
      {excluido && <Aviso>Time excluído.</Aviso>}

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {clubes.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center gap-4 border-b border-line p-4 last:border-b-0"
          >
            <ClubBadge name={c.name} logo={c.logo} colors={c.colors} size={40} />

            <div className="min-w-[160px] flex-1">
              <p className="text-sm font-bold leading-tight">{c.name}</p>
              <p className="mt-0.5 text-[12px] text-ink-soft">
                {c.league ? (nomeLiga.get(c.league) ?? c.league) : "sem liga"} ·{" "}
                {porTime.get(c.id) ?? 0} produtos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Toggle
                id={c.id}
                campo="destaque"
                valor={c.featured}
                ligado="Na vitrine"
                desligado="Fora da vitrine"
                tabela="clubs"
                volta="/admin/times"
              />
              <Toggle
                id={c.id}
                campo="ativo"
                valor={c.active}
                ligado="Vendo"
                desligado="Não vendo"
                tabela="clubs"
                volta="/admin/times"
              />
              <Link
                href={`/admin/times/${c.id}`}
                className="rounded-full border border-line px-4 py-2 text-[12px] font-bold transition hover:border-ink"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 rounded-xl bg-brand/25 px-4 py-3 text-[13px] font-semibold text-ink">
      {children}
    </p>
  );
}
