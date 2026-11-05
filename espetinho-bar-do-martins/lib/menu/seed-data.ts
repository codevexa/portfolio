/**
 * Cardápio inicial do Espetinho Bar do Martins, transcrito do cardápio físico.
 *
 * Este arquivo é a origem do cardápio:
 * - gera a migration de carga inicial (`pnpm seed:sql`), que passa a ser a fonte única no Supabase;
 * - é usado somente leitura enquanto o Supabase não estiver configurado.
 * Depois que o banco estiver conectado, os preços são alterados pelo painel, não aqui.
 */
import type { Catalog, Category, Product, Settings, Variant } from "./types.ts"

const uuid = (prefix: string, n: number) => `00000000-0000-4000-8000-${prefix}${String(n).padStart(12 - prefix.length, "0")}`
const catId = (n: number) => uuid("c", n)
const prodId = (n: number) => uuid("a", n)
const varId = (n: number) => uuid("b", n)

const CACHURRASCO_NOTE =
  "Todos os cachurrascos são recheados com tomate, alface, batata palha e maionese verde da casa."

export const seedCategories: Category[] = [
  {
    id: catId(1),
    slug: "cachurrascos",
    name: "Cachurrascos",
    description: "Sanduíches de 30 cm preparados com pão, espetinhos e recheios de churrasco.",
    infoNote: CACHURRASCO_NOTE,
    sortOrder: 10,
    isActive: true,
    isHighlighted: true,
  },
  {
    id: catId(2),
    slug: "espetinhos",
    name: "Espetinhos",
    description: "Espetinhos assados na brasa.",
    infoNote: null,
    sortOrder: 20,
    isActive: true,
    isHighlighted: false,
  },
  {
    id: catId(3),
    slug: "espetinhos-especiais",
    name: "Espetinhos especiais",
    description: "Espetinhos com cobertura de maionese verde.",
    infoNote: null,
    sortOrder: 30,
    isActive: true,
    isHighlighted: false,
  },
  {
    id: catId(4),
    slug: "porcoes-e-combos",
    name: "Porções e combos",
    description: null,
    infoNote: null,
    sortOrder: 40,
    isActive: true,
    isHighlighted: false,
  },
  {
    id: catId(5),
    slug: "picanha",
    name: "Picanha",
    description: null,
    infoNote: null,
    sortOrder: 50,
    isActive: true,
    isHighlighted: false,
  },
  {
    id: catId(6),
    slug: "assado-em-tiras",
    name: "Assado em tiras",
    description: null,
    infoNote: null,
    sortOrder: 60,
    isActive: true,
    isHighlighted: false,
  },
]

type SeedProduct = Omit<Product, "variants" | "isActive" | "isAvailable" | "imageAlt"> & {
  imageAlt: string
  variants: Array<Omit<Variant, "isAvailable" | "sortOrder">>
}

let variantSeq = 0
const single = (priceCents: number) => [{ id: varId(++variantSeq), groupName: null, name: "", priceCents }]

function product(p: Omit<SeedProduct, "variantLabel" | "groupLabel" | "details" | "isNew" | "isFeatured" | "allowsNotes"> &
  Partial<Pick<SeedProduct, "variantLabel" | "groupLabel" | "details" | "isNew" | "isFeatured" | "allowsNotes">>): Product {
  return {
    variantLabel: null,
    groupLabel: null,
    details: null,
    isNew: false,
    isFeatured: false,
    allowsNotes: true,
    ...p,
    isActive: true,
    isAvailable: true,
    variants: p.variants.map((v, i) => ({ ...v, sortOrder: (i + 1) * 10, isAvailable: true })),
  }
}

const espetinho = (n: number, slug: string, name: string, description: string, image: string, priceCents: number, sortOrder: number, isFeatured = false) =>
  product({
    id: prodId(n),
    categoryId: catId(2),
    slug,
    name,
    description,
    imagePath: `/img/menu/${image}.svg`,
    imageAlt: `Ilustração de ${name.toLowerCase()} na brasa`,
    sortOrder,
    isFeatured,
    variants: single(priceCents),
  })

