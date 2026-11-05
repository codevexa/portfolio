import Link from "next/link"
import { BrandMark } from "@/components/ui/icons"

export function ErrorView({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="bg-ember flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-4 py-20 text-center">
      <BrandMark className="h-20 w-20" />
      <h1 className="section-title text-4xl sm:text-5xl">{title}</h1>
      <p className="max-w-md text-lg text-fumaca">{message}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {action}
        <Link href="/" className="btn btn-ghost">
          Página inicial
        </Link>
        <Link href="/cardapio" className="btn btn-gold">
          Ver cardápio
        </Link>
      </div>
    </div>
  )
}
