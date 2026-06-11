import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { c as adminListDelivery, a as adminCreateDelivery, d as adminToggleDelivery, b as adminDeleteDelivery } from "./delivery.functions-DREsD37w.js";
import { Bike, Loader2, Plus, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
function AdminDelivery() {
  const list = useServerFn(adminListDelivery);
  const create = useServerFn(adminCreateDelivery);
  const toggle = useServerFn(adminToggleDelivery);
  const del = useServerFn(adminDeleteDelivery);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function reload() {
    try {
      const r = await list();
      setRows(r.personnel ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function onCreate(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await create({
        data: {
          name,
          whatsapp,
          phone: phone || void 0,
          email: email || void 0,
          password: password || void 0
        }
      });
      toast.success("تم إضافة الدليفري");
      setName("");
      setWhatsapp("");
      setPhone("");
      setEmail("");
      setPassword("");
      await reload();
    } catch (e2) {
      toast.error(e2 instanceof Error ? e2.message : "فشل");
    } finally {
      setBusy(false);
    }
  }
  function copy(t) {
    navigator.clipboard.writeText(t);
    toast.success("تم النسخ");
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Bike, eyebrow: "Delivery", title: "عمال الدليفري", description: "إدارة حسابات الدليفري ومتابعتهم." }),
    /* @__PURE__ */ jsxs(Card, { className: "p-4 mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold mb-3 text-sm", children: "إضافة دليفري جديد" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: onCreate, className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "الاسم", value: name, onChange: (e) => setName(e.target.value), className: "rounded-xl bg-background border border-border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsx("input", { required: true, placeholder: "رقم الواتساب (مع كود الدولة)", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), className: "rounded-xl bg-background border border-border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsx("input", { placeholder: "رقم الهاتف (اختياري)", value: phone, onChange: (e) => setPhone(e.target.value), className: "rounded-xl bg-background border border-border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsx("input", { type: "email", placeholder: "البريد (اختياري — هيتولّد تلقائي)", value: email, onChange: (e) => setEmail(e.target.value), className: "rounded-xl bg-background border border-border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsx("input", { placeholder: "كلمة المرور (اختياري — هتتولّد تلقائي)", value: password, onChange: (e) => setPassword(e.target.value), className: "rounded-xl bg-background border border-border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2 text-sm font-bold disabled:opacity-50", children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " إضافة"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Bike, title: "لا يوجد دليفري بعد" }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((r) => /* @__PURE__ */ jsxs("li", { className: "p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "font-bold", children: [
          r.name,
          " ",
          !r.active && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-destructive", children: "(موقوف)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "📱 ",
          r.whatsapp,
          " ",
          r.phone && `· ${r.phone}`
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1.5 text-xs flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => copy(r.email), className: "inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 hover:bg-secondary/80", children: [
            /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }),
            " ",
            r.email
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => copy(r.password), className: "inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 hover:bg-secondary/80", children: [
            /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }),
            " ",
            r.password
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: async () => {
          await toggle({
            data: {
              id: r.id,
              active: !r.active
            }
          });
          await reload();
        }, className: "rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary", children: r.active ? "إيقاف" : "تفعيل" }),
        /* @__PURE__ */ jsx("button", { onClick: async () => {
          if (confirm("حذف نهائياً؟")) {
            await del({
              data: {
                id: r.id
              }
            });
            await reload();
          }
        }, className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, r.id)) }) })
  ] });
}
export {
  AdminDelivery as component
};
