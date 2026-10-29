import type { Metadata } from "next"
import { CategoryForm } from "@/components/admin/category-form"
import { CategoryActiveSwitch, DeleteButton, MoveButtons } from "@/components/admin/row-controls"
import { requireAdmin } from "@/lib/admin/auth"
import { getAdminCatalog } from "@/lib/admin/catalog"

export const metadata: Metadata = { title: "Categorias" }

export default async function CategoriesAdmin() {
  const session = await requireAdmin()
  const catalog = await getAdminCatalog(session)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title text-4xl">Categorias</h1>
        <p className="text-fumaca">A ordem aqui é a ordem do cardápio. Só é possível excluir categorias sem produtos.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {catalog.categories.map((c, i) => {
          const count = catalog.products.filter((p) => p.categoryId === c.id).length
          return (
            <li key={c.id} className="card-surface flex flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl uppercase text-ambar">{c.name}</h2>
                  <p className="text-sm text-fumaca">{count} produto(s) · /cardapio?categoria={c.slug}</p>
                </div>
                <MoveButtons kind="category" id={c.id} first={i === 0} last={i === catalog.categories.length - 1} />
              </div>
              <CategoryActiveSwitch id={c.id} active={c.isActive} />
              <details className="rounded-xl border border-creme/10 p-3">
                <summary className="min-h-9 cursor-pointer font-semibold text-fumaca hover:text-ambar">Editar categoria</summary>
                <div className="mt-3">
                  <CategoryForm category={c} />
                </div>
              </details>
              {count === 0 && <DeleteButton kind="category" id={c.id} name={c.name} />}
            </li>
          )
        })}
      </ul>

      <section className="card-surface p-5" aria-labelledby="nova-categoria">
        <h2 id="nova-categoria" className="mb-3 font-display text-2xl uppercase">Nova categoria</h2>
        <CategoryForm />
      </section>
    </div>
  )
}
