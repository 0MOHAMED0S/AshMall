import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";


// All operations rely on the authenticated user's Supabase client.
// Admin RLS policies (`*_admin_all`) gate access at the DB level.

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

// ============ OVERVIEW ============
export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const [users, stores, pending, approved, suspended, orders, products, categories, ads, reviews] = await Promise.all([
      sb.from("profiles").select("*", { count: "exact", head: true }),
      sb.from("stores").select("*", { count: "exact", head: true }),
      sb.from("stores").select("*", { count: "exact", head: true }).eq("status", "pending"),
      sb.from("stores").select("*", { count: "exact", head: true }).eq("status", "approved"),
      sb.from("stores").select("*", { count: "exact", head: true }).eq("status", "suspended"),
      sb.from("orders").select("total", { count: "exact" }),
      sb.from("products").select("*", { count: "exact", head: true }),
      sb.from("categories").select("*", { count: "exact", head: true }),
      sb.from("ads").select("*", { count: "exact", head: true }),
      sb.from("reviews").select("*", { count: "exact", head: true }),
    ]);
    const revenue = (orders.data ?? []).reduce((s: number, r: any) => s + Number(r.total ?? 0), 0);

    const { data: recentOrders } = await sb
      .from("orders")
      .select("id, total, status, currency, created_at, stores(name_ar)")
      .order("created_at", { ascending: false })
      .limit(8);
    const { data: recentStores } = await sb
      .from("stores")
      .select("id, name_ar, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

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
        reviews: reviews.count ?? 0,
      },
      revenue,
      recentOrders: recentOrders ?? [],
      recentStores: recentStores ?? [],
    };
  });