export const seedProducts: Product[] = [
  // CACHURRASCOS
  product({
    id: prodId(1),
    categoryId: catId(1),
    slug: "cachurrasco-30-cm",
    name: "Cachurrasco 30 cm",
    description:
      "Sanduíche de 30 cm com pão, espetinhos e recheio de churrasco. Escolha o pão e a quantidade de espetinhos.",
    imagePath: "/img/menu/cachurrasco.svg",
    imageAlt: "Ilustração de cachurrasco: sanduíche de churrasco de 30 cm",
    groupLabel: "Pão",
    variantLabel: "Quantidade de espetinhos",
    sortOrder: 10,
    isFeatured: true,
    variants: [
      { id: varId(++variantSeq), groupName: "Pão Tradicional 30 cm", name: "1 espetinho", priceCents: 2690 },
      { id: varId(++variantSeq), groupName: "Pão Tradicional 30 cm", name: "2 espetinhos", priceCents: 3990 },
      { id: varId(++variantSeq), groupName: "Pão Tradicional 30 cm", name: "3 espetinhos", priceCents: 5590 },
      { id: varId(++variantSeq), groupName: "Pão Parmesão 30 cm", name: "1 espetinho", priceCents: 2990 },
      { id: varId(++variantSeq), groupName: "Pão Parmesão 30 cm", name: "2 espetinhos", priceCents: 4190 },
      { id: varId(++variantSeq), groupName: "Pão Parmesão 30 cm", name: "3 espetinhos", priceCents: 5790 },
    ],
  }),
  product({
    id: prodId(2),
    categoryId: catId(1),
    slug: "cachurrasco-contrafile-geleia-de-pimenta",
    name: "Cachurrasco de contrafilé com geleia de pimenta",
    description: "Cachurrasco de contrafilé acompanhado de geleia de pimenta.",
    imagePath: "/img/menu/cachurrasco-contrafile.svg",
    imageAlt: "Ilustração de cachurrasco de contrafilé com geleia de pimenta",
    sortOrder: 20,
    isNew: true,
    isFeatured: true,
    variants: single(4590),
  }),

  // ESPETINHOS
  espetinho(3, "espetinho-de-gado", "Espetinho de Gado", "Espetinho de carne de gado assado na brasa.", "espetinho-gado", 1590, 10, true),
  espetinho(4, "espetinho-de-frango", "Espetinho de Frango", "Espetinho de frango assado na brasa.", "espetinho-frango", 1590, 20),
  espetinho(5, "espetinho-misto", "Espetinho Misto", "Espetinho misto assado na brasa.", "espetinho-misto", 1590, 30),
  espetinho(6, "espetinho-de-coracao", "Espetinho de Coração", "Espetinho de coração assado na brasa.", "espetinho-coracao", 1590, 40),
  espetinho(7, "espetinho-de-calabresa", "Espetinho de Calabresa", "Espetinho de calabresa assado na brasa.", "espetinho-calabresa", 1590, 50),
  espetinho(8, "espetinho-de-coalho", "Espetinho de Coalho", "Espetinho de queijo coalho na brasa.", "espetinho-coalho", 1290, 60),
  espetinho(9, "pao-de-alho", "Pão de Alho", "Pão de alho na brasa.", "pao-de-alho", 700, 70),

  // ESPETINHOS ESPECIAIS (tipo de carne a ser completado pelo administrador)
  product({
    id: prodId(10),
    categoryId: catId(3),
    slug: "espetinho-maionese-verde-batata-palha",
    name: "Espetinho com maionese verde e batata palha",
    description: "Opção especial de espetinho com cobertura de maionese verde e batata palha.",
    imagePath: "/img/menu/espetinho-especial-batata.svg",
    imageAlt: "Ilustração de espetinho com maionese verde e batata palha",
    sortOrder: 10,
    variants: single(1590),
  }),
  product({
    id: prodId(11),
    categoryId: catId(3),
    slug: "espetinho-maionese-verde-farofa",
    name: "Espetinho com maionese verde e farofa",
    description: "Opção especial de espetinho com cobertura de maionese verde e farofa.",
    imagePath: "/img/menu/espetinho-especial-farofa.svg",
    imageAlt: "Ilustração de espetinho com maionese verde e farofa",
    sortOrder: 20,
    variants: single(1590),
  }),

  // PORÇÕES E COMBOS
  product({
    id: prodId(12),
    categoryId: catId(4),
    slug: "picado-martins",
    name: "Picado Martins",
    description: "3 espetinhos, pão de alho, picles, ovo de codorna e batata frita.",
    imagePath: "/img/menu/picado.svg",
    imageAlt: "Ilustração do Picado Martins: espetinhos, pão de alho, picles, ovo de codorna e batata frita",
    sortOrder: 10,
    isFeatured: true,
    variants: single(7990),
  }),
  product({
    id: prodId(13),
    categoryId: catId(4),
    slug: "porcao-de-batatas",
    name: "Porção de batatas",
    description: "Porção de batata frita.",
    imagePath: "/img/menu/batatas.svg",
    imageAlt: "Ilustração de porção de batatas fritas",
    variantLabel: "Tamanho",
    sortOrder: 20,
    variants: [
      { id: varId(++variantSeq), groupName: null, name: "Média", priceCents: 2500 },
      { id: varId(++variantSeq), groupName: null, name: "Grande", priceCents: 3000 },
    ],
  }),

  // PICANHA
  product({
    id: prodId(14),
    categoryId: catId(5),
    slug: "medalhao-de-picanha",
    name: "Medalhão de picanha",
    description: "Medalhão de picanha com peso aproximado de 200 g.",
    imagePath: "/img/menu/medalhao.svg",
    imageAlt: "Ilustração de medalhões de picanha grelhados",
    sortOrder: 10,
    isFeatured: true,
    variants: single(3490),
  }),

  // ASSADO EM TIRAS
  product({
    id: prodId(15),
    categoryId: catId(6),
    slug: "assado-de-gado-em-tiras",
    name: "Assado de gado em tiras",
    description: "Gado assado servido em tiras.",
    imagePath: "/img/menu/assado-tiras.svg",
    imageAlt: "Ilustração de carne de gado assada em tiras",
    variantLabel: "Peso",
    sortOrder: 10,
    variants: [
      { id: varId(++variantSeq), groupName: null, name: "300 g", priceCents: 2690 },
      { id: varId(++variantSeq), groupName: null, name: "600 g", priceCents: 4290 },
    ],
  }),
]

