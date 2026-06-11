import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Megaphone, Plus, X, Save, EyeOff, Eye, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { k as adminListAds, z as adminUpsertAd, e as adminDeleteAd } from "./admin.functions-B9xDw6Pq.js";
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
function AdsAdmin() {
  const list = useServerFn(adminListAds);
  const save = useServerFn(adminUpsertAd);
  const del = useServerFn(adminDeleteAd);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  async function reload() {
    setLoading(true);
    try {
      const r = await list();
      setRows(r.ads ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function submit() {
    if (!editing?.title) {
      toast.error("العنوان مطلوب");
      return;
    }
    try {
      await save({
        data: {
          id: editing.id,
          title: editing.title,
          subtitle: editing.subtitle ?? null,
          image_url: editing.image_url ?? null,
          link: editing.link ?? null,
          sort_order: editing.sort_order ?? 0,
          active: editing.active ?? true
        }
      });
      toast.success("تم الحفظ");
      setEditing(null);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    }
  }
  async function toggleActive(ad) {
    try {
      await save({
        data: {
          id: ad.id,
          title: ad.title,
          subtitle: ad.subtitle,
          image_url: ad.image_url,
          link: ad.link,
          sort_order: ad.sort_order,
          active: !ad.active
        }
      });
      setRows((p) => p.map((a) => a.id === ad.id ? {
        ...a,
        active: !a.active
      } : a));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل");
    }
  }
  async function remove(id) {
    if (!confirm("حذف الإعلان؟")) return;
    try {
      await del({
        data: {
          id
        }
      });
      toast.success("تم الحذف");
      setRows((p) => p.filter((a) => a.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Megaphone, eyebrow: "Ads", title: "إدارة الإعلانات", description: "بنرات الإعلانات على الصفحة الرئيسية.", actions: /* @__PURE__ */ jsxs("button", { onClick: () => setEditing({
      title: "",
      subtitle: "",
      image_url: "",
      link: "",
      sort_order: 0,
      active: true
    }), className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-95 transition", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " إعلان جديد"
    ] }) }),
    editing && /* @__PURE__ */ jsxs(Card, { className: "p-5 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display font-bold", children: editing.id ? "تعديل الإعلان" : "إعلان جديد" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(null), className: "grid h-8 w-8 place-items-center rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "العنوان *", children: /* @__PURE__ */ jsx("input", { value: editing.title ?? "", onChange: (e) => setEditing({
          ...editing,
          title: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "العنوان الفرعي", children: /* @__PURE__ */ jsx("input", { value: editing.subtitle ?? "", onChange: (e) => setEditing({
          ...editing,
          subtitle: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "رابط الصورة (URL)", children: /* @__PURE__ */ jsx("input", { value: editing.image_url ?? "", onChange: (e) => setEditing({
          ...editing,
          image_url: e.target.value
        }), className: inputCls, dir: "ltr", placeholder: "https://..." }) }),
        /* @__PURE__ */ jsx(Field, { label: "الرابط عند الضغط", children: /* @__PURE__ */ jsx("input", { value: editing.link ?? "", onChange: (e) => setEditing({
          ...editing,
          link: e.target.value
        }), className: inputCls, dir: "ltr", placeholder: "/stores/..." }) }),
        /* @__PURE__ */ jsx(Field, { label: "ترتيب", children: /* @__PURE__ */ jsx("input", { type: "number", value: editing.sort_order ?? 0, onChange: (e) => setEditing({
          ...editing,
          sort_order: parseInt(e.target.value) || 0
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "الحالة", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: editing.active ?? true, onChange: (e) => setEditing({
            ...editing,
            active: e.target.checked
          }) }),
          " نشط"
        ] }) })
      ] }),
      editing.image_url && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-2xl overflow-hidden border border-border h-32", children: /* @__PURE__ */ jsx("img", { src: editing.image_url, alt: "", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(null), className: "rounded-full border border-border px-4 py-2 text-sm", children: "إلغاء" }),
        /* @__PURE__ */ jsxs("button", { onClick: submit, className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          " حفظ"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Megaphone, title: "لا توجد إعلانات بعد" }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((a) => /* @__PURE__ */ jsxs("li", { className: "p-3 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-24 rounded-xl bg-secondary overflow-hidden shrink-0", children: a.image_url ? /* @__PURE__ */ jsx("img", { src: a.image_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "h-full w-full grid place-items-center text-muted-foreground", children: /* @__PURE__ */ jsx(Megaphone, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold truncate", children: a.title }),
          a.subtitle && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: a.subtitle }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "ترتيب ",
              a.sort_order
            ] }),
            a.active ? /* @__PURE__ */ jsx("span", { className: "text-emerald-600", children: "● نشط" }) : /* @__PURE__ */ jsx("span", { children: "● موقوف" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 w-full sm:w-auto justify-end", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => toggleActive(a), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition", "aria-label": a.active ? "إيقاف" : "تفعيل", children: a.active ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(a), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition", children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => remove(a.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, a.id)) }) })
  ] });
}
const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: label }),
    children
  ] });
}
export {
  AdsAdmin as component
};
