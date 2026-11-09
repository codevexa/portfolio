import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  icons: { icon: "/icon.webp", apple: "/logo.webp" },
  openGraph: {
    images: ["/logo.webp"],
    title: site.name,
    description: site.description,
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
  },
  twitter: {
    images: ["/logo.webp"],
    card: "summary",
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={sora.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
