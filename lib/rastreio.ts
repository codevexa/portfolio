/**
 * Rastreio de encomendas — J&T Express Brasil.
 *
 * Como funciona hoje, e por quê:
 *
 * A página oficial (https://www.jtexpress.com.br/mobile/expressTracking) é um
 * app de página única que lê o código de `localStorage` / `sessionStorage` do
 * próprio domínio e exige um captcha antes de consultar. Ela NÃO aceita o
 * código pela URL — conferido no bundle da própria J&T: o formulário grava
 * `{ waybillNo, type, cpf }` no localStorage e navega para /expressTracking
 * com apenas um parâmetro `t` de cache. Como não dá para escrever no
 * localStorage de outro domínio, não existe forma de pré-preencher o campo
 * a partir daqui.
 *
 * Então o fluxo é: a gente valida o código, copia para a área de
 * transferência e abre o site oficial em outra aba, para o cliente colar.
 * Nada de rastreio é simulado nem inventado nesta loja.
 *
 * Regras de validação espelhadas das mensagens da própria J&T:
 * o código não pode ser vazio e cada código tem no máximo 44 caracteres.
 */

export const TRANSPORTADORA = {
  nome: "J&T Express",
  nomeCompleto: "J&T Express Brasil",
  site: "https://www.jtexpress.com.br",
  /** Página oficial de rastreio, aberta em nova aba. */
  urlRastreio: "https://www.jtexpress.com.br/mobile/expressTracking",
} as const;

/** Limite da própria J&T: cada código tem no máximo 44 caracteres. */
export const MAX_CODIGO = 44;
/** Piso generoso, só para barrar digitação acidental. */
export const MIN_CODIGO = 6;

/** Tira espaços e deixa em caixa alta, sem descartar nenhum caractere válido. */
export function normalizarCodigo(bruto: string) {
  return bruto.replace(/\s+/g, "").toUpperCase();
}

export type ProblemaCodigo = "vazio" | "curto" | "longo" | null;

export function validarCodigo(codigo: string): ProblemaCodigo {
  if (!codigo) return "vazio";
  if (codigo.length < MIN_CODIGO) return "curto";
  if (codigo.length > MAX_CODIGO) return "longo";
  return null;
}

/* ------------------------------------------------------------------ */
/* Espaço reservado para uma integração oficial, quando existir         */
/* ------------------------------------------------------------------ */

/** Um evento da encomenda, como a transportadora reportaria. */
export type EventoRastreio = {
  data: string;
  status: string;
  local?: string;
};

export type ResultadoRastreio = {
  codigo: string;
  entregue: boolean;
  eventos: EventoRastreio[];
};

/**
 * Ponto único de troca para o dia em que a J&T abrir uma API oficial de
 * rastreio para lojistas.
 *
 * Quando isso acontecer: criar uma rota de servidor (ex.: app/api/rastreio),
 * guardar a credencial em variável de ambiente, chamar a API oficial de lá e
 * fazer esta função devolver os eventos reais. A tela já trata o resultado.
 *
 * Até lá ela devolve `null`, que significa "não há consulta automática
 * disponível" — e a tela segue abrindo o site oficial. Nenhum status é
 * inventado nem simulado em nenhuma hipótese.
 */
export async function consultarRastreio(
  _codigo: string,
): Promise<ResultadoRastreio | null> {
  return null;
}
