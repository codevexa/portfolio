"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Título revelado linha a linha, cada uma subindo de trás de uma máscara.
 * Recebe as linhas já quebradas para manter o controle tipográfico.
 */
export default function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  animateOnView = false,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  animateOnView?: boolean;
}) {
  const reduce = useReducedMotion();

  const animationProps = animateOnView
    ? { whileInView: "show" as const, viewport: { once: true, margin: "-15% 0px" } }
    : { animate: "show" as const };

  return (
    <motion.span
      initial="hidden"
      {...animationProps}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={cn("block", className)}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            variants={{
              hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className={cn("block", lineClassName)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
