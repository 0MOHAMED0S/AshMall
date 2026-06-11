import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const adminCreateMerchantForStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(64).optional()
}).parse(i)).handler(createSsrRpc("aa03a3e53a6ea777f9a1686c4b129ba736a41df27c24c4d984b8242d993121c0"));
const adminGetStoreCredentials = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("0799ae0b339a07511586b97a94728db79923f64d35ad0560d242b6300d15a313"));
const getMerchantDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("19e69e5bce95f87fda3cd79d3cde7fd938ff089c492831ab05f10fa3c8e23bb8"));
const merchantUpdateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  order_id: z.string().uuid(),
  status: z.enum(["confirmed", "preparing", "delivering", "completed", "cancelled"])
}).parse(i)).handler(createSsrRpc("3b590ebaf77d258dc6bb4087c32f0c07113405d98fff037d23dcaeefe3b49c7a"));
const merchantRequestDelivery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  order_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("ad9dc4c36d8499f8073c2f99556002920c797a2385e55133782fa2f5af4e07a8"));
export {
  adminCreateMerchantForStore as a,
  adminGetStoreCredentials as b,
  merchantUpdateOrderStatus as c,
  getMerchantDashboard as g,
  merchantRequestDelivery as m
};
