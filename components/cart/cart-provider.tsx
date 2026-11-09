"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CART_KEY,
  MAX_POR_ITEM,
  linhaId,
  subtotalCarrinho,
  totalPecas,
  type CartItem,
} from "@/lib/cart";

type Ctx = {
  itens: CartItem[];
  pronto: boolean;
  pecas: number;
  subtotal: number;
  adicionar: (item: Omit<CartItem, "id">) => void;
  alterarQtd: (id: string, qtd: number) => void;
  remover: (id: string) => void;
  limpar: () => void;
};

const CarrinhoCtx = createContext<Ctx | null>(null);

function ler(): CartItem[] {
  try {
    const cru = localStorage.getItem(CART_KEY);
    if (!cru) return [];
    const dados = JSON.parse(cru);
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (i) => i && typeof i.id === "string" && typeof i.preco === "number",
    );
  } catch {
    return [];
  }
}

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<CartItem[]>([]);
  const [pronto, setPronto] = useState(false);

  // carrega do navegador depois de montar (evita divergência com o servidor)
  useEffect(() => {
    setItens(ler());
    setPronto(true);
  }, []);

  // guarda a cada mudança, e acompanha outras abas abertas
  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(itens));
    } catch {
      /* navegador sem espaço ou em modo restrito: o carrinho segue na memória */
    }
  }, [itens, pronto]);

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItens(ler());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const adicionar = useCallback((item: Omit<CartItem, "id">) => {
    const id = linhaId(item.productId, item.tamanho);
    setItens((atual) => {
      const existe = atual.find((i) => i.id === id);
      if (existe) {
        return atual.map((i) =>
          i.id === id
            ? { ...i, quantidade: Math.min(MAX_POR_ITEM, i.quantidade + item.quantidade) }
            : i,
        );
      }
      return [...atual, { ...item, id }];
    });
  }, []);

  const alterarQtd = useCallback((id: string, qtd: number) => {
    setItens((atual) =>
      qtd <= 0
        ? atual.filter((i) => i.id !== id)
        : atual.map((i) =>
            i.id === id ? { ...i, quantidade: Math.min(MAX_POR_ITEM, qtd) } : i,
          ),
    );
  }, []);

  const remover = useCallback(
    (id: string) => setItens((atual) => atual.filter((i) => i.id !== id)),
    [],
  );

  const limpar = useCallback(() => setItens([]), []);

  const valor = useMemo<Ctx>(
    () => ({
      itens,
      pronto,
      pecas: totalPecas(itens),
      subtotal: subtotalCarrinho(itens),
      adicionar,
      alterarQtd,
      remover,
      limpar,
    }),
    [itens, pronto, adicionar, alterarQtd, remover, limpar],
  );

  return <CarrinhoCtx.Provider value={valor}>{children}</CarrinhoCtx.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro do CarrinhoProvider");
  return ctx;
}
