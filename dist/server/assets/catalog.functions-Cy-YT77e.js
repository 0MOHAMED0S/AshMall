import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.js";
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
async function assertAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}
const adminListStoresLite_createServerFn_handler = createServerRpc({
  id: "ba8134f2138ab250650c30c0f838f039ba3ab202f24ef535680b5852675dd7a0",
  name: "adminListStoresLite",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminListStoresLite.__executeServer(opts));
const adminListStoresLite = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional()
}).parse(i ?? {})).handler(adminListStoresLite_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let q = context.supabase.from("stores").select("id, name_ar, slug, status, logo_url, categories(name_ar, slug)").order("name_ar", {
    ascending: true
  }).limit(300);
  if (data.q) q = q.ilike("name_ar", `%${data.q}%`);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    stores: rows ?? []
  };
});
const adminGetStoreCatalog_createServerFn_handler = createServerRpc({
  id: "316e896bf86dae0d4e3059b2b2c7ac20195cb6f62a1d4fd451c27f1a9b5de34b",
  name: "adminGetStoreCatalog",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminGetStoreCatalog.__executeServer(opts));
const adminGetStoreCatalog = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(adminGetStoreCatalog_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const sb = context.supabase;
  const [storeRes, sectionsRes, productsRes] = await Promise.all([sb.from("stores").select("id, name_ar, slug, logo_url, status, categories(name_ar, slug)").eq("id", data.store_id).maybeSingle(), sb.from("product_sections").select("*").eq("store_id", data.store_id).order("sort_order", {
    ascending: true
  }), sb.from("products").select("*").eq("store_id", data.store_id).order("sort_order", {
    ascending: true
  }).order("created_at", {
    ascending: false
  })]);
  if (storeRes.error) throw new Error(storeRes.error.message);
  if (!storeRes.data) throw new Error("Store not found");
  if (sectionsRes.error) throw new Error(sectionsRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);
  const productIds = (productsRes.data ?? []).map((p) => p.id);
  const [variantsRes, extrasRes] = productIds.length ? await Promise.all([sb.from("product_variants").select("*").in("product_id", productIds).order("sort_order", {
    ascending: true
  }), sb.from("product_extras").select("*").in("product_id", productIds).order("sort_order", {
    ascending: true
  })]) : [{
    data: []
  }, {
    data: []
  }];
  return {
    store: storeRes.data,
    sections: sectionsRes.data ?? [],
    products: productsRes.data ?? [],
    variants: variantsRes.data ?? [],
    extras: extrasRes.data ?? []
  };
});
const adminUpsertSection_createServerFn_handler = createServerRpc({
  id: "c6fd167a4f1f166f4c5cd59a144bcd8b37f1b24147a3dd0a03efdf9df7f7fe0b",
  name: "adminUpsertSection",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminUpsertSection.__executeServer(opts));
const adminUpsertSection = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid().optional(),
  store_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(80),
  name_en: z.string().trim().max(80).optional().nullable(),
  icon: z.string().trim().max(40).optional().nullable(),
  sort_order: z.number().int().min(0).max(9999).default(0)
}).parse(i)).handler(adminUpsertSection_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const row = {
    store_id: data.store_id,
    name_ar: data.name_ar,
    name_en: data.name_en ?? null,
    icon: data.icon ?? null,
    sort_order: data.sort_order
  };
  if (data.id) {
    const {
      error
    } = await context.supabase.from("product_sections").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: data.id
    };
  } else {
    const {
      data: created,
      error
    } = await context.supabase.from("product_sections").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: created.id
    };
  }
});
const adminDeleteSection_createServerFn_handler = createServerRpc({
  id: "0c12dbcfc68bb0ba76488ec4eea1f9a9460356fa48c8599715398da27a322a44",
  name: "adminDeleteSection",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminDeleteSection.__executeServer(opts));
const adminDeleteSection = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteSection_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("product_sections").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const ProductInput = z.object({
  id: z.string().uuid().optional(),
  store_id: z.string().uuid(),
  section_id: z.string().uuid().nullable().optional(),
  product_type: z.enum(["general", "clothing", "food"]).default("general"),
  name_ar: z.string().trim().min(1).max(200),
  description_ar: z.string().trim().max(1500).optional().nullable(),
  price: z.number().min(0).max(9999999).nullable().optional(),
  compare_at_price: z.number().min(0).max(9999999).nullable().optional(),
  image_url: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  image_url_extra: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  stock: z.number().int().min(0).max(9999999).nullable().optional(),
  sku: z.string().trim().max(80).nullable().optional(),
  is_available: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0)
});
const adminUpsertProduct_createServerFn_handler = createServerRpc({
  id: "605c0e783f06a410abf97ec27974b61fe90c878cfeb4f75058ef327e6ba5bace",
  name: "adminUpsertProduct",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminUpsertProduct.__executeServer(opts));
const adminUpsertProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ProductInput.parse(i)).handler(adminUpsertProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let sectionLabel = null;
  if (data.section_id) {
    const {
      data: sec
    } = await context.supabase.from("product_sections").select("name_ar").eq("id", data.section_id).maybeSingle();
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
    sort_order: data.sort_order
  };
  if (data.id) {
    const {
      error
    } = await context.supabase.from("products").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: data.id
    };
  } else {
    const {
      data: created,
      error
    } = await context.supabase.from("products").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: created.id
    };
  }
});
const adminDeleteProductFull_createServerFn_handler = createServerRpc({
  id: "a9ba30adf2430240c88c80b23fac1cbe86400cfa4a9385e5108548c5c5a17240",
  name: "adminDeleteProductFull",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminDeleteProductFull.__executeServer(opts));
const adminDeleteProductFull = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteProductFull_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("products").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const VariantInput = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  size: z.string().trim().max(40).nullable().optional(),
  color: z.string().trim().max(60).nullable().optional(),
  color_hex: z.string().trim().regex(/^#[0-9a-fA-F]{3,8}$/).nullable().optional().or(z.literal("")),
  sku: z.string().trim().max(80).nullable().optional(),
  price: z.number().min(0).max(9999999).nullable().optional(),
  stock: z.number().int().min(0).max(9999999).default(0),
  image_url: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999).default(0)
});
const adminUpsertVariant_createServerFn_handler = createServerRpc({
  id: "5a00ccb4e9933b86dd232a13a10cd00ece386fbea93819af04017667a80f6ef7",
  name: "adminUpsertVariant",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminUpsertVariant.__executeServer(opts));
const adminUpsertVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => VariantInput.parse(i)).handler(adminUpsertVariant_createServerFn_handler, async ({
  data,
  context
}) => {
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
    sort_order: data.sort_order
  };
  if (data.id) {
    const {
      error
    } = await context.supabase.from("product_variants").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: data.id
    };
  } else {
    const {
      data: created,
      error
    } = await context.supabase.from("product_variants").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: created.id
    };
  }
});
const adminDeleteVariant_createServerFn_handler = createServerRpc({
  id: "e5d25d4c9d932efe0e33a86085dce55667d33c751941822355ba609e2ca30ad2",
  name: "adminDeleteVariant",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminDeleteVariant.__executeServer(opts));
const adminDeleteVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteVariant_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("product_variants").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const ExtraInput = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(80),
  price: z.number().min(0).max(9999999).default(0),
  is_required: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(9999).default(0)
});
const adminUpsertExtra_createServerFn_handler = createServerRpc({
  id: "22d81b800568f4d49051ac9242f417f88c7a9e5a16a9b92c2a35d355e9d48cf3",
  name: "adminUpsertExtra",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminUpsertExtra.__executeServer(opts));
const adminUpsertExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ExtraInput.parse(i)).handler(adminUpsertExtra_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const row = {
    product_id: data.product_id,
    name_ar: data.name_ar,
    price: data.price,
    is_required: data.is_required,
    sort_order: data.sort_order
  };
  if (data.id) {
    const {
      error
    } = await context.supabase.from("product_extras").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: data.id
    };
  } else {
    const {
      data: created,
      error
    } = await context.supabase.from("product_extras").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return {
      ok: true,
      id: created.id
    };
  }
});
const adminDeleteExtra_createServerFn_handler = createServerRpc({
  id: "c296ad3bf21b1f415596378993f7a6e9b14cc01e974e606213cfb1acac3bde67",
  name: "adminDeleteExtra",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => adminDeleteExtra.__executeServer(opts));
const adminDeleteExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteExtra_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("product_extras").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getStoreSmartCatalog_createServerFn_handler = createServerRpc({
  id: "ccbb718a7cd4d38f405c6e0242637bd4482ef78d17494679c238bdadfe809387",
  name: "getStoreSmartCatalog",
  filename: "src/lib/catalog.functions.ts"
}, (opts) => getStoreSmartCatalog.__executeServer(opts));
const getStoreSmartCatalog = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(getStoreSmartCatalog_createServerFn_handler, async ({
  data
}) => {
  const [sectionsRes, productsRes] = await Promise.all([supabaseAdmin.from("product_sections").select("id, name_ar, name_en, icon, sort_order").eq("store_id", data.storeId).order("sort_order", {
    ascending: true
  }), supabaseAdmin.from("products").select("id, section_id, product_type, name_ar, description_ar, price, compare_at_price, currency, image_url, stock, is_available, sort_order").eq("store_id", data.storeId).eq("is_available", true).order("sort_order", {
    ascending: true
  })]);
  if (sectionsRes.error) throw new Error(sectionsRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);
  const ids = (productsRes.data ?? []).map((p) => p.id);
  const [vRes, eRes] = ids.length ? await Promise.all([supabaseAdmin.from("product_variants").select("id, product_id, size, color, color_hex, price, stock, image_url").in("product_id", ids), supabaseAdmin.from("product_extras").select("id, product_id, name_ar, price, is_required").in("product_id", ids)]) : [{
    data: []
  }, {
    data: []
  }];
  return {
    sections: sectionsRes.data ?? [],
    products: productsRes.data ?? [],
    variants: vRes.data ?? [],
    extras: eRes.data ?? []
  };
});
export {
  adminDeleteExtra_createServerFn_handler,
  adminDeleteProductFull_createServerFn_handler,
  adminDeleteSection_createServerFn_handler,
  adminDeleteVariant_createServerFn_handler,
  adminGetStoreCatalog_createServerFn_handler,
  adminListStoresLite_createServerFn_handler,
  adminUpsertExtra_createServerFn_handler,
  adminUpsertProduct_createServerFn_handler,
  adminUpsertSection_createServerFn_handler,
  adminUpsertVariant_createServerFn_handler,
  getStoreSmartCatalog_createServerFn_handler
};
