import { jsx, jsxs } from "react/jsx-runtime";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { g as createSsrRpc, l as listCategoriesWithCounts, u as useAuth, n as listStores } from "./router-B21PHlE4.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { ImageIcon, Star, Plus, ShoppingBasket, Tag, Sparkles, Clock, ArrowLeft, MapPin, BadgeCheck, ShieldCheck, BarChart3, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { b as listPopularProducts, S as SectionHeader, l as listDiscountProducts, a as listFeaturedNearbyStores, c as listRecentStores, R as RecentlyViewed } from "./RecentlyViewed-CeF32dDS.js";
import { u as useCartAdd } from "./use-cart-add-B9MCEUQH.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { B as BottomTabBar } from "./BottomTabBar-CDa4C_FS.js";
import "zod";
import "./client-1xsKmu53.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "./auth-middleware-tARyaGyP.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./cart.functions-dSYgTWmf.js";
const listActiveAds = createServerFn({
  method: "GET"
}).handler(createSsrRpc("0b28afb36dfc833476f068d7822248f76a248945b7d20f31d2e85b6c5f4d1370"));
function HeroBanner() {
  const fetchAds = useServerFn(listActiveAds);
  const [ads, setAds] = useState([]);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    fetchAds().then((r) => setAds(r.ads ?? [])).catch(() => {
    });
  }, [fetchAds]);
  useEffect(() => {
    if (ads.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % ads.length), 5500);
    return () => clearInterval(t);
  }, [ads.length]);
  if (ads.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative overflow-hidden rounded-3xl bg-[#f3ede1] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5",
      style: { aspectRatio: "1080 / 540" },
      children: [
        ads.map((ad, i) => /* @__PURE__ */ jsx(
          Link,
          {
            to: ad.link ?? "/stores",
            className: `absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`,
            children: ad.image_url && /* @__PURE__ */ jsx(
              "img",
              {
                src: ad.image_url,
                alt: ad.title,
                className: "absolute inset-0 h-full w-full object-cover object-center select-none",
                draggable: false
              }
            )
          },
          ad.id
        )),
        ads.length > 1 && /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10", children: ads.map((_, i) => /* @__PURE__ */ jsx(
          "button",
          {
            "aria-label": `عرض ${i + 1}`,
            onClick: () => setIdx(i),
            className: `h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-primary/30"}`
          },
          i
        )) })
      ]
    }
  ) });
}
const offersImg = "/assets/cat-offers-B1CX5gGF.jpg";
const restaurantsImg = "/assets/cat-restaurants-DaD-5skP.jpg";
const cafesImg = "/assets/cat-cafes-DHYaB-rr.jpg";
const fashionImg = "/assets/cat-fashion-l8dbDb_B.jpg";
const pharmacyImg = "/assets/cat-pharmacy-CUVz4uuW.jpg";
const electronicsImg = "/assets/cat-electronics-CdSL3Mxn.jpg";
const beautyImg = "/assets/cat-beauty-DD0vIDLW.jpg";
const giftsImg = "/assets/cat-gifts-oGr2BfhQ.jpg";
const servicesImg = "/assets/cat-services-SVKt2jmI.jpg";
const supermarketImg = "/assets/cat-supermarket-BI2OXEWL.jpg";
const homeImg = "/assets/cat-home-Czs8taq2.jpg";
const donateImg = "/assets/cat-donate-gKciuanW.jpg";
const bekiaImg = "/assets/cat-bekia-2oIaounA.jpg";
const imageBySlug = {
  restaurants: restaurantsImg,
  cafes: cafesImg,
  fashion: fashionImg,
  pharmacy: pharmacyImg,
  pharmacies: pharmacyImg,
  electronics: electronicsImg,
  beauty: beautyImg,
  gifts: giftsImg,
  services: servicesImg,
  supermarket: supermarketImg,
  "home-goods": homeImg,
  donate: donateImg,
  bekia: bekiaImg
};
const COMING_SOON = /* @__PURE__ */ new Set(["services"]);
const fallbackCats = [
  { id: "restaurants", slug: "restaurants", name_ar: "المطاعم", icon: null, count: 1 },
  { id: "cafes", slug: "cafes", name_ar: "الكافيهات", icon: null, count: 1 },
  { id: "fashion", slug: "fashion", name_ar: "الأزياء", icon: null, count: 1 },
  { id: "pharmacy", slug: "pharmacy", name_ar: "الصيدليات", icon: null, count: 1 },
  { id: "electronics", slug: "electronics", name_ar: "الإلكترونيات", icon: null, count: 1 },
  { id: "beauty", slug: "beauty", name_ar: "التجميل", icon: null, count: 1 }
];
function Categories() {
  const fetchCats = useServerFn(listCategoriesWithCounts);
  const [cats, setCats] = useState(fallbackCats);
  useEffect(() => {
    fetchCats().then((r) => {
      const list = r.categories ?? [];
      const map = /* @__PURE__ */ new Map();
      for (const c of list) {
        const key = (c.name_ar || c.slug).trim().replace(/\s+/g, " ");
        const existing = map.get(key);
        if (!existing || (c.count ?? 0) > (existing.count ?? 0)) map.set(key, c);
      }
      setCats(Array.from(map.values()));
    }).catch(() => setCats(fallbackCats));
  }, [fetchCats]);
  const scrollerRef = useRef(null);
  const dragState = useRef({ down: false, moved: false, startX: 0, startScroll: 0 });
  const onPointerDown = (e) => {
    const el = scrollerRef.current;
    if (!el || e.pointerType === "touch") return;
    dragState.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
  };
  const onPointerMove = (e) => {
    const el = scrollerRef.current;
    if (!el || !dragState.current.down) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScroll - dx;
  };
  const onPointerUp = () => {
    dragState.current.down = false;
    setTimeout(() => {
      dragState.current.moved = false;
    }, 0);
  };
  const onClickCapture = (e) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "categories", className: "mx-auto max-w-6xl px-4 sm:px-6 pt-2", children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: scrollerRef,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      className: "flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 select-none touch-pan-x cursor-grab active:cursor-grabbing",
      style: { WebkitOverflowScrolling: "touch" },
      children: [
        /* @__PURE__ */ jsxs(Link, { to: "/stores", draggable: false, className: "shrink-0 flex flex-col items-center gap-2 min-w-[76px] group", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative h-[76px] w-[76px] sm:h-[88px] sm:w-[88px] rounded-3xl overflow-hidden border-2 border-primary/40 shadow-[var(--shadow-chip)] group-hover:shadow-[var(--shadow-glow)] transition-all", children: [
            /* @__PURE__ */ jsx("div", { role: "img", "aria-label": "عروض وخصومات", className: "absolute inset-0 bg-cover bg-center group-hover:scale-105 transition pointer-events-none", style: { backgroundImage: `url(${offersImg})` } }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-1 left-1 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold px-1.5 py-0.5 shadow", children: "جديد" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] sm:text-xs font-extrabold text-center text-primary max-w-[88px] leading-tight", children: "عروض وخصومات" })
        ] }),
        cats.map((c) => {
          const img = imageBySlug[c.slug];
          const soon = COMING_SOON.has(c.slug);
          const Tag2 = soon ? "button" : "a";
          const tagProps = soon ? { type: "button", onClick: (e) => e.preventDefault() } : { href: `/categories/${c.slug}` };
          return /* @__PURE__ */ jsxs(Tag2, { ...tagProps, draggable: false, className: "shrink-0 flex flex-col items-center gap-2 group min-w-[76px] text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-[76px] w-[76px] sm:h-[88px] sm:w-[88px] rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-chip)] group-hover:border-primary/40 group-hover:shadow-[var(--shadow-soft)] transition-all", children: [
              img ? /* @__PURE__ */ jsx("div", { role: "img", "aria-label": c.name_ar, className: "absolute inset-0 bg-cover bg-center group-hover:scale-105 transition pointer-events-none", style: { backgroundImage: `url(${img})` } }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center bg-primary-soft text-primary font-display text-2xl font-extrabold", children: c.name_ar.slice(0, 1) }),
              soon && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center bg-background/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold px-2.5 py-1 shadow-[var(--shadow-glow)]", children: "قريبًا" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] sm:text-xs font-bold text-center text-foreground/90 max-w-[88px] truncate leading-tight", children: c.name_ar })
          ] }, c.id);
        })
      ]
    }
  ) });
}
function ProductCardMini({
  p,
  onAdd,
  rating = 5
}) {
  const hasDiscount = p.compare_at_price != null && (p.price ?? 0) < (p.compare_at_price ?? 0);
  const off = hasDiscount ? Math.round((p.compare_at_price ?? 0) - (p.price ?? 0)) : 0;
  return /* @__PURE__ */ jsx("div", { className: "snap-start shrink-0 w-[180px] sm:w-[210px] group", children: /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/products/$id",
      params: { id: p.id },
      className: "relative block aspect-[3/4] rounded-[26px] overflow-hidden bg-card border border-border/70 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] transition-all duration-500 group-hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.28)] group-hover:-translate-y-1",
      children: [
        p.image_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: p.image_url,
            alt: p.name_ar,
            className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center bg-secondary/40", children: /* @__PURE__ */ jsx(ImageIcon, { className: "h-10 w-10 text-muted-foreground/40" }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-3 inset-x-3 z-10 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold tabular-nums text-neutral-900 shadow-sm", children: [
            /* @__PURE__ */ jsx(Star, { className: "h-2.5 w-2.5 fill-amber-500 text-amber-500" }),
            /* @__PURE__ */ jsx("span", { children: rating.toFixed(1) })
          ] }),
          hasDiscount && /* @__PURE__ */ jsxs("div", { className: "rounded-full bg-success text-success-foreground px-2.5 py-1 text-[10px] font-bold tabular-nums shadow", children: [
            off,
            "- ج.م"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 z-10 p-3.5 text-right", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-medium text-white/70 truncate mb-0.5", children: p.store.name_ar }),
          /* @__PURE__ */ jsx("h3", { className: "text-[13px] font-bold text-white leading-snug line-clamp-2 mb-2", children: p.name_ar }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 tabular-nums", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[15px] font-black text-white tracking-tight", children: (p.price ?? 0).toFixed(2) }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-white/70", children: "ج.م" }),
              hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-white/50 line-through ms-1", children: (p.compare_at_price ?? 0).toFixed(2) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAdd?.(p);
                },
                "aria-label": "إضافة للسلة",
                className: "grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-90 transition",
                children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4", strokeWidth: 2.8 })
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function MostOrdered() {
  const fetchPop = useServerFn(listPopularProducts);
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPop().then((r) => setRows(r.products ?? [])).catch(() => {
    }).finally(() => setLoading(false));
  }, [fetchPop]);
  async function onAdd(p) {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/" } });
      return;
    }
    const row = rows.find((r) => r.id === p.id);
    if (!row) return;
    try {
      await addToCartGuarded({ store_id: row.store_id, name: row.name_ar, price: row.price ?? void 0 });
      toast.success("أُضيف للسلة");
    } catch (e) {
      if (e.message !== "تم الإلغاء") toast.error(e.message || "تعذّر الإضافة");
    }
  }
  if (!loading && rows.length === 0) return null;
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "الأكثر طلباً", icon: ShoppingBasket }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6", children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "shrink-0 w-[170px] sm:w-[200px] aspect-[3/4] rounded-3xl bg-secondary animate-pulse" }, i)) : rows.map((r) => /* @__PURE__ */ jsx(
      ProductCardMini,
      {
        p: { id: r.id, name_ar: r.name_ar, price: r.price, image_url: r.image_url, store: { slug: r.stores?.slug ?? "", name_ar: r.stores?.name_ar ?? "" } },
        onAdd
      },
      r.id
    )) })
  ] });
}
function Discounts() {
  const fetchDisc = useServerFn(listDiscountProducts);
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDisc().then((r) => setRows(r.products ?? [])).catch(() => {
    }).finally(() => setLoading(false));
  }, [fetchDisc]);
  async function onAdd(p) {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/" } });
      return;
    }
    const row = rows.find((r) => r.id === p.id);
    if (!row) return;
    try {
      await addToCartGuarded({ store_id: row.store_id, name: row.name_ar, price: row.price ?? void 0 });
      toast.success("أُضيف للسلة");
    } catch (e) {
      if (e.message !== "تم الإلغاء") toast.error(e.message || "تعذّر الإضافة");
    }
  }
  if (!loading && rows.length === 0) return null;
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 pt-10", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "خصومات وعروض", icon: Tag }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6", children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "shrink-0 w-[170px] sm:w-[200px] aspect-[3/4] rounded-3xl bg-secondary animate-pulse" }, i)) : rows.map((r) => /* @__PURE__ */ jsx(
      ProductCardMini,
      {
        p: { id: r.id, name_ar: r.name_ar, price: r.price, compare_at_price: r.compare_at_price, image_url: r.image_url, store: { slug: r.stores?.slug ?? "", name_ar: r.stores?.name_ar ?? "" } },
        onAdd
      },
      r.id
    )) })
  ] });
}
function StoreCircle({ s }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/stores/$slug",
      params: { slug: s.slug },
      className: "shrink-0 w-20 sm:w-24 flex flex-col items-center text-center group",
      children: [
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] rounded-full p-[3px] bg-gradient-to-bl from-primary to-primary-glow transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full overflow-hidden bg-card grid place-items-center", children: s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: s.name_ar, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-display text-2xl font-extrabold text-primary", children: s.name_ar.slice(0, 1) }) }) }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-[11px] font-bold truncate w-full", children: s.name_ar }),
        /* @__PURE__ */ jsxs("div", { className: "mt-0.5 inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2 py-0.5 text-[10px] tabular-nums", children: [
          Number(s.rating).toFixed(1),
          " ",
          /* @__PURE__ */ jsx(Star, { className: "h-2.5 w-2.5 fill-primary text-primary" })
        ] })
      ]
    }
  );
}
function NearbyStoresCircles() {
  const fetchFeat = useServerFn(listFeaturedNearbyStores);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFeat().then((r) => setStores(r.stores ?? [])).catch(() => {
    }).finally(() => setLoading(false));
  }, [fetchFeat]);
  if (!loading && stores.length === 0) return null;
  const loop = stores.length > 0 ? [...stores, ...stores] : [];
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 pt-10", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "متاجر مميزة قريبة منك", icon: Sparkles, href: "/stores" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex gap-4 overflow-hidden pb-2", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "shrink-0 w-20 h-28 rounded-full bg-secondary animate-pulse" }, i)) }) : /* @__PURE__ */ jsx(
      "div",
      {
        className: "group relative overflow-hidden pb-2 -mx-4 sm:-mx-6",
        style: {
          maskImage: "linear-gradient(to left, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)"
        },
        children: /* @__PURE__ */ jsx("div", { className: "flex gap-4 w-max animate-marquee-rtl px-4 sm:px-6", children: loop.map((s, i) => /* @__PURE__ */ jsx(StoreCircle, { s }, `${s.id}-${i}`)) })
      }
    )
  ] });
}
function RecentlyAdded() {
  const fetchRec = useServerFn(listRecentStores);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchRec().then((r) => setStores(r.stores ?? [])).catch(() => {
    }).finally(() => setLoading(false));
  }, [fetchRec]);
  if (!loading && stores.length === 0) return null;
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 pt-10", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "أُضيف حديثاً", icon: Sparkles, href: "/stores" }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-3 -mx-4 sm:-mx-6 px-4 sm:px-6", children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "shrink-0 w-[270px] h-[230px] rounded-3xl bg-secondary animate-pulse" }, i)) : stores.map((s) => {
      return /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: { slug: s.slug }, className: "snap-start shrink-0 w-[270px] sm:w-[290px] soft-card rounded-3xl group relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-32 bg-secondary overflow-hidden rounded-t-3xl", children: [
          s.cover_url ? /* @__PURE__ */ jsx("img", { src: s.cover_url, alt: "", className: "absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary-soft via-accent to-secondary" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-2 py-1 text-[10px] font-bold tabular-nums", children: [
            /* @__PURE__ */ jsx(Star, { className: "h-2.5 w-2.5 fill-primary text-primary" }),
            " ",
            Number(s.rating).toFixed(1)
          ] }),
          /* @__PURE__ */ jsx("div", { className: `absolute top-2 left-2 rounded-full px-2 py-1 text-[10px] font-bold ${"bg-success text-success-foreground"}`, children: "مفتوح" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-[104px] right-4 h-14 w-14 rounded-2xl bg-card border border-border grid place-items-center overflow-hidden shadow-lg z-10", children: s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: "", className: "h-full w-full object-contain p-1 bg-card" }) : /* @__PURE__ */ jsx("span", { className: "font-display text-lg font-extrabold text-primary", children: s.name_ar.slice(0, 1) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-8 pb-4 px-4", children: [
          /* @__PURE__ */ jsx("div", { className: "font-display font-bold text-[15px] truncate", children: s.name_ar }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-xs text-muted-foreground line-clamp-1", children: s.description_ar ?? s.categories?.name_ar ?? "متجر موثّق" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-2 text-[11px]", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2.5 py-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
              " 30 دقيقة"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-primary font-bold", children: [
              "زيارة ",
              /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3 w-3" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-start gap-1 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 mt-0.5 shrink-0 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: s.address })
          ] })
        ] })
      ] }, s.id);
    }) })
  ] });
}
function FeaturedStores() {
  const fetchStores = useServerFn(listStores);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchStores({ data: { limit: 6 } }).then((r) => setStores(r.stores ?? [])).catch(() => {
    }).finally(() => setLoading(false));
  }, [fetchStores]);
  return /* @__PURE__ */ jsxs("section", { id: "stores", className: "relative mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": true,
        className: "absolute -top-10 right-0 h-72 w-72 rounded-full blur-3xl opacity-40 pointer-events-none",
        style: { background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent)" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-8 sm:mb-12 flex-wrap relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "font-display font-extrabold tracking-tight text-xl sm:text-2xl bg-clip-text text-transparent",
            style: {
              lineHeight: 1.2,
              paddingBlock: "0.1em",
              backgroundImage: "linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklab, var(--primary) 80%, var(--foreground)) 100%)"
            },
            children: "متاجر مختارة بعناية"
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "grid relative place-items-center h-8 w-8 rounded-full text-primary-foreground shrink-0",
            style: {
              background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
              boxShadow: "0 10px 24px -10px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)"
            },
            children: /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/stores",
          className: "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs sm:text-sm font-medium hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition active:scale-95",
          children: [
            "كل المتاجر",
            /* @__PURE__ */ jsx("span", { className: "transition-transform group-hover:-translate-x-1", children: "←" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "-mt-6 sm:-mt-8 mb-8 sm:mb-10 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "h-[2px] w-10 rounded-full",
          style: { background: "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 10%, transparent))" }
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: "Curated Stores" }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "h-[2px] flex-1 max-w-[60px] rounded-full",
          style: { background: "linear-gradient(270deg, var(--primary), color-mix(in oklab, var(--primary) 10%, transparent))" }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5", children: loading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-80 rounded-3xl bg-secondary/30 animate-pulse" }, i)) : stores.length === 0 ? /* @__PURE__ */ jsx("div", { className: "col-span-full text-center py-12 text-sm text-muted-foreground", children: "لا توجد متاجر معتمدة بعد." }) : stores.map((s, i) => {
      const hue = Math.abs(s.slug.charCodeAt(0) * 17) % 360;
      const tag = s.is_featured ? "مميّز" : s.tags?.[0] ?? "موثّق";
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/stores/$slug",
          params: { slug: s.slug },
          className: "group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 block",
          style: { boxShadow: "var(--shadow-elevated)", transitionDelay: `${i * 30}ms` },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-44 sm:h-48 overflow-hidden", children: [
              s.cover_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: s.cover_url,
                  alt: "",
                  className: "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                }
              ) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-110",
                  style: {
                    background: `radial-gradient(120% 80% at 20% 20%, oklch(0.62 0.2 ${hue}) 0%, oklch(0.22 0.05 ${hue}) 60%, oklch(0.13 0.01 ${hue}) 100%)`
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-60" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" }),
              /* @__PURE__ */ jsxs("span", { className: "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-md px-2.5 py-1 text-[10px] tracking-wider text-foreground border border-border", children: [
                /* @__PURE__ */ jsx("span", { className: "h-1 w-1 rounded-full bg-primary animate-pulse" }),
                tag
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "w-full min-w-0 sm:flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1.5 min-w-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-[15px] sm:text-lg font-bold leading-snug break-words whitespace-normal", children: s.name_ar }),
                    /* @__PURE__ */ jsx(BadgeCheck, { className: "mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1", children: s.categories?.name_ar ?? "" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex w-fit items-center gap-1 rounded-xl bg-secondary/80 border border-border px-2 py-1 text-[11px] sm:text-xs shrink-0", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-primary text-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: Number(s.rating).toFixed(1) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 sm:mt-5 h-px ring-divider" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
                  s.rating_count,
                  " تقييم"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-semibold shadow-sm group-hover:shadow-md transition", children: [
                  "افتح المتجر",
                  /* @__PURE__ */ jsx("span", { className: "inline-block transition-transform group-hover:-translate-x-0.5", children: "←" })
                ] })
              ] })
            ] })
          ]
        },
        s.id
      );
    }) })
  ] });
}
const items = [
  { icon: ShieldCheck, title: "موثّق فقط", body: "كل متجر يُراجع يدويًا بعنوان فعلي داخل أشمون. لا متاجر إلكترونية وهمية." },
  { icon: BarChart3, title: "تحليلات ذكية", body: "إحصاءات لحظية: زيارات، تحويلات، أداء الإعلانات وسلوك العملاء." },
  { icon: Megaphone, title: "إعلانات ذكية", body: "حملات مستهدفة عبر الصفحة الرئيسية، البحث والتوصيات الذكية." }
];
function ForBusiness() {
  return /* @__PURE__ */ jsx("section", { id: "business", className: "relative overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] glass-strong p-8 sm:p-16 grain",
      style: { boxShadow: "var(--shadow-elevated)" },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute -top-32 -start-32 h-96 w-96 rounded-full blur-3xl opacity-40 animate-pulse-glow",
            style: { background: "var(--gradient-primary)" }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute -bottom-40 -end-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-25",
            style: { background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative grid lg:grid-cols-2 gap-10 sm:gap-12 items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary font-medium", children: "للشركات" }),
            /* @__PURE__ */ jsx("h2", { className: "mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient-soft", children: "ضمّ متجرك إلى المدينة الذكية." }),
            /* @__PURE__ */ jsx("p", { className: "mt-5 text-muted-foreground max-w-md leading-relaxed", children: "لوحة تحكم احترافية، اكتشاف مدعوم بالذكاء الاصطناعي، وقاعدة عملاء تعيش بالفعل في أشمون. الإعداد في دقائق — والموافقة خلال ٢٤ ساعة." }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-wrap gap-3", children: /* @__PURE__ */ jsxs(
              "a",
              {
                href: `https://wa.me/201213442141?text=${encodeURIComponent("السلام عليكم، عاوز أسجّل متجري في تطبيق آش مول وأعرف التفاصيل والأسعار. شكراً.")}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "group rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-95 transition-all glow-ring active:scale-95 inline-flex items-center gap-2",
                children: [
                  "سجّل متجرك",
                  /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 transition-transform group-hover:-translate-x-1" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: items.map(({ icon: Icon, title, body }, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "group flex gap-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-md p-5 hover:border-primary/30 hover:bg-surface/80 transition-all duration-500 hover:-translate-y-0.5",
              style: { transitionDelay: `${i * 40}ms` },
              children: [
                /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: title }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-0.5 leading-relaxed", children: body })
                ] })
              ]
            },
            title
          )) })
        ] })
      ]
    }
  ) }) });
}
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-x-hidden bg-background pb-mobile-tabbar", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-32 sm:pt-32", children: [
      /* @__PURE__ */ jsx(Categories, {}),
      /* @__PURE__ */ jsx(HeroBanner, {}),
      /* @__PURE__ */ jsx(MostOrdered, {}),
      /* @__PURE__ */ jsx(Discounts, {}),
      /* @__PURE__ */ jsx(NearbyStoresCircles, {}),
      /* @__PURE__ */ jsx(FeaturedStores, {}),
      /* @__PURE__ */ jsx(RecentlyAdded, {}),
      /* @__PURE__ */ jsx(RecentlyViewed, {}),
      /* @__PURE__ */ jsx(ForBusiness, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(BottomTabBar, {})
  ] });
}
export {
  Index as component
};
