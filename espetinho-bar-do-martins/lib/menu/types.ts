export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  /** Informação exibida na categoria e em cada produto dela (ex.: recheio dos cachurrascos). */
  infoNote: string | null
  sortOrder: number
  isActive: boolean
  isHighlighted: boolean
}

export type Variant = {
  id: string
  /** Primeiro nível de escolha, opcional (ex.: "Pão Tradicional 30 cm"). */
  groupName: string | null
  /** Segundo nível (ex.: "1 espetinho", "Média", "300 g"). Vazio = produto de preço único. */
  name: string
  priceCents: number
  sortOrder: number
  isAvailable: boolean
}

export type Product = {
  id: string
  categoryId: string
  slug: string
  name: string
  description: string | null
  /** Ingredientes e informações complementares. */
  details: string | null
  /** Caminho no Storage, caminho local (/img/...) ou URL absoluta. */
  imagePath: string | null
  imageAlt: string | null
  /** Rótulo da escolha de variação (ex.: "Tamanho", "Peso", "Espetinhos"). */
  variantLabel: string | null
  /** Rótulo do primeiro nível de escolha, quando houver grupos (ex.: "Pão"). */
  groupLabel: string | null
  sortOrder: number
  isActive: boolean
  isAvailable: boolean
  isFeatured: boolean
  isNew: boolean
  allowsNotes: boolean
  variants: Variant[]
}

export type Catalog = {
  categories: Category[]
  products: Product[]
}

export type OpeningHour = {
  /** 0 = domingo … 6 = sábado */
  day: number
  open: string
  close: string
  closed: boolean
}

export type Settings = {
  businessName: string
  logoPath: string | null
  whatsappNumber: string
  phoneDisplay: string
  addressLine: string | null
  addressConfirmed: boolean
  city: string
  state: string
  mapsQuery: string | null
  openingHours: OpeningHour[]
  deliveryEnabled: boolean
  pickupEnabled: boolean
  /** null = taxa não cadastrada (não é calculada). */
  deliveryFeeCents: number | null
  deliveryNote: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  aboutText: string | null
  serviceMessage: string | null
  noticeText: string | null
  noticeActive: boolean
}
