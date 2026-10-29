import type { Metadata } from "next"
import { CartView } from "@/components/cart/cart-view"

export const metadata: Metadata = {
  title: "Meu pedido",
  robots: { index: false },
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <header className="py-10">
        <p className="eyebrow">Carrinho</p>
        <h1 className="section-title text-5xl">Meu pedido</h1>
      </header>
      <CartView />
    </div>
  )
}
