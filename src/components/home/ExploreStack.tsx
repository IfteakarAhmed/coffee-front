import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Reveal } from "@/components/layout/Reveal";
import { StackedCards } from "@/components/nav/StackedCards";
import { NAV_PAGES } from "@/components/nav/nav-pages";

export function ExploreStack() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="chapter-label">
              <span className="gold-rule mr-4" />
              Explore
              <span className="gold-rule ml-4" />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-4xl leading-tight text-cream md:text-6xl">
              Turn a card, <em className="italic text-accent">step inside</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-sm text-cream/70 md:text-base">
              Every corner of the café has its own chapter. Hover any card to
              lift it from the deck — click to walk in.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="mt-16 md:mt-20">
            <StackedCards
              pages={NAV_PAGES}
              activePath={pathname}
              variant="inline"
              onSelect={(p) => navigate({ to: p.to })}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
