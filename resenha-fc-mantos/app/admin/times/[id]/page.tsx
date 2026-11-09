import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CLUB_COLUMNS, toClubFull, toLeague, type ClubRow, type LeagueRow } from "@/lib/db";
import { ClubForm } from "@/components/admin/club-form";

export const dynamic = "force-dynamic";

export default async function EditarTime({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novo = id === "novo";
  const supabase = await createClient();

  const { data: ligasRaw } = await supabase
    .from("leagues")
    .select("id,nome,descricao,cor_fundo,cor_destaque,ativo,ordem")
    .order("ordem", { ascending: true });
  const ligas = (ligasRaw ?? []).map((r) => toLeague(r as LeagueRow));

  let time;
  if (!novo) {
    const { data } = await supabase
      .from("clubs")
      .select(CLUB_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    time = toClubFull(data as ClubRow);
  }

  return (
    <>
      <Link
        href="/admin/times"
        className="text-[13px] font-semibold text-ink-soft transition hover:text-ink"
      >
        ← Voltar
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {novo ? "Novo time" : time?.name}
        </h1>
        {time && (
          <Link
            href={`/time/${time.id}`}
            target="_blank"
            className="rounded-full border border-line px-4 py-2 text-[12px] font-bold transition hover:border-ink"
          >
            Ver no site ↗
          </Link>
        )}
      </div>
      <ClubForm time={time} ligas={ligas} />
    </>
  );
}
