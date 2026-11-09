import { alternarCampo } from "@/app/admin/actions";

/** Botão que liga/desliga um campo booleano direto na lista. */
export function Toggle({
  id,
  campo,
  valor,
  ligado,
  desligado,
  tabela = "products",
  volta = "/admin",
}: {
  id: string;
  campo: string;
  valor: boolean;
  ligado: string;
  desligado: string;
  tabela?: string;
  volta?: string;
}) {
  return (
    <form action={alternarCampo}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="campo" value={campo} />
      <input type="hidden" name="valor" value={String(valor)} />
      <input type="hidden" name="tabela" value={tabela} />
      <input type="hidden" name="volta" value={volta} />
      <button
        type="submit"
        title="Clique para alternar"
        className={`rounded-full px-3 py-2 text-[11px] font-bold transition ${
          valor
            ? "bg-brand text-ink hover:brightness-95"
            : "border border-line text-ink-soft hover:border-ink"
        }`}
      >
        {valor ? ligado : desligado}
      </button>
    </form>
  );
}
