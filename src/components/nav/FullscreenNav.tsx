import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { StackedCards } from "./StackedCards";
import { NAV_PAGES } from "./nav-pages";
import { Logo } from "@/components/common/Logo";
import { useTransitionNavigate } from "@/components/common/TransitionOverlay";

export function FullscreenNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const goto = useTransitionNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="fullscreen-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[80] flex flex-col bg-ink text-cream"
        >
          <div className="flex items-center justify-between px-6 py-5 md:px-10">
            <div className="inline-flex items-center gap-3">
              <Logo size={44} onDark />
              <span className="hidden font-display text-lg tracking-tight sm:inline md:text-xl">
                The Coffee Bean <span className="text-accent">&amp;</span> Tea Leaf
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.32em] text-cream/80 transition-colors hover:text-accent"
            >
              <span className="hidden sm:inline">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-y-auto px-4 md:overflow-hidden md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <StackedCards
                pages={NAV_PAGES}
                activePath={pathname}
                onSelect={(p) => {
                  onClose();
                  setTimeout(() => goto(p.to, p.title), 100);
                }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-6 py-6 text-[0.7rem] uppercase tracking-[0.28em] text-cream/60 sm:grid-cols-2 md:px-10">
            <div>
              <div className="text-accent">Visit</div>
              <div className="mt-2 normal-case tracking-normal text-cream/80">
                House No 11, A Rd 117
                <br />
                Dhaka 1212
              </div>
            </div>
            <div className="sm:text-right">
              <div className="text-accent">Contact</div>
              <div className="mt-2 normal-case tracking-normal text-cream/80">
                <a href="tel:+8801818385378" className="hover:text-accent">
                  +880 1818-385378
                </a>
                <br />
                hello@coffeebeandhaka.com
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
