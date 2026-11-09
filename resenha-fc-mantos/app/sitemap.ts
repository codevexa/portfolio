import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllProducts, getCategories, getClubs, getLeagues } from "@/lib/db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, clubs, leagues, categories] = await Promise.all([
    getAllProducts(),
    getClubs(),
    getLeagues(),
    getCategories(),
  ]);
  const now = new Date();
  const paths = [
    "/",
    "/pronta-entrega",
    "/busca",
    "/sobre",
    ...categories
      .filter((c) => c.id !== "pronta-entrega")
      .map((c) => `/categoria/${c.id}`),
    ...leagues.map((l) => `/liga/${l.id}`),
    ...clubs.map((c) => `/time/${c.id}`),
    ...products.map((p) => `/produto/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: now }));
}
