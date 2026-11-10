import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { ProductRail } from "@/components/product-rail";
import { ClubGrid } from "@/components/club-grid";
import { CollectionCards } from "@/components/collection-cards";
import { Feedback } from "@/components/feedback";
import { TrustRow } from "@/components/trust-row";
import { Faq } from "@/components/faq";
import {
  getAllProducts,
  getBanners,
  getFeaturedCategories,
  getFeaturedClubs,
  getLeagues,
  getTexts,
} from "@/lib/db";

export const revalidate = 60;

export default async function HomePage() {
  const [all, banners, featured, leagues, categorias, t] = await Promise.all([
    getAllProducts(),
    getBanners(),
    getFeaturedClubs(),
    getLeagues(),
    getFeaturedCategories(),
    getTexts(),
  ]);

  return (
    <>
      {banners.length > 0 && (
        <div className="py-6">
          <HeroCarousel banners={banners} />
        </div>
      )}

      <Section className="py-6">
        <SectionHeading
          title={t["home.destaques.titulo"]}
          subtitle={t["home.destaques.sub"]}
          href="/catalogo"
        />
        <ProductRail products={all.slice(0, 18)} />
        {all.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/catalogo"
              className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold tracking-wide text-white transition hover:bg-ink/85"
            >
              {t["home.destaques.botao"]}
            </Link>
          </div>
        )}
      </Section>

      {featured.map((club) => {
        const items = all.filter((p) => p.clubId === club.id);
        if (items.length === 0) return null;
        return (
          <Section key={club.id} className="py-6">
            <SectionHeading title={club.name} href={`/time/${club.id}`} />
            <ProductRail products={items} />
          </Section>
        );
      })}

      <Section className="py-10">
        <SectionHeading
          title={t["home.times.titulo"]}
          subtitle={t["home.times.sub"]}
        />
        <ClubGrid />
      </Section>

      {categorias.length > 0 && (
        <Section className="py-6">
          <SectionHeading
            title={t["home.categorias.titulo"]}
            subtitle={t["home.categorias.sub"]}
          />
          <CollectionCards
            cards={categorias.map((c) => ({
              href: `/categoria/${c.id}`,
              title: c.name,
              cta: t["home.categorias.cta"],
              from: c.from,
              to: c.to,
            }))}
          />
        </Section>
      )}

      {leagues.length > 0 && (
        <Section className="py-10">
          <SectionHeading
            title={t["home.ligas.titulo"]}
            subtitle={t["home.ligas.sub"]}
          />
          <CollectionCards
            cards={leagues.map((l) => ({
              href: `/liga/${l.id}`,
              title: l.name,
              cta: t["home.ligas.cta"],
              from: l.from,
              to: l.to,
            }))}
          />
        </Section>
      )}

      <Section className="py-10">
        <SectionHeading
          title={t["home.feedback.titulo"]}
          subtitle={t["home.feedback.sub"]}
        />
        <Feedback />
      </Section>

      <TrustRow />

      <Section className="py-14">
        <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t["home.faq.titulo"]}
        </h2>
        <Faq />
      </Section>
    </>
  );
}
