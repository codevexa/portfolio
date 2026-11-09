import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/section";
import { KitImage } from "@/components/kit-image";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductRail } from "@/components/product-rail";
import { SectionHeading } from "@/components/section-heading";
import { brl, site } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { discountPercent, soldOut, stockTotal } from "@/lib/products";
import {
  getByClub,
  getLeague,
  getProductBySlug,
  getReadyToShip,
  getTexts,
} from "@/lib/db";
import { aplicar } from "@/lib/texts";
import { ClubBadge } from "@/components/club-badge";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Produto não encontrado" };
  return {
    title: p.name,
    description: `${p.name} por ${brl(p.price)} na ${site.name}. Envio para todo o Brasil com rastreio.`,
    openGraph: p.image ? { images: [p.image] } : undefined,
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const club = product.club;
  const [settings, league, relacionados, t] = await Promise.all([
    getSettings(),
    product.league ? getLeague(product.league) : Promise.resolve(null),
    club ? getByClub(club.id) : getReadyToShip(),
    getTexts(),
  ]);
  const off = discountPercent(product);
  const esgotado = soldOut(product);
  const emEstoque = stockTotal(product);
  const related = relacionados.filter((p) => p.id !== product.id).slice(0, 12);

  return (
    <>
      <Section className="py-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-soft">
          <Link href="/" className="hover:text-ink">
            Início
          </Link>
          <span>/</span>
          {league && (
            <>
              <Link href={`/liga/${league.id}`} className="hover:text-ink">
                {league.name}
              </Link>
              <span>/</span>
            </>
          )}
          {club && (
            <>
              <Link href={`/time/${club.id}`} className="hover:text-ink">
                {club.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>
      </Section>

      <Section className="pb-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8">
            {off !== null && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">
                -{off}%
              </span>
            )}
            {esgotado ? (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-bold text-white">
                {t["produto.selo_esgotado"]}
              </span>
            ) : (
              product.readyToShip && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-ink">
                  {t["produto.selo_pronta"]}
                </span>
              )
            )}
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="mx-auto h-auto w-full max-w-md object-contain"
                priority
              />
            ) : (
              <KitImage
                product={product}
                className="mx-auto h-auto w-full max-w-md"
              />
            )}
          </div>

          <div>
            <div className="flex items-start gap-3">
              {club && (
                <ClubBadge
                  name={club.name}
                  logo={club.logo}
                  colors={club.colors}
                  size={38}
                />
              )}
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {product.name}
              </h1>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[13px] text-ink-soft">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#f5a623">
                    <path d="m12 17.3-6.2 3.7 1.7-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.5 4.8 1.7 7z" />
                  </svg>
                ))}
              </span>
              <span className="ml-1">{t["produto.avaliacao"]}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              {product.oldPrice && (
                <span className="text-base text-ink-soft line-through">
                  {brl(product.oldPrice)}
                </span>
              )}
              <span className="text-4xl font-extrabold tracking-tight">
                {brl(product.price)}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] text-ink-soft">
              {t["produto.pagamento"]}
            </p>

            {emEstoque !== null && emEstoque > 0 && emEstoque <= 5 && (
              <p className="mt-2 text-[13px] font-bold text-gold-deep">
                {aplicar(t["produto.estoque_baixo"], { n: emEstoque })}
              </p>
            )}

            {product.description && (
              <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
                {product.description}
              </p>
            )}

            <div className="mt-7 border-t border-line pt-7">
              <AddToCart
                product={product}
                whatsapp={settings.whatsapp}
                loja={settings.storeName}
                textos={t}
              />
            </div>

            <ul className="mt-8 space-y-2.5 border-t border-line pt-7">
              {[
                esgotado
                  ? t["produto.bullet_esgotado"]
                  : product.readyToShip
                    ? t["produto.bullet_estoque"]
                    : t["produto.bullet_encomenda"],
                t["produto.bullet_envio"],
                t["produto.bullet_troca"],
                t["produto.bullet_pagamento"],
              ].map((linha) => (
                <li key={linha} className="flex items-start gap-2.5 text-[13px]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-gold-deep)"
                    strokeWidth="2.6"
                    className="mt-0.5 shrink-0"
                  >
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {linha}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="pb-16">
          <SectionHeading
            title={t["produto.relacionados"]}
            href={club ? `/time/${club.id}` : "/pronta-entrega"}
          />
          <ProductRail products={related} />
        </Section>
      )}
    </>
  );
}
