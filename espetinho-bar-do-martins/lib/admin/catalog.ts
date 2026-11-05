import "server-only"
import { sortCatalog } from "@/lib/data"
import { CATEGORY_COLUMNS, PRODUCT_COLUMNS, toCategory, toProduct, toSettings } from "@/lib/menu/mappers"
import type { Catalog, Settings } from "@/lib/menu/types"
import type { AdminSession } from "./auth"

/** Cardápio completo, inclusive itens e categorias inativos (a RLS libera isso só para admins). */
export async function getAdminCatalog(session: AdminSession): Promise<Catalog> {
  const [cats, prods] = await Promise.all([
    session.supabase.from("categories").select(CATEGORY_COLUMNS),
    session.supabase.from("products").select(PRODUCT_COLUMNS),
  ])
  if (cats.error) throw new Error(`Falha ao carregar categorias: ${cats.error.message}`)
  if (prods.error) throw new Error(`Falha ao carregar produtos: ${prods.error.message}`)
  return sortCatalog({ categories: cats.data.map(toCategory), products: prods.data.map(toProduct) })
}

export async function getAdminSettings(session: AdminSession): Promise<Settings | null> {
  const { data, error } = await session.supabase.from("settings").select("*").eq("id", 1).maybeSingle()
  if (error) throw new Error(`Falha ao carregar configurações: ${error.message}`)
  return data ? toSettings(data) : null
}
