import { createFileRoute } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/home/LoadingScreen";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { GalleryPinned } from "@/components/home/GalleryPinned";
import { Features } from "@/components/home/Features";
import { ExploreStack } from "@/components/home/ExploreStack";
import { TeaserMenu } from "@/components/home/TeaserMenu";
import { LocationCTA } from "@/components/home/LocationCTA";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <LoadingScreen />
      <Hero />
      <Story />
      <GalleryPinned />
      <Features />
      <ExploreStack />
      <TeaserMenu />
      <LocationCTA />
    </>
  );
}

