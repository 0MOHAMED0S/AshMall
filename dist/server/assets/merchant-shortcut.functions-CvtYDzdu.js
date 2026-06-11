import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.js";
import { z } from "zod";
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
const SHORTCUT_ID = "01040459460";
const SHORTCUT_PASSWORD = "13532000";
const SHORTCUT_EMAIL = "merchant01040459460@ashmoun.local";
const ensureMerchantShortcut_createServerFn_handler = createServerRpc({
  id: "d40176337b963db22a207dc9644bef998ad409ffe9459a127a9a0652b368e22a",
  name: "ensureMerchantShortcut",
  filename: "src/lib/merchant-shortcut.functions.ts"
}, (opts) => ensureMerchantShortcut.__executeServer(opts));
const ensureMerchantShortcut = createServerFn({
  method: "POST"
}).inputValidator((input) => z.object({
  identifier: z.string().min(1).max(100),
  password: z.string().min(1).max(200)
}).parse(input)).handler(ensureMerchantShortcut_createServerFn_handler, async ({
  data
}) => {
  if (data.identifier.trim() !== SHORTCUT_ID || data.password !== SHORTCUT_PASSWORD) {
    return {
      matched: false
    };
  }
  const {
    data: list,
    error: listErr
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });
  if (listErr) throw new Error(listErr.message);
  let user = list.users.find((u) => u.email === SHORTCUT_EMAIL);
  if (!user) {
    const {
      data: created,
      error: createErr
    } = await supabaseAdmin.auth.admin.createUser({
      email: SHORTCUT_EMAIL,
      password: SHORTCUT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "تاجر آش مول",
        intended_role: "owner"
      }
    });
    if (createErr) throw new Error(createErr.message);
    user = created.user;
  } else {
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: SHORTCUT_PASSWORD,
      email_confirm: true
    });
  }
  await supabaseAdmin.from("user_roles").upsert({
    user_id: user.id,
    role: "admin"
  }, {
    onConflict: "user_id,role"
  });
  return {
    matched: true,
    email: SHORTCUT_EMAIL,
    password: SHORTCUT_PASSWORD
  };
});
export {
  ensureMerchantShortcut_createServerFn_handler
};
