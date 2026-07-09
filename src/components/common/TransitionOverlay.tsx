import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { useRouter } from "@tanstack/react-router";
import { Logo } from "./Logo";

/**
 * Universal page transition overlay.
 *
 * A single dark full-screen overlay that shows the destination page name in
 * bold display type between route changes. Used both for first site load
 * and every subsequent card/link navigation, so the whole app has one
 * consistent cinematic hand-off.
 *
 *   const goto = useTransitionNavigate();
 *   goto("/menu/espresso", "Espresso");
 */

type State = { active: boolean; label: string };
let state: State = { active: false, label: "" };
const listeners = new Set<() => void>();
let busy = false;

function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return state;
}

/**
 * Show the overlay, then run `action` (usually a navigate), then hide.
 * Concurrent calls are ignored to prevent stacking on rapid clicks.
 */
export async function playTransition(
  label: string,
  action: () => void | Promise<void> = () => {},
): Promise<void> {
  if (busy) return;
  busy = true;
  state = { active: true, label };
  emit();
  await new Promise((r) => setTimeout(r, 420));
  try {
    await action();
  } finally {
    // Small hold so the destination has a moment to mount under the cover.
    await new Promise((r) => setTimeout(r, 260));
    state = { active: false, label };
    emit();
    busy = false;
  }
}

/**
 * Returns a `(to, label) => void` helper that plays the transition then
 * navigates via the TanStack router.
 */
export function useTransitionNavigate() {
  const router = useRouter();
  return (to: string, label: string) => {
    void playTransition(label, () => router.navigate({ to: to as never }));
  };
}

export function TransitionOverlay() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return (
    <AnimatePresence>
      {s.active && (
        <motion.div
          key="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-espresso text-cream"
          aria-hidden={!s.active}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo size={72} onDark />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20, letterSpacing: "0.06em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "-0.02em" }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[90vw] text-center font-display uppercase text-cream"
            style={{ fontSize: "clamp(2rem, 8vw, 5.5rem)", lineHeight: 1 }}
          >
            {s.label}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
            className="mt-6 h-px w-32 origin-left bg-accent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
