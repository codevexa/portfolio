import { z } from "zod"
import { parseBRL } from "@/lib/money"

export type ActionResult = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string>
}

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .transform((v) => (v === "" ? null : v))

const price = z.string().transform((v, ctx) => {
  const cents = parseBRL(v)
  if (cents === null || cents < 0 || cents > 10_000_000) {
    ctx.addIssue({ code: "custom", message: "Preço inválido. Use o formato 15,90." })
    return z.NEVER
  }
  return cents
})

const uuidOrEmpty = z.union([z.literal(""), z.uuid()])

/** Caminhos de imagem aceitos: ilustrações locais ou arquivos do bucket. */
export const imagePathSchema = z
  .string()
  .regex(/^(\/img\/[a-z0-9/_-]+\.(svg|png|jpg|webp)|(produtos|logo)\/[A-Za-z0-9._-]+)$/, "Caminho de imagem inválido.")

export const variantSchema = z.object({
  id: uuidOrEmpty,
  groupName: z.string().trim().max(80),
  name: z.string().trim().max(80),
  price,
  isAvailable: z.boolean(),
})

export const productSchema = z
  .object({
    id: uuidOrEmpty,
    categoryId: z.uuid("Escolha uma categoria."),
    name: z.string().trim().min(2, "Informe o nome do produto.").max(120),
    slug: z.string().trim().max(120),
    description: optionalText(1000),
    details: optionalText(2000),
    imageAlt: optionalText(200),
    variantLabel: optionalText(60),
    groupLabel: optionalText(60),
    isActive: z.boolean(),
    isAvailable: z.boolean(),
    isFeatured: z.boolean(),
    isNew: z.boolean(),
    allowsNotes: z.boolean(),
    variants: z.array(variantSchema).min(1, "Cadastre ao menos um preço.").max(40),
  })
  .transform((p) => ({ ...p, slug: slugify(p.slug || p.name) }))
  .superRefine((p, ctx) => {
    if (!p.slug) ctx.addIssue({ code: "custom", path: ["slug"], message: "Endereço (slug) inválido." })
    const seen = new Set<string>()
    p.variants.forEach((v, i) => {
      const key = `${v.groupName.toLowerCase()}|${v.name.toLowerCase()}`
      if (seen.has(key)) ctx.addIssue({ code: "custom", path: ["variants", i, "name"], message: "Variação repetida." })
      seen.add(key)
      if (p.variants.length > 1 && !v.name && !v.groupName)
        ctx.addIssue({ code: "custom", path: ["variants", i, "name"], message: "Dê um nome a cada variação (ex.: Média, 300 g)." })
    })
  })

export const categorySchema = z
  .object({
    id: uuidOrEmpty,
    name: z.string().trim().min(2, "Informe o nome.").max(80),
    slug: z.string().trim().max(80),
    description: optionalText(500),
    infoNote: optionalText(500),
    isActive: z.boolean(),
    isHighlighted: z.boolean(),
  })
  .transform((c) => ({ ...c, slug: slugify(c.slug || c.name) }))

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido.")
const httpsUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || /^https:\/\/[^\s]+$/.test(v), "Use um link completo começando com https://")

export const settingsSchema = z
  .object({
    businessName: z.string().trim().min(2, "Informe o nome.").max(120),
    whatsappNumber: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => /^55\d{10,11}$/.test(v), "Use o formato 55 + DDD + número, ex.: 5551994261019."),
    phoneDisplay: z.string().trim().min(8, "Informe o telefone para exibição.").max(40),
    addressLine: optionalText(300),
    addressConfirmed: z.boolean(),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(40),
    mapsQuery: optionalText(300),
    openingHours: z
      .array(z.object({ day: z.number().int().min(0).max(6), open: time, close: time, closed: z.boolean() }))
      .length(7),
    deliveryEnabled: z.boolean(),
    pickupEnabled: z.boolean(),
    deliveryFee: z.string().transform((v, ctx) => {
      if (v.trim() === "") return null
      const cents = parseBRL(v)
      if (cents === null || cents > 1_000_000) {
        ctx.addIssue({ code: "custom", message: "Taxa inválida. Use 7,00 ou deixe em branco." })
        return z.NEVER
      }
      return cents
    }),
    deliveryNote: optionalText(300),
    instagramUrl: httpsUrl,
    facebookUrl: httpsUrl,
    aboutText: optionalText(2000),
    serviceMessage: optionalText(500),
    noticeText: optionalText(300),
    noticeActive: z.boolean(),
  })
  .superRefine((s, ctx) => {
    if (s.addressConfirmed && !s.addressLine)
      ctx.addIssue({ code: "custom", path: ["addressLine"], message: "Informe o endereço antes de marcá-lo como confirmado." })
    if (s.noticeActive && !s.noticeText)
      ctx.addIssue({ code: "custom", path: ["noticeText"], message: "Escreva o aviso antes de ativá-lo." })
  })

/** Converte os erros do zod em { "campo.0.sub": "mensagem" } para mostrar ao lado de cada campo. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join(".")
    if (!out[key]) out[key] = issue.message
  }
  return out
}

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
}
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
