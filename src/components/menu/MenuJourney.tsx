import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory, MenuItem } from "@/services/api";
import { CategoryChapter } from "./CategoryChapter";
import { BgMedia } from "@/components/common/BgMedia";
import { PageHero } from "@/components/layout/PageHero";
import { playTransition } from "@/components/common/TransitionOverlay";
import { cn } from "@/lib/utils";

export type MenuGroupId = "food" | "drinks";

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

const GROUP_META: Record<
  MenuGroupId,
  {
    title: string;
    tagline: string;
    image: string;
    heroImage: string;
    heroVideo?: string;
    chapter: string;
    captionLeft: string;
    captionRight: string;
    openingLine: string;
  }
> = {
  food: {
    title: "Food",
    tagline: "Savory & fresh — from breakfast to burgers",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=2400&q=80",
    chapter: "Part One — Food",
    captionLeft: "Savory & Fresh",
    captionRight: "Breakfast to Burgers",
    openingLine: "Let's begin where the day does — at the table.",
  },
  drinks: {
    title: "Drinks",
    tagline: "Handcrafted, sip by sip",
    image:
      "https://images.unsplash.com/photo-1494314675392-2ba1d54e56b7?auto=format&fit=crop&w=2000&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=2400&q=80",
    chapter: "Part Two — Drinks",
    captionLeft: "Handcrafted",
    captionRight: "Sip by Sip",
    openingLine: "Let's begin, one careful pour at a time.",
  },
};


interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
}

