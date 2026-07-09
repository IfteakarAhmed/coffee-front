import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/layout/Reveal";

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="relative bg-background py-24 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12 md:gap-14 lg:px-10">
        <div className="md:col-span-5">
          <Reveal>
            <span className="chapter-label">01 — Our Story</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Every cup <em className="italic text-accent">tells</em> a story.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              For six decades, we have kept a single, stubborn promise — to
              treat every bean and every leaf as though it were the last. Our
              roasters work by ear and by nose, our brewers by patience, and
              our room is quiet on purpose.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              This is not fast coffee. It is a small, considered ritual served
              in porcelain, poured slowly, and offered with both hands.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="font-display text-lg italic text-foreground">
                — The House
              </span>
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="relative md:col-span-7">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <motion.img
                style={{ y: imgY }}
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80"
                alt="Barista carefully pouring a latte"
                className="absolute inset-0 h-[115%] w-full object-cover will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/10" />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="absolute -bottom-8 -left-6 hidden aspect-square w-40 overflow-hidden rounded-sm border-4 border-background md:block lg:w-52">
              <img
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80"
                alt="Freshly roasted coffee beans"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
