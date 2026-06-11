import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const adminOverview = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95"));
const adminListStores = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  status: z.string().optional(),
  q: z.string().optional()
}).parse(i ?? {})).handler(createSsrRpc("adf61c7212b1948e5c9e6ed11636e3e5882e1956e31fa4c98543fa951ead7c93"));
const adminUpdateStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
  is_featured: z.boolean().optional()
}).parse(i)).handler(createSsrRpc("5a04121677d3e65ffa270b8996711c244063b84471f0f9b4ab84f840ae1fb9f9"));
const adminDeleteStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("cba90266c9a7758c97eb8361bbee0e080b445247010a30e61a622d12457b64f7"));
const adminListStoresByCategory = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  category_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("8571920cee1e1bd25ce5aba7013a1ef30afbdac6d033bf073ec0bcdb5605f50b"));
const adminCreateStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  category_id: z.string().uuid(),
  name_ar: z.string().trim().min(2).max(100),
  name_en: z.string().trim().max(100).optional(),
  description_ar: z.string().trim().max(1e3).optional(),
  address: z.string().trim().min(2).max(300),
  legal_name: z.string().trim().max(150).optional(),
  delivery_fee: z.number().min(0).max(1e5).optional(),
  prep_time_minutes: z.number().int().min(0).max(600).optional(),
  opening_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  closing_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  logo_url: z.string().url().max(2048).optional().or(z.literal("")),
  cover_url: z.string().url().max(2048).optional().or(z.literal("")),
  is_featured: z.boolean().optional().default(false)
}).parse(i)).handler(createSsrRpc("69329ca9e2ea9d8fedfa436e83190e53f00dd8a9ad23912e6fa18af9afd9441f"));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional()
}).parse(i ?? {})).handler(createSsrRpc("35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240"));
const adminSetRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "store_owner", "customer"]),
  grant: z.boolean()
}).parse(i)).handler(createSsrRpc("154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3"));
const adminListOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  status: z.string().optional()
}).parse(i ?? {})).handler(createSsrRpc("573be2cdf3c95bfa88f6bb3d2080ff0b0c620db545ac53f2f5a039a50348d737"));
const adminUpdateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"])
}).parse(i)).handler(createSsrRpc("9505b54584006d8459dff4f0d9b2b1ccc184fc05200648ce850e9f9f7ee3f723"));
const adminListCategories = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("16adcae68f7f6ee62a1f2c605455af763ee11cf325960f90579e35d6bc275907"));
const adminUpsertCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid().optional(),
  name_ar: z.string().min(1).max(80),
  name_en: z.string().min(1).max(80),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  icon: z.string().max(80).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0)
}).parse(i)).handler(createSsrRpc("6bada778c941c28d8f4bb5693567682fcc0a8cc5f8e134db94c3d77ba2454fce"));
const adminDeleteCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("950328abc056627e7020b8ee4af15de2c8185c6b4f0fa341cec497db75a14951"));
const adminListAds = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("853897e326dd61bfc50a155e64353f1d22f1728ed7aa992d071369a5c124ca85"));
const adminUpsertAd = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(240).nullable().optional(),
  image_url: z.string().url().max(2048).nullable().optional(),
  link: z.string().max(2048).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(true)
}).parse(i)).handler(createSsrRpc("d8084ea51bce5c31e5323fe1c90745c7c9143261d63f2d671209023a0d9ea1fc"));
const adminDeleteAd = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("db83bc6b01fa8e833b8f7e0a912abd2b45f46a03a366e6951704b573371b9d7b"));
const adminBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  title: z.string().min(1).max(120),
  body: z.string().max(500).optional(),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  link: z.string().max(500).optional(),
  audience: z.enum(["all", "store_owners", "customers"]).default("all")
}).parse(i)).handler(createSsrRpc("3337831eabcbeff783b9046181bf907f45a0e670191e3c1928ea84e3f9e97c0a"));
const adminListReviews = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("15f2e75a66daeb3bb02995a6ec9720c2223d751ece39bd60c1b92546d4e5e485"));
const adminDeleteReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("a5e49249b72a1c4a65f74bebe4f19c3e7987e76bb8ff6b8d0c8f3dc6a74c7fcc"));
const adminAnalytics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  days: z.number().int().min(7).max(90).default(14)
}).parse(i ?? {})).handler(createSsrRpc("ad0c092d9068302d584e4ee6c929270ef251348f837bd3ea129892db963c741d"));
const adminListMerchants = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional()
}).parse(i ?? {})).handler(createSsrRpc("71193263ad6fe16869da2a6db5a7c64cc64998622ac4022c99bfe83df854ac31"));
const adminCreateMerchant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  full_name: z.string().min(1).max(120),
  phone: z.string().max(30).optional()
}).parse(i)).handler(createSsrRpc("ef77b1c0232c7304ff62bb9380a5ae2415adc96f0eb603b4ece40932b1a36cf5"));
const adminResetMerchantPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  user_id: z.string().uuid(),
  password: z.string().min(8).max(72)
}).parse(i)).handler(createSsrRpc("42de0c8cb8ebcb7de3efb34f033c04a87a31e15f24797cb312b022900f84859d"));
const adminDeleteMerchant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  user_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("6098d7c545fd04a6b8c0631e0de77760fe299c6ba31834ee9696d393e18e17ee"));
const adminListProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional(),
  store_id: z.string().uuid().optional()
}).parse(i ?? {})).handler(createSsrRpc("9932f7d91182148199cbc8b49e99aa83ab2855e0f2166e0d0e38e6c091b587df"));
const adminUpdateProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid(),
  name_ar: z.string().min(1).max(200).optional(),
  price: z.number().min(0).max(9999999).nullable().optional(),
  is_available: z.boolean().optional()
}).parse(i)).handler(createSsrRpc("70be012ea44ce688beab96ae8c1cf36c639ba53bf34207e89caac6ed540441f5"));
const adminDeleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("0ddf57ac23192120a1e98e48f57343c6fe83e8a1ddcf5df54be83354a1f768ad"));
const SiteSettingsSchema = z.object({
  site_name: z.string().min(1).max(80),
  tagline: z.string().max(200).nullable().optional(),
  logo_url: z.string().max(2048).nullable().optional(),
  primary_color: z.string().max(80).nullable().optional(),
  contact_phone: z.string().max(40).nullable().optional(),
  contact_whatsapp: z.string().max(40).nullable().optional(),
  contact_email: z.string().max(120).nullable().optional()
});
const adminUpsertSiteSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SiteSettingsSchema.parse(i)).handler(createSsrRpc("1cd54dfd63c87639b15ad0645f45822214af342b65becc8c492194ae8dc7a3db"));
export {
  adminUpsertCategory as A,
  adminUpsertSiteSettings as B,
  adminAnalytics as a,
  adminBroadcast as b,
  adminCreateMerchant as c,
  adminCreateStore as d,
  adminDeleteAd as e,
  adminDeleteCategory as f,
  adminDeleteMerchant as g,
  adminDeleteProduct as h,
  adminDeleteReview as i,
  adminDeleteStore as j,
  adminListAds as k,
  adminListCategories as l,
  adminListMerchants as m,
  adminListOrders as n,
  adminListProducts as o,
  adminListReviews as p,
  adminListStores as q,
  adminListStoresByCategory as r,
  adminListUsers as s,
  adminOverview as t,
  adminResetMerchantPassword as u,
  adminSetRole as v,
  adminUpdateOrderStatus as w,
  adminUpdateProduct as x,
  adminUpdateStore as y,
  adminUpsertAd as z
};
