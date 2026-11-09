import Link from "next/link";
import { getClubs, getLeagues } from "@/lib/db";
import { ClubBadge } from "./club-badge";

export async function ClubGrid() {
  const [clubs, leagues] = await Promise.all([getClubs(), getLeagues()]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {leagues.map((l) => (
          <Link
            key={l.id}
            href={`/liga/${l.id}`}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
          >
            {l.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {clubs.map((c) => (
          <Link
            key={c.id}
            href={`/time/${c.id}`}
            className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-ink"
          >
            <ClubBadge name={c.name} logo={c.logo} colors={c.colors} size={24} />
            <span className="truncate text-[13px] font-semibold">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
