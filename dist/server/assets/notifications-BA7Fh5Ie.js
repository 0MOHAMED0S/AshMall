import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { g as createSsrRpc, u as useAuth } from "./router-B21PHlE4.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { ArrowRight, Bell, MailOpen, CheckCheck, Inbox, XCircle, AlertTriangle, CheckCircle2, Info, Check } from "lucide-react";
import { s as supabase } from "./client-1xsKmu53.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const listNotifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c017b24a4940a916334ff23b3f3461893d7b3f151e06bac76f968dd27c3f187b"));
const markNotificationRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("385e76cdf807dd53711b6f969d894db85cf9b0ca7a6373bb34c6352adedccb64"));
const markAllRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2951bd39fcb59a048407113c481b15fd695e4a9d3e2f43e52a2e7ab107a2cb63"));
const TYPE_META = {
  info: {
    Icon: Info,
    bg: "oklch(0.95 0.04 240)",
    fg: "oklch(0.5 0.18 245)",
    ring: "oklch(0.85 0.08 240)"
  },
  success: {
    Icon: CheckCircle2,
    bg: "oklch(0.95 0.05 160)",
    fg: "oklch(0.5 0.15 160)",
    ring: "oklch(0.85 0.08 160)"
  },
  warning: {
    Icon: AlertTriangle,
    bg: "oklch(0.96 0.06 70)",
    fg: "oklch(0.6 0.18 55)",
    ring: "oklch(0.88 0.1 65)"
  },
  error: {
    Icon: XCircle,
    bg: "oklch(0.95 0.05 25)",
    fg: "oklch(0.55 0.2 25)",
    ring: "oklch(0.85 0.1 25)"
  }
};
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "الآن";
  if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} س`;
  const d = Math.floor(h / 24);
  if (d < 7) return `منذ ${d} ي`;
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short"
  });
}
function NotificationsPage() {
  const {
    user
  } = useAuth();
  const fetchAll = useServerFn(listNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllRead);
  const navigate = useNavigate();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      setItems(r.notifications ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`notif-page-${user.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${user.id}`
    }, () => {
      void reload();
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [user?.id]);
  const unreadCount = useMemo(() => items.filter((n) => !n.read_at).length, [items]);
  const totalCount = items.length;
  const visible = tab === "unread" ? items.filter((n) => !n.read_at) : items;
  async function open(n) {
    if (!n.read_at) {
      try {
        await markRead({
          data: {
            id: n.id
          }
        });
      } catch {
      }
      setItems((p) => p.map((x) => x.id === n.id ? {
        ...x,
        read_at: (/* @__PURE__ */ new Date()).toISOString()
      } : x));
    }
    if (n.link) navigate({
      to: n.link
    });
  }
  async function readAll() {
    try {
      await markAll();
      setItems((p) => p.map((x) => ({
        ...x,
        read_at: x.read_at ?? (/* @__PURE__ */ new Date()).toISOString()
      })));
      toast.success("تم تعليم الكل كمقروء");
    } catch {
      toast.error("حدث خطأ");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-36 sm:pt-44 pb-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6", children: [
      /* @__PURE__ */ jsx("header", { className: "relative mb-6 sm:mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "font-display font-extrabold tracking-tight text-2xl sm:text-4xl text-foreground", children: "الإشعارات" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs sm:text-sm text-muted-foreground", children: "تحديثاتك في مكان واحد." })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => router.history.back(), "aria-label": "رجوع", className: "shrink-0 grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card border border-border hover:border-primary/40 hover:text-primary transition active:scale-95", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "الكل", value: loading ? "…" : totalCount.toLocaleString("ar-EG"), tone: "teal", icon: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }), active: tab === "all", onClick: () => setTab("all") }),
        /* @__PURE__ */ jsx(StatCard, { label: "غير مقروء", value: loading ? "…" : unreadCount.toLocaleString("ar-EG"), tone: "amber", icon: /* @__PURE__ */ jsx(MailOpen, { className: "h-5 w-5" }), active: tab === "unread", onClick: () => setTab("unread") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 sm:mb-8 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 p-1.5 rounded-2xl bg-secondary/60 border border-border grid grid-cols-2 gap-1 text-sm font-bold", children: [
          /* @__PURE__ */ jsx(TabBtn, { active: tab === "all", onClick: () => setTab("all"), children: "الكل" }),
          /* @__PURE__ */ jsxs(TabBtn, { active: tab === "unread", onClick: () => setTab("unread"), children: [
            "غير مقروء ",
            unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: `mr-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${tab === "unread" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`, children: unreadCount })
          ] })
        ] }),
        unreadCount > 0 && /* @__PURE__ */ jsxs("button", { onClick: () => void readAll(), className: "shrink-0 inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:text-primary transition px-3 sm:px-4 py-2.5 text-xs font-bold active:scale-[0.97]", children: [
          /* @__PURE__ */ jsx(CheckCheck, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "تعليم الكل" })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: Array.from({
        length: 5
      }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-20 rounded-2xl bg-secondary/40 animate-pulse" }, i)) }) : visible.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: tab === "unread" ? /* @__PURE__ */ jsx(CheckCheck, { className: "h-7 w-7" }) : /* @__PURE__ */ jsx(Inbox, { className: "h-7 w-7" }), title: tab === "unread" ? "لا توجد إشعارات غير مقروءة" : "لا توجد إشعارات", desc: tab === "unread" ? "أنت متابع لكل شيء — استمتع بهدوء صندوقك." : "سنخبرك هنا بأي تحديثات على طلباتك أو متجرك.", ctaLabel: "تصفّح المتاجر", ctaTo: "/stores" }) : /* @__PURE__ */ jsx("ul", { className: "space-y-2.5", children: visible.map((n) => {
        const meta = TYPE_META[n.type] ?? TYPE_META.info;
        const Icon = meta.Icon;
        const isNew = !n.read_at;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { onClick: () => void open(n), className: `group w-full text-right flex items-start gap-3 rounded-2xl border bg-card p-3.5 sm:p-4 transition hover:border-primary/40 hover:-translate-y-0.5 ${isNew ? "border-primary/30" : "border-border"}`, style: {
          boxShadow: isNew ? "0 8px 22px -16px color-mix(in oklab, var(--primary) 55%, transparent)" : void 0
        }, children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl shrink-0", style: {
            background: meta.bg,
            color: meta.fg,
            boxShadow: `inset 0 0 0 1px ${meta.ring}`
          }, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-sm sm:text-[15px] truncate", children: n.title }),
              isNew && /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary shrink-0 animate-pulse" })
            ] }),
            n.body && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs sm:text-[13px] text-muted-foreground line-clamp-2 leading-relaxed", children: n.body }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/80 tabular-nums", children: [
              /* @__PURE__ */ jsx("span", { children: timeAgo(n.created_at) }),
              n.link && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 text-primary/80 font-semibold opacity-0 group-hover:opacity-100 transition", children: "فتح" })
            ] })
          ] }),
          isNew && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-bold shrink-0 self-start", children: [
            /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
            " جديد"
          ] })
        ] }) }, n.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function StatCard({
  label,
  value,
  tone,
  icon,
  active,
  onClick
}) {
  const palette = tone === "teal" ? {
    bg: "oklch(0.95 0.04 195)",
    fg: "oklch(0.55 0.13 195)",
    ring: "oklch(0.85 0.07 195)"
  } : {
    bg: "oklch(0.96 0.06 70)",
    fg: "oklch(0.65 0.18 55)",
    ring: "oklch(0.88 0.1 65)"
  };
  return /* @__PURE__ */ jsx("button", { onClick, className: `group text-right rounded-3xl border bg-card p-4 sm:p-5 transition active:scale-[0.98] ${active ? "border-primary/50" : "border-border hover:border-primary/30"}`, style: {
    boxShadow: active ? "0 10px 24px -16px color-mix(in oklab, var(--primary) 60%, transparent)" : void 0
  }, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] sm:text-xs font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 font-display text-2xl sm:text-3xl font-extrabold tabular-nums", children: value })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl shrink-0", style: {
      background: palette.bg,
      color: palette.fg,
      boxShadow: `inset 0 0 0 1px ${palette.ring}`
    }, children: icon })
  ] }) });
}
function TabBtn({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsx("button", { onClick, className: `py-2.5 rounded-xl transition inline-flex items-center justify-center ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children });
}
function EmptyState({
  icon,
  title,
  desc,
  ctaLabel,
  ctaTo
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-8 sm:p-14 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full grid place-items-center bg-primary/10 text-primary mb-4", children: icon }),
    /* @__PURE__ */ jsx("h2", { className: "font-display text-lg sm:text-xl font-extrabold", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto", children: desc }),
    /* @__PURE__ */ jsx(Link, { to: ctaTo, className: "mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition", children: ctaLabel })
  ] });
}
export {
  NotificationsPage as component
};
