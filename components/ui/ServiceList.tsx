"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

export default function ServiceList({ services }: { services: Service[] }) {
  const [open, setOpen] = useState<string | null>(services[0]?.index ?? null);
  const baseId = useId();
  const reduce = useReducedMotion();

  return (
    <ul className="border-t border-line">
      {services.map((service) => {
        const expanded = open === service.index;
        const panelId = `${baseId}-${service.index}`;

        return (
          <li key={service.index} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : service.index)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="group flex w-full items-center gap-5 py-7 text-left transition-colors duration-500 md:gap-10 md:py-9"
              >
                <span
                  className={cn(
                    "w-8 shrink-0 font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.14em] transition-colors duration-500",
                    expanded ? "text-lime" : "text-dim group-hover:text-lime",
                  )}
                >
                  {service.index}
                </span>

                <span className="flex-1">
                  <span
                    className={cn(
                      "display block text-[1.5rem] leading-tight transition-colors duration-500 sm:text-[2rem] lg:text-[2.4rem]",
                      expanded ? "text-lime" : "text-bone group-hover:text-lime",
                    )}
                  >
                    {service.title}
                  </span>
                </span>

                <span className="hidden max-w-[22ch] flex-1 text-sm leading-relaxed text-muted lg:block">
                  {service.summary}
                </span>

                <span
                  aria-hidden
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                    expanded
                      ? "rotate-45 border-lime bg-lime text-ink"
                      : "border-line text-muted group-hover:border-lime group-hover:text-lime",
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-8 pb-10 md:grid-cols-[auto_1.2fr_1fr] md:gap-10 md:pl-[4.5rem]">
                    <p className="max-w-lg leading-relaxed text-muted md:col-start-2 lg:hidden">
                      {service.summary}
                    </p>
                    <p className="max-w-lg leading-relaxed text-bone md:col-start-2">
                      {service.detail}
                    </p>
                    <ul className="space-y-2.5 md:col-start-3">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-muted"
                        >
                          <span aria-hidden className="h-px w-4 bg-lime/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
