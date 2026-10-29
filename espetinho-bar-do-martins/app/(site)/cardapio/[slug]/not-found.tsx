import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-brasa/15 text-brasa">
        <UtensilsCrossed className="h-8 w-8" />
      </span>
      <h1 className="section-title text-4xl">Produto indisponível ou não encontrado</h1>
      <p className="text-lg text-fumaca">
        Este item pode ter saído do cardápio ou estar temporariamente indisponível. Veja as outras opções da brasa.
      </p>
      <Link href="/cardapio" className="btn btn-gold">
        Ver cardápio completo
      </Link>
    </div>
  )
}
