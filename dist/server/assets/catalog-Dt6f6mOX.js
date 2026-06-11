import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Boxes, Search, Store, UtensilsCrossed, Shirt, Package, Tag, Plus, Save, Edit2, Trash2, ChevronUp, ChevronDown, X, Loader2, ImagePlus, Ruler } from "lucide-react";
import { toast } from "sonner";
import { g as createSsrRpc, u as useAuth } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { A as AdminPageHeader, C as Card, E as EmptyState, S as Spinner } from "./AdminUI-P1Smhk6f.js";
import { s as supabase } from "./client-1xsKmu53.js";
import "@tanstack/react-router";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const adminListStoresLite = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  q: z.string().optional()
}).parse(i ?? {})).handler(createSsrRpc("ba8134f2138ab250650c30c0f838f039ba3ab202f24ef535680b5852675dd7a0"));
const adminGetStoreCatalog = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("316e896bf86dae0d4e3059b2b2c7ac20195cb6f62a1d4fd451c27f1a9b5de34b"));
const adminUpsertSection = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid().optional(),
  store_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(80),
  name_en: z.string().trim().max(80).optional().nullable(),
  icon: z.string().trim().max(40).optional().nullable(),
  sort_order: z.number().int().min(0).max(9999).default(0)
}).parse(i)).handler(createSsrRpc("c6fd167a4f1f166f4c5cd59a144bcd8b37f1b24147a3dd0a03efdf9df7f7fe0b"));
const adminDeleteSection = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("0c12dbcfc68bb0ba76488ec4eea1f9a9460356fa48c8599715398da27a322a44"));
const ProductInput = z.object({
  id: z.string().uuid().optional(),
  store_id: z.string().uuid(),
  section_id: z.string().uuid().nullable().optional(),
  product_type: z.enum(["general", "clothing", "food"]).default("general"),
  name_ar: z.string().trim().min(1).max(200),
  description_ar: z.string().trim().max(1500).optional().nullable(),
  price: z.number().min(0).max(9999999).nullable().optional(),
  compare_at_price: z.number().min(0).max(9999999).nullable().optional(),
  image_url: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  image_url_extra: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  stock: z.number().int().min(0).max(9999999).nullable().optional(),
  sku: z.string().trim().max(80).nullable().optional(),
  is_available: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0)
});
const adminUpsertProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ProductInput.parse(i)).handler(createSsrRpc("605c0e783f06a410abf97ec27974b61fe90c878cfeb4f75058ef327e6ba5bace"));
const adminDeleteProductFull = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("a9ba30adf2430240c88c80b23fac1cbe86400cfa4a9385e5108548c5c5a17240"));
const VariantInput = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  size: z.string().trim().max(40).nullable().optional(),
  color: z.string().trim().max(60).nullable().optional(),
  color_hex: z.string().trim().regex(/^#[0-9a-fA-F]{3,8}$/).nullable().optional().or(z.literal("")),
  sku: z.string().trim().max(80).nullable().optional(),
  price: z.number().min(0).max(9999999).nullable().optional(),
  stock: z.number().int().min(0).max(9999999).default(0),
  image_url: z.string().url().max(2048).nullable().optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999).default(0)
});
const adminUpsertVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => VariantInput.parse(i)).handler(createSsrRpc("5a00ccb4e9933b86dd232a13a10cd00ece386fbea93819af04017667a80f6ef7"));
const adminDeleteVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("e5d25d4c9d932efe0e33a86085dce55667d33c751941822355ba609e2ca30ad2"));
const ExtraInput = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(80),
  price: z.number().min(0).max(9999999).default(0),
  is_required: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(9999).default(0)
});
const adminUpsertExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ExtraInput.parse(i)).handler(createSsrRpc("22d81b800568f4d49051ac9242f417f88c7a9e5a16a9b92c2a35d355e9d48cf3"));
const adminDeleteExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("c296ad3bf21b1f415596378993f7a6e9b14cc01e974e606213cfb1acac3bde67"));
createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(createSsrRpc("ccbb718a7cd4d38f405c6e0242637bd4482ef78d17494679c238bdadfe809387"));
const TYPE_LABELS = {
  general: {
    label: "منتج عام",
    icon: Package,
    hint: "سعر + صورة + وصف"
  },
  clothing: {
    label: "ملابس / إكسسوار",
    icon: Shirt,
    hint: "مقاسات + ألوان + مخزون لكل تركيبة"
  },
  food: {
    label: "طعام / منيو",
    icon: UtensilsCrossed,
    hint: "صنف منيو + إضافات اختيارية"
  }
};
function detectType(categorySlug) {
  const s = (categorySlug ?? "").toLowerCase();
  if (/restaurant|food|bakery|cafe|sweet|مطعم/.test(s)) return "food";
  if (/cloth|fashion|shoe|bag|kid|men|women|ملابس|أزياء/.test(s)) return "clothing";
  return "general";
}
function CatalogAdmin() {
  const listStores = useServerFn(adminListStoresLite);
  const getCatalog = useServerFn(adminGetStoreCatalog);
  const [stores, setStores] = useState([]);
  const [storeQ, setStoreQ] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    void reloadStores();
  }, []);
  async function reloadStores() {
    try {
      const r = await listStores({
        data: {
          q: storeQ || void 0
        }
      });
      setStores(r.stores);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحميل");
    }
  }
  const [catalog, setCatalog] = useState(null);
  const [loadingCat, setLoadingCat] = useState(false);
  async function reloadCatalog(id) {
    setLoadingCat(true);
    try {
      const r = await getCatalog({
        data: {
          store_id: id
        }
      });
      setCatalog({
        sections: r.sections,
        products: r.products,
        variants: r.variants,
        extras: r.extras
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحميل");
    } finally {
      setLoadingCat(false);
    }
  }
  useEffect(() => {
    if (selectedId) void reloadCatalog(selectedId);
    else setCatalog(null);
  }, [selectedId]);
  const selectedStore = useMemo(() => stores.find((s) => s.id === selectedId) ?? null, [stores, selectedId]);
  const defaultType = detectType(selectedStore?.categories?.slug);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Boxes, eyebrow: "Catalog", title: "إدارة المنتجات الذكية", description: "اختر محلًا، أضف أقسام داخلية وضع منتجاته بنظام ذكي حسب النوع (ملابس بمقاسات وألوان، منيو مطعم بإضافات، أو منتجات عامة)." }),
    !selectedId && /* @__PURE__ */ jsxs(Card, { className: "p-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: storeQ, onChange: (e) => setStoreQ(e.target.value), onKeyDown: (e) => e.key === "Enter" && reloadStores(), placeholder: "ابحث عن محل...", className: "w-full rounded-xl border border-border bg-background pr-9 pl-3 py-2 text-sm focus:border-primary outline-none" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: reloadStores, className: "rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium", children: "بحث" })
      ] }),
      stores.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Store, title: "لا يوجد محلات", hint: "أنشئ محلات أولًا من صفحة الفئات." }) : /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: stores.map((s) => {
        const t = detectType(s.categories?.slug);
        const TIcon = TYPE_LABELS[t].icon;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { onClick: () => setSelectedId(s.id), className: "w-full text-right rounded-2xl border border-border bg-background hover:border-primary/50 hover:bg-secondary/40 transition p-3 flex items-center gap-3", children: [
          s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: "", className: "h-12 w-12 rounded-xl object-cover border border-border shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-xl bg-secondary grid place-items-center text-muted-foreground shrink-0", children: /* @__PURE__ */ jsx(Store, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold truncate", children: s.name_ar }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
              s.categories?.name_ar ?? "—",
              " · ",
              s.status
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-1 text-[10px] font-bold shrink-0", children: [
            /* @__PURE__ */ jsx(TIcon, { className: "h-3 w-3" }),
            " ",
            TYPE_LABELS[t].label
          ] })
        ] }) }, s.id);
      }) })
    ] }),
    selectedId && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-3 mb-4 flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          selectedStore?.logo_url ? /* @__PURE__ */ jsx("img", { src: selectedStore.logo_url, alt: "", className: "h-10 w-10 rounded-xl object-cover border border-border" }) : /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-secondary grid place-items-center text-muted-foreground", children: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold truncate", children: selectedStore?.name_ar ?? "..." }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
              selectedStore?.categories?.name_ar ?? "—",
              " · النوع المقترح: ",
              TYPE_LABELS[defaultType].label
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSelectedId(null), className: "text-xs rounded-full border border-border px-3 py-1.5 hover:bg-secondary", children: "تغيير المحل" })
      ] }),
      loadingCat || !catalog ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx(CatalogEditor, { storeId: selectedId, defaultType, catalog, onReload: () => reloadCatalog(selectedId) })
    ] })
  ] });
}
function CatalogEditor({
  storeId,
  defaultType,
  catalog,
  onReload
}) {
  const upsertSection = useServerFn(adminUpsertSection);
  const deleteSection = useServerFn(adminDeleteSection);
  const deleteProduct = useServerFn(adminDeleteProductFull);
  const [editSection, setEditSection] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [openProductId, setOpenProductId] = useState(null);
  async function saveSection() {
    if (!editSection?.name_ar?.trim()) return;
    try {
      await upsertSection({
        data: {
          id: editSection.id,
          store_id: storeId,
          name_ar: editSection.name_ar.trim(),
          name_en: editSection.name_en ?? void 0,
          icon: editSection.icon ?? void 0,
          sort_order: editSection.sort_order ?? 0
        }
      });
      toast.success("تم حفظ القسم");
      setEditSection(null);
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    }
  }
  async function removeSection(id) {
    if (!confirm("حذف القسم؟ المنتجات اللي بداخله هتفضل بس بدون قسم.")) return;
    try {
      await deleteSection({
        data: {
          id
        }
      });
      toast.success("تم الحذف");
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  async function removeProduct(id) {
    if (!confirm("حذف المنتج وكل تشكيلاته وإضافاته؟")) return;
    try {
      await deleteProduct({
        data: {
          id
        }
      });
      toast.success("تم الحذف");
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  const productsBySection = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const p of catalog.products) {
      const k = p.section_id ?? "_none";
      m.set(k, [...m.get(k) ?? [], p]);
    }
    return m;
  }, [catalog.products]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: "p-4 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3 flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
            "الأقسام الداخلية (",
            catalog.sections.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setEditSection({
          name_ar: "",
          sort_order: catalog.sections.length
        }), className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
          " قسم جديد"
        ] })
      ] }),
      editSection && /* @__PURE__ */ jsxs("div", { className: "mb-3 rounded-xl border border-border bg-background p-3 grid grid-cols-1 sm:grid-cols-[1fr_120px_auto_auto] gap-2 items-end", children: [
        /* @__PURE__ */ jsx(Field, { label: "اسم القسم *", children: /* @__PURE__ */ jsx("input", { autoFocus: true, value: editSection.name_ar ?? "", onChange: (e) => setEditSection({
          ...editSection,
          name_ar: e.target.value
        }), className: inputCls, placeholder: "مثال: المقبلات / مجموعة الشتاء" }) }),
        /* @__PURE__ */ jsx(Field, { label: "ترتيب", children: /* @__PURE__ */ jsx("input", { type: "number", value: editSection.sort_order ?? 0, onChange: (e) => setEditSection({
          ...editSection,
          sort_order: parseInt(e.target.value) || 0
        }), className: inputCls }) }),
        /* @__PURE__ */ jsxs("button", { onClick: saveSection, className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }),
          " حفظ"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setEditSection(null), className: "rounded-full border border-border px-4 py-2 text-xs", children: "إلغاء" })
      ] }),
      catalog.sections.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground py-3 text-center", children: "لا أقسام بعد. هتقدر تضيف منتجات بدون أقسام برضه." }) : /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2", children: catalog.sections.map((s) => /* @__PURE__ */ jsxs("li", { className: "inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: s.name_ar }),
        /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
          "(",
          productsBySection.get(s.id)?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setEditSection(s), className: "grid place-items-center h-5 w-5 rounded-full hover:bg-background", children: /* @__PURE__ */ jsx(Edit2, { className: "h-3 w-3" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => removeSection(s.id), className: "grid place-items-center h-5 w-5 rounded-full hover:bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }) })
      ] }, s.id)) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3 flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Boxes, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
            "المنتجات (",
            catalog.products.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setEditProduct({
          store_id: storeId,
          product_type: defaultType,
          name_ar: "",
          is_available: true,
          sort_order: catalog.products.length,
          section_id: catalog.sections[0]?.id ?? null
        }), className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
          " منتج جديد"
        ] })
      ] }),
      editProduct && /* @__PURE__ */ jsx(ProductForm, { initial: editProduct, sections: catalog.sections, onCancel: () => setEditProduct(null), onSaved: async () => {
        setEditProduct(null);
        await onReload();
      } }),
      catalog.products.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Boxes, title: "لا توجد منتجات بعد", hint: "اضغط منتج جديد لإضافة أول منتج." }) : /* @__PURE__ */ jsx("div", { className: "space-y-4 mt-2", children: Array.from(productsBySection.entries()).map(([sectionKey, prods]) => {
        const section = sectionKey === "_none" ? null : catalog.sections.find((s) => s.id === sectionKey);
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-muted-foreground mb-2 pb-1 border-b border-border", children: [
            section?.name_ar ?? "بدون قسم",
            " · ",
            prods.length
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: prods.map((p) => {
            const isOpen = openProductId === p.id;
            const vCount = catalog.variants.filter((v) => v.product_id === p.id).length;
            const eCount = catalog.extras.filter((e) => e.product_id === p.id).length;
            const TIcon = TYPE_LABELS[p.product_type].icon;
            return /* @__PURE__ */ jsxs("li", { className: "py-2.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-xl bg-secondary border border-border overflow-hidden shrink-0", children: p.image_url && /* @__PURE__ */ jsx("img", { src: p.image_url, alt: "", className: "h-full w-full object-cover" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm truncate", children: p.name_ar }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 text-[10px] font-bold", children: [
                      /* @__PURE__ */ jsx(TIcon, { className: "h-3 w-3" }),
                      " ",
                      TYPE_LABELS[p.product_type].label
                    ] }),
                    !p.is_available && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted text-muted-foreground px-1.5 py-0.5 text-[10px]", children: "مخفي" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground tabular-nums", dir: "ltr", children: [
                    p.price != null ? `${p.price} ${p.currency}` : "—",
                    p.compare_at_price ? ` · قبل: ${p.compare_at_price}` : "",
                    p.product_type === "clothing" && ` · ${vCount} تركيبة`,
                    p.product_type === "food" && ` · ${eCount} إضافة`
                  ] })
                ] }),
                (p.product_type === "clothing" || p.product_type === "food") && /* @__PURE__ */ jsx("button", { onClick: () => setOpenProductId(isOpen ? null : p.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary", children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => setEditProduct(p), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary", children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => removeProduct(p.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
              ] }),
              isOpen && p.product_type === "clothing" && /* @__PURE__ */ jsx(VariantsEditor, { productId: p.id, variants: catalog.variants.filter((v) => v.product_id === p.id), onReload }),
              isOpen && p.product_type === "food" && /* @__PURE__ */ jsx(ExtrasEditor, { productId: p.id, extras: catalog.extras.filter((e) => e.product_id === p.id), onReload })
            ] }, p.id);
          }) })
        ] }, sectionKey);
      }) })
    ] })
  ] });
}
function ProductForm({
  initial,
  sections,
  onCancel,
  onSaved
}) {
  const upsert = useServerFn(adminUpsertProduct);
  const {
    user
  } = useAuth();
  const [p, setP] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  async function uploadImage(file) {
    if (!user) {
      toast.error("سجل دخول أولاً");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("الحجم الأقصى 5MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/product-${Date.now()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("store-media").upload(path, file, {
        upsert: true
      });
      if (error) throw error;
      const {
        data
      } = supabase.storage.from("store-media").getPublicUrl(path);
      setP((prev) => ({
        ...prev,
        image_url: data.publicUrl
      }));
    } catch (e) {
      toast.error("فشل الرفع: " + e.message);
    } finally {
      setUploading(false);
    }
  }
  async function submit() {
    if (!p.name_ar?.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    setSaving(true);
    try {
      await upsert({
        data: {
          id: p.id,
          store_id: p.store_id,
          section_id: p.section_id ?? null,
          product_type: p.product_type ?? "general",
          name_ar: p.name_ar.trim(),
          description_ar: p.description_ar ?? null,
          price: p.price ?? null,
          compare_at_price: p.compare_at_price ?? null,
          image_url: p.image_url ?? "",
          image_url_extra: p.image_url_extra ?? "",
          stock: p.stock ?? null,
          sku: p.sku ?? null,
          is_available: p.is_available ?? true,
          sort_order: p.sort_order ?? 0
        }
      });
      toast.success("تم الحفظ");
      await onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }
  const type = p.product_type ?? "general";
  return /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-2xl border-2 border-primary/30 bg-background p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "font-display font-bold", children: p.id ? "تعديل منتج" : "منتج جديد" }),
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "grid h-8 w-8 place-items-center rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 mb-4", children: Object.keys(TYPE_LABELS).map((t) => {
      const TIcon = TYPE_LABELS[t].icon;
      const active = type === t;
      return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setP({
        ...p,
        product_type: t
      }), className: `rounded-2xl border p-3 text-right transition ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(TIcon, { className: `h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}` }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-xs", children: TYPE_LABELS[t].label })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: TYPE_LABELS[t].hint })
      ] }, t);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "اسم المنتج *", children: /* @__PURE__ */ jsx("input", { value: p.name_ar ?? "", onChange: (e) => setP({
        ...p,
        name_ar: e.target.value
      }), className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "القسم", children: /* @__PURE__ */ jsxs("select", { value: p.section_id ?? "", onChange: (e) => setP({
        ...p,
        section_id: e.target.value || null
      }), className: inputCls, children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "— بدون قسم —" }),
        sections.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name_ar }, s.id))
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: type === "clothing" ? "السعر الأساسي (يتغيّر حسب التركيبة)" : "السعر", children: /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: p.price ?? "", onChange: (e) => setP({
        ...p,
        price: e.target.value === "" ? null : Number(e.target.value)
      }), className: inputCls, dir: "ltr" }) }),
      /* @__PURE__ */ jsx(Field, { label: "السعر قبل الخصم (اختياري)", children: /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: p.compare_at_price ?? "", onChange: (e) => setP({
        ...p,
        compare_at_price: e.target.value === "" ? null : Number(e.target.value)
      }), className: inputCls, dir: "ltr" }) }),
      type === "general" && /* @__PURE__ */ jsx(Field, { label: "المخزون (اختياري)", children: /* @__PURE__ */ jsx("input", { type: "number", value: p.stock ?? "", onChange: (e) => setP({
        ...p,
        stock: e.target.value === "" ? null : Number(e.target.value)
      }), className: inputCls, dir: "ltr" }) }),
      /* @__PURE__ */ jsx(Field, { label: "صورة المنتج", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => fileRef.current?.click(), className: "relative h-20 w-20 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition bg-secondary/30 shrink-0", children: p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, className: "absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-muted-foreground", children: uploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(ImagePlus, { className: "h-5 w-5" }) }) }),
        p.image_url && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setP({
          ...p,
          image_url: null
        }), className: "text-xs text-destructive hover:underline", children: "إزالة" }),
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: async (e) => {
          const f = e.target.files?.[0];
          if (f) await uploadImage(f);
          e.target.value = "";
        } })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "الوصف", children: /* @__PURE__ */ jsx("textarea", { value: p.description_ar ?? "", onChange: (e) => setP({
        ...p,
        description_ar: e.target.value
      }), className: `${inputCls} min-h-[72px] resize-y` }) })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "mt-3 flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: p.is_available ?? true, onChange: (e) => setP({
        ...p,
        is_available: e.target.checked
      }) }),
      "ظاهر للعملاء"
    ] }),
    type !== "general" && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-[11px] text-muted-foreground bg-secondary/50 rounded-xl p-2.5", children: [
      "💡 احفظ المنتج الأول، وبعدين هتقدر تضيف ",
      type === "clothing" ? "المقاسات والألوان والمخزون" : "الإضافات الاختيارية",
      " من زر السهم بجانب المنتج."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "rounded-full border border-border px-4 py-2 text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxs("button", { onClick: submit, disabled: saving || uploading, className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        " ",
        saving ? "حفظ..." : "حفظ"
      ] })
    ] })
  ] });
}
function VariantsEditor({
  productId,
  variants,
  onReload
}) {
  const upsert = useServerFn(adminUpsertVariant);
  const del = useServerFn(adminDeleteVariant);
  const [draft, setDraft] = useState(null);
  async function save() {
    if (!draft) return;
    if (!draft.size && !draft.color) {
      toast.error("أدخل مقاس أو لون على الأقل");
      return;
    }
    try {
      await upsert({
        data: {
          id: draft.id,
          product_id: productId,
          size: draft.size ?? null,
          color: draft.color ?? null,
          color_hex: draft.color_hex || "",
          sku: draft.sku ?? null,
          price: draft.price ?? null,
          stock: draft.stock ?? 0,
          image_url: draft.image_url || "",
          sort_order: draft.sort_order ?? 0
        }
      });
      toast.success("تم الحفظ");
      setDraft(null);
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    }
  }
  async function remove(id) {
    if (!confirm("حذف التركيبة؟")) return;
    try {
      await del({
        data: {
          id
        }
      });
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mt-3 ms-14 rounded-xl bg-secondary/40 border border-border p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Ruler, { className: "h-3.5 w-3.5" }),
        " المقاسات والألوان (",
        variants.length,
        ")"
      ] }),
      !draft && /* @__PURE__ */ jsxs("button", { onClick: () => setDraft({
        stock: 0
      }), className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[11px] font-semibold", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }),
        " تركيبة"
      ] })
    ] }),
    draft && /* @__PURE__ */ jsxs("div", { className: "mb-2 grid grid-cols-2 sm:grid-cols-6 gap-2 items-end rounded-lg bg-background p-2 border border-border", children: [
      /* @__PURE__ */ jsx("input", { placeholder: "مقاس (M)", value: draft.size ?? "", onChange: (e) => setDraft({
        ...draft,
        size: e.target.value
      }), className: inputXs }),
      /* @__PURE__ */ jsx("input", { placeholder: "لون", value: draft.color ?? "", onChange: (e) => setDraft({
        ...draft,
        color: e.target.value
      }), className: inputXs }),
      /* @__PURE__ */ jsx("input", { type: "color", value: draft.color_hex ?? "#000000", onChange: (e) => setDraft({
        ...draft,
        color_hex: e.target.value
      }), className: "h-8 w-full rounded border border-border" }),
      /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", placeholder: "سعر", value: draft.price ?? "", onChange: (e) => setDraft({
        ...draft,
        price: e.target.value === "" ? null : Number(e.target.value)
      }), className: inputXs, dir: "ltr" }),
      /* @__PURE__ */ jsx("input", { type: "number", placeholder: "مخزون", value: draft.stock ?? 0, onChange: (e) => setDraft({
        ...draft,
        stock: parseInt(e.target.value) || 0
      }), className: inputXs, dir: "ltr" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx("button", { onClick: save, className: "flex-1 rounded-md bg-primary text-primary-foreground px-2 py-1 text-[11px] font-semibold", children: "حفظ" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDraft(null), className: "rounded-md border border-border px-2 py-1 text-[11px]", children: "×" })
      ] })
    ] }),
    variants.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground py-2 text-center", children: "لا توجد تركيبات بعد." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border/70", children: variants.map((v) => /* @__PURE__ */ jsxs("li", { className: "py-1.5 flex items-center gap-2 text-xs", children: [
      v.color_hex && /* @__PURE__ */ jsx("span", { className: "h-4 w-4 rounded-full border border-border shrink-0", style: {
        background: v.color_hex
      } }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: v.size || "—" }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: v.color || "" }),
      /* @__PURE__ */ jsx("span", { className: "ms-auto tabular-nums", dir: "ltr", children: v.price != null ? `${v.price}` : "—" }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground tabular-nums", children: [
        "مخزون: ",
        v.stock
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setDraft(v), className: "grid place-items-center h-6 w-6 rounded-full hover:bg-background", children: /* @__PURE__ */ jsx(Edit2, { className: "h-3 w-3" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => remove(v.id), className: "grid place-items-center h-6 w-6 rounded-full hover:bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }) })
    ] }, v.id)) })
  ] });
}
function ExtrasEditor({
  productId,
  extras,
  onReload
}) {
  const upsert = useServerFn(adminUpsertExtra);
  const del = useServerFn(adminDeleteExtra);
  const [draft, setDraft] = useState(null);
  async function save() {
    if (!draft?.name_ar?.trim()) {
      toast.error("اسم الإضافة مطلوب");
      return;
    }
    try {
      await upsert({
        data: {
          id: draft.id,
          product_id: productId,
          name_ar: draft.name_ar.trim(),
          price: draft.price ?? 0,
          is_required: draft.is_required ?? false,
          sort_order: draft.sort_order ?? 0
        }
      });
      toast.success("تم الحفظ");
      setDraft(null);
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    }
  }
  async function remove(id) {
    if (!confirm("حذف الإضافة؟")) return;
    try {
      await del({
        data: {
          id
        }
      });
      await onReload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mt-3 ms-14 rounded-xl bg-secondary/40 border border-border p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(UtensilsCrossed, { className: "h-3.5 w-3.5" }),
        " الإضافات (",
        extras.length,
        ")"
      ] }),
      !draft && /* @__PURE__ */ jsxs("button", { onClick: () => setDraft({
        price: 0
      }), className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[11px] font-semibold", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }),
        " إضافة"
      ] })
    ] }),
    draft && /* @__PURE__ */ jsxs("div", { className: "mb-2 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end rounded-lg bg-background p-2 border border-border", children: [
      /* @__PURE__ */ jsx("input", { placeholder: "اسم (جبنة إضافية)", value: draft.name_ar ?? "", onChange: (e) => setDraft({
        ...draft,
        name_ar: e.target.value
      }), className: `${inputXs} col-span-2` }),
      /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", placeholder: "سعر", value: draft.price ?? 0, onChange: (e) => setDraft({
        ...draft,
        price: Number(e.target.value) || 0
      }), className: inputXs, dir: "ltr" }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1 text-[11px]", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: draft.is_required ?? false, onChange: (e) => setDraft({
          ...draft,
          is_required: e.target.checked
        }) }),
        " إجباري"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx("button", { onClick: save, className: "flex-1 rounded-md bg-primary text-primary-foreground px-2 py-1 text-[11px] font-semibold", children: "حفظ" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDraft(null), className: "rounded-md border border-border px-2 py-1 text-[11px]", children: "×" })
      ] })
    ] }),
    extras.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground py-2 text-center", children: "لا توجد إضافات بعد." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border/70", children: extras.map((x) => /* @__PURE__ */ jsxs("li", { className: "py-1.5 flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: x.name_ar }),
      x.is_required && /* @__PURE__ */ jsx("span", { className: "text-[10px] rounded-full bg-destructive/10 text-destructive px-1.5", children: "إجباري" }),
      /* @__PURE__ */ jsxs("span", { className: "ms-auto tabular-nums", dir: "ltr", children: [
        "+",
        x.price
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setDraft(x), className: "grid place-items-center h-6 w-6 rounded-full hover:bg-background", children: /* @__PURE__ */ jsx(Edit2, { className: "h-3 w-3" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => remove(x.id), className: "grid place-items-center h-6 w-6 rounded-full hover:bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }) })
    ] }, x.id)) })
  ] });
}
const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
const inputXs = "w-full rounded-md border border-border bg-background px-2 py-1 text-xs focus:border-primary outline-none";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: label }),
    children
  ] });
}
export {
  CatalogAdmin as component
};
