import { AnimatePresence, motion } from "motion/react";
import { Outlet, useRouterState } from "@tanstack/react-router";

/**
 * Wraps the routed <Outlet /> in a fade+lift transition. Keyed by pathname
 * so consecutive matches on the same route don't re-mount.
 */
export function PageTransitions() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
