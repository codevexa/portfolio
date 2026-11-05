"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { getAdmin, type AdminSession } from "@/lib/admin/auth"
import {
  categorySchema,
  fieldErrors,
  IMAGE_TYPES,
  imagePathSchema,
  MAX_IMAGE_BYTES,
  productSchema,
  settingsSchema,
  type ActionResult,
} from "@/lib/admin/validation"
import { CATALOG_TAG, SETTINGS_TAG } from "@/lib/data"
import { IMAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase/env"
import { createSessionClient } from "@/lib/supabase/server"

const DENIED: ActionResult = { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." }

/** Toda ação confere a sessão e o cadastro de administrador no servidor; o banco confere de novo pela RLS. */
async function admin(): Promise<AdminSession | null> {
  return getAdmin()
}

function refreshPublic() {
  updateTag(CATALOG_TAG)
  updateTag(SETTINGS_TAG)
  revalidatePath("/", "layout")
}

const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true"
const str = (fd: FormData, key: string) => {
  const v = fd.get(key)
  return typeof v === "string" ? v : ""
}

function dbMessage(error: { code?: string; message: string }, fallback: string): string {
  if (error.code === "23505") return "Já existe um item com esse endereço (slug). Escolha outro."
  if (error.code === "23503") return "Não é possível excluir: existem produtos ligados a esta categoria."
  if (error.code === "42501") return DENIED.message
  if (error.code === "23514") return "Algum valor está fora do permitido. Confira os campos."
  return fallback
}

/** Envia uma imagem ao Storage e devolve o caminho salvo, ou uma mensagem de erro. */
async function uploadImage(session: AdminSession, file: File, folder: "produtos" | "logo"): Promise<{ path?: string; error?: string }> {
  const ext = IMAGE_TYPES[file.type]
  if (!ext) return { error: "Formato de imagem não aceito. Use JPG, PNG, WebP ou AVIF." }
  if (file.size > MAX_IMAGE_BYTES) return { error: "A imagem passa de 5 MB. Reduza o tamanho e tente de novo." }
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await session.supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  })
  if (error) return { error: "Não foi possível enviar a imagem. Tente novamente." }
  return { path }
}

async function removeStoredImage(session: AdminSession, path: string | null | undefined) {
  if (path && !path.startsWith("/") && !path.startsWith("http")) {
    await session.supabase.storage.from(IMAGE_BUCKET).remove([path])
  }
}

/* ------------------------------------------------------------------ Login */

export async function signIn(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured) return { ok: false, message: "O Supabase ainda não foi configurado." }
  const email = str(fd, "email").trim()
  const password = str(fd, "password")
  if (!email || !password) return { ok: false, message: "Informe e-mail e senha." }
  const supabase = await createSessionClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: "E-mail ou senha incorretos." }
  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (isAdmin !== true) {
    await supabase.auth.signOut()
    return { ok: false, message: "Este usuário não tem acesso ao painel." }
  }
  redirect("/admin")
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient()
    await supabase.auth.signOut()
  }
  redirect("/admin/login")
}

/* --------------------------------------------------------------- Produtos */

export async function saveProduct(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED

  let variantsRaw: unknown
  try {
    variantsRaw = JSON.parse(str(fd, "variants") || "[]")
  } catch {
    return { ok: false, message: "Variações inválidas." }
  }

  const parsed = productSchema.safeParse({
    id: str(fd, "id"),
    categoryId: str(fd, "categoryId"),
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    description: str(fd, "description"),
    details: str(fd, "details"),
    imageAlt: str(fd, "imageAlt"),
    variantLabel: str(fd, "variantLabel"),
    groupLabel: str(fd, "groupLabel"),
    isActive: bool(fd, "isActive"),
    isAvailable: bool(fd, "isAvailable"),
    isFeatured: bool(fd, "isFeatured"),
    isNew: bool(fd, "isNew"),
    allowsNotes: bool(fd, "allowsNotes"),
    variants: variantsRaw,
  })
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos destacados.", fieldErrors: fieldErrors(parsed.error) }
  }
  const p = parsed.data

  // Imagem: mantém a atual, remove ou substitui por um arquivo novo.
  const current = str(fd, "currentImagePath")
  let imagePath: string | null = current && imagePathSchema.safeParse(current).success ? current : null
  if (bool(fd, "removeImage")) imagePath = null
  const file = fd.get("image")
  let uploaded: string | undefined
  if (file instanceof File && file.size > 0) {
    const up = await uploadImage(session, file, "produtos")
    if (up.error) return { ok: false, message: up.error, fieldErrors: { image: up.error } }
    uploaded = up.path
    imagePath = up.path!
  }

  const { data: id, error } = await session.supabase.rpc("admin_save_product", {
    p: {
      id: p.id,
      category_id: p.categoryId,
      slug: p.slug,
      name: p.name,
      description: p.description,
      details: p.details,
      image_path: imagePath,
      image_alt: p.imageAlt,
      variant_label: p.variantLabel,
      group_label: p.groupLabel,
      is_active: p.isActive,
      is_available: p.isAvailable,
      is_featured: p.isFeatured,
      is_new: p.isNew,
      allows_notes: p.allowsNotes,
      variants: p.variants.map((v) => ({
        id: v.id,
        group_name: v.groupName,
        name: v.name,
        price_cents: v.price,
        is_available: v.isAvailable,
      })),
    },
  })

  if (error) {
    if (uploaded) await removeStoredImage(session, uploaded)
    const message = dbMessage(error, "Não foi possível salvar o produto.")
    return { ok: false, message, fieldErrors: error.code === "23505" ? { slug: message } : undefined }
  }
  if (current && current !== imagePath) await removeStoredImage(session, current)

  refreshPublic()
  if (!p.id) redirect(`/admin/produtos/${id}?criado=1`)
  return { ok: true, message: "Produto salvo. O cardápio público já foi atualizado." }
}

