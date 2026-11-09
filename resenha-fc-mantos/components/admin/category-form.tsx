"use client";

import { useActionState } from "react";
import type { Category } from "@/lib/products";
import {
  excluirCategoria,
  salvarCategoria,
  type ActionState,
} from "@/app/admin/actions";
import { Cor, Erro, Ok, Salvar, inputCls } from "./form-ui";

export function CategoryForm({
  categoria,
  produtos = 0,
}: {
  categoria?: Category;
  produtos?: number;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarCategoria,
    null,
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <form action={formAction} className="space-y-4">
        {categoria && (
          <input type="hidden" name="id_atual" value={categoria.id} />
        )}
        <Erro msg={state?.erro} />
        <Ok msg={state?.ok} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Nome</span>
            <input
              name="nome"
              required
              defaultValue={categoria?.name ?? ""}
              placeholder="Camisas"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">
              Endereço no site
            </span>
            <input
              name="id"
              defaultValue={categoria?.id ?? ""}
              placeholder="camisas"
              className={inputCls}
            />
            <span className="mt-1.5 block text-[12px] text-ink-soft">
              {categoria
                ? `/categoria/${categoria.id}`
                : "Deixe vazio para gerar a partir do nome."}
            </span>
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold">Descrição</span>
          <input
            name="descricao"
            defaultValue={categoria?.blurb ?? ""}
            placeholder="Clubes e seleções"
            className={inputCls}
          />
          <span className="mt-1.5 block text-[12px] text-ink-soft">
            Aparece abaixo do título da página da categoria.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-4">
          <Cor
            name="cor_fundo"
            label="Fundo do card"
            valor={categoria?.from ?? "#0b0b0b"}
          />
          <Cor
            name="cor_destaque"
            label="Destaque"
            valor={categoria?.to ?? "#e3ff00"}
          />
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold">Ordem</span>
            <input
              name="ordem"
              type="number"
              defaultValue={categoria?.order ?? 0}
              className={inputCls}
            />
          </label>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5">
              <input
                type="checkbox"
                name="ativo"
                defaultChecked={categoria?.active ?? true}
                className="h-4 w-4 accent-[#0e0e0e]"
              />
              <span className="text-[13px] font-bold">No ar</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5">
              <input
                type="checkbox"
                name="destaque"
                defaultChecked={categoria?.featured ?? true}
                className="h-4 w-4 accent-[#0e0e0e]"
              />
              <span className="text-[13px] font-bold">Card na home</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Salvar label={categoria ? "Salvar" : "Criar categoria"} />
          {categoria && (
            <>
              <button
                type="submit"
                formAction={excluirCategoria}
                name="id"
                value={categoria.id}
                className="rounded-full border border-red-200 px-5 py-2.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50"
              >
                Excluir
              </button>
              <span className="text-[12px] text-ink-soft">
                {produtos === 0
                  ? "Nenhum produto nesta categoria."
                  : `${produtos} produto(s) nesta categoria — excluir só desativa.`}
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
