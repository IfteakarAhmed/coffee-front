import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMenuCategories, getMenuItems } from "@/services/api";
import { MenuJourney } from "@/components/menu/MenuJourney";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — The Coffee Bean & Tea Leaf" },
      {
        name: "description",
        content:
          "Two journeys — Food and Drinks. Chapter by chapter through The Coffee Bean & Tea Leaf, Dhaka.",
      },
      { property: "og:title", content: "Menu — The Coffee Bean & Tea Leaf" },
      { property: "og:description", content: "Food or Drinks — every chapter has its story." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data: categories = [] } = useQuery({
    queryKey: ["menu", "categories"],
    queryFn: () => getMenuCategories(),
  });
  const { data: items = [] } = useQuery({
    queryKey: ["menu", "items", "all"],
    queryFn: () => getMenuItems(),
  });

  return <MenuJourney categories={categories} items={items} />;
}
