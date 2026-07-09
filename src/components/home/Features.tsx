import { motion } from "motion/react";
import { Coffee, Flame, Leaf, Sparkles } from "lucide-react";
import { Reveal } from "@/components/layout/Reveal";
import { TiltCard } from "@/components/common/TiltCard";

const FEATURES = [
  {
    icon: Coffee,
    title: "Handcrafted Quality",
    body: "Every cup is prepared by a trained barista — no shortcuts, no automation.",
  },
  {
    icon: Flame,
    title: "Cozy Ambience",
    body: "A warm, low-lit room designed for slow conversation and quiet work.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    body: "Beans roasted weekly, teas sourced direct, pastries baked at dawn.",
  },
  {
    icon: Sparkles,
    title: "Since 1963 Legacy",
    body: "Six decades of the same recipe, the same room, the same care.",
  },
];

export function Features() {
  return (
    <section className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="chapter-label">Why Us</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-4xl leading-tight text-foreground md:text-5xl">
              A house of <em className="italic text-accent">small</em> perfections.
            </h2>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <TiltCard intensity={7}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative h-full overflow-hidden rounded-sm border border-border/60 bg-card p-8 transition-shadow duration-500 hover:shadow-[0_20px_60px_-30px_var(--gold)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="chapter-label">0{i + 1}</span>
                  <div className="mt-6 grid h-12 w-12 place-items-center rounded-full border border-accent/40 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-espresso">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
