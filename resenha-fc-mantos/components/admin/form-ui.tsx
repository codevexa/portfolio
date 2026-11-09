"use client";

import { useFormStatus } from "react-dom";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-ink";

export function Salvar({ label = "Salvar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold text-white transition hover:bg-ink/85 disabled:opacity-50"
    >
      {pending ? "Salvando…" : label}
    </button>
  );
}

export function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="mb-4 text-[13px] font-bold tracking-[0.1em] text-ink-soft">
        {titulo.toUpperCase()}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Campo({
  label,
  dica,
  children,
}: {
  label: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold">{label}</span>
      {children}
      {dica && <span className="mt-1.5 block text-[12px] text-ink-soft">{dica}</span>}
    </label>
  );
}

export function Marcar({
  name,
  defaultChecked,
  titulo,
  texto,
}: {
  name: string;
  defaultChecked: boolean;
  titulo: string;
  texto: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition hover:border-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#0e0e0e]"
      />
      <span>
        <span className="block text-[13px] font-bold">{titulo}</span>
        <span className="mt-0.5 block text-[12px] text-ink-soft">{texto}</span>
      </span>
    </label>
  );
}

export function Cor({
  name,
  label,
  valor,
}: {
  name: string;
  label: string;
  valor: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          name={name}
          defaultValue={valor}
          className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-white p-1"
        />
        <span className="text-[12px] text-ink-soft">{valor}</span>
      </span>
    </label>
  );
}

export function Erro({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
      {msg}
    </p>
  );
}

export function Ok({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-xl bg-brand/25 px-4 py-3 text-[13px] font-semibold text-ink">
      {msg}
    </p>
  );
}

export function Excluir({
  action,
  id,
  titulo,
  texto,
}: {
  action: (form: FormData) => void | Promise<void>;
  id: string;
  titulo: string;
  texto: string;
}) {
  return (
    <form
      action={action}
      className="mt-10 rounded-2xl border border-red-200 bg-red-50/50 p-5"
    >
      <input type="hidden" name="id" value={id} />
      <p className="text-[13px] font-bold text-red-800">{titulo}</p>
      <p className="mb-3 mt-1 text-[12px] text-red-700/80">{texto}</p>
      <button
        type="submit"
        className="rounded-full bg-red-700 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-800"
      >
        Excluir
      </button>
    </form>
  );
}
