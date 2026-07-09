import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { ChatWidget } from "@/components/common/ChatWidget";
import { PageTransitions } from "@/components/layout/PageTransitions";
import { TransitionOverlay } from "@/components/common/TransitionOverlay";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { CustomCursor } from "@/components/common/CustomCursor";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <span className="chapter-label">404 — Lost in the grove</span>
        <h1 className="mt-6 font-display text-6xl text-foreground">Not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has wandered off. Let's get you back.
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Return home
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <span className="chapter-label">Something spilled</span>
        <h1 className="mt-6 font-display text-4xl text-foreground">
          This page didn't load
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Try again in a moment, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.24em] text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border px-6 py-3 text-xs uppercase tracking-[0.24em] text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Coffee Bean & Tea Leaf — Premium Since 1963" },
      {
        name: "description",
        content:
          "Handcrafted coffee and tea, served with old-world care since 1963. Visit our Dhaka café or reserve a table.",
      },
      { name: "author", content: "The Coffee Bean & Tea Leaf" },
      { property: "og:title", content: "The Coffee Bean & Tea Leaf — Premium Since 1963" },
      {
        property: "og:description",
        content:
          "Handcrafted coffee and tea, served with old-world care since 1963.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Coffee Bean & Tea Leaf — Premium Since 1963" },
      { name: "description", content: "A premium restaurant website foundation for \"The Coffee Bean & Tea Leaf\" cafe." },
      { property: "og:description", content: "A premium restaurant website foundation for \"The Coffee Bean & Tea Leaf\" cafe." },
      { name: "twitter:description", content: "A premium restaurant website foundation for \"The Coffee Bean & Tea Leaf\" cafe." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c144e3ff-009d-4250-a04b-721d2134f710/id-preview-696fdd70--b2400647-9033-4aae-8367-b4be466d4a8d.lovable.app-1782982760754.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c144e3ff-009d-4250-a04b-721d2134f710/id-preview-696fdd70--b2400647-9033-4aae-8367-b4be466d4a8d.lovable.app-1782982760754.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "256x256" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <PageTransitions />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <ChatWidget />
        <TransitionOverlay />
        <SmoothScroll />
        <CustomCursor />
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            style: {
              background: "var(--espresso)",
              color: "var(--cream)",
              border: "1px solid color-mix(in oklab, var(--gold) 50%, transparent)",
              borderRadius: "2px",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}
