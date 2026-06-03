import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Most-ordered products across all approved stores
export const listPopularProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name_ar, price, currency, image_url, store_id, order_count, stores!inner(slug, name_ar, status)")
      .eq("is_available", true)
      .eq("stores.status", "approved")
      .order("order_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);
    if (error) throw new Error(error.message);
    return { products: data ?? [] };
  });

// Discount products
export const listDiscountProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name_ar, price, compare_at_price, currency, image_url, store_id, stores!inner(slug, name_ar, status)")
      .eq("is_available", true)
      .eq("stores.status", "approved")
      .not("compare_at_price", "is", null)
      .order("created_at", { ascending: false })
      .limit(12);
    if (error) throw new Error(error.message);
    // Keep only items where compare_at_price > price
    const filtered = (data ?? []).filter((p) => (p.compare_at_price ?? 0) > (p.price ?? 0));
    return { products: filtered };
  });

// Featured nearby stores (circles row)
export const listFeaturedNearbyStores = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("stores")
      .select("id, slug, name_ar, logo_url, rating, rating_count")
      .eq("status", "approved")
      .eq("is_featured", true)
      .order("rating", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    return { stores: data ?? [] };
  });

// Recently added stores
export const listRecentStores = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("stores")
      .select("id, slug, name_ar, description_ar, logo_url, cover_url, address, rating, rating_count, opening_hours, categories(name_ar)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw new Error(error.message);
    return { stores: data ?? [] };
  });

// Lookup specific stores by ID (for "recently viewed" from localStorage)
export const getStoresByIds = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ ids: z.array(z.string().uuid()).max(20) }).parse(i))
  .handler(async ({ data }) => {
    if (data.ids.length === 0) return { stores: [] };
    const { data: rows, error } = await supabaseAdmin
      .from("stores")
      .select("id, slug, name_ar, logo_url, cover_url, rating, rating_count, categories(name_ar)")
      .in("id", data.ids)
      .eq("status", "approved");
    if (error) throw new Error(error.message);
    // Preserve order from input
    const map = new Map((rows ?? []).map((r) => [r.id, r]));
    const ordered = data.ids.map((id) => map.get(id)).filter(Boolean);
    return { stores: ordered };
  });