// ============ STORES ============
export const adminListStores = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ status: z.string().optional(), q: z.string().optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("stores")
      .select("id, slug, name_ar, address, phone, status, is_featured, rating, rating_count, owner_id, created_at, categories(name_ar)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status && data.status !== "all") q = q.eq("status", data.status as any);
    if (data.q) q = q.ilike("name_ar", `%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { stores: rows ?? [] };
  });

export const adminUpdateStore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    id: z.string().uuid(),
    status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
    is_featured: z.boolean().optional(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const patch: { status?: any; is_featured?: boolean } = {};
    if (data.status) patch.status = data.status;
    if (typeof data.is_featured === "boolean") patch.is_featured = data.is_featured;
    const { error } = await context.supabase.from("stores").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };

  });

export const adminDeleteStore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("stores").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Admin: list stores in a specific category (any status)
export const adminListStoresByCategory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ category_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("stores")
      .select("id, slug, name_ar, address, phone, status, is_featured, rating, rating_count, cover_url, logo_url, created_at")
      .eq("category_id", data.category_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { stores: rows ?? [] };
  });

// Admin: create a store directly under a category (auto-approved)
const adminSlugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `store-${Date.now()}`;

export const adminCreateStore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    category_id: z.string().uuid(),
    name_ar: z.string().trim().min(2).max(100),
    name_en: z.string().trim().max(100).optional(),
    description_ar: z.string().trim().max(1000).optional(),
    address: z.string().trim().min(2).max(300),
    legal_name: z.string().trim().max(150).optional(),
    delivery_fee: z.number().min(0).max(100000).optional(),
    prep_time_minutes: z.number().int().min(0).max(600).optional(),
    opening_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
    closing_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
    logo_url: z.string().url().max(2048).optional().or(z.literal("")),
    cover_url: z.string().url().max(2048).optional().or(z.literal("")),
    is_featured: z.boolean().optional().default(false),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const baseSlug = adminSlugify(data.name_en || data.name_ar);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    const { data: row, error } = await context.supabase
      .from("stores")
      .insert({
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
        status: "approved",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { store: row };
  });

// ============ USERS ============
export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ q: z.string().optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.q) q = q.ilike("full_name", `%${data.q}%`);
    const { data: profiles, error } = await q;
    if (error) throw new Error(error.message);

    const ids = (profiles ?? []).map((p: any) => p.id);
    const { data: roles } = ids.length
      ? await context.supabase.from("user_roles").select("user_id, role").in("user_id", ids)
      : { data: [] as any[] };
    const rolesByUser: Record<string, string[]> = {};
    (roles ?? []).forEach((r: any) => {
      rolesByUser[r.user_id] = [...(rolesByUser[r.user_id] ?? []), r.role];
    });
    return {
      users: (profiles ?? []).map((p: any) => ({ ...p, roles: rolesByUser[p.id] ?? [] })),
    };
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    user_id: z.string().uuid(),
    role: z.enum(["admin", "store_owner", "customer"]),
    grant: z.boolean(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.grant) {
      const { error } = await context.supabase
        .from("user_roles")
        .upsert({ user_id: data.user_id, role: data.role as any }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role as any);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ============ ORDERS ============
export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ status: z.string().optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("orders")
      .select("id, total, currency, status, phone, address, created_at, user_id, store_id, stores(name_ar)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status && data.status !== "all") q = q.eq("status", data.status as any);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { orders: rows ?? [] };
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    id: z.string().uuid(),
    status: z.enum(["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"]),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("orders").update({ status: data.status as any }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ CATEGORIES ============
export const adminListCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("categories")
      .select("id, name_ar, name_en, slug, icon, sort_order, created_at")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { categories: data ?? [] };
  });

export const adminUpsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    id: z.string().uuid().optional(),
    name_ar: z.string().min(1).max(80),
    name_en: z.string().min(1).max(80),
    slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
    icon: z.string().max(80).nullable().optional(),
    sort_order: z.number().int().min(0).max(9999).default(0),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = { name_ar: data.name_ar, name_en: data.name_en, slug: data.slug, icon: data.icon ?? null, sort_order: data.sort_order };
    if (data.id) {
      const { error } = await context.supabase.from("categories").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("categories").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ADS ============
export const adminListAds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("ads")
      .select("id, title, subtitle, image_url, link, store_id, active, starts_at, ends_at, sort_order, created_at")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { ads: data ?? [] };
  });

export const adminUpsertAd = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1).max(120),
    subtitle: z.string().max(240).nullable().optional(),
    image_url: z.string().url().max(2048).nullable().optional(),
    link: z.string().max(2048).nullable().optional(),
    sort_order: z.number().int().min(0).max(9999).default(0),
    active: z.boolean().default(true),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = {
      title: data.title,
      subtitle: data.subtitle ?? null,
      image_url: data.image_url ?? null,
      link: data.link ?? null,
      sort_order: data.sort_order,
      active: data.active,
    };
    if (data.id) {
      const { error } = await context.supabase.from("ads").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("ads").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteAd = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("ads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ BROADCAST NOTIFICATIONS ============
export const adminBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    title: z.string().min(1).max(120),
    body: z.string().max(500).optional(),
    type: z.enum(["info", "success", "warning", "error"]).default("info"),
    link: z.string().max(500).optional(),
    audience: z.enum(["all", "store_owners", "customers"]).default("all"),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let userIds: string[] = [];
    if (data.audience === "all") {
      const { data: rows, error } = await context.supabase.from("profiles").select("id");
      if (error) throw new Error(error.message);
      userIds = (rows ?? []).map((r: any) => r.id);
    } else {
      const role = data.audience === "store_owners" ? "store_owner" : "customer";
      const { data: rows, error } = await context.supabase.from("user_roles").select("user_id").eq("role", role as any);
      if (error) throw new Error(error.message);
      userIds = (rows ?? []).map((r: any) => r.user_id);
    }
    if (userIds.length === 0) return { ok: true, sent: 0 };
    const payload = userIds.map((uid) => ({
      user_id: uid,
      title: data.title,
      body: data.body ?? null,
      type: data.type,
      link: data.link ?? null,
    }));
    // Chunk inserts to avoid payload limits
    const chunkSize = 500;
    for (let i = 0; i < payload.length; i += chunkSize) {
      const slice = payload.slice(i, i + chunkSize);
      const { error } = await context.supabase.from("notifications").insert(slice);
      if (error) throw new Error(error.message);
    }
    return { ok: true, sent: userIds.length };
  });

// ============ REVIEWS ============
export const adminListReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("reviews")
      .select("id, rating, comment, created_at, stores(name_ar)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { reviews: data ?? [] };
  });

export const adminDeleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ANALYTICS ============
export const adminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ days: z.number().int().min(7).max(90).default(14) }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000);
    const sinceIso = since.toISOString();

    const [ordersRes, usersRes, statusRes, topStoresRes] = await Promise.all([
      sb.from("orders").select("total, currency, status, created_at, store_id, stores(name_ar)").gte("created_at", sinceIso).order("created_at", { ascending: true }),
      sb.from("profiles").select("created_at").gte("created_at", sinceIso),
      sb.from("orders").select("status"),
      sb.from("orders").select("total, store_id, stores(name_ar)").neq("status", "cancelled"),
    ]);

    if (ordersRes.error) throw new Error(ordersRes.error.message);

    // Series per day
    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const series: Record<string, { date: string; revenue: number; orders: number; users: number }> = {};
    for (let i = 0; i < data.days; i++) {
      const d = new Date(since.getTime() + i * 86400000);
      const k = dayKey(d);
      series[k] = { date: k, revenue: 0, orders: 0, users: 0 };
    }
    (ordersRes.data ?? []).forEach((o: any) => {
      const k = dayKey(new Date(o.created_at));
      if (series[k]) { series[k].orders += 1; if (o.status !== "cancelled") series[k].revenue += Number(o.total ?? 0); }
    });
    (usersRes.data ?? []).forEach((u: any) => {
      const k = dayKey(new Date(u.created_at));
      if (series[k]) series[k].users += 1;
    });

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    (statusRes.data ?? []).forEach((r: any) => { statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1; });

    // Top stores by revenue
    const byStore: Record<string, { name: string; revenue: number; orders: number }> = {};
    (topStoresRes.data ?? []).forEach((o: any) => {
      const id = o.store_id ?? "—";
      const name = o.stores?.name_ar ?? "—";
      if (!byStore[id]) byStore[id] = { name, revenue: 0, orders: 0 };
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
        newUsers: Object.values(series).reduce((s, r) => s + r.users, 0),
      },
    };
  });

// ============ MERCHANTS (auth account management) ============
export const adminListMerchants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ q: z.string().optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    // Get all users with store_owner role
    const { data: roleRows, error: rErr } = await context.supabase
      .from("user_roles").select("user_id").eq("role", "store_owner" as any);
    if (rErr) throw new Error(rErr.message);
    const ids = (roleRows ?? []).map((r: any) => r.user_id);
    if (ids.length === 0) return { merchants: [] };

    const { data: profiles, error: pErr } = await context.supabase
      .from("profiles").select("id, full_name, phone, created_at").in("id", ids);
    if (pErr) throw new Error(pErr.message);

    const { data: stores } = await context.supabase
      .from("stores").select("id, name_ar, slug, status, owner_id").in("owner_id", ids);

    // Fetch emails via admin
    const emails: Record<string, string> = {};
    for (const id of ids) {
      try {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(id);
        if (u?.user?.email) emails[id] = u.user.email;
      } catch { /* ignore */ }
    }

    const merchants = (profiles ?? []).map((p: any) => ({
      id: p.id,
      full_name: p.full_name,
      phone: p.phone,
      email: emails[p.id] ?? null,
      created_at: p.created_at,
      stores: (stores ?? []).filter((s: any) => s.owner_id === p.id),
    }));

    const filtered = data.q
      ? merchants.filter((m) =>
          (m.full_name ?? "").toLowerCase().includes(data.q!.toLowerCase()) ||
          (m.email ?? "").toLowerCase().includes(data.q!.toLowerCase()))
      : merchants;

    return { merchants: filtered };
  });

export const adminCreateMerchant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    email: z.string().email().max(255),
    password: z.string().min(8).max(72),
    full_name: z.string().min(1).max(120),
    phone: z.string().max(30).optional(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name, intended_role: "owner" },
    });
    if (error) throw new Error(error.message);
    const uid = created.user!.id;

    // Profile auto-created via trigger; update phone if provided
    if (data.phone) {
      await supabaseAdmin.from("profiles").update({ phone: data.phone, full_name: data.full_name }).eq("id", uid);
    } else {
      await supabaseAdmin.from("profiles").update({ full_name: data.full_name }).eq("id", uid);
    }

    // Ensure store_owner role (handle_new_user adds customer by default)
    await supabaseAdmin.from("user_roles").upsert(
      { user_id: uid, role: "store_owner" as any },
      { onConflict: "user_id,role" },
    );

    return { ok: true, user_id: uid };
  });

export const adminResetMerchantPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    user_id: z.string().uuid(),
    password: z.string().min(8).max(72),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, { password: data.password });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteMerchant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ user_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


// ============ PRODUCTS (cross-store) ============
export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ q: z.string().optional(), store_id: z.string().uuid().optional() }).parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("products")
      .select("id, name_ar, price, currency, image_url, is_available, order_count, sort_order, store_id, created_at, stores(name_ar, slug)")
      .order("created_at", { ascending: false })
      .limit(300);
    if (data.q) q = q.ilike("name_ar", `%${data.q}%`);
    if (data.store_id) q = q.eq("store_id", data.store_id);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { products: rows ?? [] };
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({
    id: z.string().uuid(),
    name_ar: z.string().min(1).max(200).optional(),
    price: z.number().min(0).max(9999999).nullable().optional(),
    is_available: z.boolean().optional(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const patch: { name_ar?: string; price?: number | null; is_available?: boolean } = {};
    if (data.name_ar !== undefined) patch.name_ar = data.name_ar;
    if (data.price !== undefined) patch.price = data.price;
    if (typeof data.is_available === "boolean") patch.is_available = data.is_available;
    const { error } = await context.supabase.from("products").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ SITE SETTINGS ============
const SiteSettingsSchema = z.object({
  site_name: z.string().min(1).max(80),
  tagline: z.string().max(200).nullable().optional(),
  logo_url: z.string().max(2048).nullable().optional(),
  primary_color: z.string().max(80).nullable().optional(),
  contact_phone: z.string().max(40).nullable().optional(),
  contact_whatsapp: z.string().max(40).nullable().optional(),
  contact_email: z.string().max(120).nullable().optional(),
});

export const adminUpsertSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => SiteSettingsSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("site_settings")
      .upsert({ id: true, ...data }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
