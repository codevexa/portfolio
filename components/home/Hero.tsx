"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import LineReveal from "@/components/motion/LineReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import Marquee from "@/components/ui/Marquee";
import { whatsappLink } from "@/lib/whatsapp";

const CAPABILITIES = [
  "Sites institucionais",
  "Landing pages",
  "Aplicações web",
  "Sistemas personalizados",
  "Plataformas SaaS",
  "Painéis administrativos",
  "Automação de processos",
  "Integrações com IA",
  "Experiências digitais",
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32">
      {/* Fotografia editorial */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: reduce ? 1 : 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative h-full w-full"
        >
          {/* Retrato vertical no mobile */}
          <Image
            src="/images/portrait-tall.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_24%] opacity-95 md:hidden"
          />
          {/* Retrato panorâmico no desktop, ancorado à direita */}
          <Image
            src="/images/portrait-wide.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hidden scale-x-[-1] object-cover object-[70%_center] opacity-80 md:block"
          />
        </motion.div>

        {/* Máscaras de leitura */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/35 to-ink/10 md:via-ink/30 md:to-transparent" />
        <div className="grid-veil absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="container-vx relative">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="eyebrow mb-8 flex items-center gap-3"
        >
          <span aria-hidden className="h-px w-10 bg-lime" />
          Digital Experience Studio
        </motion.p>

        <h1 className="display max-w-[16ch] text-[3.1rem] leading-[0.9] text-bone sm:text-[5rem] lg:text-[7.2rem] xl:text-[8.4rem]">
          <LineReveal
            lines={["Ideias que", "viram", "interface."]}
            delay={0.3}
            lineClassName="[&>span]:inline"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance-vx mt-9 max-w-xl text-[1rem] leading-relaxed text-muted sm:text-[1.1rem]"
        >
          Transformamos conceitos em experiências digitais. Criamos produtos,
          plataformas e soluções que conectam tecnologia, criatividade e propósito.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-11 flex flex-wrap items-center gap-3"
        >
          <ButtonLink href="/projetos" variant="primary">
            Explorar projetos
          </ButtonLink>
          <ButtonLink href={whatsappLink()} variant="outline" external>
            Iniciar um projeto
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="container-vx relative mt-16 flex items-center gap-8 border-t border-line pt-6"
      >
        <span className="eyebrow hidden shrink-0 items-center gap-2.5 sm:inline-flex">
          <ArrowDown className="h-3 w-3 text-lime" aria-hidden />
          Role
        </span>
        <Marquee items={CAPABILITIES} className="flex-1" />
      </motion.div>
    </section>
  );
}
