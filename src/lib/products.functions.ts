import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// PUBLIC — list products for an approved store
export const listProductsByStore = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ storeId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, name_ar, description_ar, price, compare_at_price, currency, image_url, image_url_extra, section, is_available, sort_order, order_count, created_at, product_type")
      .eq("store_id", data.storeId)
      .order("section", { ascending: true, nullsFirst: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { products: rows ?? [] };
  });

// PUBLIC — single product by id (with store info)
export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("*, stores!inner(id, slug, name_ar, name_en, logo_url, cover_url, rating, rating_count, address, phone, whatsapp, status, categories(slug, name_ar))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || (row.stores as { status: string } | null)?.status !== "approved") return { product: null };
    return { product: row };
  });

// OWNER — list my store's products
export const listMyStoreProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ storeId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("products")
      .select("*")
      .eq("store_id", data.storeId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { products: rows ?? [] };
  });

// OWNER — create
export const createProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    store_id: z.string().uuid(),
    name_ar: z.string().trim().min(1).max(150),
    description_ar: z.string().trim().max(800).optional(),
    price: z.number().min(0).max(1_000_000).optional(),
    image_url: z.string().url().max(500).optional(),
    section: z.string().trim().max(80).optional(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("products")
      .insert({
        store_id: data.store_id,
        name_ar: data.name_ar,
        description_ar: data.description_ar ?? null,
        price: data.price ?? null,
        image_url: data.image_url ?? null,
        section: data.section ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { product: row };
  });

// OWNER — delete
export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
