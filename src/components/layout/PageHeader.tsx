import { Reveal } from "./Reveal";

export function PageHeader({
  chapter,
  title,
  intro,
}: {
  chapter: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 md:pt-52 md:pb-28">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal>
          <span className="chapter-label">{chapter}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {intro}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.3}>
          <span className="mt-10 inline-block h-px w-16 bg-accent" />
        </Reveal>
      </div>
    </section>
  );
}
