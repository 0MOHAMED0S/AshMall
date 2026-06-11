import { c as createServerRpc } from "./createServerRpc-BIM_FMco.js";
import { z } from "zod";
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
async function assertAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}
const adminListDelivery_createServerFn_handler = createServerRpc({
  id: "5db9e87d549a71479f0b60d9157e9d2b2071c70442f321ca27f8084bbb8e47cb",
  name: "adminListDelivery",
  filename: "src/lib/delivery.functions.ts"
}, (opts) => adminListDelivery.__executeServer(opts));
const adminListDelivery = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListDelivery_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("delivery_personnel").select("id, user_id, name, phone, whatsapp, email, password, active, created_at").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    personnel: data ?? []
  };
});
const adminCreateDelivery_createServerFn_handler = createServerRpc({
  id: "2218ae7e549bdb42cbe227b4909ac2dfe0643e28a4eb9192228c9486574032c1",
  name: "adminCreateDelivery",
  filename: "src/lib/delivery.functions.ts"
}, (opts) => adminCreateDelivery.__executeServer(opts));
const adminCreateDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  name: z.string().trim().min(2).max(100),
  whatsapp: z.string().trim().min(5).max(40),
  phone: z.string().trim().max(40).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(64).optional()
}).parse(i)).handler(adminCreateDelivery_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const cleanWa = data.whatsapp.replace(/[^\d+]/g, "");
  const email = data.email?.trim() || `delivery-${cleanWa.replace(/\D/g, "")}@ashmoun.local`;
  const password = data.password || Math.random().toString(36).slice(2, 12);
  const {
    data: list
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1e3
  });
  let user = list?.users.find((u) => u.email === email);
  if (!user) {
    const {
      data: created,
      error: cerr
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: data.name,
        intended_role: "delivery"
      }
    });
    if (cerr) throw new Error(cerr.message);
    user = created.user;
  } else {
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true
    });
  }
  const {
    data: row,
    error
  } = await supabaseAdmin.from("delivery_personnel").upsert({
    user_id: user.id,
    name: data.name,
    phone: data.phone || null,
    whatsapp: cleanWa,
    email,
    password,
    active: true
  }, {
    onConflict: "user_id"
  }).select().single();
  if (error) throw new Error(error.message);
  return {
    ok: true,
    personnel: row
  };
});
const adminToggleDelivery_createServerFn_handler = createServerRpc({
  id: "42c0af1650050adbde682e7452bfce2ce235c6bfa6abeac7937c1efb0b95a74a",
  name: "adminToggleDelivery",
  filename: "src/lib/delivery.functions.ts"
}, (opts) => adminToggleDelivery.__executeServer(opts));
const adminToggleDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  active: z.boolean()
}).parse(i)).handler(adminToggleDelivery_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await supabaseAdmin.from("delivery_personnel").update({
    active: data.active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteDelivery_createServerFn_handler = createServerRpc({
  id: "2576c001784b19098cb445ec218013bd519c248827eee8b4a72a49f12490214b",
  name: "adminDeleteDelivery",
  filename: "src/lib/delivery.functions.ts"
}, (opts) => adminDeleteDelivery.__executeServer(opts));
const adminDeleteDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(adminDeleteDelivery_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data: row
  } = await supabaseAdmin.from("delivery_personnel").select("user_id").eq("id", data.id).maybeSingle();
  const {
    error
  } = await supabaseAdmin.from("delivery_personnel").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  if (row?.user_id) {
    await supabaseAdmin.auth.admin.deleteUser(row.user_id).catch(() => {
    });
  }
  return {
    ok: true
  };
});
const getDeliveryDashboard_createServerFn_handler = createServerRpc({
  id: "b78a92e882e36e3fd925546c5017fbc3b870c8c72002d577869e00aed1f0f405",
  name: "getDeliveryDashboard",
  filename: "src/lib/delivery.functions.ts"
}, (opts) => getDeliveryDashboard.__executeServer(opts));
const getDeliveryDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getDeliveryDashboard_createServerFn_handler, async ({
  context
}) => {
  const sb = context.supabase;
  const {
    data: me
  } = await supabaseAdmin.from("delivery_personnel").select("id, name, whatsapp, email, active").eq("user_id", context.userId).maybeSingle();
  if (!me || !me.active) return {
    me: null,
    requests: [],
    stats: null
  };
  const {
    data: requests,
    error
  } = await sb.from("delivery_requests").select("id, order_id, store_id, status, assigned_to, created_at, notes").or(`assigned_to.eq.${context.userId},status.eq.pending`).order("created_at", {
    ascending: false
  }).limit(60);
  if (error) throw new Error(error.message);
  const rows = requests ?? [];
  const orderIds = Array.from(new Set(rows.map((r) => r.order_id)));
  const storeIds = Array.from(new Set(rows.map((r) => r.store_id)));
  const [{
    data: orders
  }, {
    data: stores
  }] = await Promise.all([orderIds.length ? sb.from("orders").select("id, total, currency, address, phone, notes, order_items(name, quantity, price)").in("id", orderIds) : Promise.resolve({
    data: []
  }), storeIds.length ? sb.from("stores").select("id, name_ar, address, phone, whatsapp, logo_url").in("id", storeIds) : Promise.resolve({
    data: []
  })]);
  const orderMap = Object.fromEntries((orders ?? []).map((o) => [o.id, o]));
  const storeMap = Object.fromEntries((stores ?? []).map((s) => [s.id, s]));
  const enriched = rows.map((r) => ({
    ...r,
    order: orderMap[r.order_id] ?? null,
    store: storeMap[r.store_id] ?? null
  }));
  return {
    me,
    requests: enriched,
    stats: {
      active: enriched.filter((r) => r.assigned_to === context.userId && r.status !== "delivered" && r.status !== "cancelled").length,
      pending: enriched.filter((r) => r.status === "pending").length,
      delivered: enriched.filter((r) => r.assigned_to === context.userId && r.status === "delivered").length
    }
  };
});
const deliveryUpdateRequest_createServerFn_handler = createServerRpc({
  id: "1e8d50f0220d5ea834db928ef182466fbaf4c738ee3d823bc2d36b348f43fa3f",
  name: "deliveryUpdateRequest",
  filename: "src/lib/delivery.functions.ts"
}, (opts) => deliveryUpdateRequest.__executeServer(opts));
const deliveryUpdateRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  action: z.enum(["accept", "picked_up", "delivered", "cancel"])
}).parse(i)).handler(deliveryUpdateRequest_createServerFn_handler, async ({
  data,
  context
}) => {
  const sb = context.supabase;
  const patch = {};
  if (data.action === "accept") {
    patch.status = "accepted";
    patch.assigned_to = context.userId;
  } else if (data.action === "picked_up") patch.status = "picked_up";
  else if (data.action === "delivered") patch.status = "delivered";
  else if (data.action === "cancel") patch.status = "cancelled";
  const {
    error
  } = await sb.from("delivery_requests").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  if (data.action === "delivered" || data.action === "picked_up") {
    const {
      data: dr
    } = await sb.from("delivery_requests").select("order_id").eq("id", data.id).maybeSingle();
    if (dr) {
      const newOrderStatus = data.action === "delivered" ? "completed" : "delivering";
      await supabaseAdmin.from("orders").update({
        status: newOrderStatus
      }).eq("id", dr.order_id);
    }
  }
  return {
    ok: true
  };
});
export {
  adminCreateDelivery_createServerFn_handler,
  adminDeleteDelivery_createServerFn_handler,
  adminListDelivery_createServerFn_handler,
  adminToggleDelivery_createServerFn_handler,
  deliveryUpdateRequest_createServerFn_handler,
  getDeliveryDashboard_createServerFn_handler
};
