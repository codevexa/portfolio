import type { Catalog, Product, Settings, Variant } from "./menu/types"
import { isPurchasable, variantLabel } from "./menu/variants"

/** O carrinho guarda só referências; preços sempre vêm do cardápio atual (fonte única). */
export type CartLine = {
  key: string
  productId: string
  variantId: string
  quantity: number
  notes: string
}

export type ResolvedLine = CartLine & {
  product: Product | null
  variant: Variant | null
  name: string
  variantText: string
  unitCents: number
  subtotalCents: number
  available: boolean
}

export const MAX_QUANTITY = 50
export const MAX_NOTES = 200

export function lineKey(productId: string, variantId: string, notes: string): string {
  return `${productId}:${variantId}:${notes.trim().toLowerCase()}`
}

export function clampQuantity(q: number): number {
  if (!Number.isFinite(q)) return 1
  return Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(q)))
}

export function addLine(lines: CartLine[], item: Omit<CartLine, "key">): CartLine[] {
  const notes = item.notes.trim().slice(0, MAX_NOTES)
  const key = lineKey(item.productId, item.variantId, notes)
  const existing = lines.find((l) => l.key === key)
  if (existing) {
    return lines.map((l) => (l.key === key ? { ...l, quantity: clampQuantity(l.quantity + item.quantity) } : l))
  }
  return [...lines, { ...item, notes, key, quantity: clampQuantity(item.quantity) }]
}

export function setQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((l) => l.key !== key)
  return lines.map((l) => (l.key === key ? { ...l, quantity: clampQuantity(quantity) } : l))
}

export function setNotes(lines: CartLine[], key: string, notes: string): CartLine[] {
  const clean = notes.slice(0, MAX_NOTES)
  const target = lines.find((l) => l.key === key)
  if (!target) return lines
  const newKey = lineKey(target.productId, target.variantId, clean)
  const merged = lines.find((l) => l.key === newKey && l.key !== key)
  if (merged) {
    return lines
      .filter((l) => l.key !== key)
      .map((l) => (l.key === newKey ? { ...l, quantity: clampQuantity(l.quantity + target.quantity) } : l))
  }
  return lines.map((l) => (l.key === key ? { ...l, notes: clean, key: newKey } : l))
}

export function resolveCart(lines: CartLine[], catalog: Catalog) {
  const resolved: ResolvedLine[] = lines.map((line) => {
    const product = catalog.products.find((p) => p.id === line.productId) ?? null
    const variant = product?.variants.find((v) => v.id === line.variantId) ?? null
    const available = !!product && !!variant && isPurchasable(product, variant)
    const unitCents = variant?.priceCents ?? 0
    return {
      ...line,
      product,
      variant,
      name: product?.name ?? "Produto indisponível",
      variantText: variant ? variantLabel(variant) : "",
      unitCents,
      subtotalCents: available ? unitCents * line.quantity : 0,
      available,
    }
  })
  const subtotalCents = resolved.reduce((sum, l) => sum + l.subtotalCents, 0)
  const itemCount = resolved.filter((l) => l.available).reduce((sum, l) => sum + l.quantity, 0)
  return { lines: resolved, subtotalCents, itemCount, hasUnavailable: resolved.some((l) => !l.available) }
}

export type OrderType = "entrega" | "retirada"

export function computeTotals(subtotalCents: number, orderType: OrderType, settings: Pick<Settings, "deliveryFeeCents">) {
  if (orderType !== "entrega") {
    return { subtotalCents, deliveryFeeCents: null, feeApplies: false, feeKnown: true, totalCents: subtotalCents }
  }
  const fee = settings.deliveryFeeCents
  return {
    subtotalCents,
    deliveryFeeCents: fee,
    feeApplies: true,
    feeKnown: fee !== null,
    totalCents: subtotalCents + (fee ?? 0),
  }
}
