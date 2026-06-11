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
const listReviews_createServerFn_handler = createServerRpc({
  id: "18bf852c2c44b492ae1aef921e610b96e97ded65ecc99a6c42a2e28e8095049c",
  name: "listReviews",
  filename: "src/lib/reviews.functions.ts"
}, (opts) => listReviews.__executeServer(opts));
const listReviews = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(listReviews_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("reviews").select("id, rating, comment, created_at, user_id").eq("store_id", data.storeId).order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id)));
  let profilesMap = /* @__PURE__ */ new Map();
  if (userIds.length) {
    const {
      data: profs
    } = await supabaseAdmin.from("profiles").select("id, full_name, avatar_url").in("id", userIds);
    profilesMap = new Map((profs ?? []).map((p) => [p.id, {
      full_name: p.full_name,
      avatar_url: p.avatar_url
    }]));
  }
  return {
    reviews: (rows ?? []).map((r) => ({
      ...r,
      profiles: profilesMap.get(r.user_id) ?? null
    }))
  };
});
const submitReview_createServerFn_handler = createServerRpc({
  id: "ce6a536774dc23197ca25305cdef564d67785441a1af7032509a3acafaa472f0",
  name: "submitReview",
  filename: "src/lib/reviews.functions.ts"
}, (opts) => submitReview.__executeServer(opts));
const submitReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional()
}).parse(i)).handler(submitReview_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("reviews").upsert({
    store_id: data.store_id,
    user_id: context.userId,
    rating: data.rating,
    comment: data.comment ?? null
  }, {
    onConflict: "store_id,user_id"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  listReviews_createServerFn_handler,
  submitReview_createServerFn_handler
};