type ProductFlag = "is_active" | "is_available" | "is_featured" | "is_new"
const FLAGS: ProductFlag[] = ["is_active", "is_available", "is_featured", "is_new"]

export async function toggleProductFlag(id: string, flag: ProductFlag, value: boolean): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  if (!FLAGS.includes(flag)) return { ok: false, message: "Opção inválida." }
  const { error, count } = await session.supabase.from("products").update({ [flag]: value }, { count: "exact" }).eq("id", id)
  if (error || !count) return { ok: false, message: error ? dbMessage(error, "Não foi possível atualizar.") : "Produto não encontrado." }
  refreshPublic()
  return { ok: true, message: "Atualizado." }
}

export async function toggleVariantAvailable(id: string, value: boolean): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  const { error } = await session.supabase.from("product_variants").update({ is_available: value }).eq("id", id)
  if (error) return { ok: false, message: dbMessage(error, "Não foi possível atualizar.") }
  refreshPublic()
  return { ok: true, message: "Atualizado." }
}

/** Troca a posição com o vizinho e renumera a lista (10, 20, 30…). */
async function move(session: AdminSession, table: "products" | "categories", id: string, dir: "up" | "down", scope?: { column: string; value: string }) {
  let query = session.supabase.from(table).select("id, sort_order, name").order("sort_order").order("name")
  if (scope) query = query.eq(scope.column, scope.value)
  const { data, error } = await query
  if (error || !data) return { ok: false, message: "Não foi possível reordenar." }
  const idx = data.findIndex((r) => r.id === id)
  const target = dir === "up" ? idx - 1 : idx + 1
  if (idx < 0 || target < 0 || target >= data.length) return { ok: true, message: "" }
  ;[data[idx], data[target]] = [data[target], data[idx]]
  for (const [i, row] of data.entries()) {
    const order = (i + 1) * 10
    if (row.sort_order !== order) {
      const { error: e } = await session.supabase.from(table).update({ sort_order: order }).eq("id", row.id)
      if (e) return { ok: false, message: "Não foi possível reordenar." }
    }
  }
  refreshPublic()
  return { ok: true, message: "Ordem atualizada." }
}

export async function moveProduct(id: string, dir: "up" | "down"): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  const { data } = await session.supabase.from("products").select("category_id").eq("id", id).maybeSingle()
  if (!data) return { ok: false, message: "Produto não encontrado." }
  return move(session, "products", id, dir, { column: "category_id", value: data.category_id })
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  const { data } = await session.supabase.from("products").select("image_path").eq("id", id).maybeSingle()
  const { error, count } = await session.supabase.from("products").delete({ count: "exact" }).eq("id", id)
  if (error || !count) return { ok: false, message: error ? dbMessage(error, "Não foi possível excluir.") : "Produto não encontrado." }
  await removeStoredImage(session, data?.image_path)
  refreshPublic()
  return { ok: true, message: "Produto excluído." }
}

/* ------------------------------------------------------------- Categorias */

export async function saveCategory(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  const parsed = categorySchema.safeParse({
    id: str(fd, "id"),
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    description: str(fd, "description"),
    infoNote: str(fd, "infoNote"),
    isActive: bool(fd, "isActive"),
    isHighlighted: bool(fd, "isHighlighted"),
  })
  if (!parsed.success) return { ok: false, message: "Confira os campos.", fieldErrors: fieldErrors(parsed.error) }
  const c = parsed.data
  const row = {
    name: c.name,
    slug: c.slug,
    description: c.description,
    info_note: c.infoNote,
    is_active: c.isActive,
    is_highlighted: c.isHighlighted,
  }
  let error
  if (c.id) {
    ;({ error } = await session.supabase.from("categories").update(row).eq("id", c.id))
  } else {
    const { data: last } = await session.supabase.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle()
    ;({ error } = await session.supabase.from("categories").insert({ ...row, sort_order: (last?.sort_order ?? 0) + 10 }))
  }
  if (error) return { ok: false, message: dbMessage(error, "Não foi possível salvar a categoria.") }
  refreshPublic()
  return { ok: true, message: c.id ? "Categoria atualizada." : "Categoria criada." }
}

