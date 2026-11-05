"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useStore } from "@/components/cart/store"

/** "Fazer meu pedido": vai ao carrinho se já houver itens; senão, ao cardápio para escolher. */
export function OrderCta({ className = "btn btn-primary text-lg" }: { className?: string }) {
  const { cart, hydrated } = useStore()
  const hasItems = hydrated && cart.itemCount > 0
  return (
    <Link href={hasItems ? "/carrinho" : "/cardapio"} className={className}>
      <ShoppingBag className="h-5 w-5" /> Fazer meu pedido
    </Link>
  )
}
