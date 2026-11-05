import { seedCatalog, seedSettings } from "./seed-data.ts"

const q = (v: string | null) => (v === null ? "null" : `'${v.replace(/'/g, "''")}'`)
const b = (v: boolean) => (v ? "true" : "false")
const n = (v: number | null) => (v === null ? "null" : String(Math.trunc(v)))

/** Gera o SQL da carga inicial do cardápio a partir de `seed-data.ts` (idempotente). */
export function buildSeedSql(): string {
  const lines: string[] = [
    "-- ARQUIVO GERADO por `pnpm seed:sql` a partir de lib/menu/seed-data.ts. Não edite à mão.",
    "-- Carga inicial do cardápio físico. Não sobrescreve dados já existentes (on conflict do nothing).",
    "",
  ]
  for (const c of seedCatalog.categories) {
    lines.push(
      `insert into public.categories (id, slug, name, description, info_note, sort_order, is_active, is_highlighted) values (${q(c.id)}, ${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(c.infoNote)}, ${n(c.sortOrder)}, ${b(c.isActive)}, ${b(c.isHighlighted)}) on conflict do nothing;`,
    )
  }
  lines.push("")
  for (const p of seedCatalog.products) {
    lines.push(
      `insert into public.products (id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes) values (${q(p.id)}, ${q(p.categoryId)}, ${q(p.slug)}, ${q(p.name)}, ${q(p.description)}, ${q(p.details)}, ${q(p.imagePath)}, ${q(p.imageAlt)}, ${q(p.variantLabel)}, ${q(p.groupLabel)}, ${n(p.sortOrder)}, ${b(p.isActive)}, ${b(p.isAvailable)}, ${b(p.isFeatured)}, ${b(p.isNew)}, ${b(p.allowsNotes)}) on conflict do nothing;`,
    )
    for (const v of p.variants) {
      lines.push(
        `insert into public.product_variants (id, product_id, group_name, name, price_cents, sort_order, is_available) values (${q(v.id)}, ${q(p.id)}, ${q(v.groupName)}, ${q(v.name)}, ${n(v.priceCents)}, ${n(v.sortOrder)}, ${b(v.isAvailable)}) on conflict do nothing;`,
      )
    }
  }
  const s = seedSettings
  lines.push(
    "",
    `insert into public.settings (id, business_name, logo_path, whatsapp_number, phone_display, address_line, address_confirmed, city, state, maps_query, opening_hours, delivery_enabled, pickup_enabled, delivery_fee_cents, delivery_note, instagram_url, facebook_url, about_text, service_message, notice_text, notice_active) values (1, ${q(s.businessName)}, ${q(s.logoPath)}, ${q(s.whatsappNumber)}, ${q(s.phoneDisplay)}, ${q(s.addressLine)}, ${b(s.addressConfirmed)}, ${q(s.city)}, ${q(s.state)}, ${q(s.mapsQuery)}, ${q(JSON.stringify(s.openingHours))}::jsonb, ${b(s.deliveryEnabled)}, ${b(s.pickupEnabled)}, ${n(s.deliveryFeeCents)}, ${q(s.deliveryNote)}, ${q(s.instagramUrl)}, ${q(s.facebookUrl)}, ${q(s.aboutText)}, ${q(s.serviceMessage)}, ${q(s.noticeText)}, ${b(s.noticeActive)}) on conflict do nothing;`,
    "",
  )
  return lines.join("\n")
}
