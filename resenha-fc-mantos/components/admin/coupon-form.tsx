"use client";

import { useActionState, useState } from "react";
import { excluirCupom, salvarCupom, type ActionState } from "@/app/admin/actions";
import { Erro, Ok, Salvar, inputCls } from "./form-ui";

export type Cupom = {
  id: string;
  codigo: string;
  tipo: string;
  valor: number;
  minimo: number;
  usos_max: number | null;
  usos: number;
  valido_ate: string | null;
  ativo: boolean;
};

export function CouponForm({ cupom }: { cupom?: Cupom }) {
  const [state, formAction] = useActionState<ActionState, FormData>(salvarCupom, null);
  const [tipo, setTipo] = useState(cupom?.tipo ?? "percentual");

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <form action={formAction} className="space-y-4">
        {cupom && <input type="hidden" name="id" value={cupom.id} />}
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Código</span>
            <input
              name="codigo"
              required
              defaultValue={cupom?.codigo ?? ""}
              placeholder="RESENHA10"
              className={`${inputCls} uppercase`}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Tipo</span>
            <select
              name="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={inputCls}
            >
              <option value="percentual">Porcentagem (%)</option>
              <option value="valor">Valor fixo (R$)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">
              {tipo === "percentual" ? "Desconto (%)" : "Desconto (R$)"}
            </span>
            <input
              name="valor"
              required
              inputMode="decimal"
              defaultValue={cupom?.valor ?? ""}
              className={inputCls}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Pedido mínimo (R$)</span>
            <input
              name="minimo"
              inputMode="decimal"
              defaultValue={((cupom?.minimo ?? 0) / 100).toFixed(2).replace(".", ",")}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Limite de usos</span>
            <input
              name="usos_max"
              type="number"
              min={1}
              defaultValue={cupom?.usos_max ?? ""}
              placeholder="sem limite"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Vale até</span>
            <input
              name="valido_ate"
              type="date"
              defaultValue={cupom?.valido_ate?.slice(0, 10) ?? ""}
              className={inputCls}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5">
            <input
              type="checkbox"
              name="ativo"
              defaultChecked={cupom?.ativo ?? true}
              className="h-4 w-4 accent-[#0e0e0e]"
            />
            <span className="text-[13px] font-bold">Valendo</span>
          </label>

          <Salvar label={cupom ? "Salvar" : "Criar cupom"} />

          {cupom && (
            <>
              <button
                type="submit"
                formAction={excluirCupom}
                name="id"
                value={cupom.id}
                className="rounded-full border border-red-200 px-5 py-2.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50"
              >
                Excluir
              </button>
              <span className="text-[12px] text-ink-soft">
                usado {cupom.usos}x
                {cupom.usos_max ? ` de ${cupom.usos_max}` : ""}
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
