import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/services/api";

interface Props {
  categories: MenuCategory[];
  activeId: string | null;
  onJump: (id: string) => void;
}

export function ChapterNav({ categories, activeId, onJump }: Props) {
  const mobileRef = useRef<HTMLDivElement>(null);
  const activeMobileRef = useRef<HTMLButtonElement>(null);

  // Keep active pill visible on mobile
  useEffect(() => {
    if (!activeMobileRef.current || !mobileRef.current) return;
    const btn = activeMobileRef.current;
    const scroller = mobileRef.current;
    const btnLeft = btn.offsetLeft - scroller.offsetLeft;
    scroller.scrollTo({
      left: btnLeft - scroller.clientWidth / 2 + btn.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <>
      {/* Desktop: sticky rail on the right */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="pointer-events-auto max-h-[70vh] overflow-y-auto rounded-sm border border-border/60 bg-background/85 py-3 pl-4 pr-3 backdrop-blur-md scrollbar-thin">
          <ul className="space-y-1">
            {categories.map((c) => {
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onJump(c.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 py-1.5 pr-1 text-left transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "block h-px transition-all duration-500",
                        isActive ? "w-8 bg-accent" : "w-3 bg-muted-foreground/50 group-hover:w-6",
                      )}
                    />
                    <span className="font-mono text-[0.65rem] tabular-nums tracking-widest">
                      {c.chapter}
                    </span>
                    <span className="truncate text-[0.7rem] uppercase tracking-[0.22em]">
                      {c.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.aside>

      {/* Mobile/tablet: sticky top bar with current chapter + scrollable pills */}
      <div className="sticky top-[7.25rem] z-20 border-b border-border/60 bg-background/90 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3 px-4 pt-3 text-xs text-muted-foreground">
          <span className="font-mono tracking-widest text-accent">{active.chapter}</span>
          <span className="h-px w-6 bg-accent/40" />
          <span className="truncate uppercase tracking-[0.22em] text-foreground">
            {active.name}
          </span>
        </div>
        <div
          ref={mobileRef}
          className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 scrollbar-thin"
        >
          {categories.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                ref={isActive ? activeMobileRef : undefined}
                onClick={() => onJump(c.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.22em] transition-colors",
                  isActive
                    ? "border-accent bg-accent text-espresso"
                    : "border-border/60 bg-transparent text-muted-foreground",
                )}
              >
                <span className="mr-2 font-mono tabular-nums">{c.chapter}</span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
