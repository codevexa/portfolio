import type { Category, OpeningHour, Product, Settings, Variant } from "./types"

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>

export const CATEGORY_COLUMNS = "id, slug, name, description, info_note, sort_order, is_active, is_highlighted"
export const PRODUCT_COLUMNS =
  "id, category_id, slug, name, description, details, image_path, image_alt, variant_label, group_label, sort_order, is_active, is_available, is_featured, is_new, allows_notes, product_variants (id, group_name, name, price_cents, sort_order, is_available)"

export function toCategory(r: Row): Category {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    infoNote: r.info_note,
    sortOrder: r.sort_order,
    isActive: r.is_active,
    isHighlighted: r.is_highlighted,
  }
}

export function toVariant(r: Row): Variant {
  return {
    id: r.id,
    groupName: r.group_name,
    name: r.name ?? "",
    priceCents: r.price_cents,
    sortOrder: r.sort_order,
    isAvailable: r.is_available,
  }
}

export function toProduct(r: Row): Product {
  return {
    id: r.id,
    categoryId: r.category_id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    details: r.details,
    imagePath: r.image_path,
    imageAlt: r.image_alt,
    variantLabel: r.variant_label,
    groupLabel: r.group_label,
    sortOrder: r.sort_order,
    isActive: r.is_active,
    isAvailable: r.is_available,
    isFeatured: r.is_featured,
    isNew: r.is_new,
    allowsNotes: r.allows_notes,
    variants: ((r.product_variants ?? []) as Row[]).map(toVariant).sort((a, b) => a.sortOrder - b.sortOrder),
  }
}

export function toSettings(r: Row): Settings {
  return {
    businessName: r.business_name,
    logoPath: r.logo_path,
    whatsappNumber: r.whatsapp_number,
    phoneDisplay: r.phone_display,
    addressLine: r.address_line,
    addressConfirmed: r.address_confirmed,
    city: r.city,
    state: r.state,
    mapsQuery: r.maps_query,
    openingHours: (r.opening_hours ?? []) as OpeningHour[],
    deliveryEnabled: r.delivery_enabled,
    pickupEnabled: r.pickup_enabled,
    deliveryFeeCents: r.delivery_fee_cents,
    deliveryNote: r.delivery_note,
    instagramUrl: r.instagram_url,
    facebookUrl: r.facebook_url,
    aboutText: r.about_text,
    serviceMessage: r.service_message,
    noticeText: r.notice_text,
    noticeActive: r.notice_active,
  }
}
