import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoMark } from "@/components/logo";
import { sair } from "./actions";

export const metadata: Metadata = {
  title: "Painel do vendedor",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <span className="text-[15px] font-extrabold tracking-tight">
              Painel
            </span>
          </Link>

          <nav className="ml-2 flex flex-1 items-center gap-0.5 overflow-x-auto">
            <AdminLink href="/admin">Produtos</AdminLink>
            <AdminLink href="/admin/banners">Banners</AdminLink>
            <AdminLink href="/admin/times">Times</AdminLink>
            <AdminLink href="/admin/ligas">Ligas</AdminLink>
            <AdminLink href="/admin/categorias">Categorias</AdminLink>
            <AdminLink href="/admin/textos">Textos</AdminLink>
            <AdminLink href="/admin/pagamentos">Pagamentos</AdminLink>
            <AdminLink href="/admin/cupons">Cupons</AdminLink>
            <AdminLink href="/admin/config">Configurações</AdminLink>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-full border border-line px-4 py-2 text-[13px] font-semibold transition hover:border-ink sm:inline-block"
            >
              Ver a loja ↗
            </Link>
            <form action={sair}>
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white transition hover:bg-ink/85"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}

function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold text-ink-soft transition hover:bg-surface hover:text-ink"
    >
      {children}
    </Link>
  );
}
