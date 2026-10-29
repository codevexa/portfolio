import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Info } from "lucide-react"
import { requireAdmin } from "@/lib/admin/auth"
import { getAdminCatalog } from "@/lib/admin/catalog"
import { imageUrl } from "@/lib/images"
import { formatBRL } from "@/lib/money"
import { variantLabel } from "@/lib/menu/variants"

export const metadata: Metadata = { title: "Prévia do cardápio" }

export default async function PreviewAdmin() {
  const session = await requireAdmin()
  const catalog = await getAdminCatalog(session)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="section-title text-4xl">Prévia do cardápio</h1>
          <p className="text-fumaca">Inclui itens ocultos e indisponíveis, marcados abaixo. Clientes não veem os ocultos.</p>
        </div>
        <Link href="/cardapio" target="_blank" className="btn btn-gold">
          <ExternalLink className="h-4 w-4" /> Abrir cardápio público
        </Link>
      </div>
      {catalog.categories.map((c) => (
        <section key={c.id} className={c.isActive ? "" : "opacity-60"}>
          <h2 className="section-title mb-1 text-3xl text-ambar">
            {c.name} {!c.isActive && <span className="font-sans text-sm normal-case text-fumaca">(categoria oculta)</span>}
          </h2>
          {c.description && <p className="text-fumaca">{c.description}</p>}
          {c.infoNote && (
            <p className="mt-2 flex gap-2 text-sm">
              <Info className="h-4 w-4 shrink-0 text-ouro" /> {c.infoNote}
            </p>
          )}
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {catalog.products
              .filter((p) => p.categoryId === c.id)
              .map((p) => {
                const src = imageUrl(p.imagePath)
                return (
                  <li key={p.id} className={`card-surface flex gap-3 p-3 ${p.isActive ? "" : "opacity-60"}`}>
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-madeira">
                      {src && <Image src={src} alt="" fill sizes="80px" className="object-cover" unoptimized={src.endsWith(".svg")} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {p.name}
                        {!p.isActive && <span className="ml-2 text-xs text-fumaca">oculto</span>}
                        {!p.isAvailable && <span className="ml-2 text-xs text-[#ff8a99]">indisponível</span>}
                        {p.isNew && <span className="ml-2 text-xs text-pimenta-2">novidade</span>}
                      </p>
                      {p.description && <p className="text-sm text-fumaca">{p.description}</p>}
                      <ul className="mt-1 text-sm">
                        {p.variants.map((v) => (
                          <li key={v.id} className={v.isAvailable ? "" : "line-through opacity-60"}>
                            {variantLabel(v) ? `${variantLabel(v)} — ` : ""}
                            <span className="font-semibold text-ambar">{formatBRL(v.priceCents)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </div>
  )
}
