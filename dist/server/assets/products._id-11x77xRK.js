import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { B as BottomTabBar } from "./BottomTabBar-CDa4C_FS.js";
import { u as useCartAdd } from "./use-cart-add-B9MCEUQH.js";
import { c as Route, u as useAuth } from "./router-B21PHlE4.js";
import { toast } from "sonner";
import { ArrowRight, ImageOff, Star, ShieldCheck, Minus, Plus, ShoppingBag, Heart, Share2, BadgeCheck, MapPin } from "lucide-react";
import "./useServerFn-DL2oePlL.js";
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
import "./cart.functions-dSYgTWmf.js";
import "./auth-middleware-tARyaGyP.js";
import "@tanstack/react-query";
function ProductPage() {
  const {
    product
  } = Route.useLoaderData();
  const store = product.stores;
  const addToCartGuarded = useCartAdd();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const images = [product.image_url, product.image_url_extra].filter(Boolean);
  const discount = product.compare_at_price && product.price ? Math.round((product.compare_at_price - product.price) / product.compare_at_price * 100) : 0;
  const hue = product.id.charCodeAt(0) * 17 % 360;
  async function handleAdd() {
    if (!user) {
      navigate({
        to: "/auth",
        search: {
          redirect: window.location.pathname
        }
      });
      return;
    }
    setBusy(true);
    try {
      await addToCartGuarded({
        store_id: store.id,
        name: product.name_ar,
        quantity: qty,
        price: product.price ?? void 0
      });
      toast.success(`أُضيف ${qty} للسلة`);
    } catch (e) {
      if (e.message !== "تم الإلغاء") toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setBusy(false);
    }
  }
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name_ar,
          text: product.description_ar ?? "",
          url
        });
        return;
      } catch {
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط");
    } catch {
      toast.error("تعذّر النسخ");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-20 pb-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-foreground transition", children: "الرئيسية" }),
        /* @__PURE__ */ jsx("span", { children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/stores", className: "hover:text-foreground transition", children: "المتاجر" }),
        /* @__PURE__ */ jsx("span", { children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
          slug: store.slug
        }, className: "hover:text-foreground transition truncate max-w-[140px]", children: store.name_ar }),
        /* @__PURE__ */ jsx("span", { children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-foreground truncate max-w-[180px]", children: product.name_ar })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
        slug: store.slug
      }, className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-4", children: [
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
        " العودة إلى ",
        store.name_ar
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "relative aspect-square rounded-3xl overflow-hidden glass-card", style: {
            background: `radial-gradient(120% 90% at 30% 25%, oklch(0.95 0.02 ${hue}) 0%, oklch(0.88 0.03 ${hue}) 70%)`
          }, children: [
            images.length > 0 ? /* @__PURE__ */ jsx("img", { src: images[activeImg], alt: product.name_ar, className: "absolute inset-0 h-full w-full object-contain p-6" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsx(ImageOff, { className: "h-16 w-16 opacity-30" }) }),
            discount > 0 && /* @__PURE__ */ jsxs("span", { className: "absolute top-3 right-3 rounded-full bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold tabular-nums", children: [
              "خصم ",
              discount,
              "%"
            ] }),
            !product.is_available && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/80 grid place-items-center text-base font-bold text-destructive backdrop-blur-sm", children: "غير متوفر حالياً" })
          ] }),
          images.length > 1 && /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-4 gap-2", children: images.map((src, i) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveImg(i), className: `relative aspect-square rounded-xl overflow-hidden border-2 transition ${i === activeImg ? "border-primary" : "border-border hover:border-primary/40"}`, children: /* @__PURE__ */ jsx("img", { src, alt: "", className: "h-full w-full object-cover" }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          store.categories?.name_ar && /* @__PURE__ */ jsx(Link, { to: "/categories/$slug", params: {
            slug: store.categories.slug
          }, className: "inline-flex w-fit items-center rounded-full bg-secondary border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition mb-3", children: store.categories.name_ar }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight", children: product.name_ar }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3 flex-wrap text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
              Array.from({
                length: 5
              }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: `h-3.5 w-3.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}` }, i)),
              /* @__PURE__ */ jsxs("span", { className: "tabular-nums ms-1 text-muted-foreground text-xs", children: [
                "(",
                Math.max(3, product.order_count),
                " تقييم)"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "·" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-emerald-400", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
              " ضمان جودة"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 flex items-baseline gap-3", children: product.price != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("span", { className: "font-display text-4xl sm:text-5xl font-extrabold text-primary tabular-nums", children: [
              Number(product.price).toFixed(0),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-bold ms-1", children: "ج" })
            ] }),
            product.compare_at_price && product.compare_at_price > product.price && /* @__PURE__ */ jsxs("span", { className: "text-base line-through text-muted-foreground tabular-nums", children: [
              Number(product.compare_at_price).toFixed(0),
              " ج"
            ] })
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-base text-muted-foreground", children: "السعر عند الطلب" }) }),
          product.description_ar && /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm sm:text-base text-foreground/85 leading-relaxed", children: product.description_ar }),
          product.section && /* @__PURE__ */ jsxs("div", { className: "mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1 text-xs text-muted-foreground", children: [
            "القسم: ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: product.section })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "الكمية" }),
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center rounded-full bg-secondary/60 border border-border overflow-hidden", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setQty(Math.max(1, qty - 1)), className: "p-2.5 hover:bg-secondary transition", "aria-label": "نقص", children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("span", { className: "w-10 text-center font-display font-bold tabular-nums", children: qty }),
              /* @__PURE__ */ jsx("button", { onClick: () => setQty(Math.min(99, qty + 1)), className: "p-2.5 hover:bg-secondary transition", "aria-label": "زيادة", children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-2.5", children: [
            /* @__PURE__ */ jsxs("button", { onClick: handleAdd, disabled: !product.is_available || busy, className: "flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold transition hover:opacity-95 active:scale-[0.98] disabled:opacity-40 glow-ring", children: [
              /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4" }),
              busy ? "جارٍ الإضافة…" : "أضف للسلة"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setFav(!fav), "aria-label": "مفضلة", className: `grid place-items-center h-12 w-12 rounded-full border transition ${fav ? "bg-primary/15 border-primary/40 text-primary" : "glass hover:border-primary/40"}`, children: /* @__PURE__ */ jsx(Heart, { className: `h-5 w-5 ${fav ? "fill-current" : ""}` }) }),
            /* @__PURE__ */ jsx("button", { onClick: handleShare, "aria-label": "مشاركة", className: "grid place-items-center h-12 w-12 rounded-full glass hover:border-primary/40 transition", children: /* @__PURE__ */ jsx(Share2, { className: "h-5 w-5" }) })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
            slug: store.slug
          }, className: "mt-6 group flex items-center gap-3 rounded-2xl glass-card p-3 hover:border-primary/40 transition", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/40 grid place-items-center shrink-0", children: store.logo_url ? /* @__PURE__ */ jsx("img", { src: store.logo_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-display font-bold text-primary", children: store.name_ar.slice(0, 1) }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-display font-bold text-sm truncate", children: store.name_ar }),
                /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4 text-primary shrink-0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-primary text-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: Number(store.rating).toFixed(1) })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 truncate", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: store.address })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary transition rotate-180" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(BottomTabBar, {})
  ] });
}
export {
  ProductPage as component
};
