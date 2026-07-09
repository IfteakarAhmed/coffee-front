/**
 * Shared page config for the stacked flip-card navigation.
 * Used by both the fullscreen nav overlay and the homepage "Explore" section.
 */

export interface NavPage {
  /** Card number label ("00", "01", ...). */
  number: string;
  /** Route path. */
  to: string;
  /** Short title rendered on the card. */
  title: string;
  /** A one-line tagline shown on the revealed face. */
  tagline: string;
  /** Representative background image (or video poster). */
  image: string;
  /** Optional short looping background video. */
  video?: string;
}

// Placeholder short muted cinemagraphs from a public CDN; swap for real footage later.
const V_COFFEE_POUR =
  "https://cdn.coverr.co/videos/coverr-pouring-coffee-into-a-cup-8130/1080p.mp4";
const V_LATTE =
  "https://cdn.coverr.co/videos/coverr-preparing-a-cup-of-latte-2633/1080p.mp4";
const V_TABLE =
  "https://cdn.coverr.co/videos/coverr-a-table-in-a-restaurant-7266/1080p.mp4";
const V_INTERIOR =
  "https://cdn.coverr.co/videos/coverr-the-inside-of-a-cafe-4699/1080p.mp4";

export const NAV_PAGES: NavPage[] = [
  {
    number: "00",
    to: "/",
    title: "Home",
    tagline: "Premium Since 1963",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80",
    video: V_COFFEE_POUR,
  },
  {
    number: "01",
    to: "/menu",
    title: "Menu",
    tagline: "Chapter by chapter",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    video: V_LATTE,
  },
  {
    number: "02",
    to: "/reservation",
    title: "Reservation",
    tagline: "Save a quiet seat",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=80",
    video: V_TABLE,
  },
  {
    number: "03",
    to: "/contact",
    title: "Contact",
    tagline: "Come say hello",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=80",
    video: V_INTERIOR,
  },
];
