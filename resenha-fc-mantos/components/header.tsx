import Link from "next/link";
import { isOpenNow, waLink } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { getCategories, getLeagues, getTexts } from "@/lib/db";
import { Marquee } from "./marquee";
import { LogoMark } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { CartLink } from "./cart/cart-link";
import { PackageIcon } from "./package-icon";

export async function Header() {
  const [s, leagues, categorias, t] = await Promise.all([
    getSettings(),
    getLeagues(),
    getCategories(),
    getTexts(),
  ]);
  const open = isOpenNow(s);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <Marquee items={s.marquee} />

      <div className="border-b border-line">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4">
          <MobileMenu leagues={leagues} categorias={categorias} textos={t} />

          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="leading-tight">
              <span className="block text-[17px] font-extrabold tracking-tight">
                {s.storeName}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${open ? "bg-brand ring-2 ring-gold/50" : "bg-ink-soft"}`}
                  aria-hidden="true"
                />
                <span className={open ? "text-gold-deep" : "text-ink-soft"}>
                  {open ? "Aberto agora" : s.hours}
                </span>
              </span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="border-b-2 border-ink pb-1 text-[13px] font-bold tracking-wide"
            >
              {t["menu.inicio"]}
            </Link>
            <Link
              href="/catalogo"
              className="border-b-2 border-transparent pb-1 text-[13px] font-bold tracking-wide text-ink-soft transition hover:text-ink"
            >
              {t["menu.catalogo"]}
            </Link>
            <Link
              href="/rastreio"
              className="flex items-center gap-1.5 border-b-2 border-transparent pb-1 text-[13px] font-bold tracking-wide text-ink-soft transition hover:text-ink"
            >
              <PackageIcon size={15} strokeWidth={2} />
              {t["menu.rastreio"]}
            </Link>
          </nav>

          <form action="/busca" className="ml-auto hidden md:block">
            <label htmlFor="q" className="sr-only">
              Buscar manto
            </label>
            <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-soft">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" strokeLinecap="round" />
              </svg>
              <input
                id="q"
                name="q"
                type="search"
                placeholder={t["header.busca"]}
                className="w-44 bg-transparent text-sm outline-none placeholder:text-ink-soft lg:w-60"
              />
            </div>
          </form>

          <Link
            href="/busca"
            aria-label="Buscar"
            className="ml-auto grid h-9 w-9 place-items-center md:hidden"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" strokeLinecap="round" />
            </svg>
          </Link>

          <CartLink />

          <a
            href={waLink(s.whatsapp, `Olá! Quero falar com a ${s.storeName}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hidden rounded-full bg-ink px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-ink/85 sm:inline-block"
          >
            {t["header.zap"]}
          </a>
        </div>
      </div>
    </header>
  );
}
