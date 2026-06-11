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
const listNotifications_createServerFn_handler = createServerRpc({
  id: "c017b24a4940a916334ff23b3f3461893d7b3f151e06bac76f968dd27c3f187b",
  name: "listNotifications",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => listNotifications.__executeServer(opts));
const listNotifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listNotifications_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("notifications").select("id, title, body, type, link, read_at, created_at").order("created_at", {
    ascending: false
  }).limit(30);
  if (error) throw new Error(error.message);
  return {
    notifications: data ?? []
  };
});
const markNotificationRead_createServerFn_handler = createServerRpc({
  id: "385e76cdf807dd53711b6f969d894db85cf9b0ca7a6373bb34c6352adedccb64",
  name: "markNotificationRead",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => markNotificationRead.__executeServer(opts));
const markNotificationRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(markNotificationRead_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("notifications").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const markAllRead_createServerFn_handler = createServerRpc({
  id: "2951bd39fcb59a048407113c481b15fd695e4a9d3e2f43e52a2e7ab107a2cb63",
  name: "markAllRead",
  filename: "src/lib/notifications.functions.ts"
}, (opts) => markAllRead.__executeServer(opts));
const markAllRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(markAllRead_createServerFn_handler, async ({
  context
}) => {
  const {
    error
  } = await context.supabase.from("notifications").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).is("read_at", null);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  listNotifications_createServerFn_handler,
  markAllRead_createServerFn_handler,
  markNotificationRead_createServerFn_handler
};
