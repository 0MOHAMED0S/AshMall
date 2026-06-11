import { jsx, jsxs } from "react/jsx-runtime";
import { useLocation, Outlet } from "@tanstack/react-router";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { useQuery } from "@tanstack/react-query";
import { n as listStores } from "./router-B21PHlE4.js";
import { S as StoreCard } from "./StoreCard-xxkag-y8.js";
import "lucide-react";
import "react";
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
function StoresPage() {
  const {
    pathname
  } = useLocation();
  const fetchStores = useServerFn(listStores);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["stores", "all"],
    queryFn: () => fetchStores({
      data: {
        limit: 60
      }
    })
  });
  const stores = data?.stores ?? [];
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  if (normalizedPathname !== "/stores") {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-36 sm:pt-40 pb-20 mx-auto max-w-6xl px-5 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary-soft border border-primary/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase shadow-[var(--shadow-chip)]", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
          " المتاجر"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-primary/30 via-border to-transparent" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/40" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient-soft leading-[1.4] py-1", children: "كل متاجر أشمون" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground pr-4", children: "المتاجر الموثّقة فقط بعنوان فعلي داخل أشمون." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5", children: [
        isLoading && Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "glass-card rounded-3xl h-80 shimmer" }, i)),
        !isLoading && stores.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full glass-card rounded-3xl p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "لا توجد متاجر بعد. كن أوّل من يسجّل!" }) }),
        stores.map((s) => /* @__PURE__ */ jsx(StoreCard, { s }, s.id))
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  StoresPage as component
};
