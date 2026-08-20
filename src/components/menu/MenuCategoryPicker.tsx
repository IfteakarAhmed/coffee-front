import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { MenuCategory } from "@/services/api";
import { BgMedia } from "@/components/common/BgMedia";
import { useTransitionNavigate } from "@/components/common/TransitionOverlay";
import { cn } from "@/lib/utils";

/**
 * Full-bleed dark category picker. On desktop, cards are arranged in a
 * horizontal row that scrolls to the right as the user scrolls down
 * (pinned horizontal scroll). On mobile, the row scrolls naturally with
 * a horizontal swipe.
 */
export function MenuCategoryPicker({
  categories,
  groupTitle,
  onBack,
  backdrop,
}: {
  categories: MenuCategory[];
  groupTitle?: string;
  onBack?: () => void;
  backdrop?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const cardWidth = 260;
  const gap = 24;
  const rowWidth = categories.length * (cardWidth + gap);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const maxShift = Math.max(
    0,
    rowWidth - (typeof window !== "undefined" ? window.innerWidth : 1440) + 120,
  );
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  const Backdrop = () =>
    backdrop ? (
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <BgMedia image={backdrop} alt="" imgClassName="kenburns" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />
      </div>
    ) : null;

  return (
    <>
      {/* Desktop / tablet: pinned horizontal scroll */}
      <section
        ref={wrapRef}
        className="relative hidden bg-ink text-cream md:block"
        style={{ height: `${Math.max(140, categories.length * 55)}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <Backdrop />
          <div className="relative z-10 flex flex-col">
            <PickerHeader groupTitle={groupTitle} onBack={onBack} />
          </div>
          <div className="relative z-10 flex flex-1 items-center">
            <motion.div
              style={{ x, gap: `${gap}px` }}
              className="flex items-center pl-[8vw] pr-[8vw] will-change-transform"
            >
              {categories.map((cat, i) => (
                <PickerCard key={cat.id} category={cat} index={i} />
              ))}
            </motion.div>
          </div>
          <div className="relative z-10">
            <PickerFooter />
          </div>
        </div>
      </section>

      {/* Mobile: vertical stacked cards */}
      <section className="relative bg-ink py-8 text-cream md:hidden">
        <Backdrop />
        <div className="relative z-10">
          <PickerHeader mobile groupTitle={groupTitle} onBack={onBack} />
          <div className="mt-8 flex flex-col gap-4 px-5 pb-8">
            {categories.map((cat, i) => (
              <PickerCard key={cat.id} category={cat} index={i} mobile />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PickerHeader({
  mobile,
  groupTitle,
  onBack,
}: {
  mobile?: boolean;
  groupTitle?: string;
  onBack?: () => void;
}) {
  return (
    <div className={cn("px-5 sm:px-8 md:px-10", mobile ? "pt-24 text-center" : "pt-24 md:pt-28")}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-accent",
            mobile ? "mb-4" : "mb-6",
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Food / Drinks
        </button>
      )}
      <div className={cn("mx-auto max-w-3xl", !mobile && "text-center")}>
        <span className="chapter-label text-cream/70">
          <span className="gold-rule mr-4" />
          {groupTitle ?? "Choose a chapter"}
          <span className="gold-rule ml-4" />
        </span>
        <h1
          className="mt-3 font-display uppercase leading-none tracking-tight text-cream"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
        >
          {groupTitle ? groupTitle : "The Menu"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-cream/70 md:text-base">
          Each category is its own story. Tap a card to step inside.
        </p>
      </div>
    </div>
  );
}

function PickerFooter() {
  return (
    <div className="hidden items-center justify-between px-10 pb-8 text-[0.65rem] uppercase tracking-[0.28em] text-cream/50 md:flex">
      <span>Scroll to browse →</span>
      <span>Tap a card to open</span>
    </div>
  );
}


function PickerCard({
  category,
  index,
  mobile,
}: {
  category: MenuCategory;
  index: number;
  mobile?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [tapped, setTapped] = useState(false);
  const goto = useTransitionNavigate();

  const isTouch =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;



  const flipped = mobile ? true : hover || tapped;

  return (
    <motion.button
      type="button"
      onMouseEnter={() => !mobile && setHover(true)}
      onMouseLeave={() => !mobile && setHover(false)}
      onFocus={() => !mobile && setHover(true)}
      onBlur={() => !mobile && setHover(false)}
      onClick={() => {
        if (!mobile && isTouch && !tapped) {
          setTapped(true);
          return;
        }
        goto(`/menu/${category.id}`, category.name);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.5) }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-md border border-cream/15 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-accent",
        mobile ? "aspect-[16/10] w-full" : "aspect-[3/4] w-[260px]",
      )}
      style={{ perspective: 1400 }}
      aria-label={`Open ${category.name} menu`}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face — dark, number + name */}
        <div
          className="absolute inset-0 flex flex-col justify-between bg-ink p-6 text-cream"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="font-display text-sm tracking-[0.32em] text-accent">
            {category.chapter}
          </span>
          <div>
            <h3 className="font-display text-2xl uppercase leading-tight tracking-tight text-cream md:text-[1.75rem]">
              {category.name}
            </h3>
            <span className="mt-3 block h-px w-8 bg-accent/70" />
            <p className="mt-3 line-clamp-2 text-[0.7rem] uppercase tracking-[0.22em] text-cream/60">
              {category.tagline}
            </p>
          </div>
        </div>

        {/* Back face — photo */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <BgMedia image={category.heroImage} alt={category.name} imgClassName="kenburns" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-cream">
            <span className="font-display text-sm tracking-[0.32em] text-accent">
              {category.chapter}
            </span>
            <div>
              <h3 className="font-display text-2xl uppercase leading-tight tracking-tight text-cream md:text-[1.75rem]">
                {category.name}
              </h3>
              <p className="mt-3 line-clamp-2 text-[0.7rem] uppercase tracking-[0.24em] text-cream/80">
                {category.tagline}
              </p>
              <span className="mt-4 inline-block text-[0.6rem] uppercase tracking-[0.3em] text-accent">
                Open →
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
