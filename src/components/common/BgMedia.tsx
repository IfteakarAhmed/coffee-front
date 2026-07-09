import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Unified background image / muted looping video block. Falls back to the
 * static image on mobile, on `prefers-reduced-motion`, or if the video fails.
 */
export function BgMedia({
  image,
  video,
  alt,
  className,
  imgClassName,
  eager,
  disableVideo,
}: {
  image: string;
  video?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  disableVideo?: boolean;
}) {
  const [videoReady, setVideoReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const shouldPlay =
    !!video &&
    !disableVideo &&
    !failed &&
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!shouldPlay || !videoRef.current) return;
    const v = videoRef.current;
    const onCanPlay = () => setVideoReady(true);
    const onError = () => setFailed(true);
    v.addEventListener("loadeddata", onCanPlay);
    v.addEventListener("error", onError);
    v.play().catch(() => {
      /* autoplay blocked — leave image */
    });
    return () => {
      v.removeEventListener("loadeddata", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, [shouldPlay]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <img
        src={image}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.dataset.fallback !== "1") {
            img.dataset.fallback = "1";
            img.src =
              "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=2000&q=80";
          }
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700",
          videoReady ? "opacity-0" : "opacity-100",
          imgClassName,
        )}
      />
      {shouldPlay && (
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            videoReady ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
