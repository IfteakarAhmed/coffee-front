import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FullscreenNav } from "@/components/nav/FullscreenNav";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

/** Routes that DO have a dark full-bleed hero at the top. Others need
 *  the navbar to stay in its solid dark treatment for legibility. */
const HERO_ROUTES = new Set(["/", "/menu"]);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hasHero = HERO_ROUTES.has(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On non-hero pages (admin, reservation, contact, …) the navbar sits on a
  // light background — always render it in its solid dark state.
  const solid = scrolled || !hasHero;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "bg-ink/85 py-2 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md"
            : "bg-transparent py-4",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <Logo size={solid ? 40 : 46} onDark />
            <span className="sr-only">The Coffee Bean &amp; Tea Leaf</span>
            <span className="hidden font-display text-sm tracking-tight text-cream drop-shadow sm:inline md:text-base">
              The Coffee Bean <span className="text-accent">&amp;</span> Tea Leaf
            </span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 bg-ink/40 text-cream backdrop-blur-md transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <span className="flex flex-col gap-[4px]">
              <span className="block h-[1.5px] w-5 bg-current transition-all group-hover:w-6" />
              <span className="block h-[1.5px] w-4 bg-current transition-all group-hover:w-6" />
              <span className="block h-[1.5px] w-5 bg-current transition-all group-hover:w-6" />
            </span>
          </button>
        </div>
      </header>

      <FullscreenNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}

