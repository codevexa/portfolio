"use client";

import { useActionState } from "react";
import type { Depoimento } from "@/lib/texts";
import {
  excluirDepoimento,
  salvarDepoimento,
  type ActionState,
} from "@/app/admin/actions";
import { Erro, Ok, Salvar, inputCls } from "./form-ui";

export function ReviewForm({ item }: { item?: Depoimento }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarDepoimento,
    null,
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <form action={formAction} className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold">
            O que o cliente escreveu
          </span>
          <textarea
            name="texto"
            required
            rows={3}
            defaultValue={item?.texto ?? ""}
            className={inputCls}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Nome</span>
            <input
              name="nome"
              required
              defaultValue={item?.nome ?? ""}
              placeholder="Joseane"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Cidade</span>
            <input
              name="cidade"
              defaultValue={item?.cidade ?? ""}
              placeholder="Campina Grande PB"
              className={inputCls}
            />
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
          <Salvar label={item ? "Salvar" : "Criar depoimento"} />
          {item && (
            <button
              type="submit"
              formAction={excluirDepoimento}
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
