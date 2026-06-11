import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { N as Nav, b as bumpBadges } from "./Nav-C1MbaG3s.js";
import { useState, useEffect, useMemo } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { l as listFavorites, t as toggleFavorite } from "./favorites.functions-CaMhxQwS.js";
import { m as listProductsByStore } from "./router-B21PHlE4.js";
import { u as useCartAdd } from "./use-cart-add-B9MCEUQH.js";
import { ArrowRight, Store, ShoppingBag, Trash2, Star, MapPin, ChevronLeft, Heart, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import "zod";
import "./server-Dxshj7Uq.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./client-1xsKmu53.js";
import "@supabase/supabase-js";
import "./auth-middleware-tARyaGyP.js";
import "@tanstack/react-query";
import "./cart.functions-dSYgTWmf.js";
function FavoritesPage() {
  const fetchAll = useServerFn(listFavorites);
  const toggle = useServerFn(toggleFavorite);
  const fetchProducts = useServerFn(listProductsByStore);
  const addToCartGuarded = useCartAdd();
  const navigate = useNavigate();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [productsByStore, setProductsByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [justAdded, setJustAdded] = useState(null);
  const [tab, setTab] = useState("stores");
  useEffect(() => {
    void reload();
  }, []);
  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      const favs = r.favorites ?? [];
      setRows(favs);
      const results = await Promise.all(favs.filter((f) => f.stores).map(async (f) => {
        try {
          const res = await fetchProducts({
            data: {
              storeId: f.store_id
            }
          });
          return [f.store_id, res.products ?? []];
        } catch {
          return [f.store_id, []];
        }
      }));
      setProductsByStore(Object.fromEntries(results));
    } finally {
      setLoading(false);
    }
  }
  const stores = useMemo(() => rows.map((r) => r.stores).filter(Boolean), [rows]);
  const allProducts = useMemo(() => stores.flatMap((s) => (productsByStore[s.id] ?? []).map((p) => ({
    p,
    s
  }))), [stores, productsByStore]);
  const productsCount = allProducts.length;
  const storesCount = stores.length;
  async function removeStore(storeId) {
    try {
      await toggle({
        data: {
          store_id: storeId
        }
      });
      bumpBadges();
      setRows((p) => p.filter((r) => r.store_id !== storeId));
      toast.success("أُزيل المتجر من المفضلة");
    } catch {
      toast.error("حدث خطأ");
    }
  }
  function rememberBack(storeId) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cart:back", `/favorites#store-${storeId}`);
    }
  }
  async function addProductToCart(p, storeId) {
    if (!p.is_available) {
      toast.error("المنتج غير متاح حالياً");
      return;
    }
    setAdding(p.id);
    try {
      await addToCartGuarded({
        store_id: storeId,
        name: p.name_ar,
        quantity: 1,
        price: p.price ?? void 0
      });
      rememberBack(storeId);
      setJustAdded(p.id);
      window.setTimeout(() => setJustAdded((cur) => cur === p.id ? null : cur), 4e3);
      toast.success(`أُضيف "${p.name_ar}" للسلة 🛒`, {
        action: {
          label: "عرض السلة",
          onClick: () => navigate({
            to: "/cart"
          })
        }
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر الإضافة");
    } finally {
      setAdding(null);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-36 sm:pt-44 pb-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6", children: [
      /* @__PURE__ */ jsx("header", { className: "relative mb-6 sm:mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "font-display font-extrabold tracking-tight text-2xl sm:text-4xl text-foreground", children: "المفضلة" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs sm:text-sm text-muted-foreground", children: "مساحتك المختارة بعناية." })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => router.history.back(), "aria-label": "رجوع", className: "shrink-0 grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card border border-border hover:border-primary/40 hover:text-primary transition active:scale-95", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "المتاجر", value: loading ? "…" : storesCount.toLocaleString("ar-EG"), tone: "teal", icon: /* @__PURE__ */ jsx(Store, { className: "h-5 w-5" }), active: tab === "stores", onClick: () => setTab("stores") }),
        /* @__PURE__ */ jsx(StatCard, { label: "المنتجات", value: loading ? "…" : productsCount.toLocaleString("ar-EG"), tone: "amber", icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5" }), active: tab === "products", onClick: () => setTab("products") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 sm:mb-8 p-1.5 rounded-2xl bg-secondary/60 border border-border grid grid-cols-2 gap-1 text-sm font-bold", children: [
        /* @__PURE__ */ jsx(TabBtn, { active: tab === "stores", onClick: () => setTab("stores"), children: "المتاجر" }),
        /* @__PURE__ */ jsx(TabBtn, { active: tab === "products", onClick: () => setTab("products"), children: "المنتجات" })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-64 rounded-3xl bg-secondary/40 animate-pulse" }, i)) }) : tab === "stores" ? stores.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Store, { className: "h-7 w-7" }), title: "لا توجد متاجر مفضلة بعد", desc: "تصفّح المتاجر واضغط على ❤️ لحفظها هنا.", ctaLabel: "كل المتاجر", ctaTo: "/stores" }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: stores.map((s) => {
        const count = productsByStore[s.id]?.length ?? 0;
        return /* @__PURE__ */ jsxs("article", { id: `store-${s.id}`, className: "group relative scroll-mt-28 rounded-3xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:-translate-y-0.5", style: {
          boxShadow: "0 8px 24px -14px color-mix(in oklab, var(--foreground) 18%, transparent)"
        }, children: [
          /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
            slug: s.slug
          }, className: "block relative h-32 sm:h-36 overflow-hidden", children: [
            s.cover_url ? /* @__PURE__ */ jsx("img", { src: s.cover_url, alt: s.name_ar, loading: "lazy", className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" }),
            s.categories?.name_ar && /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold border border-border", children: s.categories.name_ar })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "-mt-8 px-4 pb-4 relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-2xl ring-2 ring-card bg-muted overflow-hidden grid place-items-center shrink-0 shadow-lg", children: s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: s.name_ar, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-bold text-primary text-lg", children: s.name_ar[0] }) }),
              /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 pb-1", children: /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
                slug: s.slug
              }, className: "block", children: /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-extrabold truncate hover:text-primary transition", children: s.name_ar }) }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => void removeStore(s.id), "aria-label": "إزالة من المفضلة", className: "shrink-0 grid place-items-center h-9 w-9 rounded-full border border-border bg-background hover:border-destructive/40 hover:text-destructive hover:bg-destructive/5 transition", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5", children: [
                /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-amber-500 text-amber-500" }),
                /* @__PURE__ */ jsx("span", { className: "tabular-nums font-bold text-foreground", children: Number(s.rating).toFixed(1) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 truncate", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
                s.address
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/60", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: [
                count,
                " منتج"
              ] }),
              /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
                slug: s.slug
              }, className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-bold hover:opacity-95 transition", children: [
                "زيارة ",
                /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" })
              ] })
            ] })
          ] })
        ] }, s.id);
      }) }) : allProducts.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Heart, { className: "h-7 w-7" }), title: "لا توجد منتجات محفوظة بعد", desc: "أضف منتجاتك المفضلة لتجدها هنا بسرعة وبشكل أنيق.", ctaLabel: "تصفّح المتاجر", ctaTo: "/stores" }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4", children: allProducts.map(({
        p,
        s
      }) => /* @__PURE__ */ jsxs("article", { className: "group relative rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:border-primary/40 transition", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/products/$id", params: {
          id: p.id
        }, className: "block relative aspect-square overflow-hidden bg-muted", children: [
          p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name_ar, loading: "lazy", className: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-muted-foreground", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-8 w-8" }) }),
          !p.is_available && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm text-xs font-bold text-destructive", children: "غير متاح" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-2.5 sm:p-3 flex flex-col gap-1.5 flex-1", children: [
          /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
            slug: s.slug
          }, className: "text-[10px] text-muted-foreground hover:text-primary truncate transition", children: s.name_ar }),
          /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-sm font-bold leading-tight line-clamp-2 min-h-[2.2em]", children: p.name_ar }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
            p.price != null ? /* @__PURE__ */ jsxs("span", { className: "text-sm font-extrabold text-primary tabular-nums", children: [
              Number(p.price).toFixed(0),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: p.currency })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "السعر عند الطلب" }),
            p.compare_at_price && p.price && p.compare_at_price > p.price && /* @__PURE__ */ jsx("span", { className: "text-[10px] line-through text-muted-foreground tabular-nums", children: Number(p.compare_at_price).toFixed(0) })
          ] }),
          justAdded === p.id ? /* @__PURE__ */ jsxs(Link, { to: "/cart", className: "mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-white py-2 text-xs font-semibold hover:bg-emerald-600 transition active:scale-[0.97]", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
            "اذهب للسلة"
          ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => void addProductToCart(p, s.id), disabled: adding === p.id || !p.is_available, className: "mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2 text-xs font-semibold hover:opacity-95 transition active:scale-[0.97] disabled:opacity-50", children: [
            adding === p.id ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
            "أضف للسلة"
          ] })
        ] })
      ] }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function StatCard({
  label,
  value,
  tone,
  icon,
  active,
  onClick
}) {
  const palette = tone === "teal" ? {
    bg: "oklch(0.95 0.04 195)",
    fg: "oklch(0.55 0.13 195)",
    ring: "oklch(0.85 0.07 195)"
  } : {
    bg: "oklch(0.96 0.06 70)",
    fg: "oklch(0.65 0.18 55)",
    ring: "oklch(0.88 0.1 65)"
  };
  return /* @__PURE__ */ jsx("button", { onClick, className: `group text-right rounded-3xl border bg-card p-4 sm:p-5 transition active:scale-[0.98] ${active ? "border-primary/50" : "border-border hover:border-primary/30"}`, style: {
    boxShadow: active ? "0 10px 24px -16px color-mix(in oklab, var(--primary) 60%, transparent)" : void 0
  }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] sm:text-xs font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 font-display text-2xl sm:text-3xl font-extrabold tabular-nums", children: value })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl shrink-0", style: {
      background: palette.bg,
      color: palette.fg,
      boxShadow: `inset 0 0 0 1px ${palette.ring}`
    }, children: icon })
  ] }) });
}
function TabBtn({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsx("button", { onClick, className: `py-2.5 rounded-xl transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children });
}
function EmptyState({
  icon,
  title,
  desc,
  ctaLabel,
  ctaTo
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-8 sm:p-14 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full grid place-items-center bg-primary/10 text-primary mb-4", children: icon }),
    /* @__PURE__ */ jsx("h2", { className: "font-display text-lg sm:text-xl font-bold", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc }),
    /* @__PURE__ */ jsx(Link, { to: ctaTo, className: "mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition", children: ctaLabel })
  ] });
}
export {
  FavoritesPage as component
};
