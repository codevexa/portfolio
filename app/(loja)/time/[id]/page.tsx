import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { ProductGrid } from "@/components/product-grid";
import { ClubBadge } from "@/components/club-badge";
import { getByClub, getClub, getLeague } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const club = await getClub(id);
  return { title: club?.name ?? "Time" };
}

export default async function TimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const club = await getClub(id);
  if (!club) notFound();

  const [items, league] = await Promise.all([
    getByClub(club.id),
    club.league ? getLeague(club.league) : Promise.resolve(null),
  ]);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-10">
          <ClubBadge name={club.name} logo={club.logo} colors={club.colors} size={56} />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {club.name}
            </h1>
            {league && <p className="mt-1 text-sm text-ink-soft">{league.name}</p>}
            <p className="mt-2 text-[13px] font-semibold text-gold-deep">
              {items.length} {items.length === 1 ? "produto" : "produtos"}
            </p>
          </div>
        </div>
      </div>
      <Section className="py-10">
        <ProductGrid products={items} />
      </Section>
    </>
  );
}
