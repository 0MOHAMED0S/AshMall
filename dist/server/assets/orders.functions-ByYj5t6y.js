import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
import { z } from "zod";
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
const placeOrdersFromCart_createServerFn_handler = createServerRpc({
  id: "d3f43b1c7a31820ee274e1b8d6bbf934b29168c957e85bc31b74f7189df0c7aa",
  name: "placeOrdersFromCart",
  filename: "src/lib/orders.functions.ts"
}, (opts) => placeOrdersFromCart.__executeServer(opts));
const placeOrdersFromCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  phone: z.string().trim().min(3).max(40).optional(),
  address: z.string().trim().min(1).max(500).optional(),
  notes: z.string().trim().max(500).optional()
}).parse(i)).handler(placeOrdersFromCart_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: items,
    error
  } = await supabase.from("cart_items").select("id, store_id, name, quantity, price, notes").eq("user_id", userId);
  if (error) throw new Error(error.message);
  if (!items || items.length === 0) throw new Error("السلة فارغة");
  const groups = /* @__PURE__ */ new Map();
  for (const it of items) {
    if (!groups.has(it.store_id)) groups.set(it.store_id, []);
    groups.get(it.store_id).push(it);
  }
  const orderIds = [];
  for (const [storeId, list] of groups) {
    const total = list.reduce((s, r) => s + Number(r.price ?? 0) * r.quantity, 0);
    const {
      data: order,
      error: oerr
    } = await supabase.from("orders").insert({
      user_id: userId,
      store_id: storeId,
      total,
      phone: data.phone ?? null,
      address: data.address ?? null,
      notes: data.notes ?? null
    }).select("id").single();
    if (oerr || !order) throw new Error(oerr?.message ?? "تعذّر إنشاء الطلب");
    const {
      error: ierr
    } = await supabase.from("order_items").insert(list.map((it) => ({
      order_id: order.id,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      notes: it.notes
    })));
    if (ierr) throw new Error(ierr.message);
    orderIds.push(order.id);
  }
  await supabase.from("cart_items").delete().eq("user_id", userId);
  return {
    ok: true,
    orderIds
  };
});
const listMyOrders_createServerFn_handler = createServerRpc({
  id: "3265360dd1bb8505874dca36fc08c120c489507fb549e4925a945a8286e7a79a",
  name: "listMyOrders",
  filename: "src/lib/orders.functions.ts"
}, (opts) => listMyOrders.__executeServer(opts));
const listMyOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyOrders_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("orders").select("id, status, total, currency, created_at, store_id, phone, address, notes, order_items(id, name, quantity, price, notes)").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((data ?? []).map((r) => r.store_id)));
  let stores = {};
  if (ids.length) {
    const {
      data: s
    } = await context.supabase.from("stores").select("id, slug, name_ar, logo_url").in("id", ids);
    stores = Object.fromEntries((s ?? []).map((r) => [r.id, r]));
  }
  return {
    orders: (data ?? []).map((o) => ({
      ...o,
      store: stores[o.store_id] ?? null
    }))
  };
});
const cancelMyOrder_createServerFn_handler = createServerRpc({
  id: "082dbf06af476743390b5a6c3cdff8e0cfa835da67d4e0b87348ea7d02bccda7",
  name: "cancelMyOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => cancelMyOrder.__executeServer(opts));
const cancelMyOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(cancelMyOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("orders").update({
    status: "cancelled"
  }).eq("id", data.id).eq("user_id", context.userId).in("status", ["pending", "confirmed"]);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  cancelMyOrder_createServerFn_handler,
  listMyOrders_createServerFn_handler,
  placeOrdersFromCart_createServerFn_handler
};
