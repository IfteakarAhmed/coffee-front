import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  Trash2,
  X,
  UtensilsCrossed,
  Plus,
  Pencil,
  Upload,
  Sparkles,
} from "lucide-react";
import {
  deleteReservation,
  listReservations,
  getMenuCategories,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuItemImage,
  CURRENCY,
  type Reservation,
  type MenuItem,
  type MenuCategory,
  type PriceVariant,
} from "@/services/api";
import { GROUP_CATEGORY_IDS } from "@/components/menu/MenuJourney";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — The Coffee Bean & Tea Leaf" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const DAY_RANGES = [
  { id: 1 as const, label: "Today" },
  { id: 2 as const, label: "Yesterday" },
  { id: 3 as const, label: "Last 3 days" },
  { id: 7 as const, label: "Last 7 days" },
  { id: 15 as const, label: "Last 15 days" },
  { id: 30 as const, label: "Last 30 days" },
];
type DayRange = (typeof DAY_RANGES)[number]["id"];

type TabId = "reservations" | "menu";

function AdminPage() {
  const [tab, setTab] = useState<TabId>("reservations");

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <header className="border-b border-border/60 pb-6">
          <span className="chapter-label">
            <CalendarClock className="mr-2 inline h-3 w-3 text-accent" />
            Admin
          </span>
          <h1 className="mt-2 font-display text-3xl leading-tight text-foreground md:text-4xl">
            Back of house
          </h1>

          {/* Tabs */}
          <div className="mt-6 inline-flex gap-1 rounded-full border border-border/60 bg-card p-1">
            {(
              [
                { id: "reservations", label: "Reservations", icon: CalendarClock },
                { id: "menu", label: "Menu", icon: UtensilsCrossed },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] transition-colors sm:text-xs",
                    active
                      ? "bg-espresso text-cream"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="pt-8">
          {tab === "reservations" ? <ReservationsPanel /> : <MenuPanel />}
        </div>
      </div>
    </div>
  );
}

/* ============ Reservations ============ */

function ReservationsPanel() {
  const qc = useQueryClient();
  const [range, setRange] = useState<DayRange>(7);
  const [confirmDel, setConfirmDel] = useState<Reservation | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["reservations", range],
    queryFn: () => listReservations(range),
  });

  const filtered = useMemo(() => {
    if (range === 1) {
      // Today
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return rows.filter((r) => new Date(r.createdAt) >= start);
    }
    if (range === 2) {
      // Yesterday only
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      return rows.filter((r) => {
        const t = new Date(r.createdAt);
        return t >= startOfYesterday && t < startOfToday;
      });
    }
    return rows;
  }, [rows, range]);

  const delMut = useMutation({
    mutationFn: (id: string) => deleteReservation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reservation deleted");
      setConfirmDel(null);
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Reservations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} shown · retention is 30 days
          </p>
        </div>
        {/* Pill row — scrolls horizontally on mobile */}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex gap-2">
            {DAY_RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition-colors sm:text-[0.65rem]",
                  range === r.id
                    ? "border-accent bg-accent text-espresso"
                    : "border-border/60 text-muted-foreground hover:border-accent/60 hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6">
        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-sm border border-border/60 bg-card md:block">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-left text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{r.name}</div>
                    <a
                      href={`tel:${r.phone}`}
                      className="text-xs text-muted-foreground hover:text-accent"
                    >
                      {r.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-display text-sm text-foreground">{r.date}</div>
                    <div className="text-xs text-muted-foreground">{r.time}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{r.partySize}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {r.notes ? (
                      <span className="line-clamp-2 max-w-[20ch]">"{r.notes}"</span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatTs(r.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setConfirmDel(r)}
                        aria-label="Delete reservation"
                        title="Delete"
                        className="grid h-8 w-8 place-items-center rounded-sm border border-transparent text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-sm text-muted-foreground">
                    No reservations in this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 md:hidden">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-sm border border-border/60 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{r.name}</div>
                  <a href={`tel:${r.phone}`} className="text-xs text-muted-foreground">
                    {r.phone}
                  </a>
                </div>
                <button
                  onClick={() => setConfirmDel(r)}
                  className="inline-flex items-center gap-1 rounded-sm border border-destructive/50 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-destructive"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
              <div className="mt-3 flex items-baseline gap-3 text-sm">
                <span className="font-display text-foreground">{r.date}</span>
                <span className="text-muted-foreground">{r.time}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {r.partySize} guests
                </span>
              </div>
              {r.notes && <p className="mt-2 text-xs text-muted-foreground">"{r.notes}"</p>}
              <p className="mt-3 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground/70">
                Submitted {formatTs(r.createdAt)}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-sm border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground">
              No reservations in this range.
            </div>
          )}
        </div>
      </div>

      {confirmDel && (
        <ConfirmDialog
          title="Delete reservation?"
          body={
            <>
              Remove {confirmDel.name}'s reservation for {confirmDel.date} at {confirmDel.time}?
              This cannot be undone.
            </>
          }
          confirmLabel={delMut.isPending ? "Deleting…" : "Delete"}
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => delMut.mutate(confirmDel.id)}
        />
      )}
    </div>
  );
}