export async function toggleCategoryActive(id: string, value: boolean): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  const { error } = await session.supabase.from("categories").update({ is_active: value }).eq("id", id)
  if (error) return { ok: false, message: dbMessage(error, "Não foi possível atualizar.") }
  refreshPublic()
  return { ok: true, message: value ? "Categoria visível no cardápio." : "Categoria oculta do cardápio." }
}

export async function moveCategory(id: string, dir: "up" | "down"): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  return move(session, "categories", id, dir)
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED
  const { error, count } = await session.supabase.from("categories").delete({ count: "exact" }).eq("id", id)
  if (error) return { ok: false, message: dbMessage(error, "Não foi possível excluir a categoria.") }
  if (!count) return { ok: false, message: "Categoria não encontrada." }
  refreshPublic()
  return { ok: true, message: "Categoria excluída." }
}

/* ---------------------------------------------------------- Configurações */

export async function saveSettings(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const session = await admin()
  if (!session) return DENIED

  const openingHours = Array.from({ length: 7 }, (_, day) => ({
    day,
    open: str(fd, `open-${day}`),
    close: str(fd, `close-${day}`),
    closed: bool(fd, `closed-${day}`),
  }))

  const parsed = settingsSchema.safeParse({
    businessName: str(fd, "businessName"),
    whatsappNumber: str(fd, "whatsappNumber"),
    phoneDisplay: str(fd, "phoneDisplay"),
    addressLine: str(fd, "addressLine"),
    addressConfirmed: bool(fd, "addressConfirmed"),
    city: str(fd, "city"),
    state: str(fd, "state"),
    mapsQuery: str(fd, "mapsQuery"),
    openingHours,
    deliveryEnabled: bool(fd, "deliveryEnabled"),
    pickupEnabled: bool(fd, "pickupEnabled"),
    deliveryFee: str(fd, "deliveryFee"),
    deliveryNote: str(fd, "deliveryNote"),
    instagramUrl: str(fd, "instagramUrl"),
    facebookUrl: str(fd, "facebookUrl"),
    aboutText: str(fd, "aboutText"),
    serviceMessage: str(fd, "serviceMessage"),
    noticeText: str(fd, "noticeText"),
    noticeActive: bool(fd, "noticeActive"),
  })
  if (!parsed.success) return { ok: false, message: "Confira os campos destacados.", fieldErrors: fieldErrors(parsed.error) }
  const s = parsed.data

  const current = str(fd, "currentLogoPath")
  let logoPath: string | null = current && imagePathSchema.safeParse(current).success ? current : null
  if (bool(fd, "removeLogo")) logoPath = null
  const file = fd.get("logo")
  let uploaded: string | undefined
  if (file instanceof File && file.size > 0) {
    const up = await uploadImage(session, file, "logo")
    if (up.error) return { ok: false, message: up.error, fieldErrors: { logo: up.error } }
    uploaded = up.path
    logoPath = up.path!
  }

  const { error, count } = await session.supabase
    .from("settings")
    .update(
      {
        business_name: s.businessName,
        logo_path: logoPath,
        whatsapp_number: s.whatsappNumber,
        phone_display: s.phoneDisplay,
        address_line: s.addressLine,
        address_confirmed: s.addressConfirmed,
        city: s.city,
        state: s.state,
        maps_query: s.mapsQuery,
        opening_hours: s.openingHours,
        delivery_enabled: s.deliveryEnabled,
        pickup_enabled: s.pickupEnabled,
        delivery_fee_cents: s.deliveryFee,
        delivery_note: s.deliveryNote,
        instagram_url: s.instagramUrl,
        facebook_url: s.facebookUrl,
        about_text: s.aboutText,
        service_message: s.serviceMessage,
        notice_text: s.noticeText,
        notice_active: s.noticeActive,
      },
      { count: "exact" },
    )
    .eq("id", 1)
  if (error || !count) {
    if (uploaded) await removeStoredImage(session, uploaded)
    return { ok: false, message: error ? dbMessage(error, "Não foi possível salvar.") : "Configurações não encontradas. Aplique a carga inicial do banco." }
  }
  if (current && current !== logoPath) await removeStoredImage(session, current)
  refreshPublic()
  return { ok: true, message: "Configurações salvas. O site já foi atualizado." }
}
