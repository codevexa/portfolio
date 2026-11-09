import { getPerguntas } from "@/lib/db";

export async function Faq() {
  const faqs = await getPerguntas();
  if (faqs.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-2.5">
      {faqs.map((f, i) => (
        <details
          key={f.id}
          open={i === 0}
          className="group rounded-2xl border border-line bg-white px-5 py-4 open:bg-surface"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">
            {f.pergunta}
            <span className="text-lg text-gold-deep transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
            {f.resposta}
          </p>
        </details>
      ))}
    </div>
  );
}
