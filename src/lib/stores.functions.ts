import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- PUBLIC: list approved stores ----------
export const listStores = createServerFn({ method: "GET" })
  .inputValidator((i) =>
    z.object({
      categorySlug: z.string().optional(),
      limit: z.number().min(1).max(100).optional().default(24),
      featured: z.boolean().optional(),
    }).parse(i ?? {}),
  )
  .handler(async ({ data }) => {
    let q = supabaseAdmin
      .from("stores")
      .select("id, slug, name_ar, name_en, description_ar, address, phone, rating, rating_count, cover_url, logo_url, is_featured, tags, category_id, categories(slug, name_ar, icon)")
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("rating", { ascending: false })
      .limit(data.limit);

    if (data.categorySlug) {
      const { data: cat } = await supabaseAdmin
        .from("categories")
        .select("id, name_ar")
        .eq("slug", data.categorySlug)
        .maybeSingle();

      if (cat) {
        const { data: matchingCats } = await supabaseAdmin
          .from("categories")
          .select("id")
          .eq("name_ar", cat.name_ar);
        const ids = (matchingCats ?? []).map((c) => c.id);
        q = ids.length > 0 ? q.in("category_id", ids) : q.eq("category_id", cat.id);
      }
    }
    if (data.featured) q = q.eq("is_featured", true);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { stores: rows ?? [] };
  });

// ---------- PUBLIC: single store by slug ----------
export const getStoreBySlug = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data }) => {
    const { data: store, error } = await supabaseAdmin
      .from("stores")
      .select("*, categories(slug, name_ar, name_en, icon)")
      .eq("slug", data.slug)
      .eq("status", "approved")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { store };
  });

// ---------- PUBLIC: categories with store counts ----------
export const listCategoriesWithCounts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("id, slug, name_ar, name_en, icon, sort_order")
      .order("sort_order");
    if (!cats) return { categories: [] };

    const { data: counts } = await supabaseAdmin
      .from("stores")
      .select("category_id")
      .eq("status", "approved");

    const categoryById = new Map(cats.map((c) => [c.id, c]));
    const countsByName = new Map<string, number>();
    counts?.forEach((s) => {
      const cat = s.category_id ? categoryById.get(s.category_id) : null;
      const key = (cat?.name_ar || s.category_id || "").trim().replace(/\s+/g, " ");
      countsByName.set(key, (countsByName.get(key) ?? 0) + 1);
    });

    return {
      categories: cats.map((c) => {
        const key = (c.name_ar || c.slug).trim().replace(/\s+/g, " ");
        return { ...c, count: countsByName.get(key) ?? 0 };
      }),
    };
  });

// ---------- PUBLIC: category by slug ----------
export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ slug: z.string().min(1).max(60) }).parse(i))
  .handler(async ({ data }) => {
    const { data: cat, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { category: cat };
  });

// ---------- AUTHENTICATED: stores owned by current user ----------
export const listMyStores = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("stores")
      .select("*")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { stores: data ?? [] };
  });

// ---------- AUTHENTICATED: apply for a new store ----------
const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `store-${Date.now()}`;

export const applyForStore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      name_ar: z.string().trim().min(2).max(100),
      name_en: z.string().trim().max(100).optional(),
      description_ar: z.string().trim().max(1000).optional(),
      category_id: z.string().uuid(),
      address: z.string().trim().min(5).max(300),
      legal_name: z.string().trim().min(2).max(150),
      delivery_fee: z.number().min(0).max(10000).optional(),
      prep_time_minutes: z.number().int().min(0).max(600).optional(),
      opening_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      closing_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      logo_url: z.string().url().max(500).optional(),
      cover_url: z.string().url().max(500).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const baseSlug = slugify(data.name_en || data.name_ar);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    const { data: row, error } = await context.supabase
      .from("stores")
      .insert({
        owner_id: context.userId,
        slug,
        name_ar: data.name_ar,
        name_en: data.name_en ?? null,
        description_ar: data.description_ar ?? null,
        category_id: data.category_id,
        address: data.address,
        legal_name: data.legal_name,
        delivery_fee: data.delivery_fee ?? null,
        prep_time_minutes: data.prep_time_minutes ?? null,
        opening_time: data.opening_time ?? null,
        closing_time: data.closing_time ?? null,
        logo_url: data.logo_url ?? null,
        cover_url: data.cover_url ?? null,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "store_owner" })
      .select();

    return { store: row };
  });
