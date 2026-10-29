import Link from "next/link"
import { ExternalLink, LogOut } from "lucide-react"
import { AdminNav } from "@/components/admin/nav"
import { BrandMark } from "@/components/ui/icons"
import { requireAdmin } from "@/lib/admin/auth"
import { signOut } from "../actions"

export const dynamic = "force-dynamic"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin()
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ouro/10 bg-carvao/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <BrandMark className="h-9 w-9" />
              <span className="font-display text-lg uppercase tracking-wide">Painel</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-fumaca sm:inline">{user.email}</span>
              <Link href="/" target="_blank" className="btn btn-ghost min-h-10! px-3! text-sm" aria-label="Abrir o site em nova aba">
                <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">Ver site</span>
              </Link>
              <form action={signOut}>
                <button type="submit" className="btn btn-ghost min-h-10! px-3! text-sm">
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-20">{children}</main>
    </>
  )
}
