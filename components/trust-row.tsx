import { iconePath } from "@/lib/texts";
import { getGarantias } from "@/lib/db";

export async function TrustRow() {
  const itens = await getGarantias();
  if (itens.length === 0) return null;

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-7 px-4 py-9">
        {itens.map((it) => (
          <div
            key={it.id}
            className="flex w-[130px] flex-col items-center gap-2 text-center"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-gold-deep)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={iconePath(it.icone)} />
            </svg>
            <span className="text-[12px] font-bold leading-tight">
              {it.texto}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
