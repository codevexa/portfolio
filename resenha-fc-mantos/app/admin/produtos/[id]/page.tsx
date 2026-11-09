import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_COLUMNS,
  CLUB_COLUMNS,
  PRODUCT_COLUMNS,
  toCategory,
  toClubFull,
  toLeague,
  toProduct,
  type CategoryRow,
  type ClubRow,
  type LeagueRow,
  type ProductRow,
} from "@/lib/db";
import { CATEGORIAS_PADRAO } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, { data: c }, { data: l }, { data: cats }] = await Promise.all([
    supabase
      .from("products")
      .select(`${PRODUCT_COLUMNS},clubs(id,nome,cor1,cor2,padrao,logo_url)`)
      .eq("id", id)
      .maybeSingle(),
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

  if (!data) notFound();
  const produto = toProduct(data as unknown as ProductRow);

  return (
    <>
      <Link
        href="/admin"
        className="text-[13px] font-semibold text-ink-soft transition hover:text-ink"
      >
        ← Voltar
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">{produto.name}</h1>
        <Link
          href={`/produto/${produto.slug}`}
          target="_blank"
          className="rounded-full border border-line px-4 py-2 text-[12px] font-bold transition hover:border-ink"
        >
          Ver no site ↗
        </Link>
      </div>
      <ProductForm
        produto={produto}
        clubes={(c ?? []).map((r) => toClubFull(r as ClubRow))}
        ligas={(l ?? []).map((r) => toLeague(r as LeagueRow))}
        categorias={categorias}
      />
    </>
  );
}
