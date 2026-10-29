import Link from "next/link"
import clsx from "clsx"
import { Info, Sparkles } from "lucide-react"
import { formatBRL } from "@/lib/money"
import type { Category, Product } from "@/lib/menu/types"
import { minPrice } from "@/lib/menu/variants"
import { ProductImage } from "./product-image"
import { ProductPurchase } from "./product-purchase"

export function PriceTag({ product, className }: { product: Product; className?: string }) {
  const min = minPrice(product)
  if (min === null) return null
  const varies = new Set(product.variants.map((v) => v.priceCents)).size > 1
  return (
    <p className={clsx("font-display tabular-nums text-ambar", className)}>
      {varies && <span className="mr-1 text-xs font-sans font-semibold uppercase tracking-wide text-fumaca">a partir de</span>}
      <span className="text-2xl font-bold">{formatBRL(min)}</span>
    </p>
  )
}

export function ProductBadges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.isNew && (
        <span className="inline-flex items-center gap-1 rounded-full bg-pimenta px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          <Sparkles className="h-3.5 w-3.5" /> Novidade
        </span>
      )}
      {!product.isAvailable && (
        <span className="rounded-full bg-creme/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-creme">
          Indisponível
        </span>
      )}
    </div>
  )
}

export function ProductCard({ product, category, priority = false }: { product: Product; category?: Category; priority?: boolean }) {
  const launch = product.isNew
  return (
    <article
      className={clsx(
        "group card-surface flex flex-col overflow-hidden transition-shadow hover:shadow-[0_18px_50px_-25px_rgba(232,89,12,0.7)]",
        launch && "border-2! border-pimenta! shadow-[0_0_0_1px_rgba(242,177,52,0.6),0_20px_60px_-30px_rgba(200,16,46,0.9)]",
        !product.isAvailable && "opacity-75",
      )}
      aria-labelledby={`p-${product.id}`}
    >
      <Link href={`/cardapio/${product.slug}`} className="relative block" tabIndex={-1} aria-hidden="true">
        <ProductImage product={product} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" priority={priority} className="aspect-[4/3]" />
        <div className="absolute left-3 top-3">
          <ProductBadges product={product} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 id={`p-${product.id}`} className="font-display text-xl font-semibold uppercase leading-tight tracking-wide">
            <Link href={`/cardapio/${product.slug}`} className="hover:text-ambar">
              {product.name}
            </Link>
          </h3>
          <PriceTag product={product} className="shrink-0 text-right" />
        </div>
        {product.description && <p className="text-[15px] leading-relaxed text-fumaca">{product.description}</p>}
        {category?.infoNote && (
          <p className="flex gap-2 rounded-xl bg-carvao/50 px-3 py-2 text-sm text-creme/90">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ouro" aria-hidden="true" />
            {category.infoNote}
          </p>
        )}
        <div className="mt-auto pt-1">
          <ProductPurchase product={product} compact />
        </div>
      </div>
    </article>
  )
}
