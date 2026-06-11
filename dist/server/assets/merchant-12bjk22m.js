import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { s as supabase } from "./client-1xsKmu53.js";
import { g as getMerchantDashboard, c as merchantUpdateOrderStatus, m as merchantRequestDelivery } from "./merchant.functions-d0jMkpQL.js";
import { Loader2, Store, Briefcase, LogOut, ShoppingBag, Clock, TrendingUp, Star, Phone, MapPin, CheckCircle2, XCircle, Bike } from "lucide-react";
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
function MerchantDashboard() {
  const navigate = useNavigate();
  const fetchDash = useServerFn(getMerchantDashboard);
  const updateOrder = useServerFn(merchantUpdateOrderStatus);
  const reqDelivery = useServerFn(merchantRequestDelivery);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const reload = useCallback(async () => {
    try {
      const r = await fetchDash();
      setData(r);
    } finally {
      setLoading(false);
    }
  }, [fetchDash]);
  useEffect(() => {
    void reload();
  }, [reload]);
  useEffect(() => {
    const ch = supabase.channel("merchant-orders").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "orders"
    }, () => {
      void reload();
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [reload]);
  async function accept(id) {
    setBusy(id);
    try {
      await updateOrder({
        data: {
          order_id: id,
          status: "confirmed"
        }
      });
      toast.success("تم قبول الطلب");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل");
    } finally {
      setBusy(null);
    }
  }
  async function reject(id) {
    if (!confirm("رفض الطلب؟")) return;
    setBusy(id);
    try {
      await updateOrder({
        data: {
          order_id: id,
          status: "cancelled"
        }
      });
      toast.success("تم الرفض");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل");
    } finally {
      setBusy(null);
    }
  }
  async function requestDelivery(orderId) {
    setBusy(orderId);
    try {
      const r = await reqDelivery({
        data: {
          order_id: orderId
        }
      });
      toast.success("تم تسجيل طلب الدليفري");
      if (r.courier?.whatsapp) {
        const msg = encodeURIComponent(`🚴 طلب دليفري جديد من آش مول

المتجر: ${r.store.name_ar}
عنوان المتجر: ${r.store.address}
رقم المتجر: ${r.store.phone ?? "-"}

📍 عنوان العميل: ${r.order.address ?? "-"}
📞 رقم العميل: ${r.order.phone ?? "-"}
💰 قيمة الأوردر: ${r.order.total} ج

ادخل لوحة الدليفري لتأكيد الاستلام:
${window.location.origin}/delivery/login`);
        const wa = r.courier.whatsapp.replace(/\D/g, "");
        window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
      } else {
        toast.warning("لا يوجد دليفري نشط — تواصل مع الإدارة");
      }
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
      to: "/merchant/login"
    });
  }
  if (loading) return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center", dir: "rtl", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }) });
  if (!data?.store) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center px-5", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
      /* @__PURE__ */ jsx(Store, { className: "h-12 w-12 text-muted-foreground mx-auto" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-xl font-bold", children: "لا يوجد متجر مربوط بحسابك" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "تواصل مع إدارة آش مول لربط متجرك بهذا الحساب." }),
      /* @__PURE__ */ jsx("button", { onClick: signOut, className: "mt-4 text-xs text-muted-foreground underline", children: "تسجيل الخروج" })
    ] }) });
  }
  const s = data.store;
  const stats = data.stats;
  const orders = data.orders ?? [];
  const dr = data.deliveryRequests ?? [];
  const drByOrder = Object.fromEntries(dr.map((r) => [r.order_id, r]));
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-16", dir: "rtl", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-card", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-5 py-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shrink-0", style: {
        background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))"
      }, children: /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: "Merchant Dashboard" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-lg font-extrabold truncate", children: s.name_ar })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
        slug: s.slug
      }, className: "text-xs text-muted-foreground hover:text-foreground hidden sm:inline", children: "عرض المتجر" }),
      /* @__PURE__ */ jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" }),
        " خروج"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-5 mt-6 space-y-6", children: [
      /* @__PURE__ */ jsx("section", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [{
        label: "إجمالي الطلبات",
        value: stats.totalOrders,
        Icon: ShoppingBag
      }, {
        label: "قيد المراجعة",
        value: stats.pendingOrders,
        Icon: Clock
      }, {
        label: "اليوم",
        value: stats.todayOrders,
        Icon: TrendingUp
      }, {
        label: "الإيرادات",
        value: `${stats.revenue.toFixed(0)} ج`,
        Icon: Star
      }].map(({
        label,
        value,
        Icon
      }) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px]", children: label }),
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 font-display text-2xl font-extrabold", children: value })
      ] }, label)) }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold mb-3", children: "الطلبات الواردة" }),
        orders.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm", children: "لا توجد طلبات بعد" }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: orders.map((o) => {
          const deliveryReq = drByOrder[o.id];
          const canRequestDelivery = (o.status === "confirmed" || o.status === "preparing") && !deliveryReq;
          return /* @__PURE__ */ jsx("li", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-start gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-display font-bold", children: [
                  "#",
                  o.id.slice(0, 6)
                ] }),
                /* @__PURE__ */ jsx(OrderStatus, { status: o.status }),
                deliveryReq && /* @__PURE__ */ jsx(DeliveryStatus, { status: deliveryReq.status }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: new Date(o.created_at).toLocaleString("ar-EG") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-muted-foreground space-y-0.5", children: [
                o.phone && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
                  " ",
                  o.phone
                ] }),
                o.address && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 mt-0.5 shrink-0" }),
                  " ",
                  o.address
                ] }),
                o.notes && /* @__PURE__ */ jsxs("div", { className: "italic", children: [
                  "ملاحظات: ",
                  o.notes
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "mt-2 text-xs space-y-0.5", children: (o.order_items ?? []).map((it) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "× ",
                  it.quantity,
                  " ",
                  it.name
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
                  Number(it.price ?? 0) * it.quantity,
                  " ج"
                ] })
              ] }, it.id)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 font-bold text-sm", children: [
                "الإجمالي: ",
                o.total,
                " ج"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto flex flex-col gap-2", children: [
              o.status === "pending" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("button", { onClick: () => accept(o.id), disabled: busy === o.id, className: "inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-3 py-2 text-xs font-bold hover:bg-emerald-500/25 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                  " قبول"
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => reject(o.id), disabled: busy === o.id, className: "inline-flex items-center justify-center gap-1 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 px-3 py-2 text-xs font-bold hover:bg-destructive/20 disabled:opacity-50", children: [
                  /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
                  " رفض"
                ] })
              ] }),
              canRequestDelivery && /* @__PURE__ */ jsxs("button", { onClick: () => requestDelivery(o.id), disabled: busy === o.id, className: "inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 py-2.5 text-xs font-bold hover:opacity-95 disabled:opacity-50 shadow-lg", children: [
                busy === o.id ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Bike, { className: "h-4 w-4" }),
                "اطلب دليفري آش مول الآن"
              ] }),
              deliveryReq && /* @__PURE__ */ jsxs("button", { onClick: () => requestDelivery(o.id), disabled: busy === o.id, className: "inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary border border-border px-3 py-2 text-xs hover:bg-secondary/80", children: [
                /* @__PURE__ */ jsx(Bike, { className: "h-4 w-4" }),
                " فتح واتساب الدليفري"
              ] })
            ] })
          ] }) }, o.id);
        }) })
      ] })
    ] })
  ] });
}
function OrderStatus({
  status
}) {
  const map = {
    pending: {
      label: "جديد",
      cls: "bg-amber-500/15 text-amber-600 border-amber-500/30"
    },
    confirmed: {
      label: "مؤكد",
      cls: "bg-blue-500/15 text-blue-600 border-blue-500/30"
    },
    preparing: {
      label: "تحضير",
      cls: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30"
    },
    delivering: {
      label: "في الطريق",
      cls: "bg-purple-500/15 text-purple-600 border-purple-500/30"
    },
    completed: {
      label: "تم",
      cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
    },
    cancelled: {
      label: "ملغي",
      cls: "bg-destructive/15 text-destructive border-destructive/30"
    }
  };
  const m = map[status] ?? {
    label: status,
    cls: "bg-secondary text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`, children: m.label });
}
function DeliveryStatus({
  status
}) {
  const map = {
    pending: {
      label: "🚴 بانتظار الدليفري",
      cls: "bg-amber-500/15 text-amber-600 border-amber-500/30"
    },
    accepted: {
      label: "🚴 قبل الدليفري",
      cls: "bg-blue-500/15 text-blue-600 border-blue-500/30"
    },
    picked_up: {
      label: "📦 استلم الأوردر",
      cls: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30"
    },
    delivered: {
      label: "✅ تم التسليم",
      cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
    },
    cancelled: {
      label: "ملغي",
      cls: "bg-destructive/15 text-destructive border-destructive/30"
    }
  };
  const m = map[status] ?? {
    label: status,
    cls: "bg-secondary text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`, children: m.label });
}
export {
  MerchantDashboard as component
};
