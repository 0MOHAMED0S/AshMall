import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

function genPassword(len = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// ============ ADMIN: create/reset merchant account for a store ============
export const adminCreateMerchantForStore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      store_id: z.string().uuid(),
      email: z.string().email().optional(),
      password: z.string().min(6).max(64).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: store, error: serr } = await supabaseAdmin
      .from("stores")
      .select("id, slug, name_ar")
      .eq("id", data.store_id)
      .maybeSingle();
    if (serr || !store) throw new Error("المتجر غير موجود");

    const email = data.email?.trim() || `merchant-${store.slug}@ashmoun.local`;
    const password = data.password || genPassword(10);

    // Check if user exists
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let user = list?.users.find((u) => u.email === email);

    if (!user) {
      const { data: created, error: cerr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: store.name_ar, intended_role: "merchant", store_id: store.id },
      });
      if (cerr) throw new Error(cerr.message);
      user = created.user!;
    } else {
      const { error: uerr } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
      if (uerr) throw new Error(uerr.message);
    }

    // Link store ownership
    await supabaseAdmin.from("stores").update({ owner_id: user.id }).eq("id", store.id);

    // Save credentials for admin reference
    await supabaseAdmin
      .from("store_credentials")
      .upsert({ store_id: store.id, email, password }, { onConflict: "store_id" });

    return { ok: true, email, password };
  });

export const adminGetStoreCredentials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ store_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row } = await supabaseAdmin
      .from("store_credentials")
      .select("email, password, updated_at")
      .eq("store_id", data.store_id)
      .maybeSingle();
    return { credentials: row };
  });

// ============ MERCHANT: dashboard data ============
export const getMerchantDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const { data: stores, error } = await sb
      .from("stores")
      .select("id, slug, name_ar, logo_url, cover_url, status, rating, rating_count, address, phone, whatsapp, opening_time, closing_time")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error(error.message);
    const store = stores?.[0] ?? null;
    if (!store) return { store: null, orders: [], stats: null, deliveryRequests: [] };

    const [{ data: orders }, { data: products }, { data: deliveryRequests }] = await Promise.all([
      sb.from("orders")
        .select("id, status, total, currency, created_at, phone, address, notes, user_id, order_items(id, name, quantity, price, notes)")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .limit(50),
      sb.from("products").select("id", { count: "exact", head: true }).eq("store_id", store.id),
      sb.from("delivery_requests")
        .select("id, order_id, status, assigned_to, created_at")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const all = orders ?? [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = all.filter((o) => new Date(o.created_at) >= today);
    const revenue = all
      .filter((o) => o.status === "completed" || o.status === "delivering" || o.status === "confirmed" || o.status === "preparing")
      .reduce((s, o) => s + Number(o.total ?? 0), 0);

    return {
      store,
      orders: all,
      stats: {
        totalOrders: all.length,
        pendingOrders: all.filter((o) => o.status === "pending").length,
        todayOrders: todayOrders.length,
        revenue,
        products: 0,
      },
      deliveryRequests: deliveryRequests ?? [],
    };
  });

// Merchant: accept (confirm) an order
export const merchantUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      order_id: z.string().uuid(),
      status: z.enum(["confirmed", "preparing", "delivering", "completed", "cancelled"]),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    // RLS policy orders_store_owner_update permits this
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.order_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Merchant: request delivery for a confirmed order
export const merchantRequestDelivery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ order_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    // Find the order + store
    const { data: order, error: oerr } = await sb
      .from("orders")
      .select("id, store_id, total, address, phone, notes")
      .eq("id", data.order_id)
      .maybeSingle();
    if (oerr || !order) throw new Error("الطلب غير موجود");

    // Verify store ownership
    const { data: store } = await sb
      .from("stores")
      .select("id, name_ar, address, phone")
      .eq("id", order.store_id)
      .eq("owner_id", context.userId)
      .maybeSingle();
    if (!store) throw new Error("غير مصرّح");

    // Prevent duplicate active request
    const { data: existing } = await sb
      .from("delivery_requests")
      .select("id, status")
      .eq("order_id", data.order_id)
      .not("status", "in", "(cancelled,delivered)")
      .maybeSingle();

    let requestId = existing?.id;
    if (!requestId) {
      const { data: ins, error } = await sb
        .from("delivery_requests")
        .insert({
          order_id: data.order_id,
          store_id: order.store_id,
          requested_by: context.userId,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      requestId = ins.id;
    }

    // Get first active delivery courier (for wa.me prefill on merchant side).
    // Use admin client so RLS on delivery_personnel can stay tight (no broad owner read).
    const { data: courier } = await supabaseAdmin
      .from("delivery_personnel")
      .select("name, whatsapp")
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    return {
      ok: true,
      request_id: requestId,
      courier,
      order: {
        id: order.id,
        total: order.total,
        address: order.address,
        phone: order.phone,
      },
      store: { name_ar: store.name_ar, address: store.address, phone: store.phone },
    };
  });
