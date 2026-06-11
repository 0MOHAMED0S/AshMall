import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
import { z } from "zod";
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
const listPopularProducts_createServerFn_handler = createServerRpc({
  id: "1f5f256e0d8083b161df4663cdedf6327bf5f10d38ca14d0a1e45c967bf60e55",
  name: "listPopularProducts",
  filename: "src/lib/home.functions.ts"
}, (opts) => listPopularProducts.__executeServer(opts));
const listPopularProducts = createServerFn({
  method: "GET"
}).handler(listPopularProducts_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("products").select("id, name_ar, price, currency, image_url, store_id, order_count, stores!inner(slug, name_ar, status)").eq("is_available", true).eq("stores.status", "approved").order("order_count", {
    ascending: false
  }).order("created_at", {
    ascending: false
  }).limit(12);
  if (error) throw new Error(error.message);
  return {
    products: data ?? []
  };
});
const listDiscountProducts_createServerFn_handler = createServerRpc({
  id: "cdbad617f7babe1009cf1458c81d2e5d883fdf928195933e3909136eacd9ad87",
  name: "listDiscountProducts",
  filename: "src/lib/home.functions.ts"
}, (opts) => listDiscountProducts.__executeServer(opts));
const listDiscountProducts = createServerFn({
  method: "GET"
}).handler(listDiscountProducts_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("products").select("id, name_ar, price, compare_at_price, currency, image_url, store_id, stores!inner(slug, name_ar, status)").eq("is_available", true).eq("stores.status", "approved").not("compare_at_price", "is", null).order("created_at", {
    ascending: false
  }).limit(12);
  if (error) throw new Error(error.message);
  const filtered = (data ?? []).filter((p) => (p.compare_at_price ?? 0) > (p.price ?? 0));
  return {
    products: filtered
  };
});
const listFeaturedNearbyStores_createServerFn_handler = createServerRpc({
  id: "1a4b43bcd61dce3ff71704a09ed8a697bc102b9662df3f6552a0d82a3e8d60f9",
  name: "listFeaturedNearbyStores",
  filename: "src/lib/home.functions.ts"
}, (opts) => listFeaturedNearbyStores.__executeServer(opts));
const listFeaturedNearbyStores = createServerFn({
  method: "GET"
}).handler(listFeaturedNearbyStores_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("stores").select("id, slug, name_ar, logo_url, rating, rating_count").eq("status", "approved").eq("is_featured", true).order("rating", {
    ascending: false
  }).limit(10);
  if (error) throw new Error(error.message);
  return {
    stores: data ?? []
  };
});
const listRecentStores_createServerFn_handler = createServerRpc({
  id: "26ce8044fbf2d5dd1dcad5d9ea4595d5825d39de12a5fc08d8553087f6d25cef",
  name: "listRecentStores",
  filename: "src/lib/home.functions.ts"
}, (opts) => listRecentStores.__executeServer(opts));
const listRecentStores = createServerFn({
  method: "GET"
}).handler(listRecentStores_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("stores").select("id, slug, name_ar, description_ar, logo_url, cover_url, address, rating, rating_count, opening_hours, categories(name_ar)").eq("status", "approved").order("created_at", {
    ascending: false
  }).limit(8);
  if (error) throw new Error(error.message);
  return {
    stores: data ?? []
  };
});
const getStoresByIds_createServerFn_handler = createServerRpc({
  id: "02d4e7a519bd36241a8e3b58bf299a44228812a5ce879db65dbfe84571dfac79",
  name: "getStoresByIds",
  filename: "src/lib/home.functions.ts"
}, (opts) => getStoresByIds.__executeServer(opts));
const getStoresByIds = createServerFn({
  method: "POST"
}).inputValidator((i) => z.object({
  ids: z.array(z.string().uuid()).max(20)
}).parse(i)).handler(getStoresByIds_createServerFn_handler, async ({
  data
}) => {
  if (data.ids.length === 0) return {
    stores: []
  };
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("stores").select("id, slug, name_ar, logo_url, cover_url, rating, rating_count, categories(name_ar)").in("id", data.ids).eq("status", "approved");
  if (error) throw new Error(error.message);
  const map = new Map((rows ?? []).map((r) => [r.id, r]));
  const ordered = data.ids.map((id) => map.get(id)).filter(Boolean);
  return {
    stores: ordered
  };
});
export {
  getStoresByIds_createServerFn_handler,
  listDiscountProducts_createServerFn_handler,
  listFeaturedNearbyStores_createServerFn_handler,
  listPopularProducts_createServerFn_handler,
  listRecentStores_createServerFn_handler
};
