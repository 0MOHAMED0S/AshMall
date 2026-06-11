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
const listFavorites_createServerFn_handler = createServerRpc({
  id: "0fef55eef71c739ff5d1ff5eec14fae3da02f5043becd1efa3bd5aa829859cd8",
  name: "listFavorites",
  filename: "src/lib/favorites.functions.ts"
}, (opts) => listFavorites.__executeServer(opts));
const listFavorites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listFavorites_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("favorites").select("id, store_id, created_at, stores(id, slug, name_ar, name_en, rating, rating_count, cover_url, logo_url, address, categories(name_ar, slug))").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    favorites: data ?? []
  };
});
const toggleFavorite_createServerFn_handler = createServerRpc({
  id: "4d172b19c0763e2d8fd96561556b6cc25d083064f5c5defbfa4404fbac8625a0",
  name: "toggleFavorite",
  filename: "src/lib/favorites.functions.ts"
}, (opts) => toggleFavorite.__executeServer(opts));
const toggleFavorite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(toggleFavorite_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: existing
  } = await context.supabase.from("favorites").select("id").eq("user_id", context.userId).eq("store_id", data.store_id).maybeSingle();
  if (existing) {
    const {
      error: error2
    } = await context.supabase.from("favorites").delete().eq("id", existing.id);
    if (error2) throw new Error(error2.message);
    return {
      favorited: false
    };
  }
  const {
    error
  } = await context.supabase.from("favorites").insert({
    user_id: context.userId,
    store_id: data.store_id
  });
  if (error) throw new Error(error.message);
  return {
    favorited: true
  };
});
const isFavorited_createServerFn_handler = createServerRpc({
  id: "e7a929967dfa37f7137f73c16030cdccf6661275806e33b9e440f476babedb39",
  name: "isFavorited",
  filename: "src/lib/favorites.functions.ts"
}, (opts) => isFavorited.__executeServer(opts));
const isFavorited = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(isFavorited_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: row
  } = await context.supabase.from("favorites").select("id").eq("user_id", context.userId).eq("store_id", data.store_id).maybeSingle();
  return {
    favorited: !!row
  };
});
export {
  isFavorited_createServerFn_handler,
  listFavorites_createServerFn_handler,
  toggleFavorite_createServerFn_handler
};
