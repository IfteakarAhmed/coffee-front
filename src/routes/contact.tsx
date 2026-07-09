import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/layout/Reveal";
import { buildWhatsAppUrl } from "@/components/common/FloatingWhatsApp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Coffee Bean & Tea Leaf" },
      {
        name: "description",
        content:
          "Visit The Coffee Bean & Tea Leaf at House No 11, A Rd 117, Dhaka 1212 — or send us a message.",
      },
    ],
  }),
  component: ContactPage,
});

const HOURS = [
  { day: "Monday — Thursday", time: "8:00 — 22:00" },
  { day: "Friday", time: "9:00 — 23:00" },
  { day: "Saturday", time: "8:00 — 23:00" },
  { day: "Sunday", time: "9:00 — 22:00" },
];

const MAP_SRC =
  "https://www.google.com/maps?q=House%20No%2011%2C%20Road%20117%2C%20Dhaka%201212&output=embed";

function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        chapter="03 — Contact"
        image="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2400&q=80"
        video="https://cdn.coverr.co/videos/coverr-the-inside-of-a-cafe-4699/1080p.mp4"
        captionLeft="Come Say"
        captionRight="Hello"
      />

      <section className="relative bg-background pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3 lg:px-10">
          <Reveal>
            <ContactCard icon={MapPin} label="Visit" title="House No 11">
              <p>A Rd 117, Dhaka 1212</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=House+No+11+Road+117+Dhaka+1212"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block border-b border-accent pb-0.5 text-[0.65rem] uppercase tracking-[0.28em] text-accent hover:text-foreground"
              >
                Open in Maps
              </a>
            </ContactCard>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactCard icon={Phone} label="Call" title="+880 1818-385378">
              <a
                href="tel:+8801818385378"
                className="mt-4 inline-block border-b border-accent pb-0.5 text-[0.65rem] uppercase tracking-[0.28em] text-accent hover:text-foreground"
              >
                Tap to call
              </a>
            </ContactCard>
          </Reveal>

          <Reveal delay={0.2}>
            <ContactCard icon={MessageCircle} label="WhatsApp" title="Message the café">
              <p>Reservations, orders, or a quick question.</p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block border-b border-accent pb-0.5 text-[0.65rem] uppercase tracking-[0.28em] text-accent hover:text-foreground"
              >
                Open WhatsApp
              </a>
            </ContactCard>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-background pb-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-5 md:gap-14 lg:px-10">
          {/* Map */}
          <Reveal className="md:col-span-3">
            <div className="overflow-hidden rounded-sm border border-border/70 bg-card">
              <div className="flex items-center justify-between px-6 py-4">
                <span className="chapter-label">Find Us</span>
                <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Dhaka
                </span>
              </div>
              <div className="relative aspect-[4/3] w-full bg-muted">
                <iframe
                  title="The Coffee Bean & Tea Leaf — Dhaka"
                  src={MAP_SRC}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full grayscale-[35%] contrast-[0.95]"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          {/* Hours */}
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="h-full rounded-sm border border-border/70 bg-espresso p-8 text-cream">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent" />
                <span className="chapter-label">Opening Hours</span>
              </div>
              <h3 className="mt-4 font-display text-3xl leading-tight text-cream md:text-4xl">
                Every day, gently.
              </h3>
              <ul className="mt-8 divide-y divide-cream/10">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-cream/80">{h.day}</span>
                    <span className="font-display text-accent">{h.time}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-3 border-t border-cream/10 pt-6 text-xs text-cream/60">
                <Mail className="h-3.5 w-3.5 text-accent" />
                Public holidays may vary — please call ahead.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon: Icon,
  label,
  title,
  children,
}: {
  icon: typeof Phone;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group h-full rounded-sm border border-border/70 bg-card p-8 transition-shadow duration-500 hover:shadow-[0_25px_60px_-30px_var(--espresso)]">
      <div className="grid h-11 w-11 place-items-center rounded-full border border-accent/40 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-espresso">
        <Icon className="h-4 w-4" />
      </div>
      <span className="mt-6 block chapter-label">{label}</span>
      <h3 className="mt-3 font-display text-2xl leading-tight text-foreground">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
