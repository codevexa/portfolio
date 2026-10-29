import type { MetadataRoute } from "next"
import { getCatalog } from "@/lib/data"
import { siteUrl } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const catalog = await getCatalog()
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/cardapio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contato`, changeFrequency: "monthly", priority: 0.7 },
    ...catalog.products.map((p) => ({
      url: `${base}/cardapio/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}
