import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Store, Search, Star, CheckCircle2, XCircle, ShieldOff, RotateCcw, KeyRound, ExternalLink, Trash2, X, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { q as adminListStores, y as adminUpdateStore, j as adminDeleteStore } from "./admin.functions-B9xDw6Pq.js";
import { b as adminGetStoreCredentials, a as adminCreateMerchantForStore } from "./merchant.functions-d0jMkpQL.js";
import { A as AdminPageHeader, C as Card, S as Spinner, E as EmptyState, a as StatusBadge } from "./AdminUI-P1Smhk6f.js";
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
function StoresAdmin() {
  const list = useServerFn(adminListStores);
  const update = useServerFn(adminUpdateStore);
  const del = useServerFn(adminDeleteStore);
  const [credTarget, setCredTarget] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  async function reload() {
    setLoading(true);
    try {
      const r = await list({
        data: {
          status,
          q
        }
      });
      setRows(r.stores ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, [status]);
  async function setStoreStatus(id, next) {
    try {
      await update({
        data: {
          id,
          status: next
        }
      });
      toast.success("تم التحديث");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحديث");
    }
  }
  async function toggleFeature(id, is_featured) {
    try {
      await update({
        data: {
          id,
          is_featured
        }
      });
      toast.success(is_featured ? "تمت الإضافة للمميزة" : "تمت الإزالة");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحديث");
    }
  }
  async function removeStore(id) {
    if (!confirm("حذف المتجر نهائياً؟ لا يمكن التراجع.")) return;
    try {
      await del({
        data: {
          id
        }
      });
      toast.success("تم الحذف");
      setRows((p) => p.filter((s) => s.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  const tabs = [{
    key: "all",
    label: "الكل"
  }, {
    key: "pending",
    label: "قيد المراجعة"
  }, {
    key: "approved",
    label: "موثّقة"
  }, {
    key: "rejected",
    label: "مرفوضة"
  }, {
    key: "suspended",
    label: "معلّقة"
  }];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Store, eyebrow: "Stores", title: "إدارة المتاجر", description: "مراجعة وتوثيق وإيقاف وتمييز المتاجر." }),
    /* @__PURE__ */ jsx(Card, { className: "p-3 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-1 overflow-x-auto", children: tabs.map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setStatus(t.key), className: `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${status === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`, children: t.label }, t.key)) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        void reload();
      }, className: "ms-auto relative flex-1 min-w-[200px] max-w-sm", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "بحث بالاسم...", className: "w-full rounded-full bg-background border border-border ps-4 pe-9 py-2 text-sm focus:border-primary outline-none" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Store, title: "لا توجد متاجر", hint: "جرّب تغيير الفلتر أو البحث." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((s) => /* @__PURE__ */ jsxs("li", { className: "p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
            slug: s.slug
          }, className: "font-display font-bold hover:text-primary truncate max-w-full", children: s.name_ar }),
          /* @__PURE__ */ jsx(StatusBadge, { status: s.status }),
          s.is_featured && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold", children: [
            /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-primary" }),
            " مميز"
          ] }),
          s.categories?.name_ar && /* @__PURE__ */ jsx("span", { className: "text-[10px] rounded-full bg-secondary border border-border text-muted-foreground px-2 py-0.5", children: s.categories.name_ar })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 sm:truncate", children: [
          s.address,
          s.phone ? ` · ${s.phone}` : "",
          " · ⭐ ",
          Number(s.rating).toFixed(1),
          " (",
          s.rating_count,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 w-full sm:w-auto", children: [
        s.status !== "approved" && /* @__PURE__ */ jsxs("button", { onClick: () => setStoreStatus(s.id, "approved"), className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-3 py-1.5 text-xs hover:bg-emerald-500/25 transition", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }),
          " توثيق"
        ] }),
        s.status === "pending" && /* @__PURE__ */ jsxs("button", { onClick: () => setStoreStatus(s.id, "rejected"), className: "inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30 px-3 py-1.5 text-xs hover:bg-destructive/20 transition", children: [
          /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5" }),
          " رفض"
        ] }),
        s.status === "approved" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => toggleFeature(s.id, !s.is_featured), className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs hover:bg-secondary/80 transition", children: [
            /* @__PURE__ */ jsx(Star, { className: `h-3.5 w-3.5 ${s.is_featured ? "fill-primary text-primary" : ""}` }),
            s.is_featured ? "إلغاء التمييز" : "تمييز"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setStoreStatus(s.id, "suspended"), className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 px-3 py-1.5 text-xs hover:bg-amber-500/20 transition", children: [
            /* @__PURE__ */ jsx(ShieldOff, { className: "h-3.5 w-3.5" }),
            " إيقاف"
          ] })
        ] }),
        (s.status === "rejected" || s.status === "suspended") && /* @__PURE__ */ jsxs("button", { onClick: () => setStoreStatus(s.id, "pending"), className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs hover:bg-secondary/80 transition", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
          " إعادة للمراجعة"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setCredTarget(s), className: "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 text-xs hover:bg-primary/20 transition", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "h-3.5 w-3.5" }),
          " بيانات دخول التاجر"
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
          slug: s.slug
        }, className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition", "aria-label": "فتح", children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => removeStore(s.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition", "aria-label": "حذف", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, s.id)) }) }),
    credTarget && /* @__PURE__ */ jsx(StoreCredentialsModal, { store: credTarget, onClose: () => setCredTarget(null) })
  ] });
}
function StoreCredentialsModal({
  store,
  onClose
}) {
  const get = useServerFn(adminGetStoreCredentials);
  const create = useServerFn(adminCreateMerchantForStore);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [creds, setCreds] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const r = await get({
          data: {
            store_id: store.id
          }
        });
        if (r.credentials) setCreds({
          email: r.credentials.email,
          password: r.credentials.password
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [store.id, get]);
  async function generate() {
    setWorking(true);
    try {
      const r = await create({
        data: {
          store_id: store.id,
          ...email.trim() ? {
            email: email.trim()
          } : {},
          ...password.trim() ? {
            password: password.trim()
          } : {}
        }
      });
      setCreds({
        email: r.email,
        password: r.password
      });
      toast.success("تم إنشاء/تحديث بيانات الدخول ✅");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل");
    } finally {
      setWorking(false);
    }
  }
  function copy(t) {
    navigator.clipboard.writeText(t);
    toast.success("نُسخ");
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), className: "w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between p-5 border-b border-border bg-gradient-to-bl from-primary/10 to-transparent", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: "Merchant Login" }),
        /* @__PURE__ */ jsx("div", { className: "font-display text-lg font-extrabold truncate", children: store.name_ar }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: "سيستخدم التاجر هذه البيانات للدخول على /merchant/login" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "grid place-items-center h-8 w-8 rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5 space-y-4", children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : creds ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Row, { label: "البريد", value: creds.email, onCopy: () => copy(creds.email) }),
      /* @__PURE__ */ jsx(Row, { label: "كلمة المرور", value: creds.password, onCopy: () => copy(creds.password) }),
      /* @__PURE__ */ jsxs("button", { onClick: generate, disabled: working, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-sm hover:bg-secondary/80 disabled:opacity-60", children: [
        working && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        " إعادة توليد كلمة مرور جديدة"
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "لا يوجد حساب دخول لهذا المتجر بعد. اكتب البريد وكلمة المرور أو اتركها فاضية للتوليد التلقائي." }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "البريد (اختياري)" }),
        /* @__PURE__ */ jsx("input", { dir: "ltr", value: email, onChange: (e) => setEmail(e.target.value), placeholder: `merchant-${store.slug}@ashmoun.local`, className: "w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:border-primary outline-none text-start" })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: "كلمة المرور (اختياري)" }),
        /* @__PURE__ */ jsx("input", { dir: "ltr", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "اتركها فاضية للتوليد", className: "w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:border-primary outline-none text-start" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: generate, disabled: working, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-60", children: [
        working && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        " إنشاء حساب التاجر"
      ] })
    ] }) })
  ] }) });
}
function Row({
  label,
  value,
  onCopy
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground w-20 shrink-0", children: label }),
    /* @__PURE__ */ jsx("div", { dir: "ltr", className: "flex-1 text-sm font-mono truncate", children: value }),
    /* @__PURE__ */ jsx("button", { onClick: onCopy, className: "grid place-items-center h-7 w-7 rounded-full hover:bg-background", children: /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }) })
  ] });
}
export {
  StoresAdmin as component
};
