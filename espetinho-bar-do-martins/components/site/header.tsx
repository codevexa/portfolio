"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"
import clsx from "clsx"
import { useStore } from "@/components/cart/store"
import { WhatsAppIcon } from "@/components/ui/icons"
import { whatsappLink } from "@/lib/whatsapp"
import { Logo } from "./logo"

const NAV = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/#sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
]

export function Header() {
  const { settings, cart, hydrated } = useStore()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const count = hydrated ? cart.itemCount : 0

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-40 border-b border-ouro/10 bg-carvao/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20">
        <Logo name={settings.businessName} logoPath={settings.logoPath} />

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "rounded-full px-4 py-2 font-display text-[15px] uppercase tracking-wider transition-colors",
                isActive(item.href) ? "text-ambar" : "text-creme/85 hover:text-ambar",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink(settings.whatsappNumber, `Olá! Vim pelo site do ${settings.businessName}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp hidden min-h-11! lg:inline-flex"
          >
            <WhatsAppIcon className="h-5 w-5" /> Pedir pelo WhatsApp
          </a>
          <Link
            href="/carrinho"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-creme/20 hover:border-ouro"
            aria-label={count ? `Carrinho com ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho vazio"}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-pimenta px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-creme/20 md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" className="bg-wood fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col gap-2 p-4 md:hidden">
          <nav aria-label="Menu" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-creme/10 py-4 font-display text-2xl uppercase tracking-wide hover:text-ambar"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href={whatsappLink(settings.whatsappNumber, `Olá! Vim pelo site do ${settings.businessName}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-4"
          >
            <WhatsAppIcon className="h-5 w-5" /> Pedir pelo WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
