import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Loader2 } from "lucide-react";
function AdminPageHeader({ icon: Icon, eyebrow, title, description, actions }) {
  return /* @__PURE__ */ jsxs("header", { className: "mb-5 sm:mb-7 flex items-start gap-3 sm:gap-4 flex-wrap", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl text-primary-foreground shrink-0",
        style: {
          background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
          boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent)"
        },
        children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 sm:h-6 sm:w-6" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: eyebrow }),
      /* @__PURE__ */ jsx("h1", { className: "mt-0.5 font-display text-xl sm:text-3xl font-extrabold tracking-tight leading-tight", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground", children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "w-full sm:w-auto flex items-center gap-2 flex-wrap", children: actions })
  ] });
}
function Card({ children, className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded-3xl border border-border bg-card ${className}`,
      style: { boxShadow: "0 10px 30px -18px color-mix(in oklab, var(--foreground) 14%, transparent)" },
      children
    }
  );
}
function Spinner({ label }) {
  return /* @__PURE__ */ jsxs("div", { className: "py-16 grid place-items-center text-muted-foreground", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }),
    label && /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs", children: label })
  ] });
}
function EmptyState({ icon: Icon, title, hint }) {
  return /* @__PURE__ */ jsxs("div", { className: "py-14 px-6 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 font-bold", children: title }),
    hint && /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: hint })
  ] });
}
function StatusBadge({ status }) {
  const map = {
    pending: { label: "قيد المراجعة", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    approved: { label: "موثّق", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    rejected: { label: "مرفوض", cls: "bg-destructive/15 text-destructive border-destructive/30" },
    suspended: { label: "معلّق", cls: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30" },
    confirmed: { label: "مؤكد", cls: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    preparing: { label: "قيد التحضير", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    delivering: { label: "قيد التوصيل", cls: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
    completed: { label: "مكتمل", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    cancelled: { label: "ملغي", cls: "bg-destructive/15 text-destructive border-destructive/30" }
  };
  const m = map[status] ?? { label: status, cls: "bg-secondary text-muted-foreground border-border" };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`, children: m.label });
}
export {
  AdminPageHeader as A,
  Card as C,
  EmptyState as E,
  Spinner as S,
  StatusBadge as a
};
