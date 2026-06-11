import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const adminListDelivery = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5db9e87d549a71479f0b60d9157e9d2b2071c70442f321ca27f8084bbb8e47cb"));
const adminCreateDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  name: z.string().trim().min(2).max(100),
  whatsapp: z.string().trim().min(5).max(40),
  phone: z.string().trim().max(40).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(64).optional()
}).parse(i)).handler(createSsrRpc("2218ae7e549bdb42cbe227b4909ac2dfe0643e28a4eb9192228c9486574032c1"));
const adminToggleDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  active: z.boolean()
}).parse(i)).handler(createSsrRpc("42c0af1650050adbde682e7452bfce2ce235c6bfa6abeac7937c1efb0b95a74a"));
const adminDeleteDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("2576c001784b19098cb445ec218013bd519c248827eee8b4a72a49f12490214b"));
const getDeliveryDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b78a92e882e36e3fd925546c5017fbc3b870c8c72002d577869e00aed1f0f405"));
const deliveryUpdateRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  action: z.enum(["accept", "picked_up", "delivered", "cancel"])
}).parse(i)).handler(createSsrRpc("1e8d50f0220d5ea834db928ef182466fbaf4c738ee3d823bc2d36b348f43fa3f"));
export {
  adminCreateDelivery as a,
  adminDeleteDelivery as b,
  adminListDelivery as c,
  adminToggleDelivery as d,
  deliveryUpdateRequest as e,
  getDeliveryDashboard as g
};
