import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { BANNER_COLUMNS, toBanner, type BannerRow } from "@/lib/db";
import { Toggle } from "@/components/admin/toggle";

export const dynamic = "force-dynamic";

export default async function AdminBanners({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; excluido?: string }>;
}) {
  const { salvo, excluido } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select(BANNER_COLUMNS)
    .order("ordem", { ascending: true });

  const banners = (data ?? []).map((r) => toBanner(r as BannerRow));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Banners</h1>
          <p className="mt-1 text-sm text-ink-soft">
            O carrossel do topo da página inicial.
          </p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="ml-auto rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85"
        >
          + Novo banner
        </Link>
      </div>

      {salvo && <Aviso>Banner salvo e já publicado no site.</Aviso>}
      {excluido && <Aviso>Banner excluído.</Aviso>}

      {banners.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-5 py-12 text-center text-sm text-ink-soft">
          Nenhum banner. Sem banner, o site começa direto nos destaques.
        </p>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4"
            >
              <div
                className="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-xl"
                style={{
                  background: b.image
                    ? `linear-gradient(90deg, ${b.from}cc, transparent), url(${b.image}) center/cover`
                    : `radial-gradient(120% 120% at 85% 15%, ${b.to}44, transparent 60%), ${b.from}`,
                }}
              >
                {b.image ? (
                  <Image
                    src={b.image}
                    alt=""
                    width={128}
                    height={80}
                    className="h-full w-full object-cover opacity-0"
                    unoptimized
                  />
                ) : (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{ background: b.to, color: "#0b0b0b" }}
                  >
                    {b.eyebrow || "banner"}
                  </span>
                )}
              </div>

              <div className="min-w-[200px] flex-1">
                <p className="text-sm font-bold leading-tight">{b.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-soft">
                  {b.text || "— sem texto de apoio —"}
                </p>
                <p className="mt-1 text-[12px] text-ink-soft">
                  {b.ctaLabel ? `Botão: ${b.ctaLabel} → ${b.ctaHref}` : "Sem botão"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Toggle
                  id={b.id}
                  campo="ativo"
                  valor={b.active}
                  ligado="No ar"
                  desligado="Oculto"
                  tabela="banners"
                  volta="/admin/banners"
                />
                <Link
                  href={`/admin/banners/${b.id}`}
                  className="rounded-full border border-line px-4 py-2 text-[12px] font-bold transition hover:border-ink"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
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
