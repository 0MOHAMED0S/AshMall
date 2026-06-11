import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
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
const listActiveAds_createServerFn_handler = createServerRpc({
  id: "0b28afb36dfc833476f068d7822248f76a248945b7d20f31d2e85b6c5f4d1370",
  name: "listActiveAds",
  filename: "src/lib/ads.functions.ts"
}, (opts) => listActiveAds.__executeServer(opts));
const listActiveAds = createServerFn({
  method: "GET"
}).handler(listActiveAds_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("ads").select("id, title, subtitle, image_url, link, sort_order").eq("active", true).lte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).or(`ends_at.is.null,ends_at.gt.${(/* @__PURE__ */ new Date()).toISOString()}`).order("sort_order").limit(6);
  if (error) throw new Error(error.message);
  return {
    ads: data ?? []
  };
});
export {
  listActiveAds_createServerFn_handler
};
