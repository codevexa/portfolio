import { getDepoimentos } from "@/lib/db";

export async function Feedback() {
  const reviews = await getDepoimentos();
  if (reviews.length === 0) return null;

  return (
    <div className="rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {reviews.map((r) => (
        <figure
          key={r.id}
          className="flex w-[260px] shrink-0 flex-col justify-between rounded-2xl border border-line bg-white p-5"
        >
          <span className="text-3xl leading-none text-gold" aria-hidden="true">
            “
          </span>
          <blockquote className="mt-2 text-sm leading-relaxed text-ink-soft">
            {r.texto}
          </blockquote>
          <figcaption className="mt-4 border-t border-line pt-3 text-[12px]">
            <span className="font-bold">{r.nome}</span>
            {r.cidade && <span className="text-ink-soft"> · {r.cidade}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
