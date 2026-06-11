import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { ChevronLeft, Clock4, Star } from "lucide-react";
import { g as createSsrRpc } from "./router-B21PHlE4.js";
import { z } from "zod";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
const listPopularProducts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1f5f256e0d8083b161df4663cdedf6327bf5f10d38ca14d0a1e45c967bf60e55"));
const listDiscountProducts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("cdbad617f7babe1009cf1458c81d2e5d883fdf928195933e3909136eacd9ad87"));
const listFeaturedNearbyStores = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1a4b43bcd61dce3ff71704a09ed8a697bc102b9662df3f6552a0d82a3e8d60f9"));
const listRecentStores = createServerFn({
  method: "GET"
}).handler(createSsrRpc("26ce8044fbf2d5dd1dcad5d9ea4595d5825d39de12a5fc08d8553087f6d25cef"));
const getStoresByIds = createServerFn({
  method: "POST"
}).inputValidator((i) => z.object({
  ids: z.array(z.string().uuid()).max(20)
}).parse(i)).handler(createSsrRpc("02d4e7a519bd36241a8e3b58bf299a44228812a5ce879db65dbfe84571dfac79"));
function SectionHeader({
  title,
  icon: Icon,
  href,
  hrefLabel = "عرض المزيد",
  extra
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 mb-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 rounded-full bg-primary-soft border border-primary/15 px-3.5 py-1.5 shadow-[var(--shadow-chip)]", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsx("span", { className: "font-display text-sm font-extrabold text-foreground", children: title })
    ] }),
    extra ?? (href && /* @__PURE__ */ jsxs(Link, { to: href, className: "inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:gap-1.5 transition-all", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
      " ",
      hrefLabel
    ] }))
  ] });
}
const KEY = "ash:recentStores";
function recordRecentStore(id) {
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const next = [id, ...arr.filter((x) => x !== id)].slice(0, 10);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
  }
}
function RecentlyViewed() {
  const fetchByIds = useServerFn(getStoresByIds);
  const [stores, setStores] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const ids = raw ? JSON.parse(raw) : [];
      if (ids.length === 0) {
        setReady(true);
        return;
      }
      fetchByIds({ data: { ids } }).then((r) => setStores(r.stores ?? [])).catch(() => {
      }).finally(() => setReady(true));
    } catch {
      setReady(true);
    }
  }, [fetchByIds]);
  if (!ready || stores.length === 0) return null;
  return /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 pt-10", children: [
    /* @__PURE__ */ jsx(SectionHeader, { title: "آخر ما شاهدته", icon: Clock4 }),
    /* @__PURE__ */ jsx("p", { className: "-mt-2 mb-4 text-xs text-muted-foreground", children: "متاجر رجعت لك بناءً على آخر العناصر التي فتحتها أو شاهدتها مؤخرًا." }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6", children: stores.map((s) => /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: { slug: s.slug }, className: "snap-start shrink-0 w-[160px] sm:w-[180px] soft-card overflow-hidden rounded-3xl group", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-square bg-secondary overflow-hidden", children: [
        s.cover_url || s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.cover_url ?? s.logo_url, alt: s.name_ar, className: "absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center bg-primary-soft", children: /* @__PURE__ */ jsx("span", { className: "font-display text-3xl font-extrabold text-primary", children: s.name_ar.slice(0, 1) }) }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-2 py-0.5 text-[10px] font-bold", children: [
          /* @__PURE__ */ jsx(Clock4, { className: "h-2.5 w-2.5 text-primary" }),
          " شوهد مؤخراً"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur px-2 py-0.5 text-[10px] font-bold tabular-nums", children: [
          Number(s.rating).toFixed(1),
          " ",
          /* @__PURE__ */ jsx(Star, { className: "h-2.5 w-2.5 fill-primary text-primary" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-3 py-3 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold text-[13px] truncate", children: s.name_ar }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: s.categories?.name_ar ?? "متجر" })
      ] })
    ] }, s.id)) })
  ] });
}
export {
  RecentlyViewed as R,
  SectionHeader as S,
  listFeaturedNearbyStores as a,
  listPopularProducts as b,
  listRecentStores as c,
  listDiscountProducts as l,
  recordRecentStore as r
};
