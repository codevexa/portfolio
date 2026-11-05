import type { Product, Variant } from "./types"

export function variantLabel(v: Pick<Variant, "groupName" | "name">): string {
  return [v.groupName, v.name].filter((s) => s && s.trim()).join(" · ")
}

export function hasChoices(p: Product): boolean {
  return p.variants.length > 1 || p.variants.some((v) => v.name.trim() !== "" || v.groupName)
}

/** Grupos na ordem de exibição (ex.: ["Pão Tradicional 30 cm", "Pão Parmesão 30 cm"]). */
export function variantGroups(p: Product): string[] {
  const groups: string[] = []
  for (const v of p.variants) {
    const g = v.groupName ?? ""
    if (!groups.includes(g)) groups.push(g)
  }
  return groups
}

export function minPrice(p: Product): number | null {
  const prices = p.variants.filter((v) => v.isAvailable).map((v) => v.priceCents)
  const all = prices.length ? prices : p.variants.map((v) => v.priceCents)
  return all.length ? Math.min(...all) : null
}

export function isPurchasable(p: Product, v?: Variant): boolean {
  if (!p.isActive || !p.isAvailable) return false
  if (v) return v.isAvailable
  return p.variants.some((x) => x.isAvailable)
}
