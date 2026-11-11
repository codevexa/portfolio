import "server-only";
import { createAdminClient } from "./supabase/admin";

/**
 * Montagem do pedido no servidor.
 *
 * Regra que manda aqui: o navegador só diz O QUE quer comprar — id do
 * produto, tamanho e quantidade. Preço, subtotal, frete e total saem
 * SEMPRE do banco. Nada de valor vindo do cliente é usado em cálculo.
 */

export type ItemPedido = { productId: string; size: string | null; quantity: number };

export type DadosCliente = {
  nome: string;
  email: string;
  telefone?: string;
};

export type PedidoMontado = {
  itens: {
    product_id: string;
    product_name: string;
    product_slug: string;
    size: string | null;
    quantity: number;
    unit_amount: number;
    subtotal: number;
  }[];
  itemsAmount: number;
  shippingAmount: number;
  amount: number;
};

export type ErroPedido = { erro: string };

/** Mínimo da InfinitePay: R$ 1,00. */
export const MINIMO_CENTAVOS = 100;
export const MAX_ITENS = 30;
export const MAX_QTD_POR_ITEM = 20;

/** Converte o preco numérico do banco para centavos, sem erro de ponto flutuante. */
export const aCentavos = (preco: number | string) =>
  Math.round(Number(preco) * 100);

export const emReais = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type LinhaProduto = {
  id: string;
  slug: string;
  nome: string;
  preco: number | string;
  ativo: boolean;
  tamanhos: string[] | null;
  controla_estoque: boolean;
  estoque: Record<string, number> | null;
};

/**
 * Relê tudo do banco e devolve o pedido com os valores reais.
 * Qualquer divergência vira erro, nunca um ajuste silencioso.
 */
export async function montarPedido(
  pedidos: ItemPedido[],
): Promise<PedidoMontado | ErroPedido> {
  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    return { erro: "Carrinho vazio." };
  }
  if (pedidos.length > MAX_ITENS) {
    return { erro: `No máximo ${MAX_ITENS} itens por pedido.` };
  }

  const supabase = createAdminClient();

  const ids = [...new Set(pedidos.map((i) => i.productId))];
  const { data, error } = await supabase
    .from("products")
    .select("id,slug,nome,preco,ativo,tamanhos,controla_estoque,estoque")
    .in("id", ids);

  if (error) return { erro: "Não consegui ler o catálogo agora." };

  const porId = new Map((data ?? []).map((p) => [(p as LinhaProduto).id, p as LinhaProduto]));
  const itens: PedidoMontado["itens"] = [];

  for (const pedido of pedidos) {
    const p = porId.get(pedido.productId);
    if (!p) return { erro: "Um dos produtos não existe mais." };
    if (!p.ativo) return { erro: `"${p.nome}" saiu do ar e não pode ser comprado.` };

    const qtd = Math.floor(Number(pedido.quantity));
    if (!Number.isFinite(qtd) || qtd < 1) return { erro: "Quantidade inválida." };
    if (qtd > MAX_QTD_POR_ITEM) {
      return { erro: `No máximo ${MAX_QTD_POR_ITEM} unidades do mesmo item.` };
    }

    const tamanhos = p.tamanhos ?? [];
    const tamanho = pedido.size ?? null;

    if (tamanhos.length > 0) {
      if (!tamanho) return { erro: `Escolha o tamanho de "${p.nome}".` };
      if (!tamanhos.includes(tamanho)) {
        return { erro: `O tamanho ${tamanho} não existe em "${p.nome}".` };
      }
    }

    if (p.controla_estoque && tamanho) {
      const disponivel = p.estoque?.[tamanho] ?? 0;
      if (disponivel < qtd) {
        return {
          erro:
            disponivel === 0
              ? `"${p.nome}" tamanho ${tamanho} está esgotado.`
              : `Só restam ${disponivel} de "${p.nome}" tamanho ${tamanho}.`,
        };
      }
    }

    const unit = aCentavos(p.preco);
    if (!Number.isFinite(unit) || unit <= 0) {
      return { erro: `Preço inválido em "${p.nome}".` };
    }

    itens.push({
      product_id: p.id,
      product_name: p.nome,
      product_slug: p.slug,
      size: tamanho,
      quantity: qtd,
      unit_amount: unit,
      subtotal: unit * qtd,
    });
  }

  const itemsAmount = itens.reduce((t, i) => t + i.subtotal, 0);

  const { data: cfg } = await supabase
    .from("settings")
    .select("frete_centavos")
    .eq("id", 1)
    .maybeSingle();

  const frete = Math.max(0, Math.floor(Number((cfg as { frete_centavos?: number } | null)?.frete_centavos ?? 0)));
  const total = itemsAmount + frete;

  if (total < MINIMO_CENTAVOS) {
    return { erro: "O valor mínimo de um pagamento é R$ 1,00." };
  }

  return { itens, itemsAmount, shippingAmount: frete, amount: total };
}

/** Identificador do pedido mandado à InfinitePay. Curto e sem ambiguidade. */
export function gerarOrderNsu() {
  const agora = new Date();
  const dia = agora.toISOString().slice(2, 10).replace(/-/g, "");
  const aleatorio = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `RFC-${dia}-${aleatorio}`;
}

export const ehEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
