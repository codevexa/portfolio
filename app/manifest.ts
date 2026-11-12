import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.positioning}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07070a",
    theme_color: "#07070a",
    lang: "pt-BR",
    icons: [
      { src: "/icon-180.png", sizes: "180x180", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
