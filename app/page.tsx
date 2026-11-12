import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import SelectedWork from "@/components/home/SelectedWork";
import FounderFeature from "@/components/home/FounderFeature";
import CapabilitiesPreview from "@/components/home/CapabilitiesPreview";
import ClosingCTA from "@/components/home/ClosingCTA";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.positioning}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <SelectedWork />
      <FounderFeature />
      <CapabilitiesPreview />
      <ClosingCTA />
    </>
  );
}
