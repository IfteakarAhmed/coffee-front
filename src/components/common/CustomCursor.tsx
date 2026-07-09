import { useEffect, useRef, useState } from "react";

/**
 * Two-part cursor: soft ring that trails the pointer + solid dot pinned
 * exactly at cursor center. Ring shrinks and tints gold when hovering an
 * interactive element. Desktop / fine-pointer only.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);

    document.documentElement.classList.add("custom-cursor-on");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hoverState = false;

    const setHover = (v: boolean) => {
      if (v !== hoverState) {
        hoverState = v;
        setHovering(v);
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
      const el = document.elementFromPoint(mx, my) as HTMLElement | null;
      const interactive = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]',
      );
      setHover(interactive);
    };

    let rafId = 0;
    const tick = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = "1";
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border transition-[width,height,border-color,background-color,opacity] duration-200 ease-out ${
          hovering
            ? "h-5 w-5 border-[color:var(--gold)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)]"
            : "h-9 w-9 border-[color:color-mix(in_oklab,var(--cream)_65%,transparent)]"
        }`}
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[6px] w-[6px] rounded-full bg-[color:var(--gold)]"
      />
    </>
  );
}
