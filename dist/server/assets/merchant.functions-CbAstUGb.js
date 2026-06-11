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
function genPassword(len = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
const adminCreateMerchantForStore_createServerFn_handler = createServerRpc({
  id: "aa03a3e53a6ea777f9a1686c4b129ba736a41df27c24c4d984b8242d993121c0",
  name: "adminCreateMerchantForStore",
  filename: "src/lib/merchant.functions.ts"
}, (opts) => adminCreateMerchantForStore.__executeServer(opts));
const adminCreateMerchantForStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(64).optional()
}).parse(i)).handler(adminCreateMerchantForStore_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data: store,
    error: serr
  } = await supabaseAdmin.from("stores").select("id, slug, name_ar").eq("id", data.store_id).maybeSingle();
  if (serr || !store) throw new Error("المتجر غير موجود");
  const email = data.email?.trim() || `merchant-${store.slug}@ashmoun.local`;
  const password = data.password || genPassword(10);
  const {
    data: list
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1e3
  });
  let user = list?.users.find((u) => u.email === email);
  if (!user) {
    const {
      data: created,
      error: cerr
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: store.name_ar,
        intended_role: "merchant",
        store_id: store.id
      }
    });
    if (cerr) throw new Error(cerr.message);
    user = created.user;
  } else {
    const {
      error: uerr
    } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true
    });
    if (uerr) throw new Error(uerr.message);
  }
  await supabaseAdmin.from("stores").update({
    owner_id: user.id
  }).eq("id", store.id);
  await supabaseAdmin.from("store_credentials").upsert({
    store_id: store.id,
    email,
    password
  }, {
    onConflict: "store_id"
  });
  return {
    ok: true,
    email,
    password
  };
});
const adminGetStoreCredentials_createServerFn_handler = createServerRpc({
  id: "0799ae0b339a07511586b97a94728db79923f64d35ad0560d242b6300d15a313",
  name: "adminGetStoreCredentials",
  filename: "src/lib/merchant.functions.ts"
}, (opts) => adminGetStoreCredentials.__executeServer(opts));
const adminGetStoreCredentials = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(adminGetStoreCredentials_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data: row
  } = await supabaseAdmin.from("store_credentials").select("email, password, updated_at").eq("store_id", data.store_id).maybeSingle();
  return {
    credentials: row
  };
});
const getMerchantDashboard_createServerFn_handler = createServerRpc({
  id: "19e69e5bce95f87fda3cd79d3cde7fd938ff089c492831ab05f10fa3c8e23bb8",
  name: "getMerchantDashboard",
  filename: "src/lib/merchant.functions.ts"
}, (opts) => getMerchantDashboard.__executeServer(opts));
const getMerchantDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMerchantDashboard_createServerFn_handler, async ({
  context
}) => {
  const sb = context.supabase;
  const {
    data: stores,
    error
  } = await sb.from("stores").select("id, slug, name_ar, logo_url, cover_url, status, rating, rating_count, address, phone, whatsapp, opening_time, closing_time").eq("owner_id", context.userId).order("created_at", {
    ascending: false
  }).limit(1);
  if (error) throw new Error(error.message);
  const store = stores?.[0] ?? null;
  if (!store) return {
    store: null,
    orders: [],
    stats: null,
    deliveryRequests: []
  };
  const [{
    data: orders
  }, {
    data: products
  }, {
    data: deliveryRequests
  }] = await Promise.all([sb.from("orders").select("id, status, total, currency, created_at, phone, address, notes, user_id, order_items(id, name, quantity, price, notes)").eq("store_id", store.id).order("created_at", {
    ascending: false
  }).limit(50), sb.from("products").select("id", {
    count: "exact",
    head: true
  }).eq("store_id", store.id), sb.from("delivery_requests").select("id, order_id, status, assigned_to, created_at").eq("store_id", store.id).order("created_at", {
    ascending: false
  }).limit(50)]);
  const all = orders ?? [];
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = all.filter((o) => new Date(o.created_at) >= today);
  const revenue = all.filter((o) => o.status === "completed" || o.status === "delivering" || o.status === "confirmed" || o.status === "preparing").reduce((s, o) => s + Number(o.total ?? 0), 0);
  return {
    store,
    orders: all,
    stats: {
      totalOrders: all.length,
      pendingOrders: all.filter((o) => o.status === "pending").length,
      todayOrders: todayOrders.length,
      revenue,
      products: 0
    },
    deliveryRequests: deliveryRequests ?? []
  };
});
const merchantUpdateOrderStatus_createServerFn_handler = createServerRpc({
  id: "3b590ebaf77d258dc6bb4087c32f0c07113405d98fff037d23dcaeefe3b49c7a",
  name: "merchantUpdateOrderStatus",
  filename: "src/lib/merchant.functions.ts"
}, (opts) => merchantUpdateOrderStatus.__executeServer(opts));
const merchantUpdateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  order_id: z.string().uuid(),
  status: z.enum(["confirmed", "preparing", "delivering", "completed", "cancelled"])
}).parse(i)).handler(merchantUpdateOrderStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("orders").update({
    status: data.status
  }).eq("id", data.order_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const merchantRequestDelivery_createServerFn_handler = createServerRpc({
  id: "ad9dc4c36d8499f8073c2f99556002920c797a2385e55133782fa2f5af4e07a8",
  name: "merchantRequestDelivery",
  filename: "src/lib/merchant.functions.ts"
}, (opts) => merchantRequestDelivery.__executeServer(opts));
const merchantRequestDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  order_id: z.string().uuid()
}).parse(i)).handler(merchantRequestDelivery_createServerFn_handler, async ({
  data,
  context
}) => {
  const sb = context.supabase;
  const {
    data: order,
    error: oerr
  } = await sb.from("orders").select("id, store_id, total, address, phone, notes").eq("id", data.order_id).maybeSingle();
  if (oerr || !order) throw new Error("الطلب غير موجود");
  const {
    data: store
  } = await sb.from("stores").select("id, name_ar, address, phone").eq("id", order.store_id).eq("owner_id", context.userId).maybeSingle();
  if (!store) throw new Error("غير مصرّح");
  const {
    data: existing
  } = await sb.from("delivery_requests").select("id, status").eq("order_id", data.order_id).not("status", "in", "(cancelled,delivered)").maybeSingle();
  let requestId = existing?.id;
  if (!requestId) {
    const {
      data: ins,
      error
    } = await sb.from("delivery_requests").insert({
      order_id: data.order_id,
      store_id: order.store_id,
      requested_by: context.userId,
      status: "pending"
    }).select("id").single();
    if (error) throw new Error(error.message);
    requestId = ins.id;
  }
  const {
    data: courier
  } = await supabaseAdmin.from("delivery_personnel").select("name, whatsapp").eq("active", true).limit(1).maybeSingle();
  return {
    ok: true,
    request_id: requestId,
    courier,
    order: {
      id: order.id,
      total: order.total,
      address: order.address,
      phone: order.phone
    },
    store: {
      name_ar: store.name_ar,
      address: store.address,
      phone: store.phone
    }
  };
});
export {
  adminCreateMerchantForStore_createServerFn_handler,
  adminGetStoreCredentials_createServerFn_handler,
  getMerchantDashboard_createServerFn_handler,
  merchantRequestDelivery_createServerFn_handler,
  merchantUpdateOrderStatus_createServerFn_handler
};
