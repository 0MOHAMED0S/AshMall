import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { j as listMyStoreProducts, f as createProduct, h as deleteProduct, u as useAuth, k as listMyStores, l as listCategoriesWithCounts } from "./router-B21PHlE4.js";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Package, Plus, Trash2, Store, CheckCircle2, Clock, Star, Tag, MapPin, ChevronDown, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
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
import "./client-1xsKmu53.js";
import "@supabase/supabase-js";
import "./auth-middleware-tARyaGyP.js";
function OwnerProductsManager({ storeId }) {
  const fetchMine = useServerFn(listMyStoreProducts);
  const create = useServerFn(createProduct);
  const del = useServerFn(deleteProduct);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-products", storeId],
    queryFn: () => fetchMine({ data: { storeId } })
  });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [section, setSection] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("اكتب اسم المنتج");
      return;
    }
    setBusy(true);
    try {
      await create({ data: {
        store_id: storeId,
        name_ar: name.trim(),
        price: price ? Number(price) : void 0,
        section: section.trim() || void 0,
        image_url: image.trim() || void 0,
        description_ar: desc.trim() || void 0
      } });
      toast.success("تمت إضافة المنتج");
      setName("");
      setPrice("");
      setSection("");
      setImage("");
      setDesc("");
      qc.invalidateQueries({ queryKey: ["my-products", storeId] });
    } catch (e2) {
      toast.error(e2 instanceof Error ? e2.message : "خطأ");
    } finally {
      setBusy(false);
    }
  }
  async function handleDelete(id) {
    if (!confirm("حذف هذا المنتج؟")) return;
    try {
      await del({ data: { id } });
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: ["my-products", storeId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطأ");
    }
  }
  const products = data?.products ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-3xl p-6 sm:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsx(Package, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold", children: "منتجات المتجر" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid sm:grid-cols-2 gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "اسم المنتج *", maxLength: 150, className: "bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" }),
      /* @__PURE__ */ jsx("input", { value: section, onChange: (e) => setSection(e.target.value), placeholder: "القسم (مثل: مأكولات، أدوية)", maxLength: 80, className: "bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" }),
      /* @__PURE__ */ jsx("input", { type: "number", min: 0, step: "0.01", value: price, onChange: (e) => setPrice(e.target.value), placeholder: "السعر (جنيه)", className: "bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 tabular-nums" }),
      /* @__PURE__ */ jsx("input", { type: "url", value: image, onChange: (e) => setImage(e.target.value), placeholder: "رابط الصورة (اختياري)", className: "bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" }),
      /* @__PURE__ */ jsx("textarea", { value: desc, onChange: (e) => setDesc(e.target.value), placeholder: "وصف قصير (اختياري)", maxLength: 800, rows: 2, className: "sm:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 transition active:scale-95 disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " ",
        busy ? "..." : "إضافة منتج"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "h-16 rounded-xl bg-secondary/30 animate-pulse" }),
      !isLoading && products.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "لا توجد منتجات بعد." }),
      products.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-secondary/30 border border-border p-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg overflow-hidden bg-secondary shrink-0", children: p.image_url && /* @__PURE__ */ jsx("img", { src: p.image_url, alt: "", className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm truncate", children: p.name_ar }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
            p.section && /* @__PURE__ */ jsx("span", { children: p.section }),
            p.price != null && /* @__PURE__ */ jsxs("span", { className: "tabular-nums", children: [
              "· ",
              Number(p.price).toFixed(2),
              " ",
              p.currency
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(p.id), "aria-label": "حذف", className: "grid place-items-center h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 transition", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, p.id))
    ] })
  ] });
}
function Dashboard() {
  const {
    user
  } = useAuth();
  const fetchMine = useServerFn(listMyStores);
  const fetchCats = useServerFn(listCategoriesWithCounts);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["my-stores"],
    queryFn: () => fetchMine()
  });
  const {
    data: catsData
  } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => fetchCats()
  });
  const stores = data?.stores ?? [];
  const categories = catsData?.categories ?? [];
  const grouped = useMemo(() => {
    const catById = new Map(categories.map((c) => [c.id, c]));
    const map = /* @__PURE__ */ new Map();
    for (const s of stores) {
      const cid = s.category_id ?? "uncategorized";
      if (!map.has(cid)) map.set(cid, {
        cat: catById.get(cid) ?? null,
        items: []
      });
      map.get(cid).items.push(s);
    }
    return Array.from(map.entries());
  }, [stores, categories]);
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-28 pb-20 mx-auto max-w-6xl px-5 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "animate-rise", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-primary font-medium", children: "لوحة التحكم" }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-2 font-display text-3xl sm:text-5xl font-extrabold text-gradient-soft", children: [
          "أهلاً، ",
          user?.user_metadata?.full_name ?? user?.email?.split("@")[0]
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "إدارة متاجرك، الإحصاءات، والحملات." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-rise reveal-delay-1", children: [{
        label: "متاجرك",
        value: stores.length,
        icon: Store
      }, {
        label: "موثّقة",
        value: stores.filter((s) => s.status === "approved").length,
        icon: CheckCircle2
      }, {
        label: "قيد المراجعة",
        value: stores.filter((s) => s.status === "pending").length,
        icon: Clock
      }, {
        label: "متوسط التقييم",
        value: stores.length ? (stores.reduce((a, s) => a + Number(s.rating), 0) / stores.length).toFixed(1) : "—",
        icon: Star
      }].map(({
        label,
        value,
        icon: Icon
      }) => /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs", children: label }),
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 font-display text-3xl font-extrabold", children: value })
      ] }, label)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-end justify-between flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-primary", style: {
            boxShadow: "var(--shadow-chip)"
          }, children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
            " متاجرك"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-1.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.4] py-1", children: "المتاجر مجمّعة حسب الفئة" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/dashboard/new-store", className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition active:scale-95 glow-ring shadow-lg", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " إضافة متجر"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-8", children: [
        isLoading && Array.from({
          length: 2
        }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "glass-card rounded-2xl p-5 h-24 shimmer" }, i)),
        !isLoading && stores.length === 0 && /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-3xl p-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-secondary border border-border text-primary", children: /* @__PURE__ */ jsx(Store, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("h3", { className: "mt-5 font-display text-xl font-bold", children: "لا توجد متاجر بعد" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "سجّل متجرك الحقيقي في أشمون وابدأ استقبال العملاء." }),
          /* @__PURE__ */ jsxs(Link, { to: "/dashboard/new-store", className: "mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 transition glow-ring", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " سجّل متجرك الأول"
          ] })
        ] }),
        grouped.map(([key, {
          cat,
          items
        }]) => /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-9 w-9 rounded-xl bg-primary-soft text-primary text-base", children: cat?.icon ?? /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold tracking-tight", children: cat?.name_ar ?? "بدون فئة" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              "(",
              items.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gradient-to-l from-border to-transparent" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: items.map((s) => /* @__PURE__ */ jsx(StoreRow, { store: s }, s.id)) })
        ] }, key))
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function StatusBadge({
  status
}) {
  const cfg = {
    approved: {
      label: "موثّق",
      cls: "bg-primary/15 text-primary border-primary/30",
      Icon: CheckCircle2
    },
    pending: {
      label: "قيد المراجعة",
      cls: "bg-amber-500/15 text-amber-600 border-amber-500/30",
      Icon: Clock
    },
    rejected: {
      label: "مرفوض",
      cls: "bg-destructive/15 text-destructive border-destructive/30",
      Icon: XCircle
    },
    suspended: {
      label: "موقوف",
      cls: "bg-destructive/15 text-destructive border-destructive/30",
      Icon: XCircle
    }
  };
  const c = cfg[status] ?? cfg.pending;
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${c.cls}`, children: [
    /* @__PURE__ */ jsx(c.Icon, { className: "h-2.5 w-2.5" }),
    " ",
    c.label
  ] });
}
function StoreRow({
  store: s
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl overflow-hidden transition hover:border-primary/40", style: {
    boxShadow: "var(--shadow-elevated)"
  }, children: [
    /* @__PURE__ */ jsxs("button", { onClick: () => setOpen((v) => !v), className: "w-full p-4 flex items-center gap-4 hover:bg-secondary/20 transition text-right", children: [
      /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-2xl overflow-hidden bg-secondary border border-border grid place-items-center shrink-0", children: s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-display text-xl font-extrabold text-primary", children: s.name_ar.slice(0, 1) }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display font-bold truncate", children: s.name_ar }),
          /* @__PURE__ */ jsx(StatusBadge, { status: s.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: s.address })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs shrink-0", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-2 py-1", children: [
          /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-amber-500 text-amber-500" }),
          /* @__PURE__ */ jsx("span", { className: "tabular-nums font-bold", children: Number(s.rating).toFixed(1) }),
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "(",
            s.rating_count,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
      ] })
    ] }),
    open && /* @__PURE__ */ jsx("div", { className: "border-t border-border p-5 bg-secondary/10", children: /* @__PURE__ */ jsx(OwnerProductsManager, { storeId: s.id }) })
  ] });
}
export {
  Dashboard as component
};
