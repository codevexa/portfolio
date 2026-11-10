import "server-only";
import { cache } from "react";
import { createPublicClient } from "./supabase/server";
import type { Club, League, Pattern, ProductClub } from "./clubs";
import { CATEGORIAS_PADRAO, type Category, type CategoryId, type Product } from "./products";
import { getSettings } from "./settings";
import {
  CHAVES_TEXTO,
  DEPOIMENTOS_PADRAO,
  GARANTIAS_PADRAO,
  PERGUNTAS_PADRAO,
  TEXTOS_PADRAO,
  aplicar,
  type Depoimento,
  type Garantia,
  type Pergunta,
  type Textos,
} from "./texts";

/* ------------------------------------------------------------------ */
/* Produtos                                                            */
/* ------------------------------------------------------------------ */

type ClubJoin = {
  id: string;
  nome: string;
  cor1: string;
  cor2: string;
  padrao: string;
  logo_url: string | null;
} | null;

export type ProductRow = {
  id: string;
  slug: string;
  nome: string;
  clube: string | null;
  liga: string | null;
  categoria: string;
  preco: number | string;
  preco_de: number | string | null;
  tamanhos: string[];
  foto_url: string | null;
  descricao: string | null;
  ativo: boolean;
  ordem: number;
  controla_estoque: boolean;
  estoque: Record<string, number> | null;
  clubs?: ClubJoin;
};

function toClub(c: ClubJoin): ProductClub {
  if (!c) return null;
  return {
    id: c.id,
    name: c.nome,
    colors: [c.cor1, c.cor2],
    pattern: c.padrao as Pattern,
    logo: c.logo_url ?? undefined,
  };
}

export function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.nome,
    clubId: r.clube,
    club: toClub(r.clubs ?? null),
    league: r.liga,
    category: r.categoria as CategoryId,
    price: Number(r.preco),
    oldPrice: r.preco_de != null ? Number(r.preco_de) : undefined,
    sizes: r.tamanhos ?? [],
    rating: 5,
    image: r.foto_url ?? undefined,
    description: r.descricao ?? undefined,
    active: r.ativo,
    order: r.ordem,
    tracksStock: r.controla_estoque ?? false,
    stock: r.estoque ?? {},
  };
}

export const PRODUCT_COLUMNS =
  "id,slug,nome,clube,liga,categoria,preco,preco_de,tamanhos,foto_url,descricao,ativo,ordem,controla_estoque,estoque";

const SELECT = `${PRODUCT_COLUMNS},clubs(id,nome,cor1,cor2,padrao,logo_url)`;

function base() {
  return createPublicClient()
    .from("products")
    .select(SELECT)
    .eq("ativo", true)
    .order("ordem", { ascending: true });
}

async function query(
  build: (q: ReturnType<typeof base>) => ReturnType<typeof base>,
): Promise<Product[]> {
  const { data, error } = await build(base());
  if (error) {
    console.error("[db]", error.message);
    return [];
  }
  return (data ?? []).map((r) => toProduct(r as unknown as ProductRow));
}

export const getAllProducts = () => query((q) => q);
export const getByClub = (clubId: string) => query((q) => q.eq("clube", clubId));
export const getByLeague = (league: string) => query((q) => q.eq("liga", league));

export const getByCategory = (category: CategoryId) =>
  query((q) => q.eq("categoria", category));

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await createPublicClient()
    .from("products")
    .select(SELECT)
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();
  if (error || !data) return null;
  return toProduct(data as unknown as ProductRow);
}

export async function searchProducts(term: string): Promise<Product[]> {
  const q = term.trim();
  if (!q) return [];
  const { data, error } = await createPublicClient()
    .from("products")
    .select(SELECT)
    .eq("ativo", true)
    .or(`nome.ilike.%${q}%,clube.ilike.%${q}%,liga.ilike.%${q}%,categoria.ilike.%${q}%`)
    .order("ordem", { ascending: true })
    .limit(120);
  if (error) {
    console.error("[db busca]", error.message);
    return [];
  }
  return (data ?? []).map((r) => toProduct(r as unknown as ProductRow));
}

