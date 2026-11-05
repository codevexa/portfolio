"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Info, Search, X } from "lucide-react"
import { useStore } from "@/components/cart/store"
import { ProductCard } from "./product-card"

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()

export function MenuBrowser() {
  const { catalog } = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("busca") ?? "")
  const [category, setCategory] = useState(params.get("categoria") ?? "")
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  function syncUrl(next: { busca?: string; categoria?: string }) {
    const sp = new URLSearchParams()
    const b = next.busca ?? query
    const c = next.categoria ?? category
    if (b.trim()) sp.set("busca", b.trim())
    if (c) sp.set("categoria", c)
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const sections = useMemo(() => {
    const q = normalize(query)
    return catalog.categories
      .filter((c) => !category || c.slug === category)
      .map((c) => ({
        category: c,
        products: catalog.products.filter(
          (p) =>
            p.categoryId === c.id &&
            (!onlyAvailable || p.isAvailable) &&
            (!q ||
              normalize(`${p.name} ${p.description ?? ""} ${p.details ?? ""} ${c.name} ${p.variants.map((v) => `${v.groupName ?? ""} ${v.name}`).join(" ")}`).includes(q)),
        ),
      }))
      .filter((s) => s.products.length > 0)
  }, [catalog, query, category, onlyAvailable])

  const total = sections.reduce((n, s) => n + s.products.length, 0)

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-creme/10 bg-carvao/90 px-4 pb-3 pt-3 backdrop-blur-md sm:top-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-80">
            <label htmlFor="busca" className="sr-only">Buscar no cardápio</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fumaca" aria-hidden="true" />
            <input
              id="busca"
              type="search"
              inputMode="search"
              className="field pl-11!"
              placeholder="Buscar: frango, picanha, parmesão…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => syncUrl({})}
              onKeyDown={(e) => e.key === "Enter" && syncUrl({})}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  syncUrl({ busca: "" })
                }}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-fumaca hover:text-creme"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label="Filtrar por categoria">
            <button
              type="button"
              className="chip"
              aria-pressed={!category}
              onClick={() => {
                setCategory("")
                syncUrl({ categoria: "" })
              }}
            >
              Todos
            </button>
            {catalog.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={category === c.slug}
                onClick={() => {
                  setCategory(c.slug)
                  syncUrl({ categoria: c.slug })
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <label className="mt-2 inline-flex min-h-9 cursor-pointer items-center gap-2 text-sm text-fumaca">
          <input type="checkbox" className="h-4 w-4 accent-[var(--color-ouro)]" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          Mostrar só itens disponíveis
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
      </p>

      {sections.length === 0 ? (
        <div className="card-surface mt-10 flex flex-col items-center gap-3 p-10 text-center">
          <p className="font-display text-2xl uppercase">Nada encontrado</p>
          <p className="text-fumaca">Tente outra palavra ou veja todas as categorias.</p>
          <button
            type="button"
            className="btn btn-ghost mt-2"
            onClick={() => {
              setQuery("")
              setCategory("")
              setOnlyAvailable(false)
              syncUrl({ busca: "", categoria: "" })
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-14 pt-8">
          {sections.map(({ category: c, products }, si) => (
            <section key={c.id} id={c.slug} className="scroll-mt-48" aria-labelledby={`cat-${c.slug}`}>
              <div className="mb-5 flex flex-col gap-2">
                <h2 id={`cat-${c.slug}`} className={`section-title ${c.isHighlighted ? "text-gold-gradient text-5xl" : "text-4xl"}`}>
                  {c.name}
                </h2>
                {c.description && <p className="max-w-2xl text-fumaca">{c.description}</p>}
                {c.infoNote && (
                  <p className="flex max-w-2xl gap-2 rounded-xl border border-ouro/25 bg-madeira/60 px-4 py-3 text-creme/90">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-ouro" aria-hidden="true" />
                    {c.infoNote}
                  </p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} category={c} priority={si === 0 && i < 2} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
