import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { MenuCategory, MenuItem } from "@/services/api";
import { MenuCard } from "./MenuCard";

interface Props {
  category: MenuCategory;
  items: MenuItem[];
  registerRef: (id: string, el: HTMLElement | null) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function CategoryChapter({ category, items, registerRef, isFirst, isLast }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.02, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.55, 0.75]);

  return (
    <section
      id={`chapter-${category.id}`}
      ref={(el) => registerRef(category.id, el)}
      className="relative"
    >
      {/* Chapter intro — full viewport on desktop, shorter banner on mobile */}
      <div
        ref={heroRef}
        className="relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden bg-espresso text-cream md:min-h-[92svh]"
      >
        <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0 will-change-transform">
          <img
            src={category.heroImage}
            alt={category.name}
            className="kenburns h-full w-full object-cover"
            loading={isFirst ? "eager" : "lazy"}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.dataset.fallback !== "1") {
                img.dataset.fallback = "1";
                img.src =
                  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=2000&q=80";
              }
            }}
          />
        </motion.div>
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-espresso/50 via-espresso/60 to-espresso/85"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-10"
        >
          <span className="chapter-label">
            <span className="gold-rule mr-4" />
            {category.chapter} — Chapter
            <span className="gold-rule ml-4" />
          </span>
          <h2 className="mt-6 font-display text-[2.5rem] leading-[1.02] tracking-tight text-cream sm:text-6xl md:text-7xl">
            {category.name}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            {category.tagline}
          </p>
          {category.sizeLabels && (
            <div className="mt-8 flex items-center justify-center gap-6 text-[0.65rem] uppercase tracking-[0.28em] text-accent/90">
              {category.sizeLabels.map((s, i) => (
                <span key={s} className="flex items-center gap-6">
                  {i > 0 && <span className="h-px w-6 bg-accent/50" />}
                  {s}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Item grid */}
      <div className="relative bg-background py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:px-10 xl:grid-cols-4">
          {items.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Chapter divider */}
      {!isLast && (
        <div className="relative flex items-center justify-center py-16">
          <div className="flex items-center gap-6">
            <span className="h-px w-16 bg-accent/40" />
            <span className="chapter-label">End of {category.chapter}</span>
            <span className="h-px w-16 bg-accent/40" />
          </div>
        </div>
      )}
    </section>
  );
}
