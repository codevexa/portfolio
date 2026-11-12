import { cn } from "@/lib/utils";
import Eyebrow from "./Eyebrow";
import LineReveal from "@/components/motion/LineReveal";

export default function SectionHeading({
  eyebrow,
  lines,
  lead,
  align = "left",
  className,
  size = "md",
}: {
  eyebrow?: string;
  lines: string[];
  lead?: string;
  align?: "left" | "center";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[2rem] sm:text-[2.6rem] lg:text-[3.1rem]",
    md: "text-[2.4rem] sm:text-[3.4rem] lg:text-[4.4rem]",
    lg: "text-[2.9rem] sm:text-[4.4rem] lg:text-[6rem]",
  };

  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      {eyebrow && (
        <div className="mb-7">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className={cn("display text-bone", sizes[size])}>
        <LineReveal lines={lines} animateOnView />
      </h2>
      {lead && (
        <p
          className={cn(
            "text-balance-vx mt-7 max-w-xl text-[0.98rem] leading-relaxed text-muted sm:text-[1.05rem]",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
