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
const listCart_createServerFn_handler = createServerRpc({
  id: "2c48728010f4471aff8f78d24eed2df8a5b054b8a8af799c6e4eda9f5b59565d",
  name: "listCart",
  filename: "src/lib/cart.functions.ts"
}, (opts) => listCart.__executeServer(opts));
const listCart = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listCart_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("cart_items").select("id, store_id, name, quantity, price, notes, created_at").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((data ?? []).map((r) => r.store_id)));
  let storesById = {};
  if (ids.length > 0) {
    const {
      data: s
    } = await context.supabase.from("stores").select("id, slug, name_ar, logo_url, phone, whatsapp").in("id", ids);
    storesById = Object.fromEntries((s ?? []).map((r) => [r.id, r]));
  }
  const items = (data ?? []).map((r) => ({
    ...r,
    stores: storesById[r.store_id] ?? null
  }));
  return {
    items
  };
});
const addToCart_createServerFn_handler = createServerRpc({
  id: "98787e5b2da655fe7409fdd63de3f13493a4fa74a01518d853ae680bb7821f02",
  name: "addToCart",
  filename: "src/lib/cart.functions.ts"
}, (opts) => addToCart.__executeServer(opts));
const addToCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(999).default(1),
  price: z.number().min(0).max(1e6).optional(),
  notes: z.string().trim().max(300).optional()
}).parse(i)).handler(addToCart_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: existing,
    error: exErr
  } = await context.supabase.from("cart_items").select("store_id").eq("user_id", context.userId).limit(50);
  if (exErr) throw new Error(exErr.message);
  const conflict = (existing ?? []).some((r) => r.store_id !== data.store_id);
  if (conflict) throw new Error("CART_STORE_CONFLICT");
  const {
    error
  } = await context.supabase.from("cart_items").insert({
    user_id: context.userId,
    store_id: data.store_id,
    name: data.name,
    quantity: data.quantity,
    price: data.price ?? null,
    notes: data.notes ?? null
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const replaceCartAndAdd_createServerFn_handler = createServerRpc({
  id: "632229d5d7624c31770859dad5c3cec4e7f8ab7cef2042ddf2abf85fe8f3b874",
  name: "replaceCartAndAdd",
  filename: "src/lib/cart.functions.ts"
}, (opts) => replaceCartAndAdd.__executeServer(opts));
const replaceCartAndAdd = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(999).default(1),
  price: z.number().min(0).max(1e6).optional(),
  notes: z.string().trim().max(300).optional()
}).parse(i)).handler(replaceCartAndAdd_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error: delErr
  } = await context.supabase.from("cart_items").delete().eq("user_id", context.userId);
  if (delErr) throw new Error(delErr.message);
  const {
    error
  } = await context.supabase.from("cart_items").insert({
    user_id: context.userId,
    store_id: data.store_id,
    name: data.name,
    quantity: data.quantity,
    price: data.price ?? null,
    notes: data.notes ?? null
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const updateCartItem_createServerFn_handler = createServerRpc({
  id: "8ee2877abc326cd4cce0a8c31341bed607d66ac290d21cd8d4f45868e9cf2ed7",
  name: "updateCartItem",
  filename: "src/lib/cart.functions.ts"
}, (opts) => updateCartItem.__executeServer(opts));
const updateCartItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  quantity: z.number().int().min(1).max(999)
}).parse(i)).handler(updateCartItem_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("cart_items").update({
    quantity: data.quantity
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const removeCartItem_createServerFn_handler = createServerRpc({
  id: "abc007195f92a5377b70dde90a4465315a61f009177f5672779e0f24fc7fd1c6",
  name: "removeCartItem",
  filename: "src/lib/cart.functions.ts"
}, (opts) => removeCartItem.__executeServer(opts));
const removeCartItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(removeCartItem_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("cart_items").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const clearCart_createServerFn_handler = createServerRpc({
  id: "f8ffd6e3c7dd5735d457cd2a439cc9e22142f27ba42701da3537721333fd7849",
  name: "clearCart",
  filename: "src/lib/cart.functions.ts"
}, (opts) => clearCart.__executeServer(opts));
const clearCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(clearCart_createServerFn_handler, async ({
  context
}) => {
  const {
    error
  } = await context.supabase.from("cart_items").delete().eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  addToCart_createServerFn_handler,
  clearCart_createServerFn_handler,
  listCart_createServerFn_handler,
  removeCartItem_createServerFn_handler,
  replaceCartAndAdd_createServerFn_handler,
  updateCartItem_createServerFn_handler
};
