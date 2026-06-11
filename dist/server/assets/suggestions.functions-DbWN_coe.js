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
const searchSuggestions_createServerFn_handler = createServerRpc({
  id: "7b56f205859d8fb93a1fe62324e635a8a2d99c549e0766896fdf1a658999bc4c",
  name: "searchSuggestions",
  filename: "src/lib/suggestions.functions.ts"
}, (opts) => searchSuggestions.__executeServer(opts));
const searchSuggestions = createServerFn({
  method: "POST"
}).inputValidator((i) => z.object({
  q: z.string().trim().min(1).max(80)
}).parse(i)).handler(searchSuggestions_createServerFn_handler, async ({
  data
}) => {
  const safe = data.q.replace(/[%,()]/g, "");
  const pattern = `%${safe}%`;
  const [storesRes, productsRes, catsRes] = await Promise.all([supabaseAdmin.from("stores").select("id, slug, name_ar, logo_url, categories(name_ar)").eq("status", "approved").or(`name_ar.ilike.${pattern},description_ar.ilike.${pattern}`).limit(5), supabaseAdmin.from("products").select("id, name_ar, price, image_url, store_id, stores!inner(slug, name_ar, status)").eq("is_available", true).eq("stores.status", "approved").ilike("name_ar", pattern).limit(6), supabaseAdmin.from("categories").select("slug, name_ar, icon").ilike("name_ar", pattern).limit(3)]);
  return {
    stores: storesRes.data ?? [],
    products: productsRes.data ?? [],
    categories: catsRes.data ?? []
  };
});
export {
  searchSuggestions_createServerFn_handler
};
