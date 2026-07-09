import { motion } from "motion/react";
import { CURRENCY, type MenuItem } from "@/services/api";
import { TiltCard } from "@/components/common/TiltCard";

export function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const hasSizes = item.prices.length > 1;
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.06, 0.4),
      }}
      className="h-full"
    >
      <TiltCard intensity={6} className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border/60 bg-card transition-shadow duration-500 hover:shadow-[0_25px_50px_-30px_var(--espresso)]">

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <motion.img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="kenburns h-full w-full object-cover"
          whileHover={{ scale: 1.12 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.dataset.fallback !== "1") {
              img.dataset.fallback = "1";
              img.src =
                "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80";
            }
          }}
        />
        {item.isNew && (
          <span className="absolute left-3 top-3 rounded-sm bg-accent px-2 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-espresso">
            New
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/10" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-xl leading-tight text-foreground transition-colors group-hover:text-accent">
            {item.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          {item.note && (
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.24em] text-accent/80">
              {item.note}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border/60 pt-4">
          {hasSizes ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {item.prices.map((p, i) => (
                <div key={i} className="flex flex-col">
                  {p.label && (
                    <span className="text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
                      {p.label}
                    </span>
                  )}
                  <span className="font-display text-base text-foreground">
                    {p.price > 0 ? `${CURRENCY} ${p.price}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="font-display text-2xl text-accent">
              {item.prices[0].price > 0
                ? `${CURRENCY} ${item.prices[0].price}`
                : "On request"}
            </span>
          )}
        </div>
      </div>
      </TiltCard>
    </motion.article>
  );
}
