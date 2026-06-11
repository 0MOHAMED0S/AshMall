import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Send, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { b as adminBroadcast } from "./admin.functions-B9xDw6Pq.js";
import { A as AdminPageHeader, C as Card } from "./AdminUI-P1Smhk6f.js";
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
function BroadcastAdmin() {
  const send = useServerFn(adminBroadcast);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("info");
  const [audience, setAudience] = useState("all");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }
    setBusy(true);
    try {
      const r = await send({
        data: {
          title: title.trim(),
          body: body.trim() || void 0,
          link: link.trim() || void 0,
          type,
          audience
        }
      });
      toast.success(`تم إرسال الإشعار إلى ${r.sent ?? 0} مستخدم`);
      setTitle("");
      setBody("");
      setLink("");
    } catch (e2) {
      toast.error(e2 instanceof Error ? e2.message : "فشل الإرسال");
    } finally {
      setBusy(false);
    }
  }
  const types = [{
    key: "info",
    label: "معلومة",
    Icon: Info,
    cls: "text-blue-500 bg-blue-500/15 border-blue-500/30"
  }, {
    key: "success",
    label: "نجاح",
    Icon: CheckCircle2,
    cls: "text-emerald-500 bg-emerald-500/15 border-emerald-500/30"
  }, {
    key: "warning",
    label: "تنبيه",
    Icon: AlertTriangle,
    cls: "text-amber-500 bg-amber-500/15 border-amber-500/30"
  }, {
    key: "error",
    label: "تحذير",
    Icon: XCircle,
    cls: "text-destructive bg-destructive/15 border-destructive/30"
  }];
  const audiences = [{
    key: "all",
    label: "كل المستخدمين"
  }, {
    key: "store_owners",
    label: "أصحاب المتاجر"
  }, {
    key: "customers",
    label: "العملاء"
  }];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Send, eyebrow: "Broadcast", title: "بث إشعار", description: "إرسال إشعار جماعي لمستخدمي المنصة." }),
    /* @__PURE__ */ jsx(Card, { className: "p-5", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "العنوان *", children: /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 120, className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "النص", children: /* @__PURE__ */ jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), maxLength: 500, rows: 4, className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "رابط (اختياري)", children: /* @__PURE__ */ jsx("input", { value: link, onChange: (e) => setLink(e.target.value), className: inputCls, dir: "ltr", placeholder: "/orders, /stores/..." }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-muted-foreground mb-1.5", children: "النوع" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: types.map((t) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setType(t.key), className: `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${type === t.key ? t.cls : "border-border text-muted-foreground hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsx(t.Icon, { className: "h-3.5 w-3.5" }),
          " ",
          t.label
        ] }, t.key)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-muted-foreground mb-1.5", children: "الجمهور" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: audiences.map((a) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setAudience(a.key), className: `rounded-full border px-3 py-1.5 text-xs font-medium transition ${audience === a.key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`, children: a.label }, a.key)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-50 transition", children: [
        /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
        " ",
        busy ? "جارٍ الإرسال..." : "إرسال"
      ] }) })
    ] }) })
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
  BroadcastAdmin as component
};
