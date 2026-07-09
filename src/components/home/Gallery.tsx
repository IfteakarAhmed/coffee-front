import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/layout/Reveal";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    alt: "Latte art in a white cup",
    speed: -60,
    aspect: "aspect-[3/4]",
    className: "md:col-span-4 md:mt-24",
  },
  {
    src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
    alt: "Overhead shot of croissants and coffee",
    speed: 40,
    aspect: "aspect-[4/5]",
    className: "md:col-span-5",
  },
  {
    src: "https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=1200&q=80",
    alt: "Loose leaf tea in a wooden scoop",
    speed: -30,
    aspect: "aspect-square",
    className: "md:col-span-3 md:mt-16",
  },
  {
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    alt: "Wooden coffee counter",
    speed: 60,
    aspect: "aspect-[4/3]",
    className: "md:col-span-5 md:-mt-20",
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
    alt: "Tea being poured into a glass cup",
    speed: -50,
    aspect: "aspect-[3/4]",
    className: "md:col-span-4",
  },
  {
    src: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80",
    alt: "Pastry with berries",
    speed: 30,
    aspect: "aspect-square",
    className: "md:col-span-3 md:mt-32",
  },
] as const;

function ParallaxImage({ src, alt, speed, aspect, className }: (typeof IMAGES)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className={className}>
      <Reveal>
        <div className={`relative overflow-hidden rounded-sm ${aspect}`}>
          <motion.img
            style={{ y }}
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 h-[120%] w-full object-cover will-change-transform"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/10" />
        </div>
      </Reveal>
    </div>
  );
}

export function Gallery() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="chapter-label">A Visual Menu</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-4xl leading-tight text-foreground md:text-5xl">
              Moments, <em className="italic text-accent">brewed</em>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          {IMAGES.map((img) => (
            <ParallaxImage key={img.src} {...img} />
          ))}
        </div>
      </div>
    </section>
  );
}
