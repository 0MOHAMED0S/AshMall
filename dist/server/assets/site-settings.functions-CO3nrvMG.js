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
const getSiteSettings_createServerFn_handler = createServerRpc({
  id: "6e1c851c26039a1e477558b67785ba4bc850b6cd7fffb599cf92eb098ba0b277",
  name: "getSiteSettings",
  filename: "src/lib/site-settings.functions.ts"
}, (opts) => getSiteSettings.__executeServer(opts));
const getSiteSettings = createServerFn({
  method: "GET"
}).handler(getSiteSettings_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("site_settings").select("site_name, tagline, logo_url, primary_color, contact_phone, contact_whatsapp, contact_email").eq("id", true).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    settings: data ?? {
      site_name: "آش مول",
      tagline: null,
      logo_url: null,
      primary_color: null,
      contact_phone: null,
      contact_whatsapp: null,
      contact_email: null
    }
  };
});
export {
  getSiteSettings_createServerFn_handler
};
