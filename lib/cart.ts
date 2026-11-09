import type { Pattern } from "./clubs";

export const CART_KEY = "rfc-carrinho-v1";

/** Item do carrinho: guarda o que precisa para exibir sem ir ao banco. */
export type CartItem = {
  /** produto + tamanho: o mesmo manto em tamanhos diferentes são linhas separadas */
  id: string;
  productId: string;
  slug: string;
  nome: string;
  preco: number;
  quantidade: number;
  tamanho: string | null;
  foto?: string;
  categoria: string;
  cor1?: string;
  cor2?: string;
  padrao?: Pattern;
};

export const linhaId = (productId: string, tamanho: string | null) =>
  `${productId}::${tamanho ?? ""}`;

export const subtotalItem = (i: CartItem) => i.preco * i.quantidade;

export const subtotalCarrinho = (itens: CartItem[]) =>
  itens.reduce((t, i) => t + subtotalItem(i), 0);

export const totalPecas = (itens: CartItem[]) =>
  itens.reduce((t, i) => t + i.quantidade, 0);

export const MAX_POR_ITEM = 20;

/** Monta a mensagem do pedido para o WhatsApp. */
export function mensagemPedido(
  itens: CartItem[],
  loja: string,
  url: string,
  brl: (n: number) => string,
) {
  const linhas = itens.map(
    (i) =>
      `• ${i.quantidade}x ${i.nome}${i.tamanho ? ` — tam. ${i.tamanho}` : ""} — ${brl(subtotalItem(i))}`,
  );
  return [
    `Olá! Quero fechar este pedido na ${loja}:`,
    "",
    ...linhas,
    "",
    `Total: ${brl(subtotalCarrinho(itens))}`,
    `(${totalPecas(itens)} ${totalPecas(itens) === 1 ? "peça" : "peças"})`,
    "",
    `${url}/carrinho`,
  ].join("\n");
}
