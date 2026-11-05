import "server-only"
import { unstable_cache } from "next/cache"
import { seedCatalog, seedSettings } from "./menu/seed-data"
import { CATEGORY_COLUMNS, PRODUCT_COLUMNS, toCategory, toProduct, toSettings } from "./menu/mappers"
import type { Catalog, Category, Product, Settings } from "./menu/types"
import { isSupabaseConfigured } from "./supabase/env"
import { createPublicClient } from "./supabase/public"

export const CATALOG_TAG = "catalog"
export const SETTINGS_TAG = "settings"

const bySort = <T extends { sortOrder: number; name: string }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "pt-BR")

export function sortCatalog(catalog: Catalog): Catalog {
  return {
    categories: [...catalog.categories].sort(bySort),
    products: [...catalog.products].sort(bySort),
  }
}

async function fetchPublicCatalog(): Promise<Catalog> {
  const db = createPublicClient()
  const [cats, prods] = await Promise.all([
    db.from("categories").select(CATEGORY_COLUMNS),
    db.from("products").select(PRODUCT_COLUMNS),
  ])
  if (cats.error) throw new Error(`Falha ao carregar categorias: ${cats.error.message}`)
  if (prods.error) throw new Error(`Falha ao carregar produtos: ${prods.error.message}`)
  const categories = cats.data.map(toCategory)
  const products = prods.data.map(toProduct).filter((p) => p.variants.length > 0)
  return sortCatalog({ categories, products })
}

async function fetchPublicSettings(): Promise<Settings> {
  const { data, error } = await createPublicClient().from("settings").select("*").eq("id", 1).maybeSingle()
  if (error) throw new Error(`Falha ao carregar configurações: ${error.message}`)
  return data ? toSettings(data) : seedSettings
}

const cachedCatalog = unstable_cache(fetchPublicCatalog, ["catalog"], { tags: [CATALOG_TAG], revalidate: 300 })
const cachedSettings = unstable_cache(fetchPublicSettings, ["settings"], { tags: [SETTINGS_TAG], revalidate: 300 })

/** Cardápio público (somente itens ativos). Sem Supabase, usa o cardápio inicial. */
export async function getCatalog(): Promise<Catalog> {
  if (!isSupabaseConfigured) return sortCatalog(seedCatalog)
  return cachedCatalog()
}

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return seedSettings
  return cachedSettings()
}

export function productsOf(catalog: Catalog, category: Category): Product[] {
  return catalog.products.filter((p) => p.categoryId === category.id)
}
