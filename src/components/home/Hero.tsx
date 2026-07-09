import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-espresso text-cream"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=2400&q=80"
          alt="A hand pouring coffee into a ceramic cup"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-espresso/50 to-espresso"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center lg:px-10"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="chapter-label"
        >
          <span className="gold-rule mr-4" />
          Est. 1963
          <span className="gold-rule ml-4" />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-[3.25rem] leading-[0.98] tracking-tight text-cream sm:text-7xl md:text-[6rem]"
        >
          Premium <em className="font-normal italic text-accent">Since</em> 1963
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg"
        >
          Handcrafted coffee &amp; tea, made just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-3 rounded-sm border border-accent bg-accent/10 px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-cream backdrop-blur-sm transition-all duration-500 hover:bg-accent hover:text-espresso"
          >
            View Menu
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.9 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-cream/70"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.28em]">Scroll</span>
          <ChevronDown className="h-4 w-4 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
