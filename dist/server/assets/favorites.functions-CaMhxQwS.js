import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const listFavorites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("0fef55eef71c739ff5d1ff5eec14fae3da02f5043becd1efa3bd5aa829859cd8"));
const toggleFavorite = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("4d172b19c0763e2d8fd96561556b6cc25d083064f5c5defbfa4404fbac8625a0"));
const isFavorited = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("e7a929967dfa37f7137f73c16030cdccf6661275806e33b9e440f476babedb39"));
export {
  isFavorited as i,
  listFavorites as l,
  toggleFavorite as t
};
