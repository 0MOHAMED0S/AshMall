import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const placeOrdersFromCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  phone: z.string().trim().min(3).max(40).optional(),
  address: z.string().trim().min(1).max(500).optional(),
  notes: z.string().trim().max(500).optional()
}).parse(i)).handler(createSsrRpc("d3f43b1c7a31820ee274e1b8d6bbf934b29168c957e85bc31b74f7189df0c7aa"));
const listMyOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3265360dd1bb8505874dca36fc08c120c489507fb549e4925a945a8286e7a79a"));
const cancelMyOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("082dbf06af476743390b5a6c3cdff8e0cfa835da67d4e0b87348ea7d02bccda7"));
export {
  cancelMyOrder as c,
  listMyOrders as l,
  placeOrdersFromCart as p
};
