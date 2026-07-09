import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  /** Kept for API compatibility; the logo is transparent-safe on any bg. */
  onDark?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * The Coffee Bean & Tea Leaf circular badge mark.
 * Rendered as a clean transparent circle — no rectangular container artifact.
 */
export function Logo({ size = 44, className, ariaLabel = "The Coffee Bean & Tea Leaf" }: LogoProps) {
  return (
    <span
      className={cn("inline-block shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
      role="img"
    >
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        className="block h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}
