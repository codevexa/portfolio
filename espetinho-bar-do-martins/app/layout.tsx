import type { Metadata, Viewport } from "next"
import { Inter, Oswald } from "next/font/google"
import { SEO_DESCRIPTION, SEO_KEYWORDS, siteUrl } from "@/lib/site"
import "./globals.css"

const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap", weight: ["400", "500", "600", "700"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

const NAME = "Espetinho Bar do Martins"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${NAME} | Espetinhos na brasa e cachurrascos em Porto Alegre`,
    template: `%s | ${NAME}`,
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: NAME,
    title: `${NAME} — O sabor da brasa que conquista!`,
    description: SEO_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#0c0806",
  colorScheme: "dark",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