export const seedCatalog: Catalog = { categories: seedCategories, products: seedProducts }

export const seedSettings: Settings = {
  businessName: "Espetinho Bar do Martins",
  logoPath: null,
  whatsappNumber: "5551994261019",
  phoneDisplay: "(51) 99426-1019",
  // Endereço propositalmente vazio: confirmar com o estabelecimento antes de publicar.
  addressLine: null,
  addressConfirmed: false,
  city: "Porto Alegre",
  state: "RS",
  mapsQuery: null,
  openingHours: [
    { day: 0, open: "17:00", close: "00:00", closed: true },
    { day: 1, open: "17:00", close: "00:00", closed: false },
    { day: 2, open: "17:00", close: "00:00", closed: false },
    { day: 3, open: "17:00", close: "00:00", closed: false },
    { day: 4, open: "17:00", close: "00:00", closed: false },
    { day: 5, open: "17:00", close: "00:00", closed: false },
    { day: 6, open: "17:00", close: "00:00", closed: false },
  ],
  // Serviços não confirmados: só retirada vem ligada; entrega e taxa são ativadas no painel.
  deliveryEnabled: false,
  pickupEnabled: true,
  deliveryFeeCents: null,
  deliveryNote: null,
  instagramUrl: null,
  facebookUrl: null,
  aboutText:
    "O Espetinho Bar do Martins é uma espetaria de Porto Alegre especializada em espetinhos na brasa, carnes assadas e cachurrascos de 30 cm.",
  serviceMessage: "Depois de enviar o pedido pelo WhatsApp, aguarde a confirmação do estabelecimento.",
  noticeText: null,
  noticeActive: false,
}