export function MenuJourney({ categories, items }: Props) {
  const [group, setGroup] = useState<MenuGroupId | null>(null);

  const pick = async (id: MenuGroupId) => {
    await playTransition(GROUP_META[id].title, () => setGroup(id));
  };
  const switchGroup = async (id: MenuGroupId) => {
    if (id === group) return;
    await playTransition(GROUP_META[id].title, () => {
      setGroup(id);
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    });
  };

  return (
    <AnimatePresence mode="wait">
      {!group ? (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <MenuIntro onPick={pick} />
        </motion.div>
      ) : (
        <motion.div
          key={`scroll-${group}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChapterScroll
            group={group}
            categories={categories}
            items={items}
            onSwitch={switchGroup}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------- Intro -------------------- */

function MenuIntro({ onPick }: { onPick: (id: MenuGroupId) => void }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <BgMedia
          image="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2000&q=80"
          alt=""
          imgClassName="kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-12 pt-28 sm:px-8 md:pt-32">
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

        <div className="mt-10 grid flex-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {(["food", "drinks"] as MenuGroupId[]).map((id, i) => (
            <IntroPanel key={id} id={id} index={i} onPick={onPick} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IntroPanel({
  id,
  index,
  onPick,
}: {
  id: MenuGroupId;
  index: number;
  onPick: (id: MenuGroupId) => void;
}) {
  const meta = GROUP_META[id];
  return (
    <motion.button
      type="button"
      onClick={() => onPick(id)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative min-h-[300px] overflow-hidden rounded-md border border-cream/15 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent md:min-h-[440px]"
      aria-label={`Browse ${meta.title}`}
    >
      <BgMedia image={meta.image} alt={meta.title} imgClassName="kenburns transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10 transition-opacity duration-500 group-hover:from-ink/75" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10">
        <span className="font-display text-xs tracking-[0.32em] text-accent md:text-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h2
            className="font-display uppercase leading-none tracking-tight text-cream"
            style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}
          >
            {meta.title}
          </h2>
          <span className="mt-4 block h-px w-12 bg-accent" />
          <p className="mt-4 max-w-xs text-[0.7rem] uppercase tracking-[0.28em] text-cream/80 md:text-xs">
            {meta.tagline}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-accent">
            Step inside <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* -------------------- Chapter scroll -------------------- */

function ChapterScroll({
  group,
  categories,
  items,
  onSwitch,
}: {
  group: MenuGroupId;
  categories: MenuCategory[];
  items: MenuItem[];
  onSwitch: (id: MenuGroupId) => void;
}) {
  const orderedIds = GROUP_CATEGORY_IDS[group];
  const groupCategories = useMemo(
    () =>
      orderedIds
        .map((id) => categories.find((c) => c.id === id))
        .filter((c): c is MenuCategory => Boolean(c))
        // Renumber chapters so each group starts at 01.
        .map((c, i) => ({ ...c, chapter: String(i + 1).padStart(2, "0") })),
    [orderedIds, categories],
  );

  const groupItems = useMemo(
    () => items.filter((it) => orderedIds.includes(it.categoryId)),
    [orderedIds, items],
  );

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(groupCategories[0]?.id ?? null);

  const registerRef = (id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el;
    else delete sectionRefs.current[id];
  };

  // Reset active on group change — do NOT wipe sectionRefs here; children
  // register their refs during commit BEFORE this effect runs, so clearing
  // would delete freshly-registered nodes and break the scroll-spy + jumps.
  useEffect(() => {
    setActiveId(groupCategories[0]?.id ?? null);
  }, [group, groupCategories]);

  // Scroll-spy
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = (visible[0].target as HTMLElement).id.replace("chapter-", "");
          setActiveId(id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [groupCategories]);

  const pillsRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);

  // Keep active pill in view as user scrolls
  useEffect(() => {
    if (!activePillRef.current || !pillsRef.current) return;
    const btn = activePillRef.current;
    const scroller = pillsRef.current;
    const target = btn.offsetLeft - scroller.clientWidth / 2 + btn.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  }, [activeId]);

  // Horizontal wheel scrolling on desktop
  useEffect(() => {
    const el = pillsRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleJump = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const offset = 64 + 56;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: { offset?: number; duration?: number }) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const meta = GROUP_META[group];

  return (
    <div className="relative bg-ink">
      {/* Unified sticky top bar — dark to match hero, no light band */}
      <div className="sticky top-16 z-30 border-b border-cream/10 bg-ink/85 text-cream backdrop-blur-md">
        <div className="mx-auto flex max-w-[100rem] items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-10">


          {/* Horizontally scrollable category pills — fills middle, scrolls independently */}
          <div
            ref={pillsRef}
            className="scrollbar-thin flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5"
            style={{ scrollbarWidth: "none" }}
          >
            {groupCategories.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  ref={isActive ? activePillRef : undefined}
                  type="button"
                  onClick={() => handleJump(c.id)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition-colors sm:px-4 sm:text-[0.65rem]",
                    isActive
                      ? "border-accent bg-accent text-espresso"
                      : "border-cream/15 text-cream/70 hover:border-cream/40 hover:text-cream",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Food / Drinks toggle */}
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-cream/20 bg-ink/50 p-1">
            {(["food", "drinks"] as MenuGroupId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSwitch(id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] transition-colors sm:px-4 sm:py-1.5 sm:text-[0.65rem]",
                  id === group
                    ? "bg-accent text-espresso"
                    : "text-cream/70 hover:text-cream",
                )}
                aria-pressed={id === group}
              >
                {GROUP_META[id].title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <PageHero
        title={meta.title.toUpperCase()}
        chapter={meta.chapter}
        image={meta.heroImage}
        video={meta.heroVideo}
        captionLeft={meta.captionLeft}
        captionRight={meta.captionRight}
      />

      <ChapterOpener line={meta.openingLine} />

      <div>
        {groupCategories.map((cat, i) => (
          <CategoryChapter
            key={cat.id}
            category={cat}
            items={groupItems.filter((it) => it.categoryId === cat.id)}
            registerRef={registerRef}
            isFirst={i === 0}
            isLast={i === groupCategories.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------- Opener between hero and first chapter -------------------- */

function ChapterOpener({ line }: { line: string }) {
  return (
    <section className="relative flex items-center justify-center bg-background px-6 py-28 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <span className="h-px w-16 bg-accent/50" />
        <p className="font-display italic text-foreground/80 text-2xl sm:text-3xl md:text-4xl leading-snug max-w-2xl">
          {line}
        </p>
        <span className="chapter-label text-muted-foreground">The story begins</span>
      </motion.div>
    </section>
  );
}
