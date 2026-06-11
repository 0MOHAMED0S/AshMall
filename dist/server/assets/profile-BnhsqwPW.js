import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { u as useAuth } from "./router-B21PHlE4.js";
import { s as supabase } from "./client-1xsKmu53.js";
import { Receipt, ShieldCheck, Shield, Store, User, ShoppingBag, Heart, Loader2, Info, ChevronDown, Settings, Facebook, Instagram, Send } from "lucide-react";
import { toast } from "sonner";
import "./useServerFn-DL2oePlL.js";
import "zod";
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
import "./auth-middleware-tARyaGyP.js";
import "@supabase/supabase-js";
function ProfilePage() {
  const {
    user,
    roles,
    signOut,
    isStoreOwner,
    isAdmin
  } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [open, setOpen] = useState("orders");
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
    });
    supabase.from("orders").select("id", {
      count: "exact",
      head: true
    }).eq("user_id", user.id).then(({
      count
    }) => {
      setOrdersCount(count ?? 0);
    });
  }, [user]);
  async function save(e) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: fullName,
      phone
    }).eq("id", user.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("تم حفظ التغييرات");
  }
  const displayName = fullName || user?.email?.split("@")[0] || "حسابك";
  const initial = (displayName?.[0] || "?").toUpperCase();
  const roleLabel = isAdmin ? "مشرف" : isStoreOwner ? "صاحب متجر" : "عميل";
  function toggle(id) {
    setOpen(open === id ? null : id);
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-24 pb-28 mx-auto max-w-2xl px-4 sm:px-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-center font-display text-2xl sm:text-3xl font-extrabold text-foreground mb-6", children: "حسابك" }),
      /* @__PURE__ */ jsx("section", { className: "relative rounded-[2rem] p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500", style: {
        background: "linear-gradient(140deg, color-mix(in oklab, var(--primary-soft) 70%, transparent), color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 60%, transparent))",
        boxShadow: "var(--shadow-elevated)"
      }, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "h-28 w-28 rounded-full overflow-hidden grid place-items-center text-4xl font-extrabold text-primary", style: {
          background: "color-mix(in oklab, var(--primary-soft) 80%, white)",
          boxShadow: "0 0 0 4px color-mix(in oklab, var(--primary) 30%, transparent), 0 12px 30px -10px color-mix(in oklab, var(--primary) 35%, transparent)"
        }, children: avatarUrl ? /* @__PURE__ */ jsx("img", { src: avatarUrl, alt: displayName, className: "h-full w-full object-cover" }) : initial }) }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-2xl font-extrabold text-foreground", children: displayName }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-muted-foreground", dir: "ltr", children: phone || user?.email }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-background/70 border border-border px-3 py-1.5 text-xs text-foreground", children: [
            /* @__PURE__ */ jsx(Receipt, { className: "h-3.5 w-3.5 text-primary" }),
            "عدد طلباتك ",
            ordersCount
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
            "حساب نشط"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary px-3 py-1.5 text-xs", children: [
            isAdmin ? /* @__PURE__ */ jsx(Shield, { className: "h-3 w-3" }) : isStoreOwner ? /* @__PURE__ */ jsx(Store, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
            roleLabel
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsx(AccordionCard, { id: "orders", open: open === "orders", onToggle: () => toggle("orders"), title: "طلباتك", count: ordersCount, icon: /* @__PURE__ */ jsx(Receipt, { className: "h-5 w-5" }), tone: "primary", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(RowLink, { to: "/orders", icon: /* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4" }), label: "كل الطلبات" }),
          /* @__PURE__ */ jsx(RowLink, { to: "/cart", icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4" }), label: "سلة الشراء" }),
          /* @__PURE__ */ jsx(RowLink, { to: "/favorites", icon: /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4" }), label: "المفضلة" })
        ] }) }),
        /* @__PURE__ */ jsx(AccordionCard, { id: "info", open: open === "info", onToggle: () => toggle("info"), title: "معلومات", count: 3, icon: /* @__PURE__ */ jsx(Info, { className: "h-5 w-5" }), tone: "primary", children: /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Field, { label: "الاسم الكامل", value: fullName, onChange: setFullName }),
          /* @__PURE__ */ jsx(Field, { label: "رقم الهاتف", value: phone, onChange: setPhone, ltr: true }),
          /* @__PURE__ */ jsx(Field, { label: "البريد الإلكتروني", value: user?.email ?? "", onChange: () => {
          }, ltr: true, disabled: true }),
          /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-95 transition active:scale-[0.98] disabled:opacity-60", style: {
            boxShadow: "0 10px 25px -10px color-mix(in oklab, var(--primary) 50%, transparent)"
          }, children: [
            loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            "حفظ التغييرات"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Link, { to: "/settings", className: "flex items-center justify-between gap-3 rounded-3xl bg-background border border-border/60 px-4 sm:px-5 py-4 hover:bg-muted/40 transition active:scale-[0.99]", style: {
          boxShadow: "0 4px 14px -6px color-mix(in oklab, var(--foreground) 10%, transparent)"
        }, children: [
          /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5 -rotate-90 text-muted-foreground" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-base sm:text-lg font-extrabold text-foreground", children: "الإعدادات" }),
            /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-10 w-10 rounded-2xl text-emerald-600 dark:text-emerald-400", style: {
              background: "color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 90%, white)"
            }, children: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-6 rounded-3xl p-6 text-center", style: {
        background: "color-mix(in oklab, var(--primary-soft) 50%, transparent)"
      }, children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "تابعنا للحصول علي عروض حصرية" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx(SocialBtn, { href: "#", aria: "فيسبوك", children: /* @__PURE__ */ jsx(Facebook, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx(SocialBtn, { href: "#", aria: "إنستجرام", children: /* @__PURE__ */ jsx(Instagram, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx(SocialBtn, { href: "#", aria: "تيليجرام", children: /* @__PURE__ */ jsx(Send, { className: "h-5 w-5" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function AccordionCard({
  open,
  onToggle,
  title,
  count,
  icon,
  children,
  tone = "primary"
}) {
  const toneBg = tone === "accent" ? "color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 90%, white)" : "color-mix(in oklab, var(--primary-soft) 70%, white)";
  const toneText = tone === "accent" ? "text-emerald-600 dark:text-emerald-400" : "text-primary";
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-background border border-border/60 overflow-hidden transition-all duration-300", style: {
    boxShadow: open ? "var(--shadow-elevated)" : "0 4px 14px -6px color-mix(in oklab, var(--foreground) 10%, transparent)"
  }, children: [
    /* @__PURE__ */ jsxs("button", { onClick: onToggle, className: "w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-muted/40 transition", children: [
      /* @__PURE__ */ jsx(ChevronDown, { className: `h-5 w-5 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}` }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        typeof count === "number" && /* @__PURE__ */ jsx("span", { className: `grid place-items-center min-w-7 h-7 px-2 rounded-full text-xs font-bold ${toneText}`, style: {
          background: toneBg
        }, children: count }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-base sm:text-lg font-extrabold text-foreground", children: title }),
        /* @__PURE__ */ jsx("span", { className: `grid place-items-center h-10 w-10 rounded-2xl ${toneText}`, style: {
          background: toneBg
        }, children: icon })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`, children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-5 pb-5 pt-1", children }) }) })
  ] });
}
function RowLink({
  to,
  icon,
  label
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: "flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 px-4 py-3 text-sm text-foreground transition active:scale-[0.98]", children: [
    /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 -rotate-90 text-muted-foreground" }),
    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-primary", children: icon }),
      label
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  ltr,
  disabled
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-xs text-muted-foreground mb-1.5", children: label }),
    /* @__PURE__ */ jsx("input", { dir: ltr ? "ltr" : void 0, value, disabled, onChange: (e) => onChange(e.target.value), className: `w-full rounded-2xl bg-muted/40 border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition disabled:opacity-70 ${ltr ? "text-start" : ""}` })
  ] });
}
function SocialBtn({
  href,
  aria,
  children
}) {
  return /* @__PURE__ */ jsx("a", { href, "aria-label": aria, target: "_blank", rel: "noopener noreferrer", className: "grid place-items-center h-11 w-11 rounded-2xl bg-background border border-border text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition active:scale-95", style: {
    boxShadow: "0 4px 12px -6px color-mix(in oklab, var(--primary) 30%, transparent)"
  }, children });
}
export {
  ProfilePage as component
};
