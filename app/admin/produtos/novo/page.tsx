import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_COLUMNS,
  CLUB_COLUMNS,
  toCategory,
  toClubFull,
  toLeague,
  type CategoryRow,
  type ClubRow,
  type LeagueRow,
} from "@/lib/db";
import { CATEGORIAS_PADRAO } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NovoProduto() {
  const supabase = await createClient();
  const [{ data: c }, { data: l }, { data: cats }] = await Promise.all([
    supabase.from("clubs").select(CLUB_COLUMNS).order("ordem", { ascending: true }),
    supabase
      .from("leagues")
      .select("id,nome,descricao,cor_fundo,cor_destaque,ativo,ordem")
      .order("ordem", { ascending: true }),
    supabase
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .order("ordem", { ascending: true }),
  ]);

  const categorias = cats?.length
    ? cats.map((r) => toCategory(r as CategoryRow))
    : CATEGORIAS_PADRAO;

  return (
    <>
      <Link
        href="/admin"
        className="text-[13px] font-semibold text-ink-soft transition hover:text-ink"
      >
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-extrabold tracking-tight">
        Novo produto
      </h1>
      <ProductForm
        clubes={(c ?? []).map((r) => toClubFull(r as ClubRow))}
        ligas={(l ?? []).map((r) => toLeague(r as LeagueRow))}
        categorias={categorias}
      />
    </>
  );
}
