import { useEffect } from "react";
import { playTransition } from "@/components/common/TransitionOverlay";

const KEY = "cbtl:seen-intro";

/**
 * First-visit intro. Uses the shared TransitionOverlay so the first-load
 * flourish looks identical to page-to-page transitions elsewhere.
 */
export function LoadingScreen() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(KEY)) return;
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    void playTransition("The Coffee Bean & Tea Leaf");
  }, []);

  return null;
}
