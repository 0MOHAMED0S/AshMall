import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Users, Search, User, Shield, Store } from "lucide-react";
import { toast } from "sonner";
import { s as adminListUsers, v as adminSetRole } from "./admin.functions-B9xDw6Pq.js";
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
function UsersAdmin() {
  const list = useServerFn(adminListUsers);
  const setRole = useServerFn(adminSetRole);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  async function reload() {
    setLoading(true);
    try {
      const r = await list({
        data: {
          q
        }
      });
      setRows(r.users ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function toggle(user_id, role, grant) {
    try {
      await setRole({
        data: {
          user_id,
          role,
          grant
        }
      });
      setRows((p) => p.map((u) => u.id === user_id ? {
        ...u,
        roles: grant ? Array.from(/* @__PURE__ */ new Set([...u.roles, role])) : u.roles.filter((r) => r !== role)
      } : u));
      toast.success("تم التحديث");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحديث");
    }
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Users, eyebrow: "Users", title: "إدارة المستخدمين", description: "عرض المستخدمين والتحكم في صلاحياتهم." }),
    /* @__PURE__ */ jsx(Card, { className: "p-3 mb-4", children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      void reload();
    }, className: "relative max-w-md", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "بحث بالاسم...", className: "w-full rounded-full bg-background border border-border ps-4 pe-9 py-2 text-sm focus:border-primary outline-none" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Users, title: "لا توجد نتائج" }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((u) => /* @__PURE__ */ jsxs("li", { className: "p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-secondary overflow-hidden grid place-items-center shrink-0", children: u.avatar_url ? /* @__PURE__ */ jsx("img", { src: u.avatar_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold truncate", children: u.full_name ?? "بدون اسم" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground tabular-nums truncate", children: [
            u.phone ?? "—",
            " · انضمّ ",
            new Date(u.created_at).toLocaleDateString("ar-EG")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsx(RoleToggle, { label: "مشرف", icon: Shield, active: u.roles.includes("admin"), onClick: () => toggle(u.id, "admin", !u.roles.includes("admin")), accent: "primary" }),
        /* @__PURE__ */ jsx(RoleToggle, { label: "صاحب متجر", icon: Store, active: u.roles.includes("store_owner"), onClick: () => toggle(u.id, "store_owner", !u.roles.includes("store_owner")) }),
        /* @__PURE__ */ jsx(RoleToggle, { label: "عميل", icon: User, active: u.roles.includes("customer"), onClick: () => toggle(u.id, "customer", !u.roles.includes("customer")) })
      ] })
    ] }, u.id)) }) })
  ] });
}
function RoleToggle({
  label,
  icon: Icon,
  active,
  onClick,
  accent
}) {
  const activeCls = accent === "primary" ? "bg-primary text-primary-foreground border-primary" : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
  return /* @__PURE__ */ jsxs("button", { onClick, className: `inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? activeCls : "bg-secondary text-muted-foreground border-border hover:text-foreground"}`, children: [
    /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
    " ",
    label
  ] });
}
export {
  UsersAdmin as component
};
