"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { briefToWhatsapp, type BriefFields } from "@/lib/whatsapp";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [...services.map((s) => s.title), "Ainda não sei / outro"];

const EMPTY: BriefFields = {
  nome: "",
  empresa: "",
  contato: "",
  tipo: PROJECT_TYPES[0],
  descricao: "",
};

type Errors = Partial<Record<keyof BriefFields, string>>;

/**
 * Formulário de solicitação de projeto.
 *
 * Não existe backend neste site, então nada é enviado para um servidor
 * e nenhum dado é armazenado: ao enviar, a solicitação é montada como
 * mensagem e aberta no WhatsApp do estúdio, onde a conversa continua.
 */
export default function ProjectBriefForm() {
  const [fields, setFields] = useState<BriefFields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof BriefFields>(key: K, value: BriefFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (fields.nome.trim().length < 2) next.nome = "Informe o seu nome.";
    if (fields.contato.trim().length < 6)
      next.contato = "Informe um WhatsApp ou e-mail para resposta.";
    if (fields.descricao.trim().length < 12)
      next.descricao = "Conte um pouco mais sobre o projeto.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    window.open(briefToWhatsapp(fields), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const inputBase =
    "w-full border-b border-line bg-transparent pb-3 pt-2 text-bone outline-none transition-colors duration-300 placeholder:text-dim focus:border-lime";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <Field
          id="nome"
          label="Nome"
          required
          error={errors.nome}
          value={fields.nome}
          onChange={(v) => update("nome", v)}
          placeholder="Como devo te chamar"
          autoComplete="name"
          className={inputBase}
        />
        <Field
          id="empresa"
          label="Empresa"
          error={undefined}
          value={fields.empresa}
          onChange={(v) => update("empresa", v)}
          placeholder="Opcional"
          autoComplete="organization"
          className={inputBase}
        />
      </div>

      <Field
        id="contato"
        label="Contato"
        required
        error={errors.contato}
        value={fields.contato}
        onChange={(v) => update("contato", v)}
        placeholder="WhatsApp ou e-mail"
        className={inputBase}
      />

      <div>
        <label htmlFor="tipo" className="eyebrow block">
          Tipo de projeto
        </label>
        <select
          id="tipo"
          value={fields.tipo}
          onChange={(e) => update("tipo", e.target.value)}
          className={cn(inputBase, "mt-3 cursor-pointer appearance-none")}
        >
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type} className="bg-ink text-bone">
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="descricao" className="eyebrow block">
          Descrição <span className="text-lime">*</span>
        </label>
        <textarea
          id="descricao"
          rows={5}
          value={fields.descricao}
          onChange={(e) => update("descricao", e.target.value)}
          aria-invalid={errors.descricao ? "true" : undefined}
          aria-describedby={errors.descricao ? "descricao-erro" : undefined}
          placeholder="O que você quer construir, para quem, e o que já existe hoje."
          className={cn(inputBase, "mt-3 resize-y")}
        />
        {errors.descricao && (
          <p id="descricao-erro" role="alert" className="mt-2.5 text-xs text-lime">
            {errors.descricao}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-lime px-8 py-4 font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-ink transition-colors duration-500"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-[650ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/btn:scale-y-100"
          />
          <span className="relative">Enviar pelo WhatsApp</span>
          <MessageCircle className="relative h-4 w-4" aria-hidden />
        </button>

        <p className="max-w-xs text-xs leading-relaxed text-dim">
          O formulário monta a mensagem e abre a conversa no WhatsApp. Nenhum dado é
          armazenado neste site.
        </p>
      </div>

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm text-lime">
        {sent
          ? "Mensagem montada. Se o WhatsApp não abrir, verifique o bloqueio de pop-ups do navegador."
          : ""}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  autoComplete,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label} {required && <span className="text-lime">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-erro` : undefined}
        className={cn(className, "mt-3")}
      />
      {error && (
        <p id={`${id}-erro`} role="alert" className="mt-2.5 text-xs text-lime">
          {error}
        </p>
      )}
    </div>
  );
}
