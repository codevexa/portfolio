import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { ClubBadge } from "@/components/club-badge";
import { getByLeague, getClubsByLeague, getLeague } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const league = await getLeague(id);
  return { title: league?.name ?? "Liga" };
}

export default async function LigaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const league = await getLeague(id);
  if (!league) notFound();

  const [items, teams] = await Promise.all([
    getByLeague(league.id),
    getClubsByLeague(league.id),
  ]);

  return (
    <>
      <PageHeader title={league.name} subtitle={league.blurb} count={items.length} />
      <Section className="py-10">
        {teams.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {teams.map((c) => (
              <Link
                key={c.id}
                href={`/time/${c.id}`}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[13px] font-semibold transition hover:border-ink"
              >
                <ClubBadge name={c.name} logo={c.logo} colors={c.colors} size={18} />
                {c.name}
              </Link>
            ))}
          </div>
        )}
        <ProductGrid products={items} />
      </Section>
    </>
  );
}
