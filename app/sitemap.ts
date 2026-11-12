import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projetos`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/servicos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/sobre`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/contato`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const cases: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projetos/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...cases];
}
