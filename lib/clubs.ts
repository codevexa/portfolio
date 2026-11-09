/** Tipos de time e liga. Os dados vivem no banco e são editados no painel. */

export type Pattern = "solid" | "stripes" | "hoops" | "sash" | "halves";

export const PATTERNS: { id: Pattern; nome: string }[] = [
  { id: "solid", nome: "Lisa" },
  { id: "stripes", nome: "Listras verticais" },
  { id: "hoops", nome: "Listras horizontais" },
  { id: "sash", nome: "Faixa diagonal" },
  { id: "halves", nome: "Meio a meio" },
];

export type League = {
  id: string;
  name: string;
  blurb: string;
  from: string;
  to: string;
  active: boolean;
  order: number;
};

export type Club = {
  id: string;
  name: string;
  league: string | null;
  colors: [string, string];
  pattern: Pattern;
  logo?: string;
  active: boolean;
  featured: boolean;
  order: number;
};

/** Resumo do time que viaja junto com o produto. */
export type ProductClub = {
  id: string;
  name: string;
  colors: [string, string];
  pattern: Pattern;
  logo?: string;
} | null;
