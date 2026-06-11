import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
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
const claimStoreOwnerRole_createServerFn_handler = createServerRpc({
  id: "8f27371ce786bca7dd2e87bc5c1736f014bcbfbdc236a42ea3d290e57c50f511",
  name: "claimStoreOwnerRole",
  filename: "src/lib/owner.functions.ts"
}, (opts) => claimStoreOwnerRole.__executeServer(opts));
const claimStoreOwnerRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(claimStoreOwnerRole_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    error
  } = await supabaseAdmin.from("user_roles").upsert({
    user_id: userId,
    role: "store_owner"
  }, {
    onConflict: "user_id,role"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  claimStoreOwnerRole_createServerFn_handler
};
