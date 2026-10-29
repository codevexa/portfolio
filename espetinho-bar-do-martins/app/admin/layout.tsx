import type { Metadata } from "next"
import Link from "next/link"
import { Database } from "lucide-react"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel — Espetinho Bar do Martins" },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="bg-wood flex min-h-dvh items-center justify-center px-4">
        <div className="card-surface flex max-w-lg flex-col gap-4 p-8">
          <Database className="h-10 w-10 text-ouro" />
          <h1 className="section-title text-3xl">Painel ainda não conectado</h1>
          <p className="text-creme/90">
            O painel administrativo precisa do Supabase (banco de dados, login e imagens). Enquanto ele não estiver configurado, o site
            mostra o cardápio inicial em modo somente leitura.
          </p>
          <p className="text-sm text-fumaca">
            Defina <code className="text-ambar">NEXT_PUBLIC_SUPABASE_URL</code> e <code className="text-ambar">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
            aplique as migrations e cadastre um administrador, conforme o README do projeto.
          </p>
          <Link href="/" className="btn btn-ghost self-start">
            Voltar ao site
          </Link>
        </div>
      </div>
    )
  }
  return <div className="min-h-dvh bg-carvao-2">{children}</div>
}
