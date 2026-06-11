import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { B as adminUpsertSiteSettings } from "./admin.functions-B9xDw6Pq.js";
import { i as getSiteSettings } from "./router-B21PHlE4.js";
import { A as AdminPageHeader, S as Spinner, C as Card } from "./AdminUI-P1Smhk6f.js";
import "@tanstack/react-router";
import "zod";
import "./auth-middleware-tARyaGyP.js";
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
import "@tanstack/react-query";
import "./client-1xsKmu53.js";
function SiteSettingsAdmin() {
  const load = useServerFn(getSiteSettings);
  const save = useServerFn(adminUpsertSiteSettings);
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    load().then((r) => setS(r.settings)).catch(() => {
    });
  }, [load]);
  async function submit() {
    if (!s) return;
    if (!s.site_name?.trim()) {
      toast.error("اسم الموقع مطلوب");
      return;
    }
    setSaving(true);
    try {
      await save({
        data: {
          site_name: s.site_name,
          tagline: s.tagline,
          logo_url: s.logo_url,
          primary_color: s.primary_color,
          contact_phone: s.contact_phone,
          contact_whatsapp: s.contact_whatsapp,
          contact_email: s.contact_email
        }
      });
      toast.success("تم حفظ الإعدادات — هتظهر فورًا في الموقع");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Settings, eyebrow: "Settings", title: "إعدادات الموقع", description: "اسم الموقع، الشعار، الألوان، وبيانات التواصل — تنعكس فورًا على كل الزوار." }),
    !s ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsxs(Card, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "اسم الموقع *", children: /* @__PURE__ */ jsx("input", { value: s.site_name, onChange: (e) => setS({
          ...s,
          site_name: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "الشعار (نص قصير)", children: /* @__PURE__ */ jsx("input", { value: s.tagline ?? "", onChange: (e) => setS({
          ...s,
          tagline: e.target.value
        }), className: inputCls, placeholder: "دليلك للمحلات والخدمات في أشمون" }) }),
        /* @__PURE__ */ jsx(Field, { label: "رابط اللوجو", children: /* @__PURE__ */ jsx("input", { value: s.logo_url ?? "", onChange: (e) => setS({
          ...s,
          logo_url: e.target.value
        }), className: inputCls, dir: "ltr", placeholder: "https://..." }) }),
        /* @__PURE__ */ jsx(Field, { label: "اللون الأساسي (oklch / hex)", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("input", { value: s.primary_color ?? "", onChange: (e) => setS({
            ...s,
            primary_color: e.target.value
          }), className: inputCls, dir: "ltr", placeholder: "مثال: #ff7043 أو oklch(0.7 0.18 50)" }),
          s.primary_color && /* @__PURE__ */ jsx("span", { className: "h-9 w-9 rounded-xl border border-border shrink-0", style: {
            background: s.primary_color
          } })
        ] }) }),
        /* @__PURE__ */ jsx(Field, { label: "رقم التواصل", children: /* @__PURE__ */ jsx("input", { value: s.contact_phone ?? "", onChange: (e) => setS({
          ...s,
          contact_phone: e.target.value
        }), className: inputCls, dir: "ltr", placeholder: "01XXXXXXXXX" }) }),
        /* @__PURE__ */ jsx(Field, { label: "واتساب", children: /* @__PURE__ */ jsx("input", { value: s.contact_whatsapp ?? "", onChange: (e) => setS({
          ...s,
          contact_whatsapp: e.target.value
        }), className: inputCls, dir: "ltr", placeholder: "201XXXXXXXXX" }) }),
        /* @__PURE__ */ jsx(Field, { label: "البريد الإلكتروني", children: /* @__PURE__ */ jsx("input", { value: s.contact_email ?? "", onChange: (e) => setS({
          ...s,
          contact_email: e.target.value
        }), className: inputCls, dir: "ltr", placeholder: "hello@example.com" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs("button", { onClick: submit, disabled: saving, className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold disabled:opacity-60", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        " ",
        saving ? "جارٍ الحفظ..." : "حفظ"
      ] }) })
    ] })
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
  SiteSettingsAdmin as component
};
