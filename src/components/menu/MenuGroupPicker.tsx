import { motion } from "motion/react";
import { useState } from "react";
import { BgMedia } from "@/components/common/BgMedia";
import { cn } from "@/lib/utils";

export type MenuGroupId = "food" | "drinks";

export interface MenuGroup {
  id: MenuGroupId;
  title: string;
  tagline: string;
  image: string;
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: "drinks",
    title: "Drinks",
    tagline: "Handcrafted, sip by sip",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "food",
    title: "Food",
    tagline: "Savory & fresh",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1600&q=80",
  },
];

/** Ordered category IDs per group (mapped to api.ts ids). */
export const GROUP_CATEGORY_IDS: Record<MenuGroupId, string[]> = {
  drinks: [
    "espresso",
    "latte",
    "brewed-coffee",
    "kid-friendly",
    "ice-blended-original",
    "ice-blended-non-coffee",
    "iced-espresso",
    "brewed-tea",
    "tea-latte",
    "vanilla-tea-latte",
    "signature-iced-tea",
    "fruit-based",
    "customize-it",
  ],
  food: [
    "breakfast",
    "pastas",
    "salads",
    "wraps",
    "sandwiches",
    "pizza",
    "soup",
    "light-bites",
    "burgers",
    "add-ons",
  ],
};

export function MenuGroupPicker({ onPick }: { onPick: (id: MenuGroupId) => void }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-ink text-cream">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <BgMedia
          image="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2000&q=80"
          alt=""
          imgClassName="kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-28 sm:px-8 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="chapter-label text-cream/70">
            <span className="gold-rule mr-3" />
            The Menu
            <span className="gold-rule ml-3" />
          </span>
          <h1
            className="mt-4 font-display uppercase leading-[0.95] tracking-tight text-cream"
            style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)" }}
          >
            Food, or Drinks?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-cream/70 md:text-base">
            Two doorways into the same story. Choose your side.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-1 flex-col gap-5 md:mt-14 md:flex-row md:gap-6">
          {MENU_GROUPS.map((g, i) => (
            <GroupCard key={g.id} group={g} index={i} onPick={onPick} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GroupCard({
  group,
  index,
  onPick,
}: {
  group: MenuGroup;
  index: number;
  onPick: (id: MenuGroupId) => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };

  return (
    <motion.button
      type="button"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={() => onPick(group.id)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex-1 overflow-hidden rounded-md border border-cream/15 text-left outline-none",
        "min-h-[280px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] focus-visible:ring-2 focus-visible:ring-accent",
        "transition-shadow duration-500 hover:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)]",
        "sm:min-h-[340px] md:min-h-0",
      )}
      style={{ perspective: 1400 }}
      aria-label={`Browse ${group.title}`}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <BgMedia image={group.image} alt={group.title} imgClassName="kenburns" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10 transition-opacity duration-500 group-hover:from-ink/70" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10">
          <span className="font-display text-xs tracking-[0.32em] text-accent md:text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="translate-y-0 transition-transform duration-500 group-hover:-translate-y-1">
            <h2
              className="font-display uppercase leading-none tracking-tight text-cream"
              style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}
            >
              {group.title}
            </h2>
            <span className="mt-4 block h-px w-12 bg-accent" />
            <p className="mt-4 max-w-xs text-[0.7rem] uppercase tracking-[0.28em] text-cream/80 md:text-xs">
              {group.tagline}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-accent">
              Step inside <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}
