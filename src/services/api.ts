/**
 * API service layer - src/services/api.ts
 * All data access goes directly through the Spring Boot backend database.
 */

export const API_BASE_URL = "http://localhost:8085/api";

// ---------- Types ----------

export interface PriceVariant {
  label?: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  prices: PriceVariant[];
  imageUrl: string;
  isNew?: boolean;
  note?: string;
}

export interface MenuCategory {
  id: string;
  chapter: string;
  name: string;
  tagline: string;
  heroImage: string;
  sizeLabels?: string[];
  order: number;
}

export interface ReservationInput {
  name: string;
  email: string; 
  phone: string;
  partySize: number; 
  date: string; 
  time: string; 
  notes?: string; 
}

export interface Reservation {
  id: string | number;
  name: string;
  phone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  specialRequest?: string;
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export const CURRENCY = "৳";

// Helper to map DB numeric IDs to the exact original frontend string IDs
const DB_ID_TO_FRONTEND_SLUG: Record<string | number, string> = {
  1: "espresso",
  2: "latte",
  3: "brewed-coffee",
  4: "kid-friendly",
  5: "ice-blended-original",
  6: "ice-blended-non-coffee",
  7: "iced-espresso",
  8: "brewed-tea",
  9: "tea-latte",
  10: "vanilla-tea-latte",
  11: "signature-iced-tea",
  12: "fruit-based",
  13: "customize-it",
  14: "breakfast",
  15: "pastas",
  16: "salads",
  17: "wraps",
  18: "sandwiches",
  19: "pizza",
  20: "soup",
  21: "light-bites",
  22: "burgers",
  23: "add-ons"
};

// Reverse map to find DB ID when frontend sends a string slug
const FRONTEND_SLUG_TO_DB_ID: Record<string | number, number> = {
  "espresso": 1,
  "latte": 2,
  "brewed-coffee": 3,
  "kid-friendly": 4,
  "ice-blended-original": 5,
  "ice-blended-non-coffee": 6,
  "iced-espresso": 7,
  "brewed-tea": 8,
  "tea-latte": 9,
  "vanilla-tea-latte": 10,
  "signature-iced-tea": 11,
  "fruit-based": 12,
  "customize-it": 13,
  "breakfast": 14,
  "pastas": 15,
  "salads": 16,
  "wraps": 17,
  "sandwiches": 18,
  "pizza": 19,
  "soup": 20,
  "light-bites": 21,
  "burgers": 22,
  "add-ons": 23
};

// ---------- Menu & Categories (Connected to Spring Boot API) ----------

export async function getMenuCategories(): Promise<MenuCategory[]> {
  try {
    const [drinksRes, foodRes] = await Promise.all([
      fetch(`${API_BASE_URL}/menu/categories?group=drinks`),
      fetch(`${API_BASE_URL}/menu/categories?group=food`)
    ]);

    if (!drinksRes.ok || !foodRes.ok) {
      console.error("Backend error fetching categories");
      return [];
    }

    const drinksData = await drinksRes.json();
    const foodData = await foodRes.json();
    const allData = [...drinksData, ...foodData];
    
    return allData.map((c: any) => {
      const frontendId = DB_ID_TO_FRONTEND_SLUG[c.id] || String(c.id);
      
      return {
        id: frontendId,
        chapter: String(c.chapterNumber).padStart(2, '0'),
        name: c.name,
        tagline: c.description || "",
        heroImage: c.heroImageUrl || "",
        order: c.displayOrder
      };
    }).sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error("Network error fetching categories:", err);
    return [];
  }
}

export async function getMenuItems(categoryId?: string | number): Promise<MenuItem[]> {
  try {
    let url = `${API_BASE_URL}/menu/items`;
    
    if (categoryId && categoryId !== "all") {
      const dbId = FRONTEND_SLUG_TO_DB_ID[categoryId];
      if (dbId) {
        url = `${API_BASE_URL}/menu/items?categoryId=${dbId}`;
      } else if (!isNaN(Number(categoryId))) {
        url = `${API_BASE_URL}/menu/items?categoryId=${categoryId}`;
      }
    }
      
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Backend error fetching items");
      return [];
    }
    const data = await res.json();
    
    return data.map((i: any) => {
      const prices: PriceVariant[] = [];
      if (i.priceSingle !== null && i.priceSingle !== undefined) prices.push({ price: i.priceSingle });
      if (i.priceDouble !== null && i.priceDouble !== undefined) prices.push({ label: "Double", price: i.priceDouble });
      if (i.priceSmall !== null && i.priceSmall !== undefined) prices.push({ label: "Small", price: i.priceSmall });
      if (i.priceRegular !== null && i.priceRegular !== undefined) prices.push({ label: "Reg", price: i.priceRegular });
      if (i.priceLarge !== null && i.priceLarge !== undefined) prices.push({ label: "Large", price: i.priceLarge });
      if (prices.length === 0) prices.push({ label: "Price on request", price: 0 });

      // FIX: Map the backend numeric category ID back to the frontend string slug!
      const frontendCatId = DB_ID_TO_FRONTEND_SLUG[i.categoryId] || String(i.categoryId);

      return {
        id: String(i.id),
        categoryId: frontendCatId,
        name: i.name,
        description: i.description || "",
        imageUrl: i.imageUrl || "",
        isNew: i.isNew,
        prices: prices
      };
    });
  } catch (err) {
    console.error("Network error fetching items:", err);
    return [];
  }
}

