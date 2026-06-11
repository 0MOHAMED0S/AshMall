import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { n as adminListOrders, w as adminUpdateOrderStatus } from "./admin.functions-B9xDw6Pq.js";
import { A as AdminPageHeader, C as Card, S as Spinner, E as EmptyState, a as StatusBadge } from "./AdminUI-P1Smhk6f.js";
import "@tanstack/react-router";
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
const STATUSES = ["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"];
function OrdersAdmin() {
  const list = useServerFn(adminListOrders);
  const setStatus = useServerFn(adminUpdateOrderStatus);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  async function reload() {
    setLoading(true);
    try {
      const r = await list({
        data: {
          status: filter
        }
      });
      setRows(r.orders ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, [filter]);
  async function changeStatus(id, next) {
    try {
      await setStatus({
        data: {
          id,
          status: next
        }
      });
      toast.success("تم التحديث");
      setRows((p) => p.map((o) => o.id === id ? {
        ...o,
        status: next
      } : o));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحديث");
    }
  }
  const tabs = [{
    key: "all",
    label: "الكل"
  }, ...STATUSES.map((s) => ({
    key: s,
    label: {
      pending: "قيد المراجعة",
      confirmed: "مؤكدة",
      preparing: "تحضير",
      delivering: "توصيل",
      completed: "مكتملة",
      cancelled: "ملغية"
    }[s]
  }))];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: ShoppingBag, eyebrow: "Orders", title: "إدارة الطلبات", description: "متابعة وتحديث حالة كل طلبات المنصة." }),
    /* @__PURE__ */ jsx(Card, { className: "p-3 mb-4", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 overflow-x-auto", children: tabs.map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(t.key), className: `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${filter === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`, children: t.label }, t.key)) }) }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: ShoppingBag, title: "لا توجد طلبات" }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((o) => /* @__PURE__ */ jsxs("li", { className: "p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx("span", { className: "font-display font-bold truncate max-w-full", children: o.stores?.name_ar ?? "—" }),
          /* @__PURE__ */ jsx(StatusBadge, { status: o.status }),
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: [
            "#",
            o.id.slice(0, 8)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 sm:truncate", children: [
          new Date(o.created_at).toLocaleString("ar-EG", {
            dateStyle: "short",
            timeStyle: "short"
          }),
          o.phone ? ` · ${o.phone}` : "",
          o.address ? ` · ${o.address}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold tabular-nums", children: [
          Number(o.total).toFixed(0),
          " ",
          o.currency
        ] }),
        /* @__PURE__ */ jsx("select", { value: o.status, onChange: (e) => changeStatus(o.id, e.target.value), className: "rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:border-primary outline-none", children: STATUSES.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: {
          pending: "قيد المراجعة",
          confirmed: "مؤكدة",
          preparing: "تحضير",
          delivering: "توصيل",
          completed: "مكتملة",
          cancelled: "ملغية"
        }[s] }, s)) })
      ] })
    ] }, o.id)) }) })
  ] });
}
export {
  OrdersAdmin as component
};
