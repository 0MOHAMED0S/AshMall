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
const listProductsByStore_createServerFn_handler = createServerRpc({
  id: "ad33e27f962dcec924c42c5da698dcc6f8fa972e85e8b3d98623ab5e69687a68",
  name: "listProductsByStore",
  filename: "src/lib/products.functions.ts"
}, (opts) => listProductsByStore.__executeServer(opts));
const listProductsByStore = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(listProductsByStore_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("products").select("id, name_ar, description_ar, price, compare_at_price, currency, image_url, image_url_extra, section, is_available, sort_order, order_count, created_at, product_type").eq("store_id", data.storeId).order("section", {
    ascending: true,
    nullsFirst: false
  }).order("sort_order", {
    ascending: true
  }).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    products: rows ?? []
  };
});
const getProductById_createServerFn_handler = createServerRpc({
  id: "c7fb84471f1ed3c620fa7f14e779f4ce4ede1d66e883ca357ba6cee390bd57c9",
  name: "getProductById",
  filename: "src/lib/products.functions.ts"
}, (opts) => getProductById.__executeServer(opts));
const getProductById = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(getProductById_createServerFn_handler, async ({
  data
}) => {
  const {
    data: row,
    error
  } = await supabaseAdmin.from("products").select("*, stores!inner(id, slug, name_ar, name_en, logo_url, cover_url, rating, rating_count, address, phone, whatsapp, status, categories(slug, name_ar))").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || row.stores?.status !== "approved") return {
    product: null
  };
  return {
    product: row
  };
});
const listMyStoreProducts_createServerFn_handler = createServerRpc({
  id: "f8e44893abf6b8970c5449d351a27065a6072a28330cc7382313a6d683dde0da",
  name: "listMyStoreProducts",
  filename: "src/lib/products.functions.ts"
}, (opts) => listMyStoreProducts.__executeServer(opts));
const listMyStoreProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(listMyStoreProducts_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: rows,
    error
  } = await context.supabase.from("products").select("*").eq("store_id", data.storeId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    products: rows ?? []
  };
});
const createProduct_createServerFn_handler = createServerRpc({
  id: "acc80f592bb436c21cdce6e1d5d6087ef2a2f0e66f3aa25c96c83356a4766324",
  name: "createProduct",
  filename: "src/lib/products.functions.ts"
}, (opts) => createProduct.__executeServer(opts));
const createProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(150),
  description_ar: z.string().trim().max(800).optional(),
  price: z.number().min(0).max(1e6).optional(),
  image_url: z.string().url().max(500).optional(),
  section: z.string().trim().max(80).optional()
}).parse(i)).handler(createProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: row,
    error
  } = await context.supabase.from("products").insert({
    store_id: data.store_id,
    name_ar: data.name_ar,
    description_ar: data.description_ar ?? null,
    price: data.price ?? null,
    image_url: data.image_url ?? null,
    section: data.section ?? null
  }).select().single();
  if (error) throw new Error(error.message);
  return {
    product: row
  };
});
const deleteProduct_createServerFn_handler = createServerRpc({
  id: "154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db",
  name: "deleteProduct",
  filename: "src/lib/products.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
const deleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(deleteProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("products").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createProduct_createServerFn_handler,
  deleteProduct_createServerFn_handler,
  getProductById_createServerFn_handler,
  listMyStoreProducts_createServerFn_handler,
  listProductsByStore_createServerFn_handler
};
