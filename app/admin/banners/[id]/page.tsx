import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BANNER_COLUMNS, toBanner, type BannerRow } from "@/lib/db";
import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export default async function EditarBanner({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novo = id === "novo";

  let banner;
  if (!novo) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("banners")
      .select(BANNER_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    banner = toBanner(data as BannerRow);
  }

  return (
    <>
      <Link
        href="/admin/banners"
        className="text-[13px] font-semibold text-ink-soft transition hover:text-ink"
      >
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-extrabold tracking-tight">
        {novo ? "Novo banner" : banner?.title}
      </h1>
      <BannerForm banner={banner} />
    </>
  );
}
