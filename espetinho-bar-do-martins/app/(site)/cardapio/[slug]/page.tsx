import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Info } from "lucide-react"
import { ProductBadges, ProductCard, PriceTag } from "@/components/menu/product-card"
import { ProductImage } from "@/components/menu/product-image"
import { ProductPurchase } from "@/components/menu/product-purchase"
import { getCatalog } from "@/lib/data"
import { imageUrl } from "@/lib/images"
import { formatBRL } from "@/lib/money"
import { variantLabel } from "@/lib/menu/variants"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const catalog = await getCatalog()
  return catalog.products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const catalog = await getCatalog()
  const product = catalog.products.find((p) => p.slug === slug)
  if (!product) return { title: "Produto não encontrado", robots: { index: false } }
  const prices = product.variants.map((v) => v.priceCents)
  const description = `${product.description ?? product.name} A partir de ${formatBRL(Math.min(...prices))}. Peça pelo WhatsApp — Espetinho Bar do Martins, Porto Alegre.`
  const img = imageUrl(product.imagePath)
  return {
    title: product.name,
    description,
    alternates: { canonical: `/cardapio/${product.slug}` },
    // Ilustrações SVG não aparecem em prévias do WhatsApp; nesse caso vale a imagem padrão do site.
    openGraph: { title: product.name, description, ...(img && !img.endsWith(".svg") ? { images: [img] } : {}) },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const catalog = await getCatalog()
  const product = catalog.products.find((p) => p.slug === slug)
  if (!product) notFound()
  const category = catalog.categories.find((c) => c.id === product.categoryId)
  const related = catalog.products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3)
  const showVariantList = product.variants.length > 1

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6">
      <nav aria-label="Trilha" className="mb-6 text-sm text-fumaca">
        <Link href={category ? `/cardapio?categoria=${category.slug}` : "/cardapio"} className="inline-flex min-h-11 items-center gap-2 hover:text-ambar">
          <ArrowLeft className="h-4 w-4" /> Voltar para {category?.name ?? "o cardápio"}
        </Link>
      </nav>

      <article className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative">
          <ProductImage product={product} sizes="(min-width: 1024px) 50vw, 100vw" priority className="aspect-[4/3] rounded-3xl border border-ouro/15" />
          <div className="absolute left-4 top-4">
            <ProductBadges product={product} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {category && <p className="eyebrow">{category.name}</p>}
          <h1 className="section-title text-4xl sm:text-5xl">{product.name}</h1>
          <PriceTag product={product} />
          {product.description && <p className="text-lg leading-relaxed text-creme/90">{product.description}</p>}
          {product.details && (
            <div>
              <h2 className="label">Ingredientes e informações</h2>
              <p className="whitespace-pre-line text-creme/90">{product.details}</p>
            </div>
          )}
          {category?.infoNote && (
            <p className="flex gap-2 rounded-2xl border border-ouro/25 bg-madeira/60 px-4 py-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-ouro" aria-hidden="true" />
              {category.infoNote}
            </p>
          )}

          {showVariantList && (
            <div className="rounded-2xl border border-creme/10">
              <h2 className="border-b border-creme/10 px-4 py-3 font-display uppercase tracking-wide text-fumaca">Opções e preços</h2>
              <ul>
                {product.variants.map((v) => (
                  <li key={v.id} className="flex justify-between gap-4 border-b border-creme/5 px-4 py-2.5 last:border-0">
                    <span className={v.isAvailable ? "" : "text-fumaca line-through"}>{variantLabel(v)}</span>
                    <span className="font-semibold tabular-nums text-ambar">{v.isAvailable ? formatBRL(v.priceCents) : "Indisponível"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-surface p-4 sm:p-5">
            <ProductPurchase product={product} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="relacionados">
          <h2 id="relacionados" className="section-title mb-6 text-3xl">
            Mais em {category?.name}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} category={category} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
