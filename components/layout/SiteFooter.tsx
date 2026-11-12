import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Mark } from "@/components/brand/Logo";
import Reveal from "@/components/motion/Reveal";

const year = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="container-vx pb-12 pt-20 md:pt-28">
        <Reveal className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="w-10 opacity-90">
              <Mark />
            </div>
            <p className="display mt-7 text-[1.8rem] leading-[1.05] text-bone sm:text-[2.3rem]">
              Ideias que
              <br />
              viram interface.
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              {site.description}
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="eyebrow mb-6">Navegação</p>
            <ul className="space-y-3.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="vx-underline text-sm text-muted transition-colors duration-300 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-6">Contato</p>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-lime"
                >
                  WhatsApp {site.contact.whatsappDisplay}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href={site.contact.instagram.studio.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-lime"
                >
                  Instagram {site.contact.instagram.studio.handle}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href={site.contact.instagram.founder.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-lime"
                >
                  Fundador {site.contact.instagram.founder.handle}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.14em] text-dim">
            © {year} {site.name} — Todos os direitos reservados.
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.14em] text-dim">
            {site.signature}
          </p>
        </div>
      </div>

      {/* Assinatura tipográfica de fundo */}
      <div aria-hidden className="pointer-events-none select-none px-2 pb-2">
        <p className="display bg-gradient-to-b from-bone/[0.07] to-transparent bg-clip-text text-center text-[22vw] leading-[0.8] text-transparent">
          VEXA
        </p>
      </div>
    </footer>
  );
}