export type MenuItemInput = Omit<MenuItem, "id">;
export type MenuCategoryInput = Omit<MenuCategory, "id" | "order"> & { order?: number };

// --- Admin CRUD Functions ---
export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const payload = {
    categoryId: Number(input.categoryId) || FRONTEND_SLUG_TO_DB_ID[input.categoryId] || 0,
    name: input.name,
    description: input.description,
    imageUrl: input.imageUrl,
    isNew: !!input.isNew,
    priceSingle: input.prices.find(p => !p.label || p.label === "Single")?.price || null,
    priceDouble: input.prices.find(p => p.label === "Double")?.price || null,
    priceSmall: input.prices.find(p => p.label === "Small")?.price || null,
    priceRegular: input.prices.find(p => p.label === "Reg" || p.label === "Regular")?.price || null,
    priceLarge: input.prices.find(p => p.label === "Large")?.price || null,
    displayOrder: 0
  };

  const res = await fetch(`${API_BASE_URL}/menu/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create menu item");
  const i = await res.json();
  
  return {
    id: String(i.id),
    categoryId: input.categoryId,
    name: i.name,
    description: i.description || "",
    imageUrl: i.imageUrl || "",
    isNew: i.isNew,
    prices: input.prices
  };
}

export async function updateMenuItem(id: string | number, patch: Partial<MenuItemInput>): Promise<MenuItem> {
  const dbCategoryId = patch.categoryId ? (FRONTEND_SLUG_TO_DB_ID[patch.categoryId] || Number(patch.categoryId)) : undefined;

  const payload = {
    categoryId: dbCategoryId,
    name: patch.name,
    description: patch.description,
    imageUrl: patch.imageUrl,
    isNew: patch.isNew,
    priceSingle: patch.prices ? patch.prices.find((p: any) => !p.label || p.label === "Single")?.price : undefined,
    priceDouble: patch.prices ? patch.prices.find((p: any) => p.label === "Double")?.price : undefined,
    priceSmall: patch.prices ? patch.prices.find((p: any) => p.label === "Small")?.price : undefined,
    priceRegular: patch.prices ? patch.prices.find((p: any) => p.label === "Reg" || p.label === "Regular")?.price : undefined,
    priceLarge: patch.prices ? patch.prices.find((p: any) => p.label === "Large")?.price : undefined,
  };

  const res = await fetch(`${API_BASE_URL}/menu/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update menu item");
  const i = await res.json();

  const prices: PriceVariant[] = [];
  if (i.priceSingle != null) prices.push({ price: i.priceSingle });
  if (i.priceDouble != null) prices.push({ label: "Double", price: i.priceDouble });
  if (i.priceSmall != null) prices.push({ label: "Small", price: i.priceSmall });
  if (i.priceRegular != null) prices.push({ label: "Reg", price: i.priceRegular });
  if (i.priceLarge != null) prices.push({ label: "Large", price: i.priceLarge });

  return {
    id: String(i.id),
    categoryId: patch.categoryId || DB_ID_TO_FRONTEND_SLUG[i.categoryId] || String(i.categoryId),
    name: i.name,
    description: i.description || "",
    imageUrl: i.imageUrl || "",
    isNew: i.isNew,
    prices: prices.length > 0 ? prices : (patch.prices || [])
  };
}

export async function deleteMenuItem(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/menu/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete menu item");
}

export async function uploadMenuItemImage(file: File): Promise<{ url: string }> {
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return { url };
}

export async function createMenuCategory(input: any): Promise<any> {
  throw new Error("Not implemented");
}

// ---------- Reservations ----------

export async function createReservation(input: ReservationInput): Promise<Reservation> {
  const payload = {
    name: input.name,
    phone: input.phone,
    reservationDate: input.date,
    reservationTime: input.time,
    guests: input.partySize,
    specialRequest: input.notes,
  };
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create reservation");
  return res.json();
}

export async function listReservations(days: string | number = 7): Promise<Reservation[]> {
  const res = await fetch(`${API_BASE_URL}/reservations?range=${days}`);
  if (!res.ok) throw new Error("Failed to fetch reservations");
  return res.json();
}

export async function updateReservationStatus(id: string | number, status: Reservation["status"]): Promise<Reservation> {
  const res = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update reservation status");
  return res.json();
}

export async function deleteReservation(id: string | number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/reservations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete reservation");
}

// ---------- Chat ----------

export async function sendChatMessage(message: string, history: ChatMessage[] = []): Promise<ChatMessage> {
  void history;
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Failed to send chat message");
  const data = await res.json();
  
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: data.reply,
    createdAt: new Date().toISOString(),
  };
}