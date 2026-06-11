import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { LayoutDashboard, Wallet, ShoppingBag, Users, Store, Clock, CheckCircle2, Package, Tag, Megaphone, Star, TrendingUp, Trophy, ArrowLeft } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { t as adminOverview, a as adminAnalytics } from "./admin.functions-B9xDw6Pq.js";
import { S as Spinner, A as AdminPageHeader, C as Card, a as StatusBadge } from "./AdminUI-P1Smhk6f.js";
import "./router-B21PHlE4.js";
import "@tanstack/react-query";
import "sonner";
import "./client-1xsKmu53.js";
import "@supabase/supabase-js";
import "./server-Dxshj7Uq.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-tARyaGyP.js";
const STATUS_LABEL = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  preparing: "تحضير",
  delivering: "توصيل",
  completed: "مكتمل",
  cancelled: "ملغي"
};
const STATUS_COLORS = ["#f59e0b", "#3b82f6", "#a855f7", "#6366f1", "#10b981", "#ef4444"];
function OverviewPage() {
  const fetchOv = useServerFn(adminOverview);
  const fetchAn = useServerFn(adminAnalytics);
  const [data, setData] = useState(null);
  const [an, setAn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(14);
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOv(), fetchAn({
      data: {
        days: range
      }
    })]).then(([o, a]) => {
      setData(o);
      setAn(a);
    }).finally(() => setLoading(false));
  }, [fetchOv, fetchAn, range]);
  if (loading || !data || !an) return /* @__PURE__ */ jsx(Spinner, { label: "جارٍ التحميل" });
  const c = data.counts;
  const statusData = Object.entries(an.statusCounts).map(([k, v]) => ({
    name: STATUS_LABEL[k] ?? k,
    value: v
  }));
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: LayoutDashboard, eyebrow: "Overview", title: "نظرة عامة", description: "ملخص لحظي وتحليلات لكل عمليات المنصة.", actions: /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-full bg-secondary p-1 text-xs", children: [7, 14, 30].map((d) => /* @__PURE__ */ jsxs("button", { onClick: () => setRange(d), className: `px-3 py-1.5 rounded-full font-medium transition ${range === d ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: [
      d,
      " يوم"
    ] }, d)) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [
      /* @__PURE__ */ jsx(Stat, { icon: Wallet, label: "إجمالي المبيعات", value: `${data.revenue.toFixed(0)} EGP`, accent: true }),
      /* @__PURE__ */ jsx(Stat, { icon: ShoppingBag, label: "الطلبات", value: c.orders }),
      /* @__PURE__ */ jsx(Stat, { icon: Users, label: "المستخدمون", value: c.users }),
      /* @__PURE__ */ jsx(Stat, { icon: Store, label: "المتاجر", value: c.stores })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6", children: [
      /* @__PURE__ */ jsx(MiniStat, { icon: Clock, label: "قيد المراجعة", value: c.pending, tone: "amber" }),
      /* @__PURE__ */ jsx(MiniStat, { icon: CheckCircle2, label: "موثّقة", value: c.approved, tone: "emerald" }),
      /* @__PURE__ */ jsx(MiniStat, { icon: Package, label: "منتجات", value: c.products }),
      /* @__PURE__ */ jsx(MiniStat, { icon: Tag, label: "فئات", value: c.categories }),
      /* @__PURE__ */ jsx(MiniStat, { icon: Megaphone, label: "إعلانات", value: c.ads }),
      /* @__PURE__ */ jsx(MiniStat, { icon: Star, label: "تقييمات", value: c.reviews })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4 lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-base font-bold inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
            " الإيرادات خلال آخر ",
            range,
            " يوم"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground tabular-nums", children: [
            an.totals.revenue.toFixed(0),
            " EGP · ",
            an.totals.orders,
            " طلب"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-56 sm:h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: an.series, margin: {
          top: 5,
          right: 8,
          left: -16,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "rev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "hsl(var(--primary, 240 80% 60%))", stopOpacity: 0.45 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "hsl(var(--primary, 240 80% 60%))", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border, 0 0% 90%))", opacity: 0.3 }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tickFormatter: (d) => d.slice(5), fontSize: 10, stroke: "currentColor", opacity: 0.6 }),
          /* @__PURE__ */ jsx(YAxis, { fontSize: 10, stroke: "currentColor", opacity: 0.6 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: 12
          } }),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "var(--primary)", fill: "url(#rev)", strokeWidth: 2, name: "الإيراد" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-base font-bold mb-3 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4 text-primary" }),
          " حالات الطلبات"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-56 sm:h-64", children: statusData.length === 0 ? /* @__PURE__ */ jsx("div", { className: "h-full grid place-items-center text-sm text-muted-foreground", children: "لا توجد بيانات" }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: statusData, dataKey: "value", nameKey: "name", innerRadius: 45, outerRadius: 75, paddingAngle: 2, children: statusData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: STATUS_COLORS[i % STATUS_COLORS.length] }, i)) }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: 12
          } }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
            fontSize: 10
          } })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-base font-bold mb-3 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-primary" }),
          " مستخدمون جدد (",
          an.totals.newUsers,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-48", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: an.series, margin: {
          top: 5,
          right: 8,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.3 }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tickFormatter: (d) => d.slice(5), fontSize: 10, stroke: "currentColor", opacity: 0.6 }),
          /* @__PURE__ */ jsx(YAxis, { fontSize: 10, stroke: "currentColor", opacity: 0.6, allowDecimals: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: 12
          } }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "users", fill: "var(--primary)", radius: [6, 6, 0, 0], name: "مستخدمون" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-base font-bold mb-3 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-primary" }),
          " أفضل المتاجر"
        ] }),
        an.topStores.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-10 text-sm text-muted-foreground text-center", children: "لا توجد مبيعات بعد." }) : /* @__PURE__ */ jsx("ol", { className: "space-y-2", children: an.topStores.map((s, i) => {
          const max = an.topStores[0].revenue || 1;
          const pct = Math.max(6, Math.round(s.revenue / max * 100));
          return /* @__PURE__ */ jsxs("li", { className: "rounded-xl border border-border bg-background/40 p-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-6 w-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold", children: i + 1 }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm truncate", children: s.name })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold tabular-nums", children: [
                s.revenue.toFixed(0),
                " EGP"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-l from-primary to-primary/40", style: {
              width: `${pct}%`
            } }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[10px] text-muted-foreground", children: [
              s.orders,
              " طلب"
            ] })
          ] }, i);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-lg font-bold inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
            " آخر الطلبات"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/admin/orders", className: "text-xs text-primary inline-flex items-center gap-1 hover:underline", children: [
            "عرض الكل ",
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3 w-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          data.recentOrders.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground text-center py-6", children: "لا توجد طلبات بعد." }),
          data.recentOrders.map((o) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold truncate", children: o.stores?.name_ar ?? "—" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground tabular-nums", children: new Date(o.created_at).toLocaleString("ar-EG", {
                dateStyle: "short",
                timeStyle: "short"
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx(StatusBadge, { status: o.status }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold tabular-nums", children: [
                Number(o.total).toFixed(0),
                " ",
                o.currency
              ] })
            ] })
          ] }, o.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-lg font-bold inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Store, { className: "h-4 w-4 text-primary" }),
            " أحدث المتاجر"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/admin/stores", className: "text-xs text-primary inline-flex items-center gap-1 hover:underline", children: [
            "إدارة ",
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3 w-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          data.recentStores.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground text-center py-6", children: "لا توجد متاجر بعد." }),
          data.recentStores.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold truncate", children: s.name_ar }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground tabular-nums", children: new Date(s.created_at).toLocaleDateString("ar-EG") })
            ] }),
            /* @__PURE__ */ jsx(StatusBadge, { status: s.status })
          ] }, s.id))
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-2xl border p-4 ${accent ? "border-primary/30 bg-gradient-to-bl from-primary/10 to-transparent" : "border-border bg-card"}`, style: {
    boxShadow: "0 8px 24px -16px color-mix(in oklab, var(--foreground) 14%, transparent)"
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground text-[11px]", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: label }),
      /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${accent ? "text-primary" : ""}` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 font-display text-xl sm:text-3xl font-extrabold tabular-nums", children: value })
  ] });
}
function MiniStat({
  icon: Icon,
  label,
  value,
  tone
}) {
  const toneCls = tone === "amber" ? "text-amber-600" : tone === "emerald" ? "text-emerald-600" : "text-primary";
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-[11px]", children: [
      /* @__PURE__ */ jsx(Icon, { className: `h-3.5 w-3.5 ${toneCls}` }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-1.5 font-display text-xl font-extrabold tabular-nums", children: value })
  ] });
}
export {
  OverviewPage as component
};
