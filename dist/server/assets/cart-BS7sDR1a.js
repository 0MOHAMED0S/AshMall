import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { N as Nav, b as bumpBadges } from "./Nav-C1MbaG3s.js";
import { useState, useEffect, useMemo } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { l as listCart, u as updateCartItem, r as removeCartItem, c as clearCart } from "./cart.functions-dSYgTWmf.js";
import { p as placeOrdersFromCart } from "./orders.functions-BZ_Qwic7.js";
import { ArrowRight, Store, ShoppingBag, Receipt, Heart, Trash2, Minus, Plus, Truck, CheckCircle2, Phone, MapPin, StickyNote, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
function CartPage() {
  const fetchAll = useServerFn(listCart);
  const upd = useServerFn(updateCartItem);
  const rm = useServerFn(removeCartItem);
  const wipe = useServerFn(clearCart);
  const place = useServerFn(placeOrdersFromCart);
  const navigate = useNavigate();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [backHref, setBackHref] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("cart:back");
    if (saved) setBackHref(saved);
  }, []);
  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      setRows(r.items ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  const grouped = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const key = r.store_id;
      if (!map.has(key)) map.set(key, {
        store: r.stores,
        items: [],
        total: 0
      });
      const g = map.get(key);
      g.items.push(r);
      g.total += (r.price ?? 0) * r.quantity;
    }
    return Array.from(map.values());
  }, [rows]);
  const grandTotal = rows.reduce((s, r) => s + (r.price ?? 0) * r.quantity, 0);
  const itemsCount = rows.reduce((s, r) => s + r.quantity, 0);
  const storesCount = grouped.length;
  async function setQty(id, q) {
    if (q < 1) return;
    setRows((p) => p.map((r) => r.id === id ? {
      ...r,
      quantity: q
    } : r));
    try {
      await upd({
        data: {
          id,
          quantity: q
        }
      });
      bumpBadges();
    } catch {
      toast.error("تعذّر التحديث");
      void reload();
    }
  }
  async function removeOne(id) {
    setRows((p) => p.filter((r) => r.id !== id));
    try {
      await rm({
        data: {
          id
        }
      });
      bumpBadges();
      toast.success("أُزيل من السلة");
    } catch {
      toast.error("تعذّر الحذف");
      void reload();
    }
  }
  async function clearAll() {
    if (!confirm("تفريغ السلة بالكامل؟")) return;
    try {
      await wipe();
      bumpBadges();
      setRows([]);
      toast.success("تم تفريغ السلة");
    } catch {
      toast.error("حدث خطأ");
    }
  }
  async function submitOrder(e) {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      toast.error("اكتب رقم الهاتف والعنوان");
      return;
    }
    setSubmitting(true);
    try {
      await place({
        data: {
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim() || void 0
        }
      });
      toast.success("تم إرسال طلبك بنجاح");
      setCheckout(false);
      setRows([]);
      navigate({
        to: "/orders"
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-36 sm:pt-44 pb-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 sm:px-6", children: [
      /* @__PURE__ */ jsx("header", { className: "relative mb-6 sm:mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h1", { className: "font-display font-extrabold tracking-tight text-2xl sm:text-4xl text-foreground", children: "السلة" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs sm:text-sm text-muted-foreground", children: "راجع طلبك قبل التأكيد." })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => backHref ? window.location.href = backHref : router.history.back(), "aria-label": "رجوع", className: "shrink-0 grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card border border-border hover:border-primary/40 hover:text-primary transition active:scale-95", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }) })
      ] }) }),
      loading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({
        length: 3
      }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-32 rounded-3xl bg-secondary/40 animate-pulse" }, i)) }) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-6", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "المتاجر", value: storesCount.toLocaleString("ar-EG"), tone: "teal", icon: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }),
          /* @__PURE__ */ jsx(StatCard, { label: "العناصر", value: itemsCount.toLocaleString("ar-EG"), tone: "amber", icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }),
          /* @__PURE__ */ jsx(StatCard, { label: "الإجمالي", value: `${grandTotal.toFixed(0)}`, suffix: "ج.م", tone: "primary", icon: /* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4 sm:h-5 sm:w-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-5 sm:mb-6 flex items-center gap-2 flex-wrap", children: [
          backHref && /* @__PURE__ */ jsxs("a", { href: backHref, onClick: () => {
            sessionStorage.removeItem("cart:back");
          }, className: "inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:text-primary transition px-3 sm:px-4 py-2.5 text-xs font-bold active:scale-[0.97]", children: [
            /* @__PURE__ */ jsx(Heart, { className: "h-3.5 w-3.5" }),
            "العودة للمفضلة"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: clearAll, className: "inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card hover:border-destructive/40 hover:text-destructive transition px-3 sm:px-4 py-2.5 text-xs font-bold active:scale-[0.97]", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
            "تفريغ السلة"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start", children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-4 sm:space-y-5 min-w-0", children: grouped.map((g) => /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-border bg-card p-4 sm:p-5", style: {
            boxShadow: "0 8px 24px -16px color-mix(in oklab, var(--foreground) 18%, transparent)"
          }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap mb-4 pb-4 border-b border-border/60", children: [
              /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
                slug: g.store?.slug ?? ""
              }, className: "flex items-center gap-3 group min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "h-11 w-11 sm:h-12 sm:w-12 rounded-2xl overflow-hidden bg-muted ring-1 ring-border grid place-items-center shrink-0", children: g.store?.logo_url ? /* @__PURE__ */ jsx("img", { src: g.store.logo_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-display text-lg font-bold text-primary", children: g.store?.name_ar.slice(0, 1) }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-display font-extrabold text-sm sm:text-base group-hover:text-primary transition truncate", children: g.store?.name_ar }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                    g.items.length,
                    " عنصر"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-display font-extrabold tabular-nums text-sm sm:text-base text-primary", children: [
                g.total.toFixed(0),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: "ج.م" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border/60", children: g.items.map((it) => /* @__PURE__ */ jsxs("li", { className: "py-3 sm:py-3.5 flex items-start gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-sm leading-tight", children: it.name }),
                it.notes && /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] text-muted-foreground line-clamp-1", children: it.notes }),
                it.price != null && /* @__PURE__ */ jsxs("div", { className: "mt-1.5 text-[11px] text-muted-foreground tabular-nums", children: [
                  it.price.toFixed(0),
                  " × ",
                  it.quantity,
                  " =",
                  /* @__PURE__ */ jsxs("span", { className: "mr-1 text-foreground font-bold", children: [
                    (it.price * it.quantity).toFixed(0),
                    " ج.م"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-0.5", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => void setQty(it.id, it.quantity - 1), className: "grid place-items-center h-7 w-7 rounded-full hover:bg-background transition disabled:opacity-40", disabled: it.quantity <= 1, "aria-label": "إنقاص", children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" }) }),
                  /* @__PURE__ */ jsx("span", { className: "w-6 text-center text-xs font-bold tabular-nums", children: it.quantity }),
                  /* @__PURE__ */ jsx("button", { onClick: () => void setQty(it.id, it.quantity + 1), className: "grid place-items-center h-7 w-7 rounded-full hover:bg-background transition", "aria-label": "زيادة", children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }) })
                ] }),
                /* @__PURE__ */ jsxs("button", { onClick: () => void removeOne(it.id), "aria-label": "حذف", className: "inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-destructive transition", children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }),
                  " حذف"
                ] })
              ] })
            ] }, it.id)) })
          ] }, g.store?.id ?? Math.random())) }),
          /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-28", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-primary/20 bg-card p-5 sm:p-6 space-y-4", style: {
            boxShadow: "0 16px 36px -22px color-mix(in oklab, var(--primary) 60%, transparent)"
          }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-9 w-9 rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Receipt, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("h2", { className: "font-display font-extrabold text-base sm:text-lg", children: "ملخّص الطلب" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsx(Row, { label: "عدد العناصر", value: `${itemsCount.toLocaleString("ar-EG")}` }),
              /* @__PURE__ */ jsx(Row, { label: "عدد المتاجر", value: `${storesCount.toLocaleString("ar-EG")}` }),
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Truck, { className: "h-3.5 w-3.5" }),
                " التوصيل يُحتسب مع المتجر"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between pt-3 border-t border-border", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm text-muted-foreground", children: "الإجمالي" }),
              /* @__PURE__ */ jsxs("span", { className: "font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-primary", children: [
                grandTotal.toFixed(0),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "ج.م" })
              ] })
            ] }),
            !checkout ? /* @__PURE__ */ jsxs("button", { onClick: () => setCheckout(true), className: "w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3.5 text-sm font-bold hover:opacity-95 active:scale-[0.99] transition", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }),
              " إتمام الطلب"
            ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submitOrder, className: "space-y-3 pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsx(Field, { label: "رقم الهاتف *", icon: /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }), children: /* @__PURE__ */ jsx("input", { dir: "ltr", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "01XXXXXXXXX", className: "w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm text-start focus:outline-none focus:border-primary/50 transition" }) }),
              /* @__PURE__ */ jsx(Field, { label: "عنوان التوصيل *", icon: /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }), children: /* @__PURE__ */ jsx("input", { value: address, onChange: (e) => setAddress(e.target.value), placeholder: "الشارع، المنطقة، أقرب علامة مميزة", className: "w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition" }) }),
              /* @__PURE__ */ jsx(Field, { label: "ملاحظات (اختياري)", icon: /* @__PURE__ */ jsx(StickyNote, { className: "h-3.5 w-3.5" }), children: /* @__PURE__ */ jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, className: "w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition resize-none" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setCheckout(false), disabled: submitting, className: "rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold hover:border-border/80 transition disabled:opacity-50", children: "إلغاء" }),
                /* @__PURE__ */ jsxs("button", { type: "submit", disabled: submitting, className: "flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-bold hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60", children: [
                  submitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                  "تأكيد الطلب"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-center text-[11px] text-muted-foreground leading-relaxed", children: "سيتم إرسال طلبك للمتجر مباشرةً وستصلك إشعارات بحالة الطلب." })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs sm:text-sm", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-bold tabular-nums text-sm", children: value })
  ] });
}
function Field({
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1.5", children: [
      icon,
      " ",
      label
    ] }),
    children
  ] });
}
function StatCard({
  label,
  value,
  suffix,
  tone,
  icon
}) {
  const palette = tone === "teal" ? {
    bg: "oklch(0.95 0.04 195)",
    fg: "oklch(0.55 0.13 195)",
    ring: "oklch(0.85 0.07 195)"
  } : tone === "amber" ? {
    bg: "oklch(0.96 0.06 70)",
    fg: "oklch(0.65 0.18 55)",
    ring: "oklch(0.88 0.1 65)"
  } : {
    bg: "color-mix(in oklab, var(--primary) 12%, var(--card))",
    fg: "var(--primary)",
    ring: "color-mix(in oklab, var(--primary) 30%, transparent)"
  };
  return /* @__PURE__ */ jsx("div", { className: "rounded-2xl sm:rounded-3xl border border-border bg-card p-3 sm:p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] sm:text-xs font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "mt-0.5 sm:mt-1 font-display text-lg sm:text-2xl font-extrabold tabular-nums leading-tight", children: [
        value,
        suffix && /* @__PURE__ */ jsx("span", { className: "ms-1 text-[10px] sm:text-xs font-medium text-muted-foreground", children: suffix })
      ] })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl shrink-0", style: {
      background: palette.bg,
      color: palette.fg,
      boxShadow: `inset 0 0 0 1px ${palette.ring}`
    }, children: icon })
  ] }) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-8 sm:p-14 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full grid place-items-center bg-primary/10 text-primary mb-4", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-7 w-7" }) }),
    /* @__PURE__ */ jsx("h2", { className: "font-display text-lg sm:text-xl font-extrabold", children: "سلتك فاضية" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto", children: "تصفّح المتاجر وأضف الطلبات اللي عايزها لتظهر هنا." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(Link, { to: "/stores", className: "inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition", children: "تصفّح المتاجر" }),
      /* @__PURE__ */ jsxs(Link, { to: "/favorites", className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:border-primary/40 hover:text-primary transition", children: [
        /* @__PURE__ */ jsx(Heart, { className: "h-4 w-4" }),
        " المفضلة"
      ] })
    ] })
  ] });
}
export {
  CartPage as component
};
