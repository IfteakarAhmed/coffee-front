import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/layout/Reveal";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
    caption: "Latte, poured slow",
  },
  {
    src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1400&q=80",
    caption: "Morning table",
  },
  {
    src: "https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=1400&q=80",
    caption: "Loose leaf",
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=80",
    caption: "The counter",
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80",
    caption: "Tea, poured warm",
  },
  {
    src: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1400&q=80",
    caption: "A small sweet",
  },
];

/**
 * Homepage gallery — pinned horizontal scroll on desktop, natural vertical
 * grid on mobile. Closing text lives at the end of the horizontal strip so
 * it reveals with the last card, holds in place when scroll passes the
 * pinned section, and gracefully retreats when scrolling back up.
 */
export function GalleryPinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Reserve ~1 "card" of horizontal room at the end for the closing text.
  const totalPanels = IMAGES.length + 1;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(totalPanels - 1) * (100 / totalPanels)}%`],
  );
  const closingOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.72, 0.95], [40, 0]);

  return (
    <>
      <section className="relative bg-background pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-10">
          <Reveal>
            <span className="chapter-label">A Visual Menu</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-4xl leading-tight text-foreground md:text-6xl">
              Moments, <em className="italic text-accent">brewed</em>.
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Desktop: pinned horizontal scroll */}
      <section
        ref={ref}
        className="relative hidden bg-background md:block"
        style={{ height: `${IMAGES.length * 55}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x }} className="flex items-center gap-6 pl-[8vw] pr-[8vw] will-change-transform">
            {IMAGES.map((img, i) => (
              <figure
                key={img.src}
                className="relative aspect-[3/4] w-[60vw] max-w-[420px] shrink-0 overflow-hidden rounded-sm bg-muted md:w-[36vw] lg:w-[28vw]"
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="kenburns absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-6 text-cream">
                  <span className="text-[0.7rem] uppercase tracking-[0.28em]">
                    {img.caption}
                  </span>
                  <span className="font-display text-lg text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}

            {/* Closing moment — reveals with the last card, holds visible
                when scroll passes, retreats on scroll-back. */}
            <motion.div
              style={{ opacity: closingOpacity, y: closingY }}
              className="flex w-[70vw] max-w-[520px] shrink-0 flex-col items-start justify-center gap-4 pl-4 md:w-[42vw] lg:w-[36vw]"
            >
              <span className="h-px w-16 bg-accent" />
              <p
                className="font-display italic text-foreground"
                style={{ fontSize: "clamp(1.75rem, 3.4vw, 3rem)", lineHeight: 1.1 }}
              >
                …and that's just the <span className="text-accent">first pour.</span>
              </p>
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                The rest waits inside.
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile: fixed-aspect grid + closing line as a natural section. */}
      <section className="bg-background pb-24 md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 pt-12">
          {IMAGES.map((img) => (
            <figure
              key={img.src}
              className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted"
            >
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="kenburns absolute inset-0 h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-start gap-3 px-6">
          <span className="h-px w-16 bg-accent" />
          <p
            className="font-display italic text-foreground"
            style={{ fontSize: "clamp(1.5rem, 6vw, 2.25rem)", lineHeight: 1.15 }}
          >
            …and that's just the <span className="text-accent">first pour.</span>
          </p>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            The rest waits inside.
          </span>
        </div>
      </section>
    </>
  );
}

