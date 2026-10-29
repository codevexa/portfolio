"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleCheck, ShoppingBag, TriangleAlert } from "lucide-react"
import clsx from "clsx"
import { useStore } from "@/components/cart/store"
import { WhatsAppIcon } from "@/components/ui/icons"
import { formatBRL } from "@/lib/money"
import { whatsappLink } from "@/lib/whatsapp"

/** Barra inferior do carrinho (celular), botão flutuante do WhatsApp e aviso de item adicionado. */
export function FloatingUi() {
  const { cart, hydrated, settings, toast } = useStore()
  const pathname = usePathname()
  const onCartFlow = pathname === "/carrinho" || pathname === "/finalizar"
  const showBar = hydrated && cart.itemCount > 0 && !onCartFlow

  return (
    <>
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ouro/20 bg-carvao/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <Link href="/carrinho" className="btn btn-primary w-full justify-between! px-5!">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Ver pedido · {cart.itemCount} {cart.itemCount === 1 ? "item" : "itens"}
            </span>
            <span className="tabular-nums">{formatBRL(cart.subtotalCents)}</span>
          </Link>
        </div>
      )}

      {!onCartFlow && (
        <a
          href={whatsappLink(settings.whatsappNumber, `Olá! Vim pelo site do ${settings.businessName}.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar pelo WhatsApp"
          className={clsx(
            "fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-[0_10px_30px_-8px_rgba(31,168,85,0.8)] transition-transform hover:scale-105",
            showBar ? "bottom-24 md:bottom-6" : "bottom-6",
          )}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 sm:top-24">
        {toast && (
          <p
            key={toast.id}
            role="status"
            className={clsx(
              "animate-rise pointer-events-auto flex max-w-md items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl",
              toast.tone === "success" ? "bg-creme text-carvao" : "bg-pimenta text-white",
            )}
          >
            {toast.tone === "success" ? <CircleCheck className="h-5 w-5 shrink-0 text-[#1f8a4c]" /> : <TriangleAlert className="h-5 w-5 shrink-0" />}
            {toast.message}
          </p>
        )}
      </div>
    </>
  )
}
