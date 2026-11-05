import type { Metadata } from "next"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"
import { requireAdmin } from "@/lib/admin/auth"
import { getAdminCatalog } from "@/lib/admin/catalog"

export const metadata: Metadata = { title: "Novo produto" }

export default async function NewProductPage() {
  const session = await requireAdmin()
  const { categories } = await getAdminCatalog(session)
  if (categories.length === 0) {
    return (
      <div className="card-surface flex flex-col gap-3 p-6">
        <p>Crie uma categoria antes de cadastrar produtos.</p>
        <Link href="/admin/categorias" className="btn btn-gold self-start">Ir para categorias</Link>
      </div>
    )
  }
  return <ProductForm categories={categories} />
}
