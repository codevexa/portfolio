import type { Metadata } from "next"
import { Checkout } from "@/components/cart/checkout"

export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <header className="py-10">
        <p className="eyebrow">Finalização</p>
        <h1 className="section-title text-5xl">Finalizar pedido</h1>
      </header>
      <Checkout />
    </div>
  )
}
