/** Desconto geral da loja. Módulo puro: serve ao servidor e ao cliente. */

/** Preço final depois do desconto geral, arredondado ao centavo. */
export function comDesconto(preco: number, percentual: number) {
  if (!percentual || percentual <= 0) return preco;
  return Math.round(preco * (1 - percentual / 100) * 100) / 100;
}

/** Quanto por cento o cliente economiza, para o selo. */
export const selo = (percentual: number) =>
  percentual > 0 ? Math.round(percentual) : null;
