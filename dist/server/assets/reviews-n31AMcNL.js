import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { p as adminListReviews, i as adminDeleteReview } from "./admin.functions-B9xDw6Pq.js";
import { A as AdminPageHeader, C as Card, S as Spinner, E as EmptyState } from "./AdminUI-P1Smhk6f.js";
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
function ReviewsAdmin() {
  const list = useServerFn(adminListReviews);
  const del = useServerFn(adminDeleteReview);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  async function reload() {
    setLoading(true);
    try {
      const r = await list();
      setRows(r.reviews ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function remove(id) {
    if (!confirm("حذف التقييم؟")) return;
    try {
      await del({
        data: {
          id
        }
      });
      setRows((p) => p.filter((r) => r.id !== id));
      toast.success("تم الحذف");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Star, eyebrow: "Reviews", title: "إدارة التقييمات", description: "مراجعة وحذف التقييمات المخالفة." }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Star, title: "لا توجد تقييمات" }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((r) => /* @__PURE__ */ jsxs("li", { className: "p-4 flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold tabular-nums shrink-0", children: r.rating }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: r.stores?.name_ar ?? "—" }),
        r.comment && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-3", children: r.comment }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-[10px] text-muted-foreground tabular-nums", children: new Date(r.created_at).toLocaleString("ar-EG", {
          dateStyle: "short",
          timeStyle: "short"
        }) })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => remove(r.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
    ] }, r.id)) }) })
  ] });
}
export {
  ReviewsAdmin as component
};
