"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Eye, House, LayoutGrid, Settings, Tags } from "lucide-react"
import clsx from "clsx"

const LINKS = [
  { href: "/admin", label: "Início", icon: House },
  { href: "/admin/produtos", label: "Produtos", icon: LayoutGrid },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/previa", label: "Prévia", icon: Eye },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Painel" className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold",
              active ? "bg-ouro text-carvao" : "text-creme/85 hover:bg-creme/10",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        )
      })}
    </nav>
  )
}
