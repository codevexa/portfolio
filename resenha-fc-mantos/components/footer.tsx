import Link from "next/link";
import { waLink } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { getCategories, getTexts } from "@/lib/db";
import { LogoMark } from "./logo";

export async function Footer() {
  const [s, categorias, t] = await Promise.all([
    getSettings(),
    getCategories(),
    getTexts(),
  ]);

  const institucional = [
    { label: t["sobre.loja.titulo"], href: "/sobre" },
    { label: t["sobre.trocas.titulo"], href: "/sobre#trocas" },
    { label: t["sobre.entrega.titulo"], href: "/sobre#entrega" },
    { label: t["sobre.pagamento.titulo"], href: "/sobre#pagamento" },
  ];

  const selos = t["rodape.selos"]
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col items-center text-center">
          <LogoMark size={56} />
          <p className="mt-3 text-lg font-extrabold">{s.storeName}</p>
          <p className="mt-1.5 max-w-md text-sm text-white/55">
            {t["rodape.chamada"]}
          </p>
          <p className="mt-1 text-xs text-white/40">
            {s.hours} · Atendimento no WhatsApp
          </p>

          <div className="mt-5 flex gap-2">
            <a
              href={s.instagram ? `https://instagram.com/${s.instagram.replace("@", "")}` : "/admin/config"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
              </svg>
            </a>
            <a
              href={waLink(s.whatsapp, `Olá! Vim pelo site da ${s.storeName}.`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z" />
              </svg>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {selos.map(
              (b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3.5 py-2 text-[11px] font-semibold text-white/70"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.4">
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterCol title="INSTITUCIONAL">
            {institucional.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title={t["menu.categorias"]}>
            {categorias.slice(0, 7).map((c) => (
              <FooterLink
                key={c.id}
                href={`/categoria/${c.id}`}
              >
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="COMPRAR">
            <FooterLink href="/catalogo">{t["menu.catalogo"]}</FooterLink>
            <FooterLink href="/carrinho">{t["menu.carrinho"]}</FooterLink>
            <FooterLink href="/busca">{t["busca.titulo"]}</FooterLink>
            <FooterLink href="/rastreio">{t["rastreio.titulo"]}</FooterLink>
          </FooterCol>

          <FooterCol title="ATENDIMENTO">
            <li>
              <a
                href={waLink(s.whatsapp, "Olá! Preciso de ajuda com um pedido.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/55 transition hover:text-white"
              >
                {t["rodape.fale"]}
              </a>
            </li>
            <li>
              <a
                href={waLink(s.whatsapp, "Olá! Quero acompanhar o meu pedido.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/55 transition hover:text-white"
              >
                {t["rodape.acompanhar"]}
              </a>
            </li>
            <FooterLink href="/sobre">{t["sobre.loja.titulo"]}</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-[11px] font-bold tracking-[0.14em] text-white/35">
            FORMAS DE PAGAMENTO
          </p>
          <div className="mt-3 flex justify-center gap-5 text-[13px] font-semibold text-white/70">
            {s.payments.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <p className="mt-7 text-[11px] text-white/30">
            © {new Date().getFullYear()} {s.storeName} — Todos os direitos
            reservados
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-white/80">
        {title}
      </p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-white/55 transition hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
