import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { d as Route, n as listStores } from "./router-B21PHlE4.js";
import { useQuery } from "@tanstack/react-query";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { S as StoreCard } from "./StoreCard-xxkag-y8.js";
import { ArrowRight } from "lucide-react";
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
import "sonner";
import "./auth-middleware-tARyaGyP.js";
const SUBCATEGORIES = {
  fashion: [{
    key: "men",
    label: "شبابي",
    match: ["شبابي", "رجالي", "men", "man", "male"]
  }, {
    key: "women",
    label: "بناتي",
    match: ["بناتي", "حريمي", "نسائي", "women", "woman", "female"]
  }, {
    key: "kids",
    label: "أطفال",
    match: ["اطفال", "أطفال", "kids", "child", "children", "baby"]
  }]
};
function CategoryPage() {
  const {
    category
  } = Route.useLoaderData();
  const fetchStores = useServerFn(listStores);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["stores", "cat", category.slug],
    queryFn: () => fetchStores({
      data: {
        categorySlug: category.slug,
        limit: 48
      }
    })
  });
  const stores = data?.stores ?? [];
  const subs = SUBCATEGORIES[category.slug] ?? [];
  const [activeSub, setActiveSub] = useState("all");
  const filteredStores = useMemo(() => {
    if (!subs.length || activeSub === "all") return stores;
    const sub = subs.find((s) => s.key === activeSub);
    if (!sub) return stores;
    const needles = sub.match.map((m) => m.toLowerCase());
    return stores.filter((s) => {
      const hay = [...s.tags ?? [], s.name_ar ?? "", s.name_en ?? "", s.description_ar ?? ""].join(" ").toLowerCase();
      return needles.some((n) => hay.includes(n));
    });
  }, [stores, subs, activeSub]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-36 lg:pt-40 pb-20 mx-auto max-w-6xl px-5 sm:px-6", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition", children: [
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
        " الرئيسية"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary-soft border border-primary/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase shadow-[var(--shadow-chip)]", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
          " فئة"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-primary/30 via-border to-transparent" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/40" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-gradient-soft leading-[1.4] py-1", children: category.name_ar })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-muted-foreground pr-4", children: [
        "كل متاجر فئة ",
        category.name_ar,
        " الموثّقة في أشمون."
      ] }),
      subs.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveSub("all"), className: `rounded-full px-4 py-2 text-xs font-bold border transition ${activeSub === "all" ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]" : "bg-card text-foreground/80 border-border hover:border-primary/40"}`, children: "الكل" }),
        subs.map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveSub(s.key), className: `rounded-full px-4 py-2 text-xs font-bold border transition ${activeSub === s.key ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]" : "bg-card text-foreground/80 border-border hover:border-primary/40"}`, children: s.label }, s.key))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5", children: [
        isLoading && Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "glass-card rounded-3xl h-80 shimmer" }, i)),
        !isLoading && filteredStores.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full glass-card rounded-3xl p-12 text-center text-sm text-muted-foreground", children: "لا توجد متاجر في هذه الفئة بعد." }),
        filteredStores.map((s) => /* @__PURE__ */ jsx(StoreCard, { s }, s.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  CategoryPage as component
};