/* ------------------------------------------------------------------ */
/* Ligas                                                               */
/* ------------------------------------------------------------------ */

export type LeagueRow = {
  id: string;
  nome: string;
  descricao: string;
  cor_fundo: string;
  cor_destaque: string;
  ativo: boolean;
  ordem: number;
};

export const toLeague = (r: LeagueRow): League => ({
  id: r.id,
  name: r.nome,
  blurb: r.descricao,
  from: r.cor_fundo,
  to: r.cor_destaque,
  active: r.ativo,
  order: r.ordem,
});

export const getLeagues = cache(async (): Promise<League[]> => {
  const { data, error } = await createPublicClient()
    .from("leagues")
    .select("id,nome,descricao,cor_fundo,cor_destaque,ativo,ordem")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) {
    console.error("[db ligas]", error.message);
    return [];
  }
  return (data ?? []).map((r) => toLeague(r as LeagueRow));
});

export async function getLeague(id: string): Promise<League | null> {
  return (await getLeagues()).find((l) => l.id === id) ?? null;
}

/* ------------------------------------------------------------------ */
/* Times                                                               */
/* ------------------------------------------------------------------ */

export type ClubRow = {
  id: string;
  nome: string;
  liga: string | null;
  cor1: string;
  cor2: string;
  padrao: string;
  logo_url: string | null;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
};

export const toClubFull = (r: ClubRow): Club => ({
  id: r.id,
  name: r.nome,
  league: r.liga,
  colors: [r.cor1, r.cor2],
  pattern: r.padrao as Pattern,
  logo: r.logo_url ?? undefined,
  active: r.ativo,
  featured: r.destaque,
  order: r.ordem,
});

export const CLUB_COLUMNS =
  "id,nome,liga,cor1,cor2,padrao,logo_url,ativo,destaque,ordem";

export const getClubs = cache(async (): Promise<Club[]> => {
  const { data, error } = await createPublicClient()
    .from("clubs")
    .select(CLUB_COLUMNS)
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) {
    console.error("[db times]", error.message);
    return [];
  }
  return (data ?? []).map((r) => toClubFull(r as ClubRow));
});

export async function getClub(id: string): Promise<Club | null> {
  return (await getClubs()).find((c) => c.id === id) ?? null;
}

export const getClubsByLeague = async (league: string) =>
  (await getClubs()).filter((c) => c.league === league);

export const getFeaturedClubs = async () =>
  (await getClubs()).filter((c) => c.featured);

/* ------------------------------------------------------------------ */
/* Banners                                                             */
/* ------------------------------------------------------------------ */

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
  from: string;
  to: string;
  active: boolean;
  order: number;
};

export type BannerRow = {
  id: string;
  etiqueta: string;
  titulo: string;
  texto: string;
  cta_texto: string;
  cta_link: string;
  imagem_url: string | null;
  cor_fundo: string;
  cor_destaque: string;
  ativo: boolean;
  ordem: number;
};

export const toBanner = (r: BannerRow): Banner => ({
  id: r.id,
  eyebrow: r.etiqueta,
  title: r.titulo,
  text: r.texto,
  ctaLabel: r.cta_texto,
  ctaHref: r.cta_link,
  image: r.imagem_url ?? undefined,
  from: r.cor_fundo,
  to: r.cor_destaque,
  active: r.ativo,
  order: r.ordem,
});

export const BANNER_COLUMNS =
  "id,etiqueta,titulo,texto,cta_texto,cta_link,imagem_url,cor_fundo,cor_destaque,ativo,ordem";

export const getBanners = cache(async (): Promise<Banner[]> => {
  const { data, error } = await createPublicClient()
    .from("banners")
    .select(BANNER_COLUMNS)
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) {
    console.error("[db banners]", error.message);
    return [];
  }
  return (data ?? []).map((r) => toBanner(r as BannerRow));
});

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

export type CategoryRow = {
  id: string;
  nome: string;
  descricao: string;
  cor_fundo: string;
  cor_destaque: string;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
};

