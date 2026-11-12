"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
          scrolled || open
            ? "border-b border-line bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="container-vx flex h-[72px] items-center justify-between md:h-[88px]">
          <Link
            href="/"
            aria-label={`${site.name} — início`}
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <Logo size="sm" />
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center gap-9 lg:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "vx-underline font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300",
                  isActive(item.href) ? "text-bone" : "text-muted hover:text-bone",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-line px-5 py-2.5 font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink md:inline-flex"
            >
              Iniciar projeto
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone transition-colors duration-300 hover:border-lime hover:text-lime lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[72px] lg:hidden"
          >
            <nav aria-label="Navegação" className="container-vx flex flex-1 flex-col justify-center">
              <ul>
                {site.nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-b border-line">
                    <motion.div
                      initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.06 + i * 0.05,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-baseline gap-4 py-5 text-bone"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-[0.65rem] text-dim">
                          0{i + 1}
                        </span>
                        <span className="display text-[2.4rem] sm:text-[3rem]">{item.label}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="container-vx pb-10"
            >
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-full bg-lime px-6 py-4 font-[family-name:var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-ink"
              >
                Iniciar um projeto
              </a>
              <p className="eyebrow mt-6 text-center">{site.signature}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
