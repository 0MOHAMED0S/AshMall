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
const adminOverview_createServerFn_handler = createServerRpc({
  id: "65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95",
  name: "adminOverview",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminOverview.__executeServer(opts));
const adminOverview = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminOverview_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const sb = context.supabase;
  const [users, stores, pending, approved, suspended, orders, products, categories, ads, reviews] = await Promise.all([sb.from("profiles").select("*", {
    count: "exact",
    head: true
  }), sb.from("stores").select("*", {
    count: "exact",
    head: true
  }), sb.from("stores").select("*", {
    count: "exact",
    head: true
  }).eq("status", "pending"), sb.from("stores").select("*", {
    count: "exact",
    head: true
  }).eq("status", "approved"), sb.from("stores").select("*", {
    count: "exact",
    head: true
  }).eq("status", "suspended"), sb.from("orders").select("total", {
    count: "exact"
  }), sb.from("products").select("*", {
    count: "exact",
    head: true
  }), sb.from("categories").select("*", {
    count: "exact",
    head: true
  }), sb.from("ads").select("*", {
    count: "exact",
    head: true
  }), sb.from("reviews").select("*", {
    count: "exact",
    head: true
  })]);
  const revenue = (orders.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0);
  const {
    data: recentOrders
  } = await sb.from("orders").select("id, total, status, currency, created_at, stores(name_ar)").order("created_at", {
    ascending: false
  }).limit(8);
  const {
    data: recentStores
  } = await sb.from("stores").select("id, name_ar, status, created_at").order("created_at", {
    ascending: false
  }).limit(6);
  return {
    counts: {
      users: users.count ?? 0,
      stores: stores.count ?? 0,
      pending: pending.count ?? 0,
      approved: approved.count ?? 0,
      suspended: suspended.count ?? 0,
      orders: orders.count ?? 0,
      products: products.count ?? 0,
      categories: categories.count ?? 0,
      ads: ads.count ?? 0,
      reviews: reviews.count ?? 0
    },
    revenue,
    recentOrders: recentOrders ?? [],
    recentStores: recentStores ?? []
  };
});
const adminListStores_createServerFn_handler = createServerRpc({
  id: "adf61c7212b1948e5c9e6ed11636e3e5882e1956e31fa4c98543fa951ead7c93",
  name: "adminListStores",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListStores.__executeServer(opts));
const adminListStores = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  status: z.string().optional(),
  q: z.string().optional()
}).parse(i ?? {})).handler(adminListStores_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let q = context.supabase.from("stores").select("id, slug, name_ar, address, phone, status, is_featured, rating, rating_count, owner_id, created_at, categories(name_ar)").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.status && data.status !== "all") q = q.eq("status", data.status);
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
const adminUpdateStore_createServerFn_handler = createServerRpc({
  id: "5a04121677d3e65ffa270b8996711c244063b84471f0f9b4ab84f840ae1fb9f9",
  name: "adminUpdateStore",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateStore.__executeServer(opts));
const adminUpdateStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
  is_featured: z.boolean().optional()
}).parse(i)).handler(adminUpdateStore_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const patch = {};
  if (data.status) patch.status = data.status;
  if (typeof data.is_featured === "boolean") patch.is_featured = data.is_featured;
  const {
    error
  } = await context.supabase.from("stores").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteStore_createServerFn_handler = createServerRpc({
  id: "cba90266c9a7758c97eb8361bbee0e080b445247010a30e61a622d12457b64f7",
  name: "adminDeleteStore",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteStore.__executeServer(opts));
const adminDeleteStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteStore_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("stores").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListStoresByCategory_createServerFn_handler = createServerRpc({
  id: "8571920cee1e1bd25ce5aba7013a1ef30afbdac6d033bf073ec0bcdb5605f50b",
  name: "adminListStoresByCategory",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListStoresByCategory.__executeServer(opts));
const adminListStoresByCategory = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  category_id: z.string().uuid()
}).parse(i)).handler(adminListStoresByCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data: rows,
    error
  } = await context.supabase.from("stores").select("id, slug, name_ar, address, phone, status, is_featured, rating, rating_count, cover_url, logo_url, created_at").eq("category_id", data.category_id).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    stores: rows ?? []
  };
});
const adminSlugify = (s) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80) || `store-${Date.now()}`;
const adminCreateStore_createServerFn_handler = createServerRpc({
  id: "69329ca9e2ea9d8fedfa436e83190e53f00dd8a9ad23912e6fa18af9afd9441f",
  name: "adminCreateStore",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminCreateStore.__executeServer(opts));
const adminCreateStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  category_id: z.string().uuid(),
  name_ar: z.string().trim().min(2).max(100),
  name_en: z.string().trim().max(100).optional(),
  description_ar: z.string().trim().max(1e3).optional(),
  address: z.string().trim().min(2).max(300),
  legal_name: z.string().trim().max(150).optional(),
  delivery_fee: z.number().min(0).max(1e5).optional(),
  prep_time_minutes: z.number().int().min(0).max(600).optional(),
  opening_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  closing_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  logo_url: z.string().url().max(2048).optional().or(z.literal("")),
  cover_url: z.string().url().max(2048).optional().or(z.literal("")),
  is_featured: z.boolean().optional().default(false)
}).parse(i)).handler(adminCreateStore_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const baseSlug = adminSlugify(data.name_en || data.name_ar);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  const {
    data: row,
    error
  } = await context.supabase.from("stores").insert({
    owner_id: context.userId,
    slug,
    name_ar: data.name_ar,
    name_en: data.name_en || null,
    description_ar: data.description_ar || null,
    category_id: data.category_id,
    address: data.address,
    legal_name: data.legal_name || null,
    delivery_fee: data.delivery_fee ?? null,
    prep_time_minutes: data.prep_time_minutes ?? null,
    opening_time: data.opening_time || null,
    closing_time: data.closing_time || null,
    logo_url: data.logo_url || null,
    cover_url: data.cover_url || null,
    is_featured: data.is_featured ?? false,
    status: "approved"
  }).select().single();
  if (error) throw new Error(error.message);
  return {
    store: row
  };
});
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
  name: "adminListUsers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional()
}).parse(i ?? {})).handler(adminListUsers_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let q = context.supabase.from("profiles").select("id, full_name, phone, avatar_url, created_at").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.q) q = q.ilike("full_name", `%${data.q}%`);
  const {
    data: profiles,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const ids = (profiles ?? []).map((p) => p.id);
  const {
    data: roles
  } = ids.length ? await context.supabase.from("user_roles").select("user_id, role").in("user_id", ids) : {
    data: []
  };
  const rolesByUser = {};
  (roles ?? []).forEach((r) => {
    rolesByUser[r.user_id] = [...rolesByUser[r.user_id] ?? [], r.role];
  });
  return {
    users: (profiles ?? []).map((p) => ({
      ...p,
      roles: rolesByUser[p.id] ?? []
    }))
  };
});
const adminSetRole_createServerFn_handler = createServerRpc({
  id: "154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3",
  name: "adminSetRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetRole.__executeServer(opts));
const adminSetRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "store_owner", "customer"]),
  grant: z.boolean()
}).parse(i)).handler(adminSetRole_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  if (data.grant) {
    const {
      error
    } = await context.supabase.from("user_roles").upsert({
      user_id: data.user_id,
      role: data.role
    }, {
      onConflict: "user_id,role"
    });
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await context.supabase.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminListOrders_createServerFn_handler = createServerRpc({
  id: "573be2cdf3c95bfa88f6bb3d2080ff0b0c620db545ac53f2f5a039a50348d737",
  name: "adminListOrders",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListOrders.__executeServer(opts));
const adminListOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  status: z.string().optional()
}).parse(i ?? {})).handler(adminListOrders_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let q = context.supabase.from("orders").select("id, total, currency, status, phone, address, created_at, user_id, store_id, stores(name_ar)").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.status && data.status !== "all") q = q.eq("status", data.status);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    orders: rows ?? []
  };
});
const adminUpdateOrderStatus_createServerFn_handler = createServerRpc({
  id: "9505b54584006d8459dff4f0d9b2b1ccc184fc05200648ce850e9f9f7ee3f723",
  name: "adminUpdateOrderStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateOrderStatus.__executeServer(opts));
const adminUpdateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"])
}).parse(i)).handler(adminUpdateOrderStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("orders").update({
    status: data.status
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListCategories_createServerFn_handler = createServerRpc({
  id: "16adcae68f7f6ee62a1f2c605455af763ee11cf325960f90579e35d6bc275907",
  name: "adminListCategories",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListCategories.__executeServer(opts));
const adminListCategories = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListCategories_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("categories").select("id, name_ar, name_en, slug, icon, sort_order, created_at").order("sort_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    categories: data ?? []
  };
});
const adminUpsertCategory_createServerFn_handler = createServerRpc({
  id: "6bada778c941c28d8f4bb5693567682fcc0a8cc5f8e134db94c3d77ba2454fce",
  name: "adminUpsertCategory",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertCategory.__executeServer(opts));
const adminUpsertCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid().optional(),
  name_ar: z.string().min(1).max(80),
  name_en: z.string().min(1).max(80),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  icon: z.string().max(80).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0)
}).parse(i)).handler(adminUpsertCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const row = {
    name_ar: data.name_ar,
    name_en: data.name_en,
    slug: data.slug,
    icon: data.icon ?? null,
    sort_order: data.sort_order
  };
  if (data.id) {
    const {
      error
    } = await context.supabase.from("categories").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await context.supabase.from("categories").insert(row);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminDeleteCategory_createServerFn_handler = createServerRpc({
  id: "950328abc056627e7020b8ee4af15de2c8185c6b4f0fa341cec497db75a14951",
  name: "adminDeleteCategory",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteCategory.__executeServer(opts));
const adminDeleteCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListAds_createServerFn_handler = createServerRpc({
  id: "853897e326dd61bfc50a155e64353f1d22f1728ed7aa992d071369a5c124ca85",
  name: "adminListAds",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListAds.__executeServer(opts));
const adminListAds = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListAds_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("ads").select("id, title, subtitle, image_url, link, store_id, active, starts_at, ends_at, sort_order, created_at").order("sort_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    ads: data ?? []
  };
});
const adminUpsertAd_createServerFn_handler = createServerRpc({
  id: "d8084ea51bce5c31e5323fe1c90745c7c9143261d63f2d671209023a0d9ea1fc",
  name: "adminUpsertAd",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertAd.__executeServer(opts));
const adminUpsertAd = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(240).nullable().optional(),
  image_url: z.string().url().max(2048).nullable().optional(),
  link: z.string().max(2048).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(true)
}).parse(i)).handler(adminUpsertAd_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const row = {
    title: data.title,
    subtitle: data.subtitle ?? null,
    image_url: data.image_url ?? null,
    link: data.link ?? null,
    sort_order: data.sort_order,
    active: data.active
  };
  if (data.id) {
    const {
      error
    } = await context.supabase.from("ads").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await context.supabase.from("ads").insert(row);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminDeleteAd_createServerFn_handler = createServerRpc({
  id: "db83bc6b01fa8e833b8f7e0a912abd2b45f46a03a366e6951704b573371b9d7b",
  name: "adminDeleteAd",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteAd.__executeServer(opts));
const adminDeleteAd = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteAd_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("ads").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminBroadcast_createServerFn_handler = createServerRpc({
  id: "3337831eabcbeff783b9046181bf907f45a0e670191e3c1928ea84e3f9e97c0a",
  name: "adminBroadcast",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminBroadcast.__executeServer(opts));
const adminBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  title: z.string().min(1).max(120),
  body: z.string().max(500).optional(),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  link: z.string().max(500).optional(),
  audience: z.enum(["all", "store_owners", "customers"]).default("all")
}).parse(i)).handler(adminBroadcast_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let userIds = [];
  if (data.audience === "all") {
    const {
      data: rows,
      error
    } = await context.supabase.from("profiles").select("id");
    if (error) throw new Error(error.message);
    userIds = (rows ?? []).map((r) => r.id);
  } else {
    const role = data.audience === "store_owners" ? "store_owner" : "customer";
    const {
      data: rows,
      error
    } = await context.supabase.from("user_roles").select("user_id").eq("role", role);
    if (error) throw new Error(error.message);
    userIds = (rows ?? []).map((r) => r.user_id);
  }
  if (userIds.length === 0) return {
    ok: true,
    sent: 0
  };
  const payload = userIds.map((uid) => ({
    user_id: uid,
    title: data.title,
    body: data.body ?? null,
    type: data.type,
    link: data.link ?? null
  }));
  const chunkSize = 500;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const slice = payload.slice(i, i + chunkSize);
    const {
      error
    } = await context.supabase.from("notifications").insert(slice);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true,
    sent: userIds.length
  };
});
const adminListReviews_createServerFn_handler = createServerRpc({
  id: "15f2e75a66daeb3bb02995a6ec9720c2223d751ece39bd60c1b92546d4e5e485",
  name: "adminListReviews",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListReviews.__executeServer(opts));
const adminListReviews = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListReviews_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("reviews").select("id, rating, comment, created_at, stores(name_ar)").order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    reviews: data ?? []
  };
});
const adminDeleteReview_createServerFn_handler = createServerRpc({
  id: "a5e49249b72a1c4a65f74bebe4f19c3e7987e76bb8ff6b8d0c8f3dc6a74c7fcc",
  name: "adminDeleteReview",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteReview.__executeServer(opts));
const adminDeleteReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteReview_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("reviews").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminAnalytics_createServerFn_handler = createServerRpc({
  id: "ad0c092d9068302d584e4ee6c929270ef251348f837bd3ea129892db963c741d",
  name: "adminAnalytics",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminAnalytics.__executeServer(opts));
const adminAnalytics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  days: z.number().int().min(7).max(90).default(14)
}).parse(i ?? {})).handler(adminAnalytics_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const sb = context.supabase;
  const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1e3);
  const sinceIso = since.toISOString();
  const [ordersRes, usersRes, statusRes, topStoresRes] = await Promise.all([sb.from("orders").select("total, currency, status, created_at, store_id, stores(name_ar)").gte("created_at", sinceIso).order("created_at", {
    ascending: true
  }), sb.from("profiles").select("created_at").gte("created_at", sinceIso), sb.from("orders").select("status"), sb.from("orders").select("total, store_id, stores(name_ar)").neq("status", "cancelled")]);
  if (ordersRes.error) throw new Error(ordersRes.error.message);
  const dayKey = (d) => d.toISOString().slice(0, 10);
  const series = {};
  for (let i = 0; i < data.days; i++) {
    const d = new Date(since.getTime() + i * 864e5);
    const k = dayKey(d);
    series[k] = {
      date: k,
      revenue: 0,
      orders: 0,
      users: 0
    };
  }
  (ordersRes.data ?? []).forEach((o) => {
    const k = dayKey(new Date(o.created_at));
    if (series[k]) {
      series[k].orders += 1;
      if (o.status !== "cancelled") series[k].revenue += Number(o.total ?? 0);
    }
  });
  (usersRes.data ?? []).forEach((u) => {
    const k = dayKey(new Date(u.created_at));
    if (series[k]) series[k].users += 1;
  });
  const statusCounts = {};
  (statusRes.data ?? []).forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  });
  const byStore = {};
  (topStoresRes.data ?? []).forEach((o) => {
    const id = o.store_id ?? "—";
    const name = o.stores?.name_ar ?? "—";
    if (!byStore[id]) byStore[id] = {
      name,
      revenue: 0,
      orders: 0
    };
    byStore[id].revenue += Number(o.total ?? 0);
    byStore[id].orders += 1;
  });
  const topStores = Object.values(byStore).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  return {
    series: Object.values(series),
    statusCounts,
    topStores,
    totals: {
      revenue: Object.values(series).reduce((s, r) => s + r.revenue, 0),
      orders: Object.values(series).reduce((s, r) => s + r.orders, 0),
      newUsers: Object.values(series).reduce((s, r) => s + r.users, 0)
    }
  };
});
const adminListMerchants_createServerFn_handler = createServerRpc({
  id: "71193263ad6fe16869da2a6db5a7c64cc64998622ac4022c99bfe83df854ac31",
  name: "adminListMerchants",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListMerchants.__executeServer(opts));
const adminListMerchants = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional()
}).parse(i ?? {})).handler(adminListMerchants_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data: roleRows,
    error: rErr
  } = await context.supabase.from("user_roles").select("user_id").eq("role", "store_owner");
  if (rErr) throw new Error(rErr.message);
  const ids = (roleRows ?? []).map((r) => r.user_id);
  if (ids.length === 0) return {
    merchants: []
  };
  const {
    data: profiles,
    error: pErr
  } = await context.supabase.from("profiles").select("id, full_name, phone, created_at").in("id", ids);
  if (pErr) throw new Error(pErr.message);
  const {
    data: stores
  } = await context.supabase.from("stores").select("id, name_ar, slug, status, owner_id").in("owner_id", ids);
  const emails = {};
  for (const id of ids) {
    try {
      const {
        data: u
      } = await supabaseAdmin.auth.admin.getUserById(id);
      if (u?.user?.email) emails[id] = u.user.email;
    } catch {
    }
  }
  const merchants = (profiles ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    phone: p.phone,
    email: emails[p.id] ?? null,
    created_at: p.created_at,
    stores: (stores ?? []).filter((s) => s.owner_id === p.id)
  }));
  const filtered = data.q ? merchants.filter((m) => (m.full_name ?? "").toLowerCase().includes(data.q.toLowerCase()) || (m.email ?? "").toLowerCase().includes(data.q.toLowerCase())) : merchants;
  return {
    merchants: filtered
  };
});
const adminCreateMerchant_createServerFn_handler = createServerRpc({
  id: "ef77b1c0232c7304ff62bb9380a5ae2415adc96f0eb603b4ece40932b1a36cf5",
  name: "adminCreateMerchant",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminCreateMerchant.__executeServer(opts));
const adminCreateMerchant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  full_name: z.string().min(1).max(120),
  phone: z.string().max(30).optional()
}).parse(i)).handler(adminCreateMerchant_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name,
      intended_role: "owner"
    }
  });
  if (error) throw new Error(error.message);
  const uid = created.user.id;
  if (data.phone) {
    await supabaseAdmin.from("profiles").update({
      phone: data.phone,
      full_name: data.full_name
    }).eq("id", uid);
  } else {
    await supabaseAdmin.from("profiles").update({
      full_name: data.full_name
    }).eq("id", uid);
  }
  await supabaseAdmin.from("user_roles").upsert({
    user_id: uid,
    role: "store_owner"
  }, {
    onConflict: "user_id,role"
  });
  return {
    ok: true,
    user_id: uid
  };
});
const adminResetMerchantPassword_createServerFn_handler = createServerRpc({
  id: "42de0c8cb8ebcb7de3efb34f033c04a87a31e15f24797cb312b022900f84859d",
  name: "adminResetMerchantPassword",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminResetMerchantPassword.__executeServer(opts));
const adminResetMerchantPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  user_id: z.string().uuid(),
  password: z.string().min(8).max(72)
}).parse(i)).handler(adminResetMerchantPassword_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
    password: data.password
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteMerchant_createServerFn_handler = createServerRpc({
  id: "6098d7c545fd04a6b8c0631e0de77760fe299c6ba31834ee9696d393e18e17ee",
  name: "adminDeleteMerchant",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteMerchant.__executeServer(opts));
const adminDeleteMerchant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  user_id: z.string().uuid()
}).parse(i)).handler(adminDeleteMerchant_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListProducts_createServerFn_handler = createServerRpc({
  id: "9932f7d91182148199cbc8b49e99aa83ab2855e0f2166e0d0e38e6c091b587df",
  name: "adminListProducts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListProducts.__executeServer(opts));
const adminListProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional(),
  store_id: z.string().uuid().optional()
}).parse(i ?? {})).handler(adminListProducts_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  let q = context.supabase.from("products").select("id, name_ar, price, currency, image_url, is_available, order_count, sort_order, store_id, created_at, stores(name_ar, slug)").order("created_at", {
    ascending: false
  }).limit(300);
  if (data.q) q = q.ilike("name_ar", `%${data.q}%`);
  if (data.store_id) q = q.eq("store_id", data.store_id);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    products: rows ?? []
  };
});
const adminUpdateProduct_createServerFn_handler = createServerRpc({
  id: "70be012ea44ce688beab96ae8c1cf36c639ba53bf34207e89caac6ed540441f5",
  name: "adminUpdateProduct",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateProduct.__executeServer(opts));
const adminUpdateProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  name_ar: z.string().min(1).max(200).optional(),
  price: z.number().min(0).max(9999999).nullable().optional(),
  is_available: z.boolean().optional()
}).parse(i)).handler(adminUpdateProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const patch = {};
  if (data.name_ar !== void 0) patch.name_ar = data.name_ar;
  if (data.price !== void 0) patch.price = data.price;
  if (typeof data.is_available === "boolean") patch.is_available = data.is_available;
  const {
    error
  } = await context.supabase.from("products").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteProduct_createServerFn_handler = createServerRpc({
  id: "0ddf57ac23192120a1e98e48f57343c6fe83e8a1ddcf5df54be83354a1f768ad",
  name: "adminDeleteProduct",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteProduct.__executeServer(opts));
const adminDeleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteProduct_createServerFn_handler, async ({
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
const SiteSettingsSchema = z.object({
  site_name: z.string().min(1).max(80),
  tagline: z.string().max(200).nullable().optional(),
  logo_url: z.string().max(2048).nullable().optional(),
  primary_color: z.string().max(80).nullable().optional(),
  contact_phone: z.string().max(40).nullable().optional(),
  contact_whatsapp: z.string().max(40).nullable().optional(),
  contact_email: z.string().max(120).nullable().optional()
});
const adminUpsertSiteSettings_createServerFn_handler = createServerRpc({
  id: "1cd54dfd63c87639b15ad0645f45822214af342b65becc8c492194ae8dc7a3db",
  name: "adminUpsertSiteSettings",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertSiteSettings.__executeServer(opts));
const adminUpsertSiteSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SiteSettingsSchema.parse(i)).handler(adminUpsertSiteSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("site_settings").upsert({
    id: true,
    ...data
  }, {
    onConflict: "id"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminAnalytics_createServerFn_handler,
  adminBroadcast_createServerFn_handler,
  adminCreateMerchant_createServerFn_handler,
  adminCreateStore_createServerFn_handler,
  adminDeleteAd_createServerFn_handler,
  adminDeleteCategory_createServerFn_handler,
  adminDeleteMerchant_createServerFn_handler,
  adminDeleteProduct_createServerFn_handler,
  adminDeleteReview_createServerFn_handler,
  adminDeleteStore_createServerFn_handler,
  adminListAds_createServerFn_handler,
  adminListCategories_createServerFn_handler,
  adminListMerchants_createServerFn_handler,
  adminListOrders_createServerFn_handler,
  adminListProducts_createServerFn_handler,
  adminListReviews_createServerFn_handler,
  adminListStoresByCategory_createServerFn_handler,
  adminListStores_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminOverview_createServerFn_handler,
  adminResetMerchantPassword_createServerFn_handler,
  adminSetRole_createServerFn_handler,
  adminUpdateOrderStatus_createServerFn_handler,
  adminUpdateProduct_createServerFn_handler,
  adminUpdateStore_createServerFn_handler,
  adminUpsertAd_createServerFn_handler,
  adminUpsertCategory_createServerFn_handler,
  adminUpsertSiteSettings_createServerFn_handler
};
