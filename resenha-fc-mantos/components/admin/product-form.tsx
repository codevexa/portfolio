"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { PATTERNS, type Club, type League } from "@/lib/clubs";
import { CATEGORIAS_PADRAO, type Category, type Product } from "@/lib/products";
import { excluirProduto, salvarProduto, type ActionState } from "@/app/admin/actions";
import { ImageUpload } from "./image-upload";
import { Bloco, Campo, Erro, Excluir, Marcar, Salvar, inputCls } from "./form-ui";

export function ProductForm({
  produto,
  clubes,
  ligas,
  categorias = CATEGORIAS_PADRAO,
}: {
  produto?: Product;
  clubes: Club[];
  ligas: League[];
  categorias?: Category[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    salvarProduto,
    null,
  );

  const tamanhosIniciais = produto?.sizes ?? ["P", "M", "G", "GG", "XGG"];
  const [tamanhos, setTamanhos] = useState(tamanhosIniciais.join(", "));
  const [controla, setControla] = useState(produto?.tracksStock ?? false);

  const listaTamanhos = tamanhos
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <>
      <form action={formAction} className="space-y-7">
        {produto && <input type="hidden" name="id" value={produto.id} />}
        <Erro msg={state?.erro} />

        <Bloco titulo="Foto do produto">
          <ImageUpload valorInicial={produto?.image ?? ""} />
        </Bloco>

        <Bloco titulo="Identificação">
          <Campo label="Nome do produto" dica="Ex.: Flamengo Titular 26/27">
            <input name="nome" required defaultValue={produto?.name ?? ""} className={inputCls} />
          </Campo>

          <Campo label="Endereço no site (slug)" dica="Deixe vazio para gerar a partir do nome.">
            <input
              name="slug"
              defaultValue={produto?.slug ?? ""}
              placeholder="flamengo-titular-26-27"
              className={inputCls}
            />
          </Campo>

          <Campo label="Descrição" dica="Opcional. Aparece na página do produto.">
            <textarea
              name="descricao"
              rows={4}
              defaultValue={produto?.description ?? ""}
              className={inputCls}
            />
          </Campo>
        </Bloco>

        <Bloco titulo="Preço">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Preço de venda (R$)">
              <input
                name="preco"
                required
                inputMode="decimal"
                defaultValue={produto?.price ?? ""}
                placeholder="160,00"
                className={inputCls}
              />
            </Campo>
            <Campo label="Preço “de” (R$)" dica="Opcional. Vira o selo de desconto.">
              <input
                name="preco_de"
                inputMode="decimal"
                defaultValue={produto?.oldPrice ?? ""}
                placeholder="299,00"
                className={inputCls}
              />
            </Campo>
          </div>
        </Bloco>

        <Bloco titulo="Classificação">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Categoria">
              <select
                name="categoria"
                defaultValue={produto?.category ?? "camisas"}
                className={inputCls}
              >
                {categorias
                  .filter((c) => c.id !== "pronta-entrega")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.active ? "" : " (desativada)"}
                    </option>
                  ))}
              </select>
            </Campo>

            <Campo label="Liga">
              <select name="liga" defaultValue={produto?.league ?? ""} className={inputCls}>
                <option value="">— nenhuma —</option>
                {ligas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Time" dica="Define as cores do manto desenhado e o escudo.">
              <select name="clube" defaultValue={produto?.clubId ?? ""} className={inputCls}>
                <option value="">— nenhum —</option>
                {clubes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.active ? "" : " (desativado)"}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Ordem" dica="Menor número aparece primeiro.">
              <input
                name="ordem"
                type="number"
                defaultValue={produto?.order ?? 0}
                className={inputCls}
              />
            </Campo>
          </div>

          <Campo label="Tamanhos" dica="Separe por vírgula. O estoque abaixo acompanha esta lista.">
            <input
              name="tamanhos"
              value={tamanhos}
              onChange={(e) => setTamanhos(e.target.value)}
              className={inputCls}
            />
          </Campo>
        </Bloco>

        <Bloco titulo="Estoque">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition hover:border-ink">
            <input
              type="checkbox"
              name="controla_estoque"
              checked={controla}
              onChange={(e) => setControla(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#0e0e0e]"
            />
            <span>
              <span className="block text-[13px] font-bold">Controlar estoque</span>
              <span className="mt-0.5 block text-[12px] text-ink-soft">
                Ligado, o tamanho sem peça aparece riscado no site e o produto
                vira “Esgotado” quando zera tudo. Desligado, está sempre
                disponível.
              </span>
            </span>
          </label>

          {controla && (
            <div>
              <span className="mb-2 block text-[13px] font-bold">
                Quantidade por tamanho
              </span>
              <div className="flex flex-wrap gap-3">
                {listaTamanhos.map((t) => (
                  <label key={t} className="w-[88px]">
                    <span className="mb-1 block text-center text-[12px] font-bold">
                      {t}
                    </span>
                    <input
                      name={`estoque_${t}`}
                      type="number"
                      min={0}
                      defaultValue={produto?.stock?.[t] ?? 0}
                      className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-center text-sm outline-none focus:border-ink"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </Bloco>

        <Bloco titulo="Situação">
          <div className="space-y-3">
            <Marcar
              name="pronta_entrega"
              defaultChecked={produto?.readyToShip ?? false}
              titulo="Pronta entrega"
              texto="Está no estoque e sai hoje. Ganha o selo amarelo e entra na vitrine da home."
            />
            <Marcar
              name="ativo"
              defaultChecked={produto?.active ?? true}
              titulo="Publicado"
              texto="Desmarque para esconder do site sem apagar o cadastro."
            />
          </div>
        </Bloco>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Salvar label="Salvar produto" />
          <Link
            href="/admin"
            className="rounded-full border border-line px-6 py-3 text-[13px] font-bold transition hover:border-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {produto && (
        <Excluir
          action={excluirProduto}
          id={produto.id}
          titulo="Excluir produto"
          texto="Apaga o cadastro de vez. Para só tirar do ar, desmarque “Publicado”."
        />
      )}
    </>
  );
}

export { PATTERNS };
