import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BgMedia } from "@/components/common/BgMedia";

interface Props {
  title: string;
  image: string;
  video?: string;
  captionLeft: string;
  captionRight: string;
  chapter?: string;
}

/**
 * Full-bleed cinematic page opener — full-viewport image/video with the
 * page name rendered as massive display text, and small caption pairs in
 * the bottom-left and bottom-right corners.
 */
export function PageHero({
  title,
  image,
  video,
  captionLeft,
  captionRight,
  chapter,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-cream"
    >
      <motion.div
        style={{ scale }}
        className="absolute inset-0 will-change-transform"
      >
        <BgMedia image={image} video={video} alt={title} eager imgClassName="kenburns" />
      </motion.div>

      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/40 to-ink/85"
      />

      <motion.div
        style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-end pb-[18vh] text-center"
      >
        {chapter && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="chapter-label mb-6 text-cream/70"
          >
            {chapter}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="page-hero-title font-display font-bold uppercase text-cream"
        >
          {title}
        </motion.h1>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-6 pb-8 md:px-10 md:pb-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.7rem] uppercase tracking-[0.32em] text-cream/80"
        >
          {captionLeft}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-right text-[0.7rem] uppercase tracking-[0.32em] text-cream/80"
        >
          {captionRight}
        </motion.span>
      </div>
    </section>
  );
}
