import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Pencil, Plus } from "lucide-react"
import { DeleteButton, MoveButtons, ProductFlags } from "@/components/admin/row-controls"
import { requireAdmin } from "@/lib/admin/auth"
import { getAdminCatalog } from "@/lib/admin/catalog"
import { imageUrl, isIllustration } from "@/lib/images"
import { formatBRL } from "@/lib/money"
import { variantLabel } from "@/lib/menu/variants"

export const metadata: Metadata = { title: "Produtos" }

export default async function ProductsAdmin() {
  const session = await requireAdmin()
  const catalog = await getAdminCatalog(session)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title text-4xl">Produtos</h1>
          <p className="text-fumaca">Alterações aparecem no site assim que são salvas.</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn btn-primary">
          <Plus className="h-5 w-5" /> Novo produto
        </Link>
      </div>

      {catalog.categories.map((c) => {
        const products = catalog.products.filter((p) => p.categoryId === c.id)
        return (
          <section key={c.id} aria-labelledby={`c-${c.id}`} className="flex flex-col gap-3">
            <h2 id={`c-${c.id}`} className="font-display text-2xl uppercase text-ambar">
              {c.name} {!c.isActive && <span className="ml-2 rounded-full bg-creme/15 px-2 py-0.5 align-middle font-sans text-xs text-creme">categoria oculta</span>}
            </h2>
            {products.length === 0 && <p className="text-sm text-fumaca">Nenhum produto nesta categoria.</p>}
            <ul className="flex flex-col gap-3">
              {products.map((p, i) => {
                const src = imageUrl(p.imagePath)
                return (
                  <li key={p.id} className={`card-surface flex flex-col gap-4 p-4 ${p.isActive ? "" : "opacity-70"}`}>
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-madeira">
                        {src && <Image src={src} alt="" fill sizes="80px" className="object-cover" unoptimized={src.endsWith(".svg")} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{p.name}</h3>
                        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          {p.variants.map((v) => (
                            <li key={v.id} className={v.isAvailable ? "text-creme/90" : "text-fumaca line-through"}>
                              {variantLabel(v) && <span className="text-fumaca">{variantLabel(v)}: </span>}
                              <span className="font-semibold text-ambar tabular-nums">{formatBRL(v.priceCents)}</span>
                            </li>
                          ))}
                        </ul>
                        {isIllustration(p.imagePath) && <p className="mt-1 text-xs text-fumaca">Usando ilustração provisória</p>}
                      </div>
                    </div>
                    <ProductFlags id={p.id} flags={p} />
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-creme/10 pt-3">
                      <MoveButtons kind="product" id={p.id} first={i === 0} last={i === products.length - 1} />
                      <div className="flex flex-wrap gap-2">
                        <DeleteButton kind="product" id={p.id} name={p.name} />
                        <Link href={`/admin/produtos/${p.id}`} className="btn btn-gold min-h-10! px-4! text-sm">
                          <Pencil className="h-4 w-4" /> Editar
                        </Link>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