/* ============ Menu Management ============ */

function MenuPanel() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({
    queryKey: ["menu", "categories"],
    queryFn: () => getMenuCategories(),
  });
  const { data: items = [] } = useQuery({
    queryKey: ["menu", "items", "all"],
    queryFn: () => getMenuItems(),
  });

  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<MenuItem | null>(null);
  const [groupFilter, setGroupFilter] = useState<"all" | "food" | "drinks">("all");

  const catById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const grouped = useMemo(() => {
    const drinksSet = new Set(GROUP_CATEGORY_IDS.drinks);
    const foodSet = new Set(GROUP_CATEGORY_IDS.food);
    const bucket: { group: "drinks" | "food"; cat: MenuCategory; items: MenuItem[] }[] = [];
    for (const cat of categories) {
      const group = drinksSet.has(cat.id) ? "drinks" : foodSet.has(cat.id) ? "food" : null;
      if (!group) continue;
      if (groupFilter !== "all" && groupFilter !== group) continue;
      const catItems = items.filter((i) => i.categoryId === cat.id);
      bucket.push({ group, cat, items: catItems });
    }
    return bucket;
  }, [categories, items, groupFilter]);

  const delMut = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menu", "items", "all"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Item deleted");
      setConfirmDel(null);
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Menu Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-full border border-border/60 bg-card p-1">
            {(["all", "food", "drinks"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGroupFilter(g)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition-colors sm:text-[0.65rem]",
                  groupFilter === g
                    ? "bg-espresso text-cream"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[0.65rem] uppercase tracking-[0.24em] text-espresso hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> New item
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {grouped.map(({ group, cat, items: catItems }) => (
          <section key={cat.id}>
            <div className="mb-3 flex items-baseline justify-between border-b border-border/60 pb-2">
              <div className="min-w-0">
                <span className="chapter-label">
                  {group === "food" ? "Food" : "Drinks"} · {cat.chapter}
                </span>
                <h3 className="mt-1 font-display text-lg text-foreground">{cat.name}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{catItems.length} items</span>
            </div>

            {catItems.length === 0 ? (
              <p className="text-sm italic text-muted-foreground">No items yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catItems.map((it) => (
                  <article
                    key={it.id}
                    className="group flex gap-3 overflow-hidden rounded-sm border border-border/60 bg-card p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-muted">
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="truncate font-display text-sm text-foreground">
                          {it.name}
                          {it.isNew && (
                            <Sparkles className="ml-1 inline h-3 w-3 text-accent" />
                          )}
                        </h4>
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => setEditing(it)}
                            aria-label="Edit"
                            className="grid h-7 w-7 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDel(it)}
                            aria-label="Delete"
                            className="grid h-7 w-7 place-items-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {it.description}
                      </p>
                      <p className="mt-1 text-xs font-medium text-accent">
                        {it.prices
                          .map((p) =>
                            p.label
                              ? `${p.label} ${CURRENCY}${p.price}`
                              : `${CURRENCY}${p.price}`,
                          )
                          .join(" · ")}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {(creating || editing) && (
        <MenuItemDialog
          initial={editing ?? undefined}
          categories={categories}
          catById={catById}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["menu", "items", "all"] });
            qc.invalidateQueries({ queryKey: ["menu"] });
          }}
        />
      )}

      {confirmDel && (
        <ConfirmDialog
          title="Delete item?"
          body={
            <>
              Remove <b>{confirmDel.name}</b> from the menu? This cannot be undone.
            </>
          }
          confirmLabel={delMut.isPending ? "Deleting…" : "Delete"}
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => delMut.mutate(confirmDel.id)}
        />
      )}
    </div>
  );
}

/* ============ Menu item form dialog ============ */

interface MenuItemDialogProps {
  initial?: MenuItem;
  categories: MenuCategory[];
  catById: Map<string, MenuCategory>;
  onClose: () => void;
  onSaved: () => void;
}

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80";

function MenuItemDialog({ initial, categories, catById, onClose, onSaved }: MenuItemDialogProps) {
  const isEdit = !!initial;
  const drinksSet = new Set(GROUP_CATEGORY_IDS.drinks);
  const foodSet = new Set(GROUP_CATEGORY_IDS.food);

  const [name, setName] = useState(initial?.name ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? DEFAULT_IMG);
  const [isNew, setIsNew] = useState(!!initial?.isNew);
  const [note, setNote] = useState(initial?.note ?? "");
  const [prices, setPrices] = useState<PriceVariant[]>(
    initial?.prices?.length ? initial.prices : [{ price: 0 }],
  );
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const cat = catById.get(categoryId);
  const suggestedLabels = cat?.sizeLabels ?? [];

  const applySizeTemplate = () => {
    if (!suggestedLabels.length) {
      setPrices([{ price: 0 }]);
      return;
    }
    setPrices(suggestedLabels.map((label) => ({ label, price: 0 })));
  };

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = {
        categoryId,
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || DEFAULT_IMG,
        prices: prices.filter((p) => Number.isFinite(p.price)),
        isNew,
        note: note.trim() || undefined,
      };
      if (!payload.name) throw new Error("Name is required");
      if (!payload.categoryId) throw new Error("Category is required");
      if (!payload.prices.length) throw new Error("At least one price is required");
      if (isEdit && initial) {
        return updateMenuItem(initial.id, payload);
      }
      return createMenuItem(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Item updated" : "Item created");
      onSaved();
      onClose();
    },
    onError: (e: Error) => toast.error(e.message || "Save failed"),
  });

  const onFile = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadMenuItemImage(file);
      setImageUrl(url);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-background shadow-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border/60 bg-background px-6 py-4">
          <h3 className="font-display text-xl text-foreground">
            {isEdit ? "Edit menu item" : "New menu item"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="Caramel Macchiato"
            />
          </Field>

          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputCls}
            >
              <optgroup label="Food">
                {categories
                  .filter((c) => foodSet.has(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Drinks">
                {categories
                  .filter((c) => drinksSet.has(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </Field>

          <Field label="Trailing note (optional)">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hot or Iced"
              className={inputCls}
            />
          </Field>

          <Field label="Description" className="sm:col-span-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={cn(inputCls, "resize-y")}
              placeholder="Short, sensory line about the item."
            />
          </Field>

          {/* Prices */}
          <Field label="Prices" className="sm:col-span-2">
            <div className="space-y-2">
              {prices.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={p.label ?? ""}
                    onChange={(e) => {
                      const next = [...prices];
                      next[i] = { ...next[i], label: e.target.value || undefined };
                      setPrices(next);
                    }}
                    placeholder="Size (optional)"
                    className={cn(inputCls, "flex-1")}
                  />
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-muted-foreground">
                      {CURRENCY}
                    </span>
                    <input
                      type="number"
                      value={Number.isFinite(p.price) ? p.price : ""}
                      onChange={(e) => {
                        const next = [...prices];
                        next[i] = { ...next[i], price: Number(e.target.value) };
                        setPrices(next);
                      }}
                      className={cn(inputCls, "pl-8")}
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrices(prices.filter((_, j) => j !== i))}
                    disabled={prices.length <= 1}
                    className="grid h-9 w-9 place-items-center rounded-sm border border-border/60 text-muted-foreground hover:border-destructive/60 hover:text-destructive disabled:opacity-40"
                    aria-label="Remove price row"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPrices([...prices, { price: 0 }])}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground hover:border-accent hover:text-foreground"
                >
                  <Plus className="h-3 w-3" /> Add price
                </button>
                {suggestedLabels.length > 0 && (
                  <button
                    type="button"
                    onClick={applySizeTemplate}
                    className="rounded-full border border-border/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground hover:border-accent hover:text-foreground"
                  >
                    Use category sizes ({suggestedLabels.join(" · ")})
                  </button>
                )}
              </div>
            </div>
          </Field>

          {/* Image */}
          <Field label="Image" className="sm:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm border border-border/60 bg-muted">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputCls}
                />
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onFile(f);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-sm border border-border/60 px-3 py-2 text-xs text-foreground hover:border-accent"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Uploading…" : "Upload from device"}
                  </button>
                </div>
              </div>
            </div>
          </Field>

          <Field label='"New" badge'>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--gold)]"
              />
              Mark as new
            </label>
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-border/60 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-sm border border-border/60 px-4 py-2 text-xs uppercase tracking-[0.24em]"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending}
            className="rounded-sm bg-espresso px-4 py-2 text-xs uppercase tracking-[0.24em] text-cream hover:opacity-90 disabled:opacity-60"
          >
            {saveMut.isPending ? "Saving…" : isEdit ? "Save changes" : "Create item"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Shared ============ */

const inputCls =
  "w-full rounded-sm border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-sm border border-border bg-background p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <h3 className="font-display text-xl text-foreground">{title}</h3>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="pt-5 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-sm border border-border/60 px-4 py-2 text-xs uppercase tracking-[0.24em]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-sm bg-destructive px-4 py-2 text-xs uppercase tracking-[0.24em] text-destructive-foreground hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTs(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
