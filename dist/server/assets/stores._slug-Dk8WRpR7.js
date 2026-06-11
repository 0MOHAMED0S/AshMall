import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { b as bumpBadges, N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { B as BottomTabBar } from "./BottomTabBar-CDa4C_FS.js";
import { g as createSsrRpc, u as useAuth, m as listProductsByStore, b as Route, n as listStores } from "./router-B21PHlE4.js";
import { MessageSquareHeart, Star, Send, Quote, Heart, Check, Bell, BellRing, Sparkles, SlidersHorizontal, X, Tag, Search, Grid3x3, List, ShoppingBag, Flame, ImageOff, ArrowRight, Store, BadgeCheck, ShieldCheck, Navigation, Share2, CircleDot, Bike, Timer, FileText, MapPin, DoorOpen, DoorClosed } from "lucide-react";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { toast } from "sonner";
import { i as isFavorited, t as toggleFavorite } from "./favorites.functions-CaMhxQwS.js";
import { u as useCartAdd } from "./use-cart-add-B9MCEUQH.js";
import { r as recordRecentStore } from "./RecentlyViewed-CeF32dDS.js";
import "./client-1xsKmu53.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./cart.functions-dSYgTWmf.js";
const listReviews = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(createSsrRpc("18bf852c2c44b492ae1aef921e610b96e97ded65ecc99a6c42a2e28e8095049c"));
const submitReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional()
}).parse(i)).handler(createSsrRpc("ce6a536774dc23197ca25305cdef564d67785441a1af7032509a3acafaa472f0"));
const AVATAR_GRADIENTS = [
  "from-orange-400/40 to-rose-300/20",
  "from-amber-400/40 to-yellow-300/20",
  "from-emerald-400/40 to-teal-300/20",
  "from-sky-400/40 to-indigo-300/20",
  "from-violet-400/40 to-fuchsia-300/20",
  "from-pink-400/40 to-rose-300/20"
];
function pickGradient(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}
function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1e3;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  if (diff < 2592e3) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(date).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}
function Reviews({ storeId }) {
  const { user } = useAuth();
  const fetchReviews = useServerFn(listReviews);
  const submit = useServerFn(submitReview);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const r = await fetchReviews({ data: { storeId } });
      setReviews(r.reviews ?? []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [storeId]);
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((n) => ({
      n,
      count: reviews.filter((r) => r.rating === n).length,
      pct: total ? reviews.filter((r) => r.rating === n).length / total * 100 : 0
    }));
    return { total, avg, dist };
  }, [reviews]);
  const visible = showAll ? reviews : reviews.slice(0, 4);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await submit({ data: { store_id: storeId, rating, comment: comment.trim() || void 0 } });
      setComment("");
      toast.success("شكراً لتقييمك!");
      await load();
    } catch {
      toast.error("تعذّر إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };
  const ratingLabel = ["", "سيء", "مقبول", "جيد", "ممتاز", "رائع جداً"][hoverRating || rating];
  return /* @__PURE__ */ jsxs("section", { className: "mt-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between mb-6 gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.3em] text-primary font-medium", children: "تجارب حقيقية" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight", children: "آراء العملاء" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(MessageSquareHeart, { className: "h-3.5 w-3.5 text-primary" }),
        /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: stats.total }),
        " تقييم"
      ] })
    ] }),
    stats.total > 0 && /* @__PURE__ */ jsx("div", { className: "glass-card rounded-3xl p-5 sm:p-6 mb-6 animate-rise", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-8 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-right sm:border-l sm:border-border sm:pl-8", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display text-5xl sm:text-6xl font-extrabold tabular-nums bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent", children: stats.avg.toFixed(1) }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 flex items-center justify-center sm:justify-start gap-0.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx(Star, { className: `h-4 w-4 ${n <= Math.round(stats.avg) ? "fill-primary text-primary" : "text-muted-foreground/30"}` }, n)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1.5 text-[11px] text-muted-foreground", children: [
          "من ",
          stats.total,
          " تقييم"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: stats.dist.map((d) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 tabular-nums text-muted-foreground", children: d.n }),
        /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-primary text-primary shrink-0" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-700 ease-out",
            style: { width: `${d.pct}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "w-8 text-left tabular-nums text-muted-foreground", children: d.count })
      ] }, d.n)) })
    ] }) }),
    user ? /* @__PURE__ */ jsxs("form", { onSubmit, className: "glass-card rounded-2xl p-5 mb-6 animate-rise", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mb-1", children: [
        [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onMouseEnter: () => setHoverRating(n),
            onMouseLeave: () => setHoverRating(0),
            onClick: () => setRating(n),
            "aria-label": `${n} نجوم`,
            className: "p-1 transition-transform duration-200 hover:scale-125",
            children: /* @__PURE__ */ jsx(Star, { className: `h-7 w-7 transition-colors ${n <= (hoverRating || rating) ? "fill-primary text-primary drop-shadow-[0_0_8px_oklch(0.7_0.19_45_/_0.5)]" : "text-muted-foreground/30"}` })
          },
          n
        )),
        /* @__PURE__ */ jsx("span", { className: "ms-2 text-xs text-muted-foreground", children: ratingLabel })
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: comment,
          onChange: (e) => setComment(e.target.value),
          placeholder: "شارك تجربتك مع هذا المتجر...",
          rows: 3,
          maxLength: 500,
          className: "mt-3 w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 transition resize-none"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground tabular-nums", children: [
          comment.length,
          "/500"
        ] }),
        /* @__PURE__ */ jsxs("button", { disabled: submitting, type: "submit", className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50 active:scale-95 transition shadow-sm hover:shadow-md", children: [
          /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5" }),
          " ",
          submitting ? "جارٍ الإرسال…" : "إرسال التقييم"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-5 mb-6 text-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Link, { to: "/auth", search: { redirect: typeof window !== "undefined" ? window.location.pathname : "/" }, className: "text-primary hover:underline font-medium", children: "سجّل دخولك" }),
      " لإضافة تقييمك."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4", children: loading ? [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-28 rounded-2xl bg-secondary/30 animate-pulse" }, i)) : reviews.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "col-span-full text-center py-12 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(MessageSquareHeart, { className: "h-10 w-10 mx-auto mb-3 text-muted-foreground/40" }),
      "لا توجد تقييمات بعد — كن أول من يقيّم."
    ] }) : visible.map((r, i) => {
      const name = r.profiles?.full_name ?? "مستخدم";
      const grad = pickGradient(r.user_id || r.id);
      return /* @__PURE__ */ jsxs(
        "article",
        {
          style: { animationDelay: `${i * 60}ms` },
          className: "group relative overflow-hidden glass-card rounded-2xl p-5 animate-rise hover:-translate-y-1 hover:border-primary/30 transition-all duration-500",
          children: [
            /* @__PURE__ */ jsx(Quote, { className: "absolute top-3 left-3 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: `h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${grad} grid place-items-center text-sm font-bold ring-1 ring-white/10`, children: r.profiles?.avatar_url ? /* @__PURE__ */ jsx("img", { src: r.profiles.avatar_url, alt: "", className: "h-full w-full rounded-full object-cover" }) : name.slice(0, 1) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold truncate", children: name }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: timeAgo(r.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5 shrink-0", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx(Star, { className: `h-3.5 w-3.5 ${n <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/25"}` }, n)) })
            ] }),
            r.comment && /* @__PURE__ */ jsx("p", { className: "relative mt-3 text-sm text-foreground/90 leading-relaxed line-clamp-4", children: r.comment }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        },
        r.id
      );
    }) }),
    reviews.length > 4 && /* @__PURE__ */ jsx("div", { className: "mt-5 text-center", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setShowAll((s) => !s),
        className: "inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium hover:border-primary/40 transition",
        children: showAll ? "عرض أقل" : `عرض كل التقييمات (${reviews.length})`
      }
    ) })
  ] });
}
function FavoriteButton({ storeId, className }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const check = useServerFn(isFavorited);
  const toggle = useServerFn(toggleFavorite);
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!user) {
      setFav(false);
      return;
    }
    check({ data: { store_id: storeId } }).then((r) => setFav(r.favorited)).catch(() => {
    });
  }, [user, storeId, check]);
  async function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    setBusy(true);
    try {
      const r = await toggle({ data: { store_id: storeId } });
      bumpBadges();
      setFav(r.favorited);
      toast.success(r.favorited ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      disabled: busy,
      "aria-label": "المفضلة",
      className: `grid place-items-center h-9 w-9 rounded-full glass border border-border hover:border-primary/40 transition active:scale-95 ${className ?? ""}`,
      children: /* @__PURE__ */ jsx(Heart, { className: `h-4 w-4 transition ${fav ? "fill-primary text-primary" : "text-muted-foreground"}` })
    }
  );
}
function FollowStoreButton({ storeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const check = useServerFn(isFavorited);
  const toggle = useServerFn(toggleFavorite);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!user) {
      setFollowing(false);
      return;
    }
    check({ data: { store_id: storeId } }).then((r) => setFollowing(r.favorited)).catch(() => {
    });
  }, [user, storeId, check]);
  async function onClick() {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    setBusy(true);
    try {
      const r = await toggle({ data: { store_id: storeId } });
      setFollowing(r.favorited);
      toast.success(r.favorited ? "تمت المتابعة ✓" : "تم إلغاء المتابعة");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      disabled: busy,
      className: `inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-95 shadow-sm
        ${following ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/20" : "bg-primary text-primary-foreground hover:opacity-95 glow-ring"}`,
      children: [
        following ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }),
          " متابَع"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
          " متابعة"
        ] }),
        following && /* @__PURE__ */ jsx(BellRing, { className: "h-3.5 w-3.5 opacity-70 animate-pulse" })
      ]
    }
  );
}
const SORT_LABELS = {
  popular: "الأكثر شهرة",
  newest: "الأحدث",
  price_asc: "السعر: الأقل أولاً",
  price_desc: "السعر: الأعلى أولاً",
  discount: "الخصومات أولاً"
};
function ctaForCategory(slug) {
  if (!slug) return "أضف للسلة";
  if (slug.includes("restaurant") || slug.includes("cafe")) return "أضف للطلب";
  if (slug.includes("pharm")) return "اطلب الآن";
  return "أضف للسلة";
}
function dotsFor(id) {
  const palette = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff", "#1f2937"];
  const out = [];
  for (let i = 0; i < 4; i++) {
    const c = id.charCodeAt(i * 7 % id.length) % palette.length;
    if (!out.includes(palette[c])) out.push(palette[c]);
    if (out.length === 3) break;
  }
  return out;
}
function brandLabel(en, ar) {
  if (en && en.trim()) return en.trim().toUpperCase();
  if (ar) return ar.split(" ").slice(0, 2).join(" ");
  return "";
}
function StoreCatalog({ storeId, storeNameEn, storeNameAr, categorySlug }) {
  const fetchProducts = useServerFn(listProductsByStore);
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [favIds, setFavIds] = useState(/* @__PURE__ */ new Set());
  const [activeSection, setActiveSection] = useState("الكل");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceLimit, setPriceLimit] = useState(0);
  useEffect(() => {
    fetchProducts({ data: { storeId } }).then((r) => {
      const list = r.products;
      setProducts(list);
      const max = list.reduce((m, p) => Math.max(m, Number(p.price ?? 0)), 0);
      const ceil = Math.ceil(max / 10) * 10 || 1e3;
      setMaxPrice(ceil);
      setPriceLimit(ceil);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [fetchProducts, storeId]);
  const sections = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    products.forEach((p) => {
      if (p.section) m.set(p.section, (m.get(p.section) ?? 0) + 1);
    });
    return [{ name: "الكل", count: products.length }, ...Array.from(m.entries()).map(([name, count]) => ({ name, count }))];
  }, [products]);
  const cta = ctaForCategory(categorySlug);
  const filtered = useMemo(() => {
    let list = products.slice();
    if (activeSection !== "الكل") list = list.filter((p) => p.section === activeSection);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) => p.name_ar.toLowerCase().includes(q) || (p.description_ar?.toLowerCase().includes(q) ?? false) || (p.section?.toLowerCase().includes(q) ?? false)
      );
    }
    if (priceLimit > 0) list = list.filter((p) => p.price == null ? true : Number(p.price) <= priceLimit);
    switch (sort) {
      case "popular":
        list.sort((a, b) => b.order_count - a.order_count);
        break;
      case "newest":
        list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
      case "price_asc":
        list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price_desc":
        list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case "discount":
        list.sort((a, b) => {
          const da = a.compare_at_price && a.price ? (a.compare_at_price - a.price) / a.compare_at_price : 0;
          const db = b.compare_at_price && b.price ? (b.compare_at_price - b.price) / b.compare_at_price : 0;
          return db - da;
        });
        break;
    }
    return list;
  }, [products, activeSection, search, sort, priceLimit]);
  function toggleFav(id) {
    setFavIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }
  async function handleAdd(p) {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    setBusyId(p.id);
    try {
      await addToCartGuarded({ store_id: storeId, name: p.name_ar, price: p.price ?? void 0 });
      toast.success("أُضيف إلى السلة");
    } catch (e) {
      if (e.message !== "تم الإلغاء") toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setBusyId(null);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "mt-6 glass-card rounded-3xl p-5 sm:p-7", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-72 rounded-2xl bg-secondary/30 animate-pulse" }, i)) }) });
  }
  if (products.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "mt-6 glass-card rounded-3xl p-10 text-center", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "h-8 w-8 text-primary mx-auto mb-3 opacity-60" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "لا توجد منتجات بعد" })
    ] });
  }
  const brand = brandLabel(storeNameEn, storeNameAr);
  return /* @__PURE__ */ jsxs("section", { className: "mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4", children: [
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: `${showFilters ? "fixed inset-0 z-50 lg:static lg:z-auto" : "hidden lg:block"}`,
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowFilters(false);
        },
        children: /* @__PURE__ */ jsxs("div", { className: `${showFilters ? "absolute right-0 top-0 h-full w-[85%] max-w-[340px] overflow-y-auto" : ""} lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto glass-card rounded-none lg:rounded-3xl p-5`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 lg:mb-5", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-display text-base font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4 text-primary" }),
              " الفئات"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowFilters(false), className: "lg:hidden p-1.5 rounded-full hover:bg-secondary/60", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: sections.map((s) => {
            const active = activeSection === s.name;
            return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setActiveSection(s.name);
                  setShowFilters(false);
                },
                className: `group w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-primary/15 text-primary border border-primary/30" : "hover:bg-secondary/60 text-foreground/80 border border-transparent"}`,
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 truncate", children: [
                    /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/40 group-hover:bg-primary/60"}` }),
                    s.name
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `text-[10px] tabular-nums rounded-full px-2 py-0.5 ${active ? "bg-primary/20 text-primary" : "bg-secondary/60 text-muted-foreground"}`, children: s.count })
                ]
              }
            ) }, s.name);
          }) }),
          maxPrice > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-5 border-t border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4 text-primary" }),
                " السعر"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] tabular-nums text-muted-foreground", children: [
                "حتى ",
                priceLimit,
                " ج"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: maxPrice,
                step: Math.max(1, Math.floor(maxPrice / 50)),
                value: priceLimit,
                onChange: (e) => setPriceLimit(Number(e.target.value)),
                className: "w-full accent-primary"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between text-[11px] tabular-nums text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { children: "0" }),
              /* @__PURE__ */ jsxs("span", { children: [
                maxPrice,
                " ج"
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-3 sm:p-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowFilters(true),
            className: "lg:hidden inline-flex items-center gap-1.5 rounded-xl bg-secondary/60 border border-border px-3 py-2 text-xs font-medium shrink-0",
            "aria-label": "الفلاتر",
            children: [
              /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4" }),
              " فلتر"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "ابحث داخل المتجر…",
              className: "w-full rounded-xl bg-secondary/40 border border-border focus:border-primary/50 focus:bg-secondary/60 outline-none text-sm pr-9 pl-3 py-2.5 transition"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-1 rounded-xl bg-secondary/40 border border-border p-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setView("grid"), className: `p-1.5 rounded-lg transition ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, "aria-label": "شبكة", children: /* @__PURE__ */ jsx(Grid3x3, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setView("list"), className: `p-1.5 rounded-lg transition ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, "aria-label": "قائمة", children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: sort,
            onChange: (e) => setSort(e.target.value),
            className: "rounded-xl bg-secondary/40 border border-border text-xs sm:text-sm px-2 sm:px-3 py-2.5 outline-none focus:border-primary/50 shrink-0",
            children: Object.keys(SORT_LABELS).map((k) => /* @__PURE__ */ jsx("option", { value: k, children: SORT_LABELS[k] }, k))
          }
        )
      ] }),
      (activeSection !== "الكل" || search || priceLimit < maxPrice) && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        activeSection !== "الكل" && /* @__PURE__ */ jsxs("button", { onClick: () => setActiveSection("الكل"), className: "inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 text-primary px-3 py-1 text-xs", children: [
          activeSection,
          " ",
          /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
        ] }),
        search && /* @__PURE__ */ jsxs("button", { onClick: () => setSearch(""), className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs", children: [
          '"',
          search,
          '" ',
          /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
        ] }),
        priceLimit < maxPrice && /* @__PURE__ */ jsxs("button", { onClick: () => setPriceLimit(maxPrice), className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs", children: [
          "حتى ",
          priceLimit,
          " ج ",
          /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 mb-3 flex items-center justify-between", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
        filtered.length,
        " منتج"
      ] }) }),
      filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-3xl p-10 text-center", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-8 w-8 text-primary mx-auto mb-3 opacity-60" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "لا توجد نتائج مطابقة" })
      ] }) : view === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4", children: filtered.map((p, idx) => {
        const discount = p.compare_at_price && p.price ? Math.round((p.compare_at_price - p.price) / p.compare_at_price * 100) : 0;
        const isNew = Date.now() - +new Date(p.created_at) < 1e3 * 60 * 60 * 24 * 14;
        const isHot = p.order_count > 20 || idx === 0 && sort === "popular";
        const dots = dotsFor(p.id);
        const fav = favIds.has(p.id);
        const hue = p.id.charCodeAt(0) * 17 % 360;
        return /* @__PURE__ */ jsxs("article", { className: "group relative flex flex-col rounded-2xl bg-secondary/30 border border-border overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/products/$id", params: { id: p.id }, className: "block relative aspect-square overflow-hidden", children: [
            p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name_ar, loading: "lazy", className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center", style: { background: `radial-gradient(120% 90% at 30% 25%, oklch(0.32 0.08 ${hue}) 0%, oklch(0.18 0.04 ${hue}) 70%)` }, children: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-12 w-12 opacity-30", style: { color: `oklch(0.75 0.15 ${hue})` } }) }),
            !p.is_available && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/75 grid place-items-center text-xs font-bold text-destructive backdrop-blur-sm", children: "غير متوفر" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFav(p.id);
              },
              "aria-label": "مفضلة",
              className: `absolute top-2 right-2 z-10 grid place-items-center h-8 w-8 rounded-full backdrop-blur-md transition ${fav ? "bg-primary text-primary-foreground" : "bg-background/60 text-foreground/80 hover:bg-background/80"}`,
              children: /* @__PURE__ */ jsx(Heart, { className: `h-4 w-4 ${fav ? "fill-current" : ""}` })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none", children: [
            discount > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] font-bold tabular-nums", children: [
              "خصم ",
              discount,
              "%"
            ] }),
            isHot && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold", children: [
              /* @__PURE__ */ jsx(Flame, { className: "h-3 w-3" }),
              " بطل"
            ] }),
            isNew && !isHot && discount === 0 && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[10px] font-bold", children: "+ جديد" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 flex flex-col gap-1.5 flex-1", children: [
            brand && /* @__PURE__ */ jsx("div", { className: "text-[9px] tracking-[0.18em] uppercase text-primary/80 font-bold truncate", children: brand }),
            /* @__PURE__ */ jsx(Link, { to: "/products/$id", params: { id: p.id }, className: "font-display text-[13px] sm:text-sm font-bold leading-tight line-clamp-2 min-h-[2.2em] hover:text-primary transition", children: p.name_ar }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: [
              Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: `h-2.5 w-2.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/40"}` }, i)),
              /* @__PURE__ */ jsxs("span", { className: "tabular-nums ms-0.5", children: [
                "(",
                Math.max(3, p.order_count),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-baseline gap-1.5", children: p.price != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("span", { className: "font-display text-base sm:text-lg font-extrabold text-primary tabular-nums", children: [
                Number(p.price).toFixed(0),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold ms-0.5", children: "ج" })
              ] }),
              p.compare_at_price && p.compare_at_price > p.price && /* @__PURE__ */ jsxs("span", { className: "text-[10px] line-through text-muted-foreground tabular-nums", children: [
                Number(p.compare_at_price).toFixed(0),
                " ج"
              ] })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "السعر عند الطلب" }) }),
            p.product_type === "clothing" && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mt-0.5", children: dots.map((c, i) => /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full ring-1 ring-white/15", style: { background: c } }, i)) }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleAdd(p),
                disabled: !p.is_available || busyId === p.id,
                className: "mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-[13px] font-bold py-2.5 transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed glow-ring",
                children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "h-3.5 w-3.5" }),
                  busyId === p.id ? "جارٍ…" : cta
                ]
              }
            )
          ] })
        ] }, p.id);
      }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: filtered.map((p) => {
        const discount = p.compare_at_price && p.price ? Math.round((p.compare_at_price - p.price) / p.compare_at_price * 100) : 0;
        const hue = p.id.charCodeAt(0) * 17 % 360;
        return /* @__PURE__ */ jsxs("article", { className: "flex gap-3 rounded-2xl bg-secondary/30 border border-border p-2.5 hover:border-primary/40 transition", children: [
          /* @__PURE__ */ jsx(Link, { to: "/products/$id", params: { id: p.id }, className: "relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden shrink-0 block", children: p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: p.name_ar, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "h-full w-full grid place-items-center", style: { background: `radial-gradient(120% 90% at 30% 25%, oklch(0.32 0.08 ${hue}), oklch(0.18 0.04 ${hue}))` }, children: /* @__PURE__ */ jsx(ImageOff, { className: "h-6 w-6 opacity-40" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 flex flex-col", children: [
            brand && /* @__PURE__ */ jsx("div", { className: "text-[9px] tracking-[0.18em] uppercase text-primary/80 font-bold", children: brand }),
            /* @__PURE__ */ jsx(Link, { to: "/products/$id", params: { id: p.id }, className: "font-display text-sm font-bold line-clamp-2 hover:text-primary transition", children: p.name_ar }),
            p.description_ar && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-1 mt-0.5", children: p.description_ar }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                p.price != null && /* @__PURE__ */ jsxs("span", { className: "font-display text-base font-extrabold text-primary tabular-nums", children: [
                  Number(p.price).toFixed(0),
                  " ج"
                ] }),
                discount > 0 && /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[9px] font-bold", children: [
                  "-",
                  discount,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleAdd(p),
                  disabled: !p.is_available || busyId === p.id,
                  className: "inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 disabled:opacity-40",
                  children: [
                    /* @__PURE__ */ jsx(ShoppingBag, { className: "h-3 w-3" }),
                    " ",
                    cta
                  ]
                }
              )
            ] })
          ] })
        ] }, p.id);
      }) })
    ] })
  ] });
}
function StorePage() {
  const {
    store
  } = Route.useLoaderData();
  const hue = Math.abs(store.slug.charCodeAt(0) * 13) % 360;
  const fetchSimilar = useServerFn(listStores);
  const [similar, setSimilar] = useState([]);
  useEffect(() => {
    if (store?.id) recordRecentStore(store.id);
  }, [store?.id]);
  useEffect(() => {
    if (!store.categories?.slug) return;
    fetchSimilar({
      data: {
        categorySlug: store.categories.slug,
        limit: 6
      }
    }).then((r) => {
      setSimilar((r.stores ?? []).filter((s) => s.id !== store.id).slice(0, 3));
    }).catch(() => {
    });
  }, [fetchSimilar, store.categories?.slug, store.id]);
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name_ar,
          text: store.description_ar ?? "",
          url
        });
        return;
      } catch {
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ الرابط");
    } catch {
      toast.error("تعذّر النسخ");
    }
  }
  const mapsUrl = store.latitude && store.longitude ? `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-20 pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative h-[44vh] min-h-[300px] overflow-hidden", children: [
        store.cover_url ? /* @__PURE__ */ jsx("img", { src: store.cover_url, alt: "", className: "absolute inset-0 h-full w-full object-cover scale-105" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: {
          background: `radial-gradient(120% 80% at 20% 20%, oklch(0.62 0.2 ${hue}) 0%, oklch(0.2 0.04 30) 70%, oklch(0.13 0.01 30) 100%)`
        } }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-32 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-primary/20 blur-[120px]" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-5 sm:px-6 -mt-28 relative", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/stores", className: "group inline-flex items-center gap-2 rounded-full glass-strong border border-border/60 hover:border-primary/50 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 mb-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95", children: [
          /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-6 w-6 rounded-full bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsx("span", { children: "كل المتاجر" }),
          /* @__PURE__ */ jsx(Store, { className: "h-3.5 w-3.5 opacity-60" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-strong rounded-3xl p-5 sm:p-10 animate-rise", style: {
          boxShadow: "var(--shadow-elevated)"
        }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start gap-4 sm:gap-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-16 w-16 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40 grid place-items-center", children: [
              store.logo_url ? /* @__PURE__ */ jsx("img", { src: store.logo_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "font-display text-2xl sm:text-3xl font-extrabold text-primary", children: store.name_ar.slice(0, 1) }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 ring-1 ring-white/15 rounded-2xl pointer-events-none" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx("h1", { className: "font-display text-xl sm:text-5xl font-extrabold tracking-tight break-words", children: store.name_ar }),
                /* @__PURE__ */ jsx(BadgeCheck, { className: "h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" })
              ] }),
              store.name_en && /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs sm:text-sm text-muted-foreground", dir: "ltr", children: store.name_en }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-sm", children: [
                store.categories?.name_ar && /* @__PURE__ */ jsx(Link, { to: "/categories/$slug", params: {
                  slug: store.categories.slug
                }, className: "inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs text-foreground hover:border-primary/40 transition", children: store.categories.name_ar }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1 text-xs", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-primary text-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: Number(store.rating).toFixed(1) }),
                  /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                    "(",
                    store.rating_count,
                    ")"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start", children: [
              /* @__PURE__ */ jsx(FavoriteButton, { storeId: store.id }),
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary border border-primary/30 px-3 py-1.5 text-xs", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
                " موثّق"
              ] })
            ] })
          ] }),
          store.description_ar && /* @__PURE__ */ jsx("p", { className: "mt-6 text-[15px] sm:text-base text-foreground/90 leading-relaxed", children: store.description_ar }),
          /* @__PURE__ */ jsxs("div", { className: "mt-7 flex flex-wrap gap-2.5", children: [
            /* @__PURE__ */ jsx(FollowStoreButton, { storeId: store.id }),
            /* @__PURE__ */ jsxs("a", { href: mapsUrl, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium hover:border-primary/40 transition active:scale-95", children: [
              /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4" }),
              " الاتجاهات"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: handleShare, className: "inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium hover:border-primary/40 transition active:scale-95", children: [
              /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }),
              " مشاركة"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(StoreInfoPanel, { store }),
        /* @__PURE__ */ jsx(StoreCatalog, { storeId: store.id, storeNameAr: store.name_ar, storeNameEn: store.name_en, categorySlug: store.categories?.slug ?? null }),
        /* @__PURE__ */ jsx(Reviews, { storeId: store.id }),
        similar.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mt-12 animate-rise reveal-delay-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.3em] text-primary font-medium", children: "قد يعجبك أيضًا" }),
            /* @__PURE__ */ jsx("h2", { className: "mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight", children: "متاجر مشابهة" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4", children: similar.map((s) => {
            const sh = Math.abs(s.slug.charCodeAt(0) * 17) % 360;
            return /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: {
              slug: s.slug
            }, className: "group relative overflow-hidden rounded-2xl glass-card hover:-translate-y-1 hover:border-primary/30 transition-all duration-500", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative h-32 sm:h-36 overflow-hidden", children: [
                s.cover_url ? /* @__PURE__ */ jsx("img", { src: s.cover_url, alt: "", className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: {
                  background: `radial-gradient(120% 80% at 20% 20%, oklch(0.6 0.2 ${sh}) 0%, oklch(0.2 0.04 ${sh}) 70%)`
                } }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "truncate font-display text-sm font-bold", children: s.name_ar }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-primary text-primary" }),
                  /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: Number(s.rating).toFixed(1) })
                ] })
              ] }) })
            ] }, s.id);
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(BottomTabBar, {})
  ] });
}
function parseHM(s) {
  if (!s) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}
function isOpenNow(open, close) {
  const o = parseHM(open);
  const c = parseHM(close);
  if (o == null || c == null) return null;
  const now = /* @__PURE__ */ new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  return o <= c ? t >= o && t < c : t >= o || t < c;
}
function fmtTime(s) {
  if (!s) return "—";
  const n = parseHM(s);
  if (n == null) return s;
  const h = Math.floor(n / 60);
  const m = n % 60;
  const period = h < 12 ? "ص" : "م";
  const h12 = (h + 11) % 12 + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}
function StoreInfoPanel({
  store
}) {
  const open = isOpenNow(store.opening_time, store.closing_time);
  const fee = store.delivery_fee != null ? Number(store.delivery_fee) : null;
  return /* @__PURE__ */ jsxs("section", { className: "mt-8 animate-rise reveal-delay-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3", children: [
      /* @__PURE__ */ jsx(InfoPillar, { icon: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-primary text-primary" }), eyebrow: "التقييم", value: Number(store.rating).toFixed(1), hint: `${store.rating_count.toLocaleString("ar-EG")} مراجعة` }),
      /* @__PURE__ */ jsx(InfoPillar, { icon: /* @__PURE__ */ jsx(CircleDot, { className: `h-4 w-4 ${open === true ? "text-emerald-500" : open === false ? "text-rose-500" : "text-muted-foreground"}` }), eyebrow: "الحالة", value: open === true ? "مفتوح الآن" : open === false ? "مغلق الآن" : "—", hint: open === true ? "يستقبل الطلبات" : open === false ? "خارج ساعات العمل" : "لم تُحدّد المواعيد", accent: open === true ? "emerald" : open === false ? "rose" : "muted" }),
      /* @__PURE__ */ jsx(InfoPillar, { icon: /* @__PURE__ */ jsx(Bike, { className: "h-4 w-4 text-primary" }), eyebrow: "سعر التوصيل", value: fee != null ? `${fee.toLocaleString("ar-EG")} ج` : "حسب العنوان", hint: "يُحتسب وقت الطلب" }),
      /* @__PURE__ */ jsx(InfoPillar, { icon: /* @__PURE__ */ jsx(Timer, { className: "h-4 w-4 text-primary" }), eyebrow: "وقت التجهيز", value: store.prep_time_minutes != null ? `${store.prep_time_minutes} د` : "—", hint: "قبل خروج الطلب" })
    ] }),
    store.legal_name && /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg sm:text-xl font-extrabold tracking-tight", children: "الاسم القانوني" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: "Legal entity" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: "البيانات الرسمية المعتمدة للمتجر داخل المنصة." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 relative overflow-hidden rounded-2xl glass-card p-5 sm:p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "relative font-display text-2xl sm:text-3xl font-extrabold tracking-tight", children: store.legal_name })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg sm:text-xl font-extrabold tracking-tight", children: "تفاصيل عامة" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: "Operations" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: "العنوان ومواعيد العمل اليومية." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-2xl glass-card p-5 sm:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-9 w-9 rounded-xl bg-primary/15 text-primary shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: "العنوان" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm sm:text-base leading-relaxed", children: store.address })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-2.5 sm:gap-3", children: [
          /* @__PURE__ */ jsx(TimeTile, { icon: /* @__PURE__ */ jsx(DoorOpen, { className: "h-4 w-4" }), label: "موعد الفتح", value: fmtTime(store.opening_time) }),
          /* @__PURE__ */ jsx(TimeTile, { icon: /* @__PURE__ */ jsx(DoorClosed, { className: "h-4 w-4" }), label: "موعد الغلق", value: fmtTime(store.closing_time) })
        ] })
      ] })
    ] })
  ] });
}
function InfoPillar({
  icon,
  eyebrow,
  value,
  hint,
  accent = "primary"
}) {
  const accentCls = accent === "emerald" ? "text-emerald-500" : accent === "rose" ? "text-rose-500" : accent === "muted" ? "text-foreground" : "text-foreground";
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl glass-card p-4 sm:p-5", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 h-12 w-12 rounded-full bg-primary/5 blur-2xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: eyebrow }),
      /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-7 w-7 rounded-lg bg-primary/10", children: icon })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `relative mt-3 font-display text-lg sm:text-xl font-extrabold tracking-tight ${accentCls}`, children: value }),
    hint && /* @__PURE__ */ jsx("div", { className: "relative mt-0.5 text-[10px] sm:text-xs text-muted-foreground", children: hint })
  ] });
}
function TimeTile({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-secondary/30 p-3.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.25em]", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-primary", children: icon })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 font-display text-base sm:text-lg font-extrabold tabular-nums", children: value })
  ] });
}
export {
  StorePage as component
};
