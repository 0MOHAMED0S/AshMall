import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useMemo } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { s as supabase } from "./client-1xsKmu53.js";
import { g as getDeliveryDashboard, e as deliveryUpdateRequest } from "./delivery.functions-DREsD37w.js";
import { Loader2, Bike, LogOut, Circle, Package, Truck, TrendingUp, Clock, MapPin, Phone, MessageCircle, ChevronRight, Navigation, CheckCircle2, Wallet } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
import "./router-B21PHlE4.js";
import "@tanstack/react-query";
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
const STATUS_META = {
  pending: {
    label: "جديد",
    tone: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    dot: "bg-amber-500"
  },
  accepted: {
    label: "مقبول",
    tone: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    dot: "bg-blue-500"
  },
  picked_up: {
    label: "بالطريق",
    tone: "bg-indigo-500/10 text-indigo-700 border-indigo-500/30",
    dot: "bg-indigo-500"
  },
  delivered: {
    label: "تم التسليم",
    tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    dot: "bg-emerald-500"
  },
  cancelled: {
    label: "ملغي",
    tone: "bg-rose-500/10 text-rose-700 border-rose-500/30",
    dot: "bg-rose-500"
  }
};
function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1e3);
  if (s < 60) return "الآن";
  const m = Math.floor(s / 60);
  if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} س`;
  return `منذ ${Math.floor(h / 24)} ي`;
}
function DeliveryDashboard() {
  const navigate = useNavigate();
  const fetchDash = useServerFn(getDeliveryDashboard);
  const update = useServerFn(deliveryUpdateRequest);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [tab, setTab] = useState("new");
  const [online, setOnline] = useState(true);
  const reload = useCallback(async () => {
    try {
      setData(await fetchDash());
    } finally {
      setLoading(false);
    }
  }, [fetchDash]);
  useEffect(() => {
    void reload();
  }, [reload]);
  useEffect(() => {
    const ch = supabase.channel("delivery-feed").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "delivery_requests"
    }, () => {
      toast.success("🚴 طلب دليفري جديد!");
      try {
        const a = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
        void a.play();
      } catch {
      }
      void reload();
    }).on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "delivery_requests"
    }, () => {
      void reload();
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [reload]);
  async function act(id, action) {
    setBusy(id);
    try {
      await update({
        data: {
          id,
          action
        }
      });
      toast.success("تم التحديث");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل");
    } finally {
      setBusy(null);
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
    navigate({
      to: "/delivery/login"
    });
  }
  const filtered = useMemo(() => {
    const list = data?.requests ?? [];
    if (tab === "new") return list.filter((r) => r.status === "pending");
    if (tab === "active") return list.filter((r) => r.status === "accepted" || r.status === "picked_up");
    return list.filter((r) => r.status === "delivered" || r.status === "cancelled");
  }, [data, tab]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center bg-background", dir: "rtl", children: /* @__PURE__ */ jsx(Loader2, { className: "h-7 w-7 animate-spin text-primary" }) });
  }
  if (!data?.me) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center px-5 text-center bg-background", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-8 max-w-sm shadow-card", children: [
      /* @__PURE__ */ jsx(Bike, { className: "h-12 w-12 text-muted-foreground mx-auto" }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-bold mt-4", children: "الحساب غير مفعّل" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "حسابك غير مفعّل كدليفري حالياً. الرجاء التواصل مع الإدارة لتفعيل الخدمة." }),
      /* @__PURE__ */ jsxs("button", { onClick: signOut, className: "mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-bold", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" }),
        " تسجيل خروج"
      ] })
    ] }) });
  }
  const initials = (data.me.name || "د").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-20", dir: "rtl", children: [
    /* @__PURE__ */ jsxs("header", { className: "relative overflow-hidden text-primary-foreground", style: {
      background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 70%, black) 100%)"
    }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.07] pointer-events-none", style: {
        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
        backgroundSize: "18px 18px"
      } }),
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-5xl px-5 pt-6 pb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm font-display font-extrabold", children: initials }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold tracking-[0.25em] uppercase text-white/70", children: "Delivery Partner" }),
            /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-extrabold truncate", children: data.me.name })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setOnline((v) => !v), className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold border backdrop-blur-sm transition-colors ${online ? "bg-emerald-500/25 border-emerald-300/40" : "bg-white/10 border-white/20"}`, children: [
            /* @__PURE__ */ jsx(Circle, { className: `h-2 w-2 ${online ? "fill-emerald-300 text-emerald-300 animate-pulse" : "fill-white/50 text-white/50"}` }),
            online ? "متصل" : "غير متصل"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: signOut, className: "grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15", children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-7 grid grid-cols-3 gap-3", children: [{
          label: "طلبات جديدة",
          value: data.stats.pending,
          Icon: Package,
          accent: "text-amber-200"
        }, {
          label: "قيد التوصيل",
          value: data.stats.active,
          Icon: Truck,
          accent: "text-blue-200"
        }, {
          label: "مكتملة اليوم",
          value: data.stats.delivered,
          Icon: TrendingUp,
          accent: "text-emerald-200"
        }].map(({
          label,
          value,
          Icon,
          accent
        }) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-white/70", children: label }),
            /* @__PURE__ */ jsx(Icon, { className: `h-3.5 w-3.5 ${accent}` })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1.5 font-display text-2xl font-extrabold tabular-nums", children: value })
        ] }, label)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-5 mt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-card border border-border shadow-card p-1.5 grid grid-cols-3 gap-1", children: [{
        key: "new",
        label: "جديدة",
        count: data.stats.pending
      }, {
        key: "active",
        label: "نشطة",
        count: data.stats.active
      }, {
        key: "done",
        label: "مكتملة",
        count: data.stats.delivered
      }].map((t) => {
        const isActive = tab === t.key;
        return /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.key), className: `relative rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsx("span", { children: t.label }),
          t.count > 0 && /* @__PURE__ */ jsx("span", { className: `mr-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-extrabold tabular-nums ${isActive ? "bg-white/25" : "bg-primary/10 text-primary"}`, children: t.count })
        ] }, t.key);
      }) }),
      /* @__PURE__ */ jsx("section", { className: "mt-5", children: filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-card/50 p-14 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Package, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display font-bold", children: tab === "new" ? "لا توجد طلبات جديدة" : tab === "active" ? "لا يوجد طلبات نشطة" : "لم تكمل أي طلب بعد" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: tab === "new" ? "سيظهر الطلب هنا فور وصوله" : "تابع لوحتك للطلبات الجديدة" })
      ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: filtered.map((r) => {
        const meta = STATUS_META[r.status] ?? STATUS_META.pending;
        const itemsCount = (r.order?.order_items ?? []).reduce((s, i) => s + (i.quantity ?? 0), 0);
        return /* @__PURE__ */ jsxs("li", { className: "group rounded-3xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-shadow", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-l from-secondary/40 to-transparent", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-display font-extrabold text-sm", children: [
              "#",
              r.order_id.slice(0, 4).toUpperCase()
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.tone}`, children: [
                  /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${meta.dot}` }),
                  " ",
                  meta.label
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  " ",
                  timeAgo(r.created_at)
                ] })
              ] }),
              r.order && /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-[11px] text-muted-foreground", children: [
                itemsCount,
                " منتج · ",
                Number(r.order.total ?? 0).toLocaleString("ar-EG"),
                " ج.م"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3.5 space-y-3", children: [
            r.store && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600", children: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold tracking-wider text-muted-foreground", children: "الاستلام" }),
                /* @__PURE__ */ jsx("div", { className: "font-bold text-sm truncate", children: r.store.name_ar }),
                r.store.address && /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground flex items-start gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: r.store.address })
                ] }),
                r.store.phone && /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxs("a", { href: `tel:${r.store.phone}`, className: "inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold hover:bg-secondary", children: [
                    /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
                    " اتصال"
                  ] }),
                  r.store.whatsapp && /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${r.store.whatsapp.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 px-2.5 py-1 text-[10px] font-bold", children: [
                    /* @__PURE__ */ jsx(MessageCircle, { className: "h-3 w-3" }),
                    " واتساب"
                  ] })
                ] })
              ] })
            ] }),
            r.order && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pr-4", children: [
              /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-gradient-to-b from-amber-500/40 to-emerald-500/40" }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground -rotate-90" }),
              /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" })
            ] }),
            r.order && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600", children: /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold tracking-wider text-muted-foreground", children: "التسليم" }),
                /* @__PURE__ */ jsx("div", { className: "font-bold text-sm", children: "عميل آش مول" }),
                r.order.address && /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground flex items-start gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsx("span", { className: "line-clamp-2", children: r.order.address })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-1.5 flex-wrap", children: [
                  r.order.phone && /* @__PURE__ */ jsxs("a", { href: `tel:${r.order.phone}`, className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold", children: [
                    /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
                    " ",
                    r.order.phone
                  ] }),
                  r.order.address && /* @__PURE__ */ jsxs("a", { href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.order.address)}`, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold hover:bg-secondary", children: [
                    /* @__PURE__ */ jsx(Navigation, { className: "h-3 w-3" }),
                    " خرائط"
                  ] })
                ] })
              ] })
            ] }),
            r.order?.order_items?.length > 0 && /* @__PURE__ */ jsxs("details", { className: "rounded-2xl bg-secondary/40 border border-border/60 px-3 py-2 text-[11px] [&_summary]:cursor-pointer", children: [
              /* @__PURE__ */ jsxs("summary", { className: "font-bold flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "تفاصيل الأوردر (",
                  itemsCount,
                  " قطعة)"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "tabular-nums text-primary", children: [
                  Number(r.order.total).toLocaleString("ar-EG"),
                  " ج.م"
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-1", children: r.order.order_items.map((it, i) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "× ",
                  it.quantity,
                  " ",
                  it.name
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
                  (Number(it.price ?? 0) * it.quantity).toLocaleString("ar-EG"),
                  " ج"
                ] })
              ] }, i)) }),
              r.order.notes && /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-2 border-t border-border/60 text-[11px]", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: "ملاحظات: " }),
                r.order.notes
              ] })
            ] })
          ] }),
          r.status !== "delivered" && r.status !== "cancelled" && /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4 flex gap-2", children: [
            r.status === "pending" && /* @__PURE__ */ jsxs("button", { onClick: () => act(r.id, "accept"), disabled: busy === r.id, className: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary text-primary-foreground px-3 py-3 text-xs font-bold shadow-sm hover:opacity-95 disabled:opacity-50", children: [
              busy === r.id ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
              "قبول الطلب"
            ] }),
            r.status === "accepted" && /* @__PURE__ */ jsxs("button", { onClick: () => act(r.id, "picked_up"), disabled: busy === r.id, className: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 text-white px-3 py-3 text-xs font-bold hover:opacity-95 disabled:opacity-50", children: [
              /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
              " استلمت من المتجر"
            ] }),
            r.status === "picked_up" && /* @__PURE__ */ jsxs("button", { onClick: () => act(r.id, "delivered"), disabled: busy === r.id, className: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 text-white px-3 py-3 text-xs font-bold hover:opacity-95 disabled:opacity-50", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
              " تم التسليم"
            ] }),
            (r.status === "pending" || r.status === "accepted") && /* @__PURE__ */ jsx("button", { onClick: () => act(r.id, "cancel"), disabled: busy === r.id, className: "rounded-2xl border border-border bg-background px-3 py-3 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50", children: "رفض" })
          ] }),
          r.status === "delivered" && /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3 py-2.5 text-xs font-bold inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Wallet, { className: "h-3.5 w-3.5" }),
            " تم تحصيل الأوردر بنجاح"
          ] }) })
        ] }, r.id);
      }) }) })
    ] })
  ] });
}
export {
  DeliveryDashboard as component
};
