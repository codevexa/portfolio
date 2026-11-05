import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Clock, Flame, MapPin, Navigation, Sandwich, Sparkles, UtensilsCrossed } from "lucide-react"
import { ProductCard } from "@/components/menu/product-card"
import { ProductImage } from "@/components/menu/product-image"
import { OrderCta } from "@/components/site/order-cta"
import { HoursList } from "@/components/site/hours"
import { RestaurantJsonLd } from "@/components/site/json-ld"
import { WhatsAppIcon } from "@/components/ui/icons"
import { getCatalog, getSettings, productsOf } from "@/lib/data"
import { fullAddress, mapsLink } from "@/lib/maps"
import { formatBRL } from "@/lib/money"
import type { Product } from "@/lib/menu/types"
import { variantGroups } from "@/lib/menu/variants"
import { whatsappLink } from "@/lib/whatsapp"

export default async function HomePage() {
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()])
  const categoryOf = (p: Product) => catalog.categories.find((c) => c.id === p.categoryId)
  const cachCategory = catalog.categories.find((c) => c.isHighlighted) ?? catalog.categories.find((c) => c.slug === "cachurrascos")
  // A categoria em destaque (cachurrascos) tem seção própria logo abaixo.
  const featured = catalog.products.filter((p) => p.isFeatured && !p.isNew && p.categoryId !== cachCategory?.id).slice(0, 6)
  const cachProducts = cachCategory ? productsOf(catalog, cachCategory) : []
  const comboProduct = cachProducts.find((p) => variantGroups(p).length > 1)
  const launches = catalog.products.filter((p) => p.isNew)
  const maps = mapsLink(settings)
  const heroProduct = comboProduct ?? featured[0]

  return (
    <>
      <RestaurantJsonLd settings={settings} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <Image src="/img/hero-brasa.svg" alt="" fill priority unoptimized className="-z-20 object-cover object-[70%_center] opacity-60" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,8,6,0.92)_0%,rgba(12,8,6,0.55)_55%,rgba(12,8,6,0.35)_100%),linear-gradient(180deg,transparent_60%,#0c0806_100%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
          <div className="animate-rise flex flex-col gap-6">
            <p className="eyebrow flex items-center gap-2">
              <Flame className="h-4 w-4" aria-hidden="true" /> Espetaria em {settings.city}
            </p>
            <h1 className="section-title text-[clamp(2.6rem,9vw,5.2rem)] font-bold">
              O sabor da <span className="text-gold-gradient">brasa</span> que conquista!
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-creme/90 sm:text-xl">
              Espetinhos, carnes e cachurrascos preparados para deixar tua fome com vontade de mais.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/cardapio" className="btn btn-gold text-lg">
                Ver cardápio <ChevronRight className="h-5 w-5" />
              </Link>
              <OrderCta />
            </div>
          </div>

          {heroProduct && (
            <Link
              href={`/cardapio/${heroProduct.slug}`}
              className="group card-surface animate-rise hidden overflow-hidden bg-madeira! shadow-[0_30px_80px_-30px_rgba(232,89,12,0.8)] sm:block"
            >
              <ProductImage product={heroProduct} sizes="(min-width: 1024px) 40vw, 90vw" priority className="aspect-[4/3]" />
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <p className="eyebrow">Destaque da casa</p>
                  <p className="font-display text-2xl uppercase">{heroProduct.name}</p>
                </div>
                <p className="text-right">
                  <span className="block text-xs uppercase text-fumaca">a partir de</span>
                  <span className="font-display text-2xl font-bold text-ambar">
                    {formatBRL(Math.min(...heroProduct.variants.map((v) => v.priceCents)))}
                  </span>
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* DESTAQUES */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20" aria-labelledby="destaques">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Direto da churrasqueira</p>
              <h2 id="destaques" className="section-title text-4xl sm:text-5xl">
                Os mais pedidos <span className="text-gold-gradient">da brasa</span>
              </h2>
            </div>
            <Link href="/cardapio" className="btn btn-ghost">
              Cardápio completo <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} category={categoryOf(p)} />
            ))}
          </div>
        </section>
      )}

      {/* CACHURRASCOS */}
      {cachCategory && cachProducts.length > 0 && (
        <section className="bg-wood relative overflow-hidden border-y border-ouro/20" aria-labelledby="cachurrascos">
          <div className="bg-ember absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-5">
                <p className="eyebrow flex items-center gap-2">
                  <Sandwich className="h-4 w-4" aria-hidden="true" /> 30 cm de churrasco
                </p>
                <h2 id="cachurrascos" className="section-title text-5xl sm:text-6xl">
                  <span className="text-gold-gradient">{cachCategory.name}</span>
                </h2>
                {cachCategory.description && <p className="text-lg text-creme/90">{cachCategory.description}</p>}
                {cachCategory.infoNote && (
                  <div className="rounded-2xl border border-ouro/30 bg-carvao/50 p-4">
                    <p className="mb-2 font-display uppercase tracking-wide text-ambar">Recheio de todos os cachurrascos</p>
                    <p className="text-creme/90">{cachCategory.infoNote}</p>
                  </div>
                )}
                {comboProduct && <PriceTable product={comboProduct} />}
                {comboProduct && (
                  <Link href={`/cardapio/${comboProduct.slug}`} className="btn btn-primary self-start text-lg">
                    Montar meu cachurrasco <ChevronRight className="h-5 w-5" />
                  </Link>
                )}
              </div>

              <div className="flex flex-col gap-5">
                {launches.map((p) => (
                  <ProductCard key={p.id} product={p} category={categoryOf(p)} />
                ))}
                {launches.length === 0 && comboProduct && <ProductCard product={comboProduct} category={cachCategory} />}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20" aria-labelledby="diferenciais">
        <p className="eyebrow">Por que pedir aqui</p>
        <h2 id="diferenciais" className="section-title mb-8 text-4xl sm:text-5xl">
          Feito na <span className="text-gold-gradient">brasa</span>
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Flame, title: "Na brasa", text: "Espetinhos e carnes assados na brasa." },
            { icon: Sandwich, title: "Cachurrascos de 30 cm", text: "Pão tradicional ou parmesão, com 1, 2 ou 3 espetinhos." },
            { icon: Sparkles, title: "Maionese verde da casa", text: "No recheio dos cachurrascos e nos espetinhos especiais." },
            { icon: WhatsAppIcon, title: "Pedido pelo WhatsApp", text: "Monte o pedido no site e envie a mensagem pronta." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="card-surface flex flex-col gap-3 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brasa/15 text-brasa">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl uppercase tracking-wide">{title}</h3>
              <p className="text-fumaca">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-24 border-t border-creme/10" aria-labelledby="sobre-titulo">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Sobre nós</p>
            <h2 id="sobre-titulo" className="section-title text-4xl sm:text-5xl">
              {settings.businessName}
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-lg leading-relaxed text-creme/90">
            {(settings.aboutText ?? "").split(/\n+/).filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <Link href="/cardapio" className="btn btn-ghost self-start">
              <UtensilsCrossed className="h-5 w-5" /> Conheça o cardápio
            </Link>
          </div>
        </div>
      </section>

      {/* HORÁRIO E LOCALIZAÇÃO */}
      <section className="bg-wood border-t border-ouro/15" aria-labelledby="visite">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:py-20 md:grid-cols-2">
          <div className="card-surface flex flex-col gap-4 p-6">
            <h2 id="visite" className="section-title flex items-center gap-2 text-3xl">
              <Clock className="h-6 w-6 text-ouro" /> Horário
            </h2>
            <HoursList hours={settings.openingHours} />
          </div>
          <div className="card-surface flex flex-col gap-4 p-6">
            <h2 className="section-title flex items-center gap-2 text-3xl">
              <MapPin className="h-6 w-6 text-ouro" /> Onde estamos
            </h2>
            {settings.addressConfirmed && settings.addressLine ? (
              <p className="text-lg">{fullAddress(settings)}</p>
            ) : (
              <p className="text-lg">
                {settings.city} - {settings.state}
                <span className="mt-1 block text-base text-fumaca">Peça o endereço completo pelo WhatsApp.</span>
              </p>
            )}
            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              {maps && (
                <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  <Navigation className="h-5 w-5" /> Como chegar
                </a>
              )}
              <a
                href={whatsappLink(settings.whatsappNumber, `Olá! Vim pelo site do ${settings.businessName}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" /> {settings.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/** Tabela pão × quantidade de espetinhos montada a partir das variações cadastradas. */
function PriceTable({ product }: { product: Product }) {
  const groups = variantGroups(product)
  const names = [...new Set(product.variants.map((v) => v.name))]
  return (
    <div className="overflow-hidden rounded-2xl border border-ouro/25">
      <table className="w-full text-left">
        <caption className="sr-only">Preços do {product.name} por tipo de pão e quantidade de espetinhos</caption>
        <thead className="bg-carvao/70 font-display uppercase tracking-wide">
          <tr>
            <th scope="col" className="px-3 py-3 text-sm text-fumaca sm:px-4">{product.variantLabel ?? ""}</th>
            {groups.map((g) => (
              <th key={g} scope="col" className="px-3 py-3 text-right text-sm text-ambar sm:px-4">
                {g}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={n} className="border-t border-creme/10">
              <th scope="row" className="px-3 py-3 font-semibold sm:px-4">{n}</th>
              {groups.map((g) => {
                const v = product.variants.find((x) => (x.groupName ?? "") === g && x.name === n)
                return (
                  <td key={g} className="px-3 py-3 text-right font-display text-xl font-bold tabular-nums text-ambar sm:px-4">
                    {v ? formatBRL(v.priceCents) : "—"}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
