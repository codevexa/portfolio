"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/db";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const s = banners[Math.min(i, banners.length - 1)];

  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: s.image
            ? `linear-gradient(90deg, ${s.from}f2 0%, ${s.from}99 55%, transparent 100%), url(${s.image}) center/cover no-repeat, ${s.from}`
            : `radial-gradient(120% 120% at 85% 15%, ${s.to}33 0%, transparent 55%), ${s.from}`,
          transition: "background 600ms ease",
        }}
      >
        <div className="relative flex min-h-[320px] flex-col justify-center gap-4 p-7 sm:min-h-[400px] sm:p-14 lg:min-h-[460px]">
          {s.eyebrow && (
            <span
              className="w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{ background: s.to, color: "#0b0b0b" }}
            >
              {s.eyebrow}
            </span>
          )}
          <h1 className="max-w-xl text-[28px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
            {s.title}
          </h1>
          {s.text && (
            <p className="max-w-md text-sm text-white/70 sm:text-base">{s.text}</p>
          )}
          {s.ctaLabel && (
            <Link
              href={s.ctaHref || "/"}
              className="mt-2 w-fit rounded-full px-6 py-3 text-sm font-bold text-ink transition hover:brightness-95"
              style={{ background: s.to }}
            >
              {s.ctaLabel} →
            </Link>
          )}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => setI((v) => (v - 1 + banners.length) % banners.length)}
              className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:grid"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => setI((v) => (v + 1) % banners.length)}
              className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:grid"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {banners.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Ir para o banner ${n + 1}`}
                  onClick={() => setI(n)}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: n === i ? 22 : 6,
                    background: n === i ? "#fff" : "rgba(255,255,255,.45)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
