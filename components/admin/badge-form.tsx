"use client";

import { useActionState } from "react";
import { ICONES_GARANTIA, iconePath, type Garantia } from "@/lib/texts";
import {
  excluirGarantia,
  salvarGarantia,
  type ActionState,
} from "@/app/admin/actions";
import { Erro, Ok, Salvar, inputCls } from "./form-ui";

export function BadgeForm({ item }: { item?: Garantia }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarGarantia,
    null,
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <form action={formAction} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto]">
          <span className="grid h-11 w-11 place-items-center self-end rounded-xl border border-line">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gold-deep)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={iconePath(item?.icone ?? "star")} />
            </svg>
          </span>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Texto</span>
            <input
              name="texto"
              required
              defaultValue={item?.texto ?? ""}
              placeholder="Enviamos pro Brasil todo"
              className={inputCls}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Ícone</span>
            <select
              name="icone"
              defaultValue={item?.icone ?? "star"}
              className={inputCls}
            >
              {ICONES_GARANTIA.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Ordem</span>
            <input
              name="ordem"
              type="number"
              defaultValue={item?.ordem ?? 0}
              className={inputCls}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 self-end rounded-xl border border-line px-4 py-3">
            <input
              type="checkbox"
              name="ativo"
              defaultChecked={item?.ativo ?? true}
              className="h-4 w-4 accent-[#0e0e0e]"
            />
            <span className="text-[13px] font-bold">No ar</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Salvar label={item ? "Salvar" : "Criar garantia"} />
          {item && (
            <button
              type="submit"
              formAction={excluirGarantia}
              name="id"
              value={item.id}
              className="rounded-full border border-red-200 px-5 py-2.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50"
            >
              Excluir
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
