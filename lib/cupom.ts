import "server-only";
import { createAdminClient } from "./supabase/admin";
import { aCentavos, motivoDoCupom } from "./orders";

/**
 * Confere um cupom SEM gastar um uso.
 *
 * Serve só para a prévia no checkout, quando o cliente clica em "Aplicar".
 * Quem de fato cobra o uso é a função usar_cupom do banco, chamada na hora
 * de abrir o pedido — lá a linha é travada e o contador sobe. Por isso a
 * prévia nunca pode ser tratada como garantia: se o último uso for levado
 * por outra pessoa nesse meio tempo, a compra é recusada na hora certa.
 */
export type PreviaCupom =
  | { ok: true; codigo: string; desconto: number }
  | { ok: false; erro: string };

export async function conferirCupom(
  codigo: string,
  itemsAmount: number,
): Promise<PreviaCupom> {
  const limpo = codigo.trim();
  if (!limpo) return { ok: false, erro: "Digite o código do cupom." };

  const { data, error } = await createAdminClient()
    .from("coupons")
    .select("codigo,tipo,valor,minimo,usos,usos_max,valido_ate,ativo")
    .ilike("codigo", limpo)
    .maybeSingle();

  if (error) return { ok: false, erro: "Não consegui conferir o cupom agora." };

  const c = data as {
    codigo: string;
    tipo: string;
    valor: number;
    minimo: number;
    usos: number;
    usos_max: number | null;
    valido_ate: string | null;
    ativo: boolean;
  } | null;

  if (!c) return { ok: false, erro: motivoDoCupom("nao_existe") };
  if (!c.ativo) return { ok: false, erro: motivoDoCupom("desativado") };
  if (c.valido_ate && new Date(c.valido_ate) < new Date()) {
    return { ok: false, erro: motivoDoCupom("expirado") };
  }
  if (c.usos_max !== null && c.usos >= c.usos_max) {
    return { ok: false, erro: motivoDoCupom("esgotado") };
  }
  if (itemsAmount < c.minimo) {
    return { ok: false, erro: motivoDoCupom("minimo", c.minimo) };
  }

  const desconto = Math.min(
    c.tipo === "percentual"
      ? Math.round((itemsAmount * Number(c.valor)) / 100)
      : aCentavos(Number(c.valor)),
    itemsAmount,
  );

  return { ok: true, codigo: c.codigo.toUpperCase(), desconto };
}
