import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getMenuCategories, getMenuItems } from "@/services/api";
import { CategoryChapter } from "@/components/menu/CategoryChapter";
import { useTransitionNavigate } from "@/components/common/TransitionOverlay";

export const Route = createFileRoute("/menu/$categoryId")({
  head: ({ params }) => ({
    meta: [
      { title: `${prettify(params.categoryId)} — Menu — The Coffee Bean & Tea Leaf` },
      { property: "og:title", content: `${prettify(params.categoryId)} — Menu` },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <span className="chapter-label">Chapter not found</span>
        <h1 className="mt-4 font-display text-4xl">This chapter has moved.</h1>
        <Link
          to="/menu"
          className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-1 text-xs uppercase tracking-[0.24em] text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>
      </div>
    </div>
  ),
});

function prettify(id: string) {
  return id
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const { data: categories = [] } = useQuery({
    queryKey: ["menu", "categories"],
    queryFn: () => getMenuCategories(),
  });
  const { data: items = [] } = useQuery({
    queryKey: ["menu", "items", categoryId],
    queryFn: () => getMenuItems(categoryId),
  });

  const category = categories.find((c) => c.id === categoryId);
  const goto = useTransitionNavigate();

  if (categories.length > 0 && !category) throw notFound();
  if (!category) return null;

  return (
    <div className="relative">
      {/* Persistent back to picker */}
      <button
        type="button"
        onClick={() => goto("/menu", "The Menu")}
        className="fixed left-4 top-24 z-40 inline-flex items-center gap-2 rounded-sm border border-cream/30 bg-ink/60 px-3 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-cream backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:left-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Back to menu</span>
      </button>

      <CategoryChapter
        category={category}
        items={items}
        registerRef={() => {}}
        isFirst
        isLast
      />
    </div>
  );
}
