"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LETTERS = ["V", "E", "X", "A"];
const KEY = "vexa:intro-seen";

/**
 * Animação de entrada da marca.
 * Roda uma vez por sessão e respeita "prefers-reduced-motion".
 */
export default function BrandIntro() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let seen = true;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) return;

    setVisible(true);
    document.documentElement.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* sessionStorage indisponível: a intro simplesmente roda de novo. */
      }
    }, 1850);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
          exit={{ y: "-100%", transition: { duration: 0.85, ease: [0.83, 0, 0.17, 1] } }}
        >
          <div className="relative flex flex-col items-center">
            <div className="flex items-baseline">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={letter}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.1 + i * 0.07,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block font-[family-name:var(--font-display)] text-[16vw] font-bold uppercase leading-none tracking-[0.1em] text-bone md:text-[8rem]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 h-px w-[60vw] origin-left bg-lime md:w-[22rem]"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="eyebrow mt-5"
            >
              Digital Experience Studio
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
