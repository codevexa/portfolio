import type { Metadata } from "next"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"
import { requireAdmin } from "@/lib/admin/auth"
import { getAdminCatalog } from "@/lib/admin/catalog"

export const metadata: Metadata = { title: "Editar produto" }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ criado?: string }> }

export default async function EditProductPage({ params, searchParams }: Props) {
  const [{ id }, { criado }] = await Promise.all([params, searchParams])
  const session = await requireAdmin()
  const { categories, products } = await getAdminCatalog(session)
  const product = products.find((p) => p.id === id)
  if (!product) {
    return (
      <div className="card-surface flex flex-col gap-3 p-6">
        <h1 className="section-title text-3xl">Produto não encontrado</h1>
        <p className="text-fumaca">Ele pode ter sido excluído.</p>
        <Link href="/admin/produtos" className="btn btn-gold self-start">Voltar aos produtos</Link>
      </div>
    )
  }
  return <ProductForm product={product} categories={categories} created={criado === "1"} />
}
