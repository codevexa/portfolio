import type { ProductClub } from "./clubs";

/** O id da categoria é livre: o vendedor cria e apaga categorias no painel. */
export type CategoryId = string;

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  /** Cor de fundo do card na home. */
  from: string;
  /** Cor de destaque do card na home. */
  to: string;
  active: boolean;
  /** Aparece nos cards "Compre por Categoria". */
  featured: boolean;
  order: number;
};

/**
 * Categorias de fábrica. O site usa esta lista enquanto a tabela
 * `categories` não existir ou estiver vazia — assim nunca fica sem menu.
 */
export const CATEGORIAS_PADRAO: Category[] = [
  { id: "pronta-entrega", name: "Pronta Entrega", blurb: "Sai hoje do estoque", from: "#0b0b0b", to: "#e3ff00", active: true, featured: true, order: 1 },
  { id: "camisas", name: "Camisas", blurb: "Clubes e seleções", from: "#0f0f0f", to: "#f5f5f5", active: true, featured: false, order: 2 },
  { id: "kits", name: "Kits", blurb: "Camisa + shorts", from: "#0b0b0b", to: "#e3ff00", active: true, featured: true, order: 3 },
  { id: "retro", name: "Retrô", blurb: "Mantos clássicos", from: "#141208", to: "#a8801a", active: true, featured: true, order: 4 },
  { id: "selecoes", name: "Seleções Mundiais", blurb: "Copa e amistosos", from: "#12100a", to: "#c9a227", active: true, featured: true, order: 5 },
  { id: "chuteiras", name: "Chuteiras", blurb: "Campo e society", from: "#0f0f0f", to: "#f5f5f5", active: true, featured: true, order: 6 },
  { id: "acessorios", name: "Acessórios", blurb: "Caixas e brindes", from: "#12100a", to: "#c9a227", active: true, featured: true, order: 7 },
];

/** Nome da categoria a partir da lista carregada do banco. */
export const categoryName = (id: string, lista: Category[] = CATEGORIAS_PADRAO) =>
  lista.find((c) => c.id === id)?.name ?? id;

export type Product = {
  id: string;
  slug: string;
  name: string;
  clubId: string | null;
  club: ProductClub;
  league: string | null;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  readyToShip: boolean;
  sizes: string[];
  rating: number;
  image?: string;
  description?: string;
  active: boolean;
  order: number;
  /** Quando falso, o produto nunca aparece esgotado. */
  tracksStock: boolean;
  /** Quantidade por tamanho, ex.: { P: 2, M: 0 }. */
  stock: Record<string, number>;
};

export const SIZES_ADULT = ["P", "M", "G", "GG", "XGG"];
export const SIZES_KIDS = ["16", "18", "20", "22", "24", "26", "28"];
export const SIZES_BOOTS = ["38", "39", "40", "41", "42", "43", "44"];

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function discountPercent(p: Product) {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

/** Um tamanho específico está disponível? */
export function sizeAvailable(p: Product, size: string) {
  if (!p.tracksStock) return true;
  return (p.stock?.[size] ?? 0) > 0;
}

/** O produto inteiro acabou? */
export function soldOut(p: Product) {
  if (!p.tracksStock) return false;
  return !p.sizes.some((s) => (p.stock?.[s] ?? 0) > 0);
}

/** Total em estoque (só faz sentido com controle ligado). */
export function stockTotal(p: Product) {
  if (!p.tracksStock) return null;
  return p.sizes.reduce((t, s) => t + (p.stock?.[s] ?? 0), 0);
}
