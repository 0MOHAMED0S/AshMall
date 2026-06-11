import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
import { z } from "zod";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.js";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import "@supabase/supabase-js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const listStores_createServerFn_handler = createServerRpc({
  id: "ac40bde93ee29e7711dec098b29535634e8fccf96b1a40bc5b1ed2566806d5b4",
  name: "listStores",
  filename: "src/lib/stores.functions.ts"
}, (opts) => listStores.__executeServer(opts));
const listStores = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  categorySlug: z.string().optional(),
  limit: z.number().min(1).max(100).optional().default(24),
  featured: z.boolean().optional()
}).parse(i ?? {})).handler(listStores_createServerFn_handler, async ({
  data
}) => {
  let q = supabaseAdmin.from("stores").select("id, slug, name_ar, name_en, description_ar, address, phone, rating, rating_count, cover_url, logo_url, is_featured, tags, category_id, categories(slug, name_ar, icon)").eq("status", "approved").order("is_featured", {
    ascending: false
  }).order("rating", {
    ascending: false
  }).limit(data.limit);
  if (data.categorySlug) {
    const {
      data: cat
    } = await supabaseAdmin.from("categories").select("id, name_ar").eq("slug", data.categorySlug).maybeSingle();
    if (cat) {
      const {
        data: matchingCats
      } = await supabaseAdmin.from("categories").select("id").eq("name_ar", cat.name_ar);
      const ids = (matchingCats ?? []).map((c) => c.id);
      q = ids.length > 0 ? q.in("category_id", ids) : q.eq("category_id", cat.id);
    }
  }
  if (data.featured) q = q.eq("is_featured", true);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    stores: rows ?? []
  };
});
const getStoreBySlug_createServerFn_handler = createServerRpc({
  id: "9c0faecd2b84a861e11a965da878f25e8d4297ddc27c8e650c9fbb2730083cc7",
  name: "getStoreBySlug",
  filename: "src/lib/stores.functions.ts"
}, (opts) => getStoreBySlug.__executeServer(opts));
const getStoreBySlug = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  slug: z.string().min(1).max(120)
}).parse(i)).handler(getStoreBySlug_createServerFn_handler, async ({
  data
}) => {
  const {
    data: store,
    error
  } = await supabaseAdmin.from("stores").select("*, categories(slug, name_ar, name_en, icon)").eq("slug", data.slug).eq("status", "approved").maybeSingle();
  if (error) throw new Error(error.message);
  return {
    store
  };
});
const listCategoriesWithCounts_createServerFn_handler = createServerRpc({
  id: "8e7d8cf9b5d066566cea70d750fc021a9c6face359f986e6b566c7d5d45a92b0",
  name: "listCategoriesWithCounts",
  filename: "src/lib/stores.functions.ts"
}, (opts) => listCategoriesWithCounts.__executeServer(opts));
const listCategoriesWithCounts = createServerFn({
  method: "GET"
}).handler(listCategoriesWithCounts_createServerFn_handler, async () => {
  const {
    data: cats
  } = await supabaseAdmin.from("categories").select("id, slug, name_ar, name_en, icon, sort_order").order("sort_order");
  if (!cats) return {
    categories: []
  };
  const {
    data: counts
  } = await supabaseAdmin.from("stores").select("category_id").eq("status", "approved");
  const categoryById = new Map(cats.map((c) => [c.id, c]));
  const countsByName = /* @__PURE__ */ new Map();
  counts?.forEach((s) => {
    const cat = s.category_id ? categoryById.get(s.category_id) : null;
    const key = (cat?.name_ar || s.category_id || "").trim().replace(/\s+/g, " ");
    countsByName.set(key, (countsByName.get(key) ?? 0) + 1);
  });
  return {
    categories: cats.map((c) => {
      const key = (c.name_ar || c.slug).trim().replace(/\s+/g, " ");
      return {
        ...c,
        count: countsByName.get(key) ?? 0
      };
    })
  };
});
const getCategoryBySlug_createServerFn_handler = createServerRpc({
  id: "934342accf617b315aec8af1950863253e71fc5f64df056b1661c282f5284602",
  name: "getCategoryBySlug",
  filename: "src/lib/stores.functions.ts"
}, (opts) => getCategoryBySlug.__executeServer(opts));
const getCategoryBySlug = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  slug: z.string().min(1).max(60)
}).parse(i)).handler(getCategoryBySlug_createServerFn_handler, async ({
  data
}) => {
  const {
    data: cat,
    error
  } = await supabaseAdmin.from("categories").select("*").eq("slug", data.slug).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    category: cat
  };
});
const listMyStores_createServerFn_handler = createServerRpc({
  id: "84594e55e04dfcaa530832ec8bcbb94e1cdbd57c355b957210000a9e90754da5",
  name: "listMyStores",
  filename: "src/lib/stores.functions.ts"
}, (opts) => listMyStores.__executeServer(opts));
const listMyStores = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyStores_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("stores").select("*").eq("owner_id", context.userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    stores: data ?? []
  };
});
const slugify = (s) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80) || `store-${Date.now()}`;
const applyForStore_createServerFn_handler = createServerRpc({
  id: "49030d49072c92cf9dabe52828662d781f3ac1cc11445593f8a488151e2c8f07",
  name: "applyForStore",
  filename: "src/lib/stores.functions.ts"
}, (opts) => applyForStore.__executeServer(opts));
const applyForStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  name_ar: z.string().trim().min(2).max(100),
  name_en: z.string().trim().max(100).optional(),
  description_ar: z.string().trim().max(1e3).optional(),
  category_id: z.string().uuid(),
  address: z.string().trim().min(5).max(300),
  legal_name: z.string().trim().min(2).max(150),
  delivery_fee: z.number().min(0).max(1e4).optional(),
  prep_time_minutes: z.number().int().min(0).max(600).optional(),
  opening_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  closing_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  logo_url: z.string().url().max(500).optional(),
  cover_url: z.string().url().max(500).optional()
}).parse(i)).handler(applyForStore_createServerFn_handler, async ({
  data,
  context
}) => {
  const baseSlug = slugify(data.name_en || data.name_ar);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  const {
    data: row,
    error
  } = await context.supabase.from("stores").insert({
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
    status: "pending"
  }).select().single();
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("user_roles").insert({
    user_id: context.userId,
    role: "store_owner"
  }).select();
  return {
    store: row
  };
});
export {
  applyForStore_createServerFn_handler,
  getCategoryBySlug_createServerFn_handler,
  getStoreBySlug_createServerFn_handler,
  listCategoriesWithCounts_createServerFn_handler,
  listMyStores_createServerFn_handler,
  listStores_createServerFn_handler
};
