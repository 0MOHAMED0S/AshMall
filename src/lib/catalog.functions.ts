import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ============================================================
// Smart catalog management: sections + products (general/clothing/food)
// + variants (clothing) + extras (food).
// Admin-only mutations. Public read used by store pages.
// ============================================================

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles").select("role")
    .eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

// -------- Lightweight store list for picker --------
export const adminListStoresLite = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ q: z.string().optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("stores")
      .select("id, name_ar, slug, status, logo_url, categories(name_ar, slug)")
      .order("name_ar", { ascending: true })
      .limit(300);
    if (data.q) q = q.ilike("name_ar", `%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { stores: rows ?? [] };
  });

// -------- Full catalog of one store --------
export const adminGetStoreCatalog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ store_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;

    const [storeRes, sectionsRes, productsRes] = await Promise.all([
      sb.from("stores").select("id, name_ar, slug, logo_url, status, categories(name_ar, slug)").eq("id", data.store_id).maybeSingle(),
      sb.from("product_sections").select("*").eq("store_id", data.store_id).order("sort_order", { ascending: true }),
      sb.from("products").select("*").eq("store_id", data.store_id).order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    ]);
    if (storeRes.error) throw new Error(storeRes.error.message);
    if (!storeRes.data) throw new Error("Store not found");
    if (sectionsRes.error) throw new Error(sectionsRes.error.message);
    if (productsRes.error) throw new Error(productsRes.error.message);

    const productIds = (productsRes.data ?? []).map((p: any) => p.id);
    const [variantsRes, extrasRes] = productIds.length
      ? await Promise.all([
          sb.from("product_variants").select("*").in("product_id", productIds).order("sort_order", { ascending: true }),
          sb.from("product_extras").select("*").in("product_id", productIds).order("sort_order", { ascending: true }),
        ])
      : [{ data: [] as any[] }, { data: [] as any[] }];

    return {
      store: storeRes.data,
      sections: sectionsRes.data ?? [],
      products: productsRes.data ?? [],
      variants: variantsRes.data ?? [],
      extras: extrasRes.data ?? [],
    };
  });

// -------- SECTIONS --------
export const adminUpsertSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    id: z.string().uuid().optional(),
    store_id: z.string().uuid(),
    name_ar: z.string().trim().min(1).max(80),
    name_en: z.string().trim().max(80).optional().nullable(),
    icon: z.string().trim().max(40).optional().nullable(),
    sort_order: z.number().int().min(0).max(9999).default(0),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = {
      store_id: data.store_id,
      name_ar: data.name_ar,
      name_en: data.name_en ?? null,
      icon: data.icon ?? null,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("product_sections").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: created, error } = await context.supabase.from("product_sections").insert(row).select("id").single();
      if (error) throw new Error(error.message);
      return { ok: true, id: created.id };
    }
  });

export const adminDeleteSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("product_sections").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- PRODUCTS (smart) --------
const ProductInput = z.object({
  id: z.string().uuid().optional(),
  store_id: z.string().uuid(),
  section_id: z.string().uuid().nullable().optional(),
  product_type: z.enum(["general", "clothing", "food"]).default("general"),
  name_ar: z.string().trim().min(1).max(200),
  description_ar: z.string().trim().max(1500).optional().nullable(),
  price: z.number().min(0).max(9_999_999).nullable().optional(),
  compare_at_price: z.number().min(0).max(9_999_999).nullable().optional(),
  image_url: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  image_url_extra: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  stock: z.number().int().min(0).max(9_999_999).nullable().optional(),
  sku: z.string().trim().max(80).nullable().optional(),
  is_available: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => ProductInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    let sectionLabel: string | null = null;
    if (data.section_id) {
      const { data: sec } = await context.supabase
        .from("product_sections").select("name_ar").eq("id", data.section_id).maybeSingle();
      sectionLabel = sec?.name_ar ?? null;
    }

    const row = {
      store_id: data.store_id,
      section_id: data.section_id ?? null,
      section: sectionLabel,
      product_type: data.product_type,
      name_ar: data.name_ar,
      description_ar: data.description_ar ?? null,
      price: data.price ?? null,
      compare_at_price: data.compare_at_price ?? null,
      image_url: data.image_url || null,
      image_url_extra: data.image_url_extra || null,
      stock: data.stock ?? null,
      sku: data.sku || null,
      is_available: data.is_available,
      sort_order: data.sort_order,
    } as any;

    if (data.id) {
      const { error } = await context.supabase.from("products").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: created, error } = await context.supabase.from("products").insert(row).select("id").single();
      if (error) throw new Error(error.message);
      return { ok: true, id: created.id };
    }
  });

export const adminDeleteProductFull = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- VARIANTS (clothing) --------
const VariantInput = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  size: z.string().trim().max(40).nullable().optional(),
  color: z.string().trim().max(60).nullable().optional(),
  color_hex: z.string().trim().regex(/^#[0-9a-fA-F]{3,8}$/).nullable().optional().or(z.literal("")),
  sku: z.string().trim().max(80).nullable().optional(),
  price: z.number().min(0).max(9_999_999).nullable().optional(),
  stock: z.number().int().min(0).max(9_999_999).default(0),
  image_url: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const adminUpsertVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => VariantInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = {
      product_id: data.product_id,
      size: data.size || null,
      color: data.color || null,
      color_hex: data.color_hex || null,
      sku: data.sku || null,
      price: data.price ?? null,
      stock: data.stock,
      image_url: data.image_url || null,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("product_variants").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: created, error } = await context.supabase.from("product_variants").insert(row).select("id").single();
      if (error) throw new Error(error.message);
      return { ok: true, id: created.id };
    }
  });

export const adminDeleteVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("product_variants").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- EXTRAS (food add-ons) --------
const ExtraInput = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(80),
  price: z.number().min(0).max(9_999_999).default(0),
  is_required: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const adminUpsertExtra = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => ExtraInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = {
      product_id: data.product_id,
      name_ar: data.name_ar,
      price: data.price,
      is_required: data.is_required,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await context.supabase.from("product_extras").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    } else {
      const { data: created, error } = await context.supabase.from("product_extras").insert(row).select("id").single();
      if (error) throw new Error(error.message);
      return { ok: true, id: created.id };
    }
  });

export const adminDeleteExtra = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("product_extras").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- PUBLIC: smart catalog for store page --------
export const getStoreSmartCatalog = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ storeId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const [sectionsRes, productsRes] = await Promise.all([
      supabaseAdmin.from("product_sections").select("id, name_ar, name_en, icon, sort_order").eq("store_id", data.storeId).order("sort_order", { ascending: true }),
      supabaseAdmin.from("products").select("id, section_id, product_type, name_ar, description_ar, price, compare_at_price, currency, image_url, stock, is_available, sort_order").eq("store_id", data.storeId).eq("is_available", true).order("sort_order", { ascending: true }),
    ]);
    if (sectionsRes.error) throw new Error(sectionsRes.error.message);
    if (productsRes.error) throw new Error(productsRes.error.message);
    const ids = (productsRes.data ?? []).map((p: any) => p.id);
    const [vRes, eRes] = ids.length
      ? await Promise.all([
          supabaseAdmin.from("product_variants").select("id, product_id, size, color, color_hex, price, stock, image_url").in("product_id", ids),
          supabaseAdmin.from("product_extras").select("id, product_id, name_ar, price, is_required").in("product_id", ids),
        ])
      : [{ data: [] as any[] }, { data: [] as any[] }];
    return {
      sections: sectionsRes.data ?? [],
      products: productsRes.data ?? [],
      variants: vRes.data ?? [],
      extras: eRes.data ?? [],
    };
  });
