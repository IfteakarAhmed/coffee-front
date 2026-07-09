import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/layout/Reveal";
import { CURRENCY, getMenuItems, type MenuItem } from "@/services/api";
import { useTransitionNavigate } from "@/components/common/TransitionOverlay";

// Curated feature list — real items and real BDT prices are looked up
// from the seeded menu data by name.
const FEATURED_NAMES = [
  "Caramel Macchiato",
  "Café Latte",
  "Earl Grey",
  "Matcha Green Latte",
  "Ultimate Breakfast",
  "CBTL Beef Burger",
];

function formatPrice(item: MenuItem) {
  const first = item.prices[0];
  if (!first || first.price <= 0) return "On request";
  return `${CURRENCY} ${first.price}`;
}

export function TeaserMenu() {
  const { data: items = [] } = useQuery({
    queryKey: ["menu", "items"],
    queryFn: () => getMenuItems(),
  });

  const featured = FEATURED_NAMES.map((name) =>
    items.find((i) => i.name === name),
  ).filter((i): i is MenuItem => !!i);

  const goto = useTransitionNavigate();

  return (
    <section className="relative bg-background py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Reveal>
              <span className="chapter-label">02 — Taste the Craft</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl">
                A short list, <em className="italic text-accent">chosen</em> carefully.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-3 border-b border-accent pb-1 text-[0.72rem] uppercase tracking-[0.28em] text-foreground transition-colors hover:text-accent"
              onClick={(e) => {
                e.preventDefault();
                goto("/menu", "The Menu");
              }}
            >
              View Full Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.08}>
              <motion.button
                type="button"
                onClick={() => goto(`/menu/${item.categoryId}`, item.name)}
                whileHover={{ y: -6, rotate: -0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group block w-full cursor-pointer text-left"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/10" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-accent">
                    {item.name}
                  </h3>
                  <span className="font-display text-lg text-accent">{formatPrice(item)}</span>
                </div>
                <div className="mt-2 h-px w-full origin-left scale-x-30 bg-accent/60 transition-transform duration-500 group-hover:scale-x-100" />
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
