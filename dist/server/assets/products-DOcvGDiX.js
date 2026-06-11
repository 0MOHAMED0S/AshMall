import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Package, Search, Save, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { o as adminListProducts, x as adminUpdateProduct, h as adminDeleteProduct } from "./admin.functions-B9xDw6Pq.js";
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
function ProductsAdmin() {
  const list = useServerFn(adminListProducts);
  const upd = useServerFn(adminUpdateProduct);
  const del = useServerFn(adminDeleteProduct);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [edits, setEdits] = useState({});
  async function reload() {
    setLoading(true);
    try {
      const r = await list({
        data: {
          q: q || void 0
        }
      });
      setRows(r.products ?? []);
      setEdits({});
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function toggle(p) {
    try {
      await upd({
        data: {
          id: p.id,
          is_available: !p.is_available
        }
      });
      setRows((prev) => prev.map((r) => r.id === p.id ? {
        ...r,
        is_available: !p.is_available
      } : r));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحديث");
    }
  }
  async function save(p) {
    const e = edits[p.id];
    if (!e) return;
    try {
      await upd({
        data: {
          id: p.id,
          name_ar: e.name_ar ?? p.name_ar,
          price: e.price !== void 0 ? e.price === "" ? null : Number(e.price) : p.price
        }
      });
      toast.success("تم الحفظ");
      await reload();
    } catch (er) {
      toast.error(er instanceof Error ? er.message : "فشل الحفظ");
    }
  }
  async function remove(id) {
    if (!confirm("حذف المنتج؟")) return;
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
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Package, eyebrow: "Products", title: "إدارة المنتجات", description: "جميع المنتجات في كل المتاجر — تحكّم في السعر والتوفر والحذف." }),
    /* @__PURE__ */ jsx(Card, { className: "p-3 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter") void reload();
        }, placeholder: "ابحث بالاسم...", className: "w-full rounded-xl border border-border bg-background pr-9 pl-3 py-2 text-sm focus:border-primary outline-none" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => void reload(), className: "rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium", children: "بحث" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Package, title: "لا توجد منتجات", hint: "جرّب بحث آخر." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((p) => {
      const e = edits[p.id] ?? {};
      const dirty = e.name_ar !== void 0 || e.price !== void 0;
      return /* @__PURE__ */ jsxs("li", { className: "p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-xl bg-secondary border border-border overflow-hidden shrink-0", children: p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: "", className: "h-full w-full object-cover" }) : null }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2", children: [
          /* @__PURE__ */ jsx("input", { defaultValue: p.name_ar, onChange: (ev) => setEdits((prev) => ({
            ...prev,
            [p.id]: {
              ...prev[p.id],
              name_ar: ev.target.value
            }
          })), className: "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm focus:border-primary outline-none" }),
          /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", defaultValue: p.price ?? "", onChange: (ev) => setEdits((prev) => ({
            ...prev,
            [p.id]: {
              ...prev[p.id],
              price: ev.target.value
            }
          })), placeholder: "السعر", className: "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm focus:border-primary outline-none tabular-nums", dir: "ltr" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground col-span-full", children: [
            "المتجر: ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: p.stores?.name_ar ?? "—" }),
            /* @__PURE__ */ jsx("span", { className: "mx-2", children: "·" }),
            "الطلبات: ",
            /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: p.order_count })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          dirty && /* @__PURE__ */ jsxs("button", { onClick: () => save(p), className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }),
            " حفظ"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => toggle(p), title: p.is_available ? "إخفاء" : "إظهار", className: `grid place-items-center h-8 w-8 rounded-full border transition ${p.is_available ? "border-emerald-500/30 text-emerald-600" : "border-border text-muted-foreground"}`, children: p.is_available ? /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => remove(p.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }, p.id);
    }) }) })
  ] });
}
export {
  ProductsAdmin as component
};
