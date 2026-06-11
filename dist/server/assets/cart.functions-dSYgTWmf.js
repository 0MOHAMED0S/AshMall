import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const listCart = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2c48728010f4471aff8f78d24eed2df8a5b054b8a8af799c6e4eda9f5b59565d"));
const addToCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(999).default(1),
  price: z.number().min(0).max(1e6).optional(),
  notes: z.string().trim().max(300).optional()
}).parse(i)).handler(createSsrRpc("98787e5b2da655fe7409fdd63de3f13493a4fa74a01518d853ae680bb7821f02"));
const replaceCartAndAdd = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  quantity: z.number().int().min(1).max(999).default(1),
  price: z.number().min(0).max(1e6).optional(),
  notes: z.string().trim().max(300).optional()
}).parse(i)).handler(createSsrRpc("632229d5d7624c31770859dad5c3cec4e7f8ab7cef2042ddf2abf85fe8f3b874"));
const updateCartItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  quantity: z.number().int().min(1).max(999)
}).parse(i)).handler(createSsrRpc("8ee2877abc326cd4cce0a8c31341bed607d66ac290d21cd8d4f45868e9cf2ed7"));
const removeCartItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("abc007195f92a5377b70dde90a4465315a61f009177f5672779e0f24fc7fd1c6"));
const clearCart = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f8ffd6e3c7dd5735d457cd2a439cc9e22142f27ba42701da3537721333fd7849"));
export {
  addToCart as a,
  replaceCartAndAdd as b,
  clearCart as c,
  listCart as l,
  removeCartItem as r,
  updateCartItem as u
};