export const CATEGORY_COLUMNS =
  "id,nome,descricao,cor_fundo,cor_destaque,ativo,destaque,ordem";

export const toCategory = (r: CategoryRow): Category => ({
  id: r.id,
  name: r.nome,
  blurb: r.descricao ?? "",
  from: r.cor_fundo || "#0b0b0b",
  to: r.cor_destaque || "#e3ff00",
  active: r.ativo,
  featured: r.destaque,
  order: r.ordem,
});

/**
 * Categorias no ar. Se a tabela ainda não existe (ou está vazia),
 * devolve as de fábrica — o menu da loja nunca fica vazio.
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await createPublicClient()
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("[db categorias]", error.message);
    return CATEGORIAS_PADRAO.filter((c) => c.active);
  }
  if (!data?.length) return CATEGORIAS_PADRAO.filter((c) => c.active);
  return data.map((r) => toCategory(r as CategoryRow));
});

export const getCategory = async (id: string) =>
  (await getCategories()).find((c) => c.id === id) ?? null;

export const getFeaturedCategories = async () =>
  (await getCategories()).filter((c) => c.featured);

/* ------------------------------------------------------------------ */
/* Textos do site                                                      */
/* ------------------------------------------------------------------ */

/**
 * Junta os padrões do código com o que o vendedor salvou e já troca os
 * marcadores {loja} e {pagamentos} pelos valores das Configurações.
 */
export const getTexts = cache(async (): Promise<Textos> => {
  const s = await getSettings();
  const vars = { loja: s.storeName, pagamentos: s.payments.join(" e ") };

  const { data, error } = await createPublicClient()
    .from("site_texts")
    .select("chave,valor");

  const salvos = new Map<string, string>();
  if (error) console.error("[db textos]", error.message);
  else for (const r of data ?? []) {
    const row = r as { chave: string; valor: string };
    if (row.valor?.trim()) salvos.set(row.chave, row.valor);
  }

  const out = {} as Textos;
  for (const chave of CHAVES_TEXTO) {
    out[chave] = aplicar(salvos.get(chave) ?? TEXTOS_PADRAO[chave], vars);
  }
  return out;
});

/** Os textos crus (sem marcadores trocados), para a tela do painel. */
export async function getTextosCrus(): Promise<Record<string, string>> {
  const { data } = await createPublicClient()
    .from("site_texts")
    .select("chave,valor");

  const out: Record<string, string> = { ...TEXTOS_PADRAO };
  for (const r of data ?? []) {
    const row = r as { chave: string; valor: string };
    if (row.valor?.trim()) out[row.chave] = row.valor;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Perguntas, depoimentos e garantias                                  */
/* ------------------------------------------------------------------ */

export const getPerguntas = cache(async (): Promise<Pergunta[]> => {
  const s = await getSettings();
  const pagamentos = s.payments.join(" e ");

  const { data, error } = await createPublicClient()
    .from("faqs")
    .select("id,pergunta,resposta,ativo,ordem")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  const lista =
    error || !data?.length
      ? PERGUNTAS_PADRAO
      : (data as Pergunta[]);
  if (error) console.error("[db perguntas]", error.message);

  return lista.map((p) => ({
    ...p,
    pergunta: aplicar(p.pergunta, { pagamentos }),
    resposta: aplicar(p.resposta, { pagamentos, loja: s.storeName }),
  }));
});

export const getDepoimentos = cache(async (): Promise<Depoimento[]> => {
  const { data, error } = await createPublicClient()
    .from("depoimentos")
    .select("id,nome,cidade,texto,ativo,ordem")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) console.error("[db depoimentos]", error.message);
  if (error || !data?.length) return DEPOIMENTOS_PADRAO;
  return data as Depoimento[];
});

export const getGarantias = cache(async (): Promise<Garantia[]> => {
  const { data, error } = await createPublicClient()
    .from("garantias")
    .select("id,texto,icone,ativo,ordem")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) console.error("[db garantias]", error.message);
  if (error || !data?.length) return GARANTIAS_PADRAO;
  return data as Garantia[];
});
