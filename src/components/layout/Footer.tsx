import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-espresso text-cream">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <Logo size={64} onDark />
              <div>
                <span className="chapter-label">Est. 1963</span>
                <h3 className="mt-1 font-display text-2xl leading-tight text-cream md:text-3xl">
                  The Coffee Bean <span className="text-accent">&amp;</span> Tea Leaf
                </h3>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70">
              A quiet room, a slow pour, a leaf unfurling. Six decades of
              handcrafted coffee and tea, served with the same care as the day
              we opened.
            </p>
          </div>

          <div>
            <span className="chapter-label">Visit</span>
            <ul className="mt-4 space-y-3 text-sm text-cream/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>House No 11, A Rd 117,<br />Dhaka 1212</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+8801818385378" className="hover:text-accent">
                  +880 1818-385378
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="chapter-label">Explore</span>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/menu", label: "Menu" },
                { to: "/reservation", label: "Reservation" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-cream/80 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} The Coffee Bean &amp; Tea Leaf. All rights reserved.</span>
          <span>
            Built by{" "}
            <a
              href="https://ifteakar.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-transparent text-cream/80 transition-colors hover:border-accent hover:text-accent"
            >
              ifteakar.dev
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
