import { jsx, jsxs } from "react/jsx-runtime";
import { useRouterState, Link, Outlet } from "@tanstack/react-router";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { u as useAuth } from "./router-B21PHlE4.js";
import { ShieldOff, Shield, LayoutDashboard, Store, Briefcase, Bike, Boxes, Package, ShoppingBag, Users, Tag, Megaphone, Send, Star, Settings } from "lucide-react";
import "react";
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
import "@tanstack/react-query";
import "sonner";
import "./auth-middleware-tARyaGyP.js";
const NAV = [{
  to: "/admin",
  label: "نظرة عامة",
  icon: LayoutDashboard,
  exact: true
}, {
  to: "/admin/stores",
  label: "المتاجر",
  icon: Store
}, {
  to: "/admin/merchants",
  label: "حسابات التجار",
  icon: Briefcase
}, {
  to: "/admin/delivery",
  label: "الدليفري",
  icon: Bike
}, {
  to: "/admin/catalog",
  label: "كتالوج المحلات",
  icon: Boxes
}, {
  to: "/admin/products",
  label: "المنتجات",
  icon: Package
}, {
  to: "/admin/orders",
  label: "الطلبات",
  icon: ShoppingBag
}, {
  to: "/admin/users",
  label: "المستخدمون",
  icon: Users
}, {
  to: "/admin/categories",
  label: "الفئات",
  icon: Tag
}, {
  to: "/admin/ads",
  label: "الإعلانات",
  icon: Megaphone
}, {
  to: "/admin/broadcast",
  label: "بث إشعار",
  icon: Send
}, {
  to: "/admin/reviews",
  label: "التقييمات",
  icon: Star
}, {
  to: "/admin/settings",
  label: "إعدادات الموقع",
  icon: Settings
}];
function AdminLayout() {
  const {
    isAdmin,
    loading
  } = useAuth();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
      /* @__PURE__ */ jsx(Nav, {}),
      /* @__PURE__ */ jsxs("main", { className: "pt-32 pb-20 mx-auto max-w-md px-5 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive", children: /* @__PURE__ */ jsx(ShieldOff, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("h1", { className: "mt-5 font-display text-2xl font-bold", children: "غير مصرّح بالوصول" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "هذه الصفحة للمشرفين فقط." }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium", children: "العودة للرئيسية" })
      ] })
    ] });
  }
  const isActive = (to, exact) => exact ? pathname === to || pathname === to + "/" : pathname.startsWith(to);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("div", { className: "pt-24 sm:pt-32 lg:pt-40 pb-16 lg:pb-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-6", children: [
      /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-28 lg:self-start mb-3 lg:mb-0", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl lg:rounded-3xl border border-border bg-card overflow-hidden", style: {
        boxShadow: "0 10px 30px -16px color-mix(in oklab, var(--foreground) 14%, transparent)"
      }, children: [
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block p-5 bg-gradient-to-bl from-primary/10 to-transparent border-b border-border/60", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shrink-0", style: {
            background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))"
          }, children: /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: "Admin" }),
            /* @__PURE__ */ jsx("div", { className: "font-display text-base font-extrabold truncate", children: "لوحة الإدارة" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:hidden flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-gradient-to-bl from-primary/10 to-transparent", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-7 w-7 place-items-center rounded-lg text-primary-foreground shrink-0", style: {
            background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))"
          }, children: /* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsx("div", { className: "font-display text-sm font-extrabold truncate", children: "لوحة الإدارة" })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "p-1.5 lg:p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar", children: NAV.map((item) => {
          const active = isActive(item.to, item.exact);
          const Icon = item.icon;
          return /* @__PURE__ */ jsxs(Link, { to: item.to, className: `shrink-0 lg:shrink inline-flex items-center gap-1.5 lg:gap-2.5 rounded-lg lg:rounded-xl px-2.5 lg:px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-medium transition whitespace-nowrap ${active ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_color-mix(in_oklab,var(--primary)_60%,transparent)]" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: item.label })
          ] }, item.to);
        }) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "mt-3 lg:mt-0 min-w-0", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] }) })
  ] });
}
export {
  AdminLayout as component
};
