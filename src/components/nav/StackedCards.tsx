import { motion } from "motion/react";
import { useState } from "react";
import type { NavPage } from "./nav-pages";
import { BgMedia } from "@/components/common/BgMedia";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Props {
  pages: NavPage[];
  /** Route that should be shown as the "front" card by default. */
  activePath?: string;
  /** Called when a card is clicked. */
  onSelect?: (page: NavPage) => void;
  /** Layout intent — used inside overlay vs. inline on the home page. */
  variant?: "overlay" | "inline";
}

/**
 * Fanned deck of nav cards. The active card sits on top with its image face
 * visible; the others sit behind, rotated a few degrees, showing only a
 * number + title. Hovering (or tapping on touch) any back card flips it to
 * reveal its image face and lifts it above the stack.
 */
export function StackedCards({
  pages,
  activePath,
  onSelect,
  variant = "overlay",
}: Props) {
  const activeIndex = Math.max(
    0,
    pages.findIndex((p) => p.to === activePath),
  );
  const isMobile = useIsMobile();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tappedId, setTappedId] = useState<string | null>(null);

  const frontId =
    hoveredId ?? tappedId ?? pages[activeIndex]?.to ?? pages[0]?.to;

  return (
    <div
      className={cn(
        "flex w-full items-stretch justify-center",
        "flex-col gap-3 md:flex-row md:items-center md:gap-6",
        variant === "overlay" ? "py-6 md:py-12" : "py-6 md:py-8",
      )}
      style={{ perspective: 1600 }}
    >
      {pages.map((page, i) => {
        const isFront = page.to === frontId;
        // Fan rotation for the back cards — desktop only.
        const offset = i - activeIndex;
        const baseRotate = isMobile ? 0 : offset * 4;
        const baseX = isMobile ? 0 : offset * 12;
        const baseY = isMobile ? 0 : Math.abs(offset) * 6;

        return (
          <motion.button
            key={page.to}
            type="button"
            onMouseEnter={() => setHoveredId(page.to)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(page.to)}
            onBlur={() => setHoveredId(null)}
            onClick={() => {
              const isTouch =
                typeof window !== "undefined" &&
                window.matchMedia("(hover: none)").matches;
              if (isTouch && tappedId !== page.to) {
                setTappedId(page.to);
                return;
              }
              onSelect?.(page);
            }}
            initial={false}
            animate={{
              rotateZ: isFront ? 0 : baseRotate,
              x: isFront ? 0 : baseX,
              y: isFront ? (isMobile ? 0 : -16) : baseY,
              scale: isFront ? (isMobile ? 1 : 1.04) : isMobile ? 1 : 0.94,
              zIndex: isFront ? 40 : 20 - Math.abs(offset),
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
              mass: 0.8,
            }}
            className={cn(
              "group relative shrink-0 origin-center cursor-pointer overflow-hidden rounded-md border border-cream/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-accent",
              // Mobile: wide horizontal banner cards, full-width, comfortable tap targets.
              "aspect-[5/2] w-full max-w-[520px] self-center",
              // Desktop: portrait fanned cards.
              "md:aspect-[3/4] md:w-[220px] md:max-w-none lg:w-[240px]",
            )}
            style={{ transformStyle: "preserve-3d" }}
            aria-label={`Go to ${page.title}`}
          >
            {/* Inner 3D flipper */}
            <motion.div
              className="relative h-full w-full"
              initial={false}
              animate={{ rotateY: isFront ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Default (dark) face */}
              <div
                className="absolute inset-0 flex flex-col justify-between bg-ink p-6 text-cream"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="font-display text-sm tracking-[0.32em] text-accent">
                  {page.number}
                </span>
                <div>
                  <h3 className="font-display text-3xl uppercase leading-none tracking-tight text-cream md:text-4xl">
                    {page.title}
                  </h3>
                  <span className="mt-3 block h-px w-8 bg-accent/70" />
                </div>
              </div>

              {/* Image / video face */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <BgMedia
                  image={page.image}
                  video={isFront ? page.video : undefined}
                  alt={page.title}
                  eager={isFront}
                  imgClassName="kenburns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-cream">
                  <span className="font-display text-sm tracking-[0.32em] text-accent">
                    {page.number}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none tracking-tight text-cream md:text-4xl">
                      {page.title}
                    </h3>
                    <p className="mt-3 text-[0.7rem] uppercase tracking-[0.24em] text-cream/80">
                      {page.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
