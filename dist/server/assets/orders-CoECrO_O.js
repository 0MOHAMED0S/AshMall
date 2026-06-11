import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { l as listMyOrders, c as cancelMyOrder } from "./orders.functions-BZ_Qwic7.js";
import { ClipboardList, Package, XCircle, PackageCheck, Truck, ChefHat, CheckCircle2, Clock, MapPin, Phone, X } from "lucide-react";
import { toast } from "sonner";
import "./router-B21PHlE4.js";
import "@tanstack/react-query";
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
const STATUS_META = {
  pending: {
    label: "قيد المراجعة",
    icon: Clock,
    cls: "bg-amber-500/15 text-amber-500 border-amber-500/30"
  },
  confirmed: {
    label: "مؤكَّد",
    icon: CheckCircle2,
    cls: "bg-blue-500/15 text-blue-500 border-blue-500/30"
  },
  preparing: {
    label: "قيد التحضير",
    icon: ChefHat,
    cls: "bg-orange-500/15 text-orange-500 border-orange-500/30"
  },
  delivering: {
    label: "في الطريق",
    icon: Truck,
    cls: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30"
  },
  completed: {
    label: "تم التسليم",
    icon: PackageCheck,
    cls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
  },
  cancelled: {
    label: "ملغي",
    icon: XCircle,
    cls: "bg-destructive/15 text-destructive border-destructive/30"
  }
};
function OrdersPage() {
  const fetchAll = useServerFn(listMyOrders);
  const cancel = useServerFn(cancelMyOrder);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      setOrders(r.orders ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function cancelOne(id) {
    if (!confirm("هل تريد إلغاء هذا الطلب؟")) return;
    try {
      await cancel({
        data: {
          id
        }
      });
      toast.success("تم إلغاء الطلب");
      void reload();
    } catch (e) {
      toast.error(e.message);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-36 sm:pt-40 pb-24", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-5 sm:px-6", children: [
      /* @__PURE__ */ jsxs("header", { className: "mb-10 relative", children: [
        /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute -top-16 -right-10 h-56 w-56 rounded-full blur-3xl opacity-50 pointer-events-none", style: {
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 38%, transparent), transparent)"
        } }),
        /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute -bottom-10 left-0 h-32 w-32 rounded-full blur-3xl opacity-30 pointer-events-none", style: {
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 25%, transparent), transparent)"
        } }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "relative grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl text-primary-foreground shrink-0", style: {
            background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
            boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)"
          }, children: /* @__PURE__ */ jsx(ClipboardList, { className: "h-5 w-5 sm:h-6 sm:w-6" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h1", { className: "font-display font-extrabold tracking-tight text-2xl sm:text-3xl bg-clip-text text-transparent", style: {
              lineHeight: 1.3,
              paddingBlock: "0.15em",
              backgroundImage: "linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklab, var(--primary) 80%, var(--foreground)) 100%)"
            }, children: "طلباتي" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "h-[2px] w-10 rounded-full", style: {
                background: "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 10%, transparent))"
              } }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: "My Orders" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed", children: "تابع حالة طلباتك من جميع المتاجر في مكان واحد، بتحديثات لحظية وحالة واضحة لكل طلب." })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({
        length: 3
      }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-40 rounded-3xl bg-secondary/40 animate-pulse" }, i)) }) : orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-3xl p-12 text-center", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold", children: "لا توجد طلبات بعد" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "ابدأ بتصفّح المتاجر واطلب ما تحب." }),
        /* @__PURE__ */ jsx(Link, { to: "/stores", className: "mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium", children: "تصفّح المتاجر" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: orders.map((o) => {
        const meta = STATUS_META[o.status];
        const Icon = meta.icon;
        const canCancel = o.status === "pending" || o.status === "confirmed";
        return /* @__PURE__ */ jsxs("article", { className: "glass-card rounded-3xl p-5 sm:p-6 animate-rise", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
              slug: o.store?.slug ?? ""
            }, className: "flex items-center gap-3 group", children: [
              /* @__PURE__ */ jsx("div", { className: "h-11 w-11 rounded-xl overflow-hidden bg-secondary border border-border grid place-items-center", children: o.store?.logo_url ? /* @__PURE__ */ jsx("img", { src: o.store.logo_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-display font-bold group-hover:text-primary transition", children: o.store?.name_ar ?? "متجر" }),
                /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground tabular-nums", children: [
                  "#",
                  o.id.slice(0, 8),
                  " • ",
                  new Date(o.created_at).toLocaleString("ar-EG", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border ${meta.cls}`, children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
              " ",
              meta.label
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-4 divide-y divide-border", children: o.order_items.map((it) => /* @__PURE__ */ jsxs("li", { className: "py-2.5 flex items-start gap-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium truncate", children: it.name }),
              it.notes && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: it.notes })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground tabular-nums shrink-0", children: [
              "× ",
              it.quantity,
              it.price != null && /* @__PURE__ */ jsxs("span", { className: "text-foreground", children: [
                " — ",
                (it.price * it.quantity).toFixed(2),
                " ج.م"
              ] })
            ] })
          ] }, it.id)) }),
          (o.address || o.phone) && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-border flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
            o.address && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
              o.address
            ] }),
            o.phone && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", dir: "ltr", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }),
              o.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "إجمالي الطلب" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              canCancel && /* @__PURE__ */ jsxs("button", { onClick: () => void cancelOne(o.id), className: "inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-xs text-destructive hover:border-destructive/40 transition", children: [
                /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }),
                " إلغاء"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-display text-lg font-extrabold tabular-nums text-primary", children: [
                Number(o.total).toFixed(2),
                " ",
                o.currency
              ] })
            ] })
          ] })
        ] }, o.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  OrdersPage as component
};
