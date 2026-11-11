"use client";

import { useState } from "react";
import {
  MAX_CODIGO,
  TRANSPORTADORA,
  normalizarCodigo,
  validarCodigo,
} from "@/lib/rastreio";
import type { Textos } from "@/lib/texts";
import { PackageIcon } from "@/components/package-icon";

export function TrackingForm({
  textos: t,
  whatsapp,
}: {
  textos: Textos;
  whatsapp: string;
}) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  function copiar(valor: string) {
    // Sem await antes do envio do formulário, para a aba nova não ser
    // barrada pelo bloqueador de pop-up. Se a cópia falhar, o código
    // continua visível na tela para o cliente copiar na mão.
    navigator.clipboard
      ?.writeText(valor)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 4000);
      })
      .catch(() => setCopiado(false));
  }

  /**
   * O formulário aponta de verdade para o site da J&T, com target="_blank":
   * sem JavaScript ele ainda abre a página oficial, e o campo obrigatório é
   * validado pelo próprio navegador. Com JavaScript, a validação fica mais
   * clara e o código vai copiado.
   */
  function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    const limpo = normalizarCodigo(codigo);
    const problema = validarCodigo(limpo);

    if (problema) {
      e.preventDefault();
      setErro(
        problema === "vazio"
          ? t["rastreio.erro_vazio"]
          : problema === "curto"
            ? t["rastreio.erro_curto"]
            : t["rastreio.erro_longo"],
      );
      setEnviado(null);
      return;
    }

    // Com JavaScript a gente abre a aba na mão, para o endereço da J&T
    // ficar limpo. Se o navegador bloquear a aba nova, o painel abaixo
    // mostra o link para o cliente abrir no clique dele.
    e.preventDefault();
    // Sem "noopener" na lista de opções: com ela o window.open devolve
    // null sempre, e não dava para saber se a aba foi mesmo bloqueada.
    // A referência é cortada logo depois, que dá na mesma em segurança.
    const aba = window.open(TRANSPORTADORA.urlRastreio, "_blank");
    if (aba) aba.opener = null;
    setBloqueado(!aba);
    setErro(null);
    setEnviado(limpo);
    copiar(limpo);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[12px] font-bold">
          <PackageIcon size={16} className="text-gold-deep" />
          {t["rastreio.transportadora"]}
        </span>

        <form
          action={TRANSPORTADORA.urlRastreio}
          method="get"
          target="_blank"
          rel="noopener noreferrer"
          onSubmit={aoEnviar}
          className="mt-5"
        >
          <label htmlFor="codigo" className="mb-1.5 block text-[13px] font-bold">
            {t["rastreio.label"]}
          </label>
          {/* Sem atributo name: a J&T ignora parâmetros na URL, então nada
              é anexado ao endereço e o link fica limpo. */}
          <input
            id="codigo"
            required
            maxLength={MAX_CODIGO}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="search"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              if (erro) setErro(null);
            }}
            placeholder={t["rastreio.placeholder"]}
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? "erro-codigo" : undefined}
            className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal focus:border-ink"
          />

          {erro && (
            <p
              id="erro-codigo"
              role="alert"
              className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700"
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-ink/85"
          >
            <PackageIcon size={18} strokeWidth={2} />
            {t["rastreio.botao"]}
          </button>
        </form>

        <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-soft">
          {t["rastreio.aviso"]}
        </p>
      </div>

      {enviado && (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-line bg-surface p-5"
        >
          <p className="text-[13px] font-bold">
            {bloqueado
              ? t["rastreio.bloqueado.titulo"]
              : copiado
                ? t["rastreio.copiado.titulo"]
                : t["rastreio.aberto.titulo"]}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
            {bloqueado
              ? t["rastreio.bloqueado.texto"]
              : copiado
                ? t["rastreio.copiado.texto"]
                : t["rastreio.aberto.texto"]}
          </p>

          <p className="mt-3 select-all break-all rounded-xl border border-line bg-white px-4 py-3 text-center font-mono text-sm font-bold tracking-wider">
            {enviado}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copiar(enviado)}
              className="rounded-full border border-line bg-white px-5 py-2.5 text-[12px] font-bold transition hover:border-ink"
            >
              {t["rastreio.copiar"]}
            </button>
            <a
              href={TRANSPORTADORA.urlRastreio}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-5 py-2.5 text-[12px] font-bold transition ${
                bloqueado
                  ? "bg-ink text-white hover:bg-ink/85"
                  : "border border-line bg-white hover:border-ink"
              }`}
            >
              {t["rastreio.abrir"]} ↗
            </a>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-[13px] text-ink-soft">
        {t["rastreio.ajuda"]}{" "}
        <a
          href={
            whatsapp.replace(/\D/g, "")
              ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Olá! Quero o código de rastreio do meu pedido.",
                )}`
              : "/admin/config"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-ink underline underline-offset-2"
        >
          {t["rastreio.ajuda_link"]}
        </a>
      </p>
    </div>
  );
}
