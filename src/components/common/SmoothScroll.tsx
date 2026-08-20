import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth scroll powered by Lenis.
 * - Desktop wheel/trackpad: eased, weighted, premium feel.
 * - Touch: native scrolling stays untouched (smoothTouch:false, default).
 * - Compatible with sticky/pinned sections and IntersectionObserver
 *   because Lenis drives the real window scroll position.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });


}
