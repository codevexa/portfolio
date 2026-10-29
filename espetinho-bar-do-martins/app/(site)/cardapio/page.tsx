import type { Metadata } from "next"
import { Suspense } from "react"
import { MenuBrowser } from "@/components/menu/menu-browser"
import { getCatalog } from "@/lib/data"
import { ProductCard } from "@/components/menu/product-card"

export const metadata: Metadata = {
  title: "Cardápio — espetinhos, cachurrascos e carnes na brasa",
  description:
    "Cardápio completo do Espetinho Bar do Martins em Porto Alegre: espetinhos na brasa, cachurrascos de 30 cm, picanha, assado em tiras, porções e combos, com preços.",
  alternates: { canonical: "/cardapio" },
}

export default async function MenuPage() {
  const catalog = await getCatalog()
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <header className="py-10 sm:py-14">
        <p className="eyebrow">Cardápio</p>
        <h1 className="section-title text-5xl sm:text-6xl">
          Escolha na <span className="text-gold-gradient">brasa</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-fumaca">
          Adicione os itens ao pedido, revise no carrinho e envie pelo WhatsApp.
        </p>
      </header>
      {/* Sem JavaScript (ou antes de carregar os filtros), o cardápio aparece completo. */}
      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.products.map((p) => (
              <ProductCard key={p.id} product={p} category={catalog.categories.find((c) => c.id === p.categoryId)} />
            ))}
          </div>
        }
      >
        <MenuBrowser />
      </Suspense>
    </div>
  )
}
