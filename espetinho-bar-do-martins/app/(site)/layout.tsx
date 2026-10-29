import { StoreProvider } from "@/components/cart/store"
import { FloatingUi } from "@/components/site/floating"
import { Footer } from "@/components/site/footer"
import { Header } from "@/components/site/header"
import { NoticeBar } from "@/components/site/notice-bar"
import { getCatalog, getSettings } from "@/lib/data"

// Páginas públicas são geradas em cache e atualizadas quando o painel salva algo (e a cada 5 min).
export const revalidate = 300

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()])
  return (
    <StoreProvider catalog={catalog} settings={settings}>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ouro focus:px-4 focus:py-2 focus:text-carvao">
        Pular para o conteúdo
      </a>
      <NoticeBar settings={settings} />
      <Header />
      <main id="conteudo">{children}</main>
      <Footer settings={settings} />
      <FloatingUi />
    </StoreProvider>
  )
}
