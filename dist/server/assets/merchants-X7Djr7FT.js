import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Briefcase, Plus, Search, ShieldCheck, Mail, Copy, Phone, Store, KeyRound, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { m as adminListMerchants, c as adminCreateMerchant, u as adminResetMerchantPassword, g as adminDeleteMerchant } from "./admin.functions-B9xDw6Pq.js";
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
function MerchantsAdmin() {
  const list = useServerFn(adminListMerchants);
  const create = useServerFn(adminCreateMerchant);
  const reset = useServerFn(adminResetMerchantPassword);
  const del = useServerFn(adminDeleteMerchant);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  async function reload() {
    setLoading(true);
    try {
      const r = await list({
        data: {
          q
        }
      });
      setRows(r.merchants ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function removeMerchant(m) {
    if (!confirm(`حذف حساب التاجر "${m.full_name ?? m.email}" نهائياً؟ سيتم حذف كل بياناته.`)) return;
    try {
      await del({
        data: {
          user_id: m.id
        }
      });
      toast.success("تم الحذف");
      setRows((p) => p.filter((x) => x.id !== m.id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Briefcase, eyebrow: "Merchants", title: "حسابات التجار", description: "أنشئ حسابات تجارة بإيميل وكلمة مرور، وأعد ضبط الباسوورد عند الحاجة.", actions: /* @__PURE__ */ jsxs("button", { onClick: () => setOpenCreate(true), className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-95 transition", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " تاجر جديد"
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "p-3 mb-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      void reload();
    }, className: "relative max-w-md", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "بحث بالاسم أو البريد...", className: "w-full rounded-full bg-background border border-border ps-4 pe-9 py-2 text-sm focus:border-primary outline-none" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Briefcase, title: "لا يوجد تجار بعد", hint: "أنشئ أول حساب تاجر من زر «تاجر جديد»." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((m) => /* @__PURE__ */ jsxs("li", { className: "p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx("span", { className: "font-display font-bold truncate", children: m.full_name ?? "(بدون اسم)" }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }),
            " تاجر"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-3 flex-wrap text-xs text-muted-foreground", children: [
          m.email && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", dir: "ltr", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
            " ",
            m.email,
            /* @__PURE__ */ jsx("button", { onClick: () => {
              navigator.clipboard.writeText(m.email);
              toast.success("نُسخ");
            }, className: "opacity-60 hover:opacity-100", children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }) })
          ] }),
          m.phone && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
            " ",
            m.phone
          ] })
        ] }),
        m.stores.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: m.stores.map((s) => /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
          slug: s.slug
        }, className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2 py-0.5 text-[10px] hover:border-primary/40 hover:text-primary transition", children: [
          /* @__PURE__ */ jsx(Store, { className: "h-3 w-3" }),
          " ",
          s.name_ar,
          " ",
          /* @__PURE__ */ jsx(StatusBadge, { status: s.status })
        ] }, s.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setResetTarget(m), className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs hover:bg-secondary/80 transition", children: [
          /* @__PURE__ */ jsx(KeyRound, { className: "h-3.5 w-3.5" }),
          " كلمة مرور"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => removeMerchant(m), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition", "aria-label": "حذف", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, m.id)) }) }),
    openCreate && /* @__PURE__ */ jsx(CreateMerchantModal, { onClose: () => setOpenCreate(false), onCreated: () => {
      setOpenCreate(false);
      void reload();
    }, create }),
    resetTarget && /* @__PURE__ */ jsx(ResetPasswordModal, { merchant: resetTarget, onClose: () => setResetTarget(null), reset })
  ] });
}
function CreateMerchantModal({
  onClose,
  onCreated,
  create
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(() => generatePassword());
  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await create({
        data: {
          email: email.trim(),
          password,
          full_name: full_name.trim(),
          phone: phone.trim() || void 0
        }
      });
      toast.success("تم إنشاء حساب التاجر ✅");
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الإنشاء");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx(Modal, { onClose, title: "إنشاء حساب تاجر", subtitle: "أدخل بيانات الدخول التي سيستخدمها التاجر في صفحة /auth.", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
    /* @__PURE__ */ jsx(Field, { label: "الاسم الكامل", children: /* @__PURE__ */ jsx("input", { required: true, value: full_name, onChange: (e) => setFullName(e.target.value), className: inputCls }) }),
    /* @__PURE__ */ jsx(Field, { label: "البريد الإلكتروني", children: /* @__PURE__ */ jsx("input", { required: true, type: "email", dir: "ltr", value: email, onChange: (e) => setEmail(e.target.value), className: inputCls + " text-start" }) }),
    /* @__PURE__ */ jsx(Field, { label: "كلمة المرور (8 أحرف على الأقل)", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx("input", { required: true, minLength: 8, dir: "ltr", value: password, onChange: (e) => setPassword(e.target.value), className: inputCls + " text-start flex-1" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPassword(generatePassword()), className: "rounded-xl border border-border bg-secondary px-3 text-xs hover:bg-secondary/80", children: "توليد" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
        navigator.clipboard.writeText(password);
        toast.success("نُسخت");
      }, className: "grid place-items-center rounded-xl border border-border bg-secondary px-3 hover:bg-secondary/80", children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Field, { label: "رقم الهاتف (اختياري)", children: /* @__PURE__ */ jsx("input", { dir: "ltr", value: phone, onChange: (e) => setPhone(e.target.value), className: inputCls + " text-start" }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed", children: "احفظ كلمة المرور وأرسلها للتاجر — لن تظهر مرة أخرى بعد إغلاق هذه النافذة." }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-60", children: [
        loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        " إنشاء الحساب"
      ] })
    ] })
  ] }) });
}
function ResetPasswordModal({
  merchant,
  onClose,
  reset
}) {
  const [password, setPassword] = useState(() => generatePassword());
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await reset({
        data: {
          user_id: merchant.id,
          password
        }
      });
      toast.success("تم تغيير كلمة المرور ✅");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل التحديث");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx(Modal, { onClose, title: "تغيير كلمة المرور", subtitle: merchant.email ?? merchant.full_name ?? "", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
    /* @__PURE__ */ jsx(Field, { label: "كلمة المرور الجديدة", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx("input", { required: true, minLength: 8, dir: "ltr", value: password, onChange: (e) => setPassword(e.target.value), className: inputCls + " text-start flex-1" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPassword(generatePassword()), className: "rounded-xl border border-border bg-secondary px-3 text-xs hover:bg-secondary/80", children: "توليد" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
        navigator.clipboard.writeText(password);
        toast.success("نُسخت");
      }, className: "grid place-items-center rounded-xl border border-border bg-secondary px-3 hover:bg-secondary/80", children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm", children: "إلغاء" }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-60", children: [
        loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        " حفظ"
      ] })
    ] })
  ] }) });
}
const inputCls = "w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:border-primary outline-none";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-muted-foreground mb-1.5", children: label }),
    children
  ] });
}
function Modal({
  title,
  subtitle,
  children,
  onClose
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), className: "w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between p-5 border-b border-border bg-gradient-to-bl from-primary/10 to-transparent", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display text-lg font-extrabold", children: title }),
        subtitle && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5 truncate", dir: "ltr", children: subtitle })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "grid place-items-center h-8 w-8 rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-5", children })
  ] }) });
}
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let s = "";
  const arr = new Uint32Array(12);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 12; i++) s += chars[arr[i] % chars.length];
  return s;
}
export {
  MerchantsAdmin as component
};
