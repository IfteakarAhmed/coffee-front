import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/layout/Reveal";

export function LocationCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-espresso text-cream"
    >
      <motion.div style={{ y }} className="absolute inset-0 opacity-30 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=80"
          alt="Warm café interior"
          className="h-[120%] w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/90 via-espresso/85 to-espresso" />

      <div className="relative mx-auto max-w-6xl px-6 py-28 text-center md:py-40 lg:px-10">
        <Reveal>
          <span className="chapter-label">
            <span className="gold-rule mr-4" />
            03 — Visit Us
            <span className="gold-rule ml-4" />
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-8 font-display text-4xl leading-[1.05] tracking-tight text-cream md:text-6xl">
            Save a seat by <em className="italic text-accent">the window</em>.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 flex flex-col items-center gap-6 text-sm text-cream/80 sm:flex-row sm:justify-center sm:gap-12 sm:text-base">
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-accent" />
              House No 11, A Rd 117, Dhaka 1212
            </span>
            <span className="hidden h-4 w-px bg-cream/20 sm:block" />
            <a href="tel:+8801818385378" className="flex items-center gap-3 hover:text-accent">
              <Phone className="h-4 w-4 text-accent" />
              +880 1818-385378
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12">
            <Link
              to="/reservation"
              className="group inline-flex items-center gap-3 rounded-sm bg-accent px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-espresso transition-all duration-500 hover:bg-cream hover:text-espresso"
            >
              Reserve a Table
              <motion.span
                initial={false}
                className="inline-flex"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </motion.span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
