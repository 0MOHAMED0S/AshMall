import { useEffect, useMemo, useState } from "react";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate, Link } from "@tanstack/react-router";
import { listProductsByStore } from "@/lib/products.functions";
import { useCartAdd } from "@/hooks/use-cart-add";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  Heart, Search, SlidersHorizontal, Grid3x3, List, X,
  ShoppingBag, Star, ImageOff, Sparkles, Flame, Tag,
} from "lucide-react";

interface Product {
  id: string;
  name_ar: string;
  description_ar: string | null;
  price: number | null;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  image_url_extra: string | null;
  section: string | null;
  is_available: boolean;
  sort_order: number;
  order_count: number;
  created_at: string;
  product_type?: string | null;
}

interface Props {
  storeId: string;
  storeNameEn?: string | null;
  storeNameAr: string;
  categorySlug?: string | null;
}

type SortKey = "popular" | "newest" | "price_asc" | "price_desc" | "discount";

const SORT_LABELS: Record<SortKey, string> = {
  popular: "الأكثر شهرة",
  newest: "الأحدث",
  price_asc: "السعر: الأقل أولاً",
  price_desc: "السعر: الأعلى أولاً",
  discount: "الخصومات أولاً",
};

function ctaForCategory(slug?: string | null) {
  if (!slug) return "أضف للسلة";
  if (slug.includes("restaurant") || slug.includes("cafe")) return "أضف للطلب";
  if (slug.includes("pharm")) return "اطلب الآن";
  return "أضف للسلة";
}

// Deterministic dot colors from product id
function dotsFor(id: string): string[] {
  const palette = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff", "#1f2937"];
  const out: string[] = [];
  for (let i = 0; i < 4; i++) {
    const c = id.charCodeAt((i * 7) % id.length) % palette.length;
    if (!out.includes(palette[c])) out.push(palette[c]);
    if (out.length === 3) break;
  }
  return out;
}

function brandLabel(en?: string | null, ar?: string) {
  if (en && en.trim()) return en.trim().toUpperCase();
  if (ar) return ar.split(" ").slice(0, 2).join(" ");
  return "";
}

export function StoreCatalog({ storeId, storeNameEn, storeNameAr, categorySlug }: Props) {
  const fetchProducts = useServerFn(listProductsByStore);
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const [activeSection, setActiveSection] = useState<string>("الكل");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [priceLimit, setPriceLimit] = useState<number>(0);

  useEffect(() => {
    fetchProducts({ data: { storeId } })
      .then((r) => {
        const list = r.products as unknown as Product[];
        setProducts(list);
        const max = list.reduce((m, p) => Math.max(m, Number(p.price ?? 0)), 0);
        const ceil = Math.ceil(max / 10) * 10 || 1000;
        setMaxPrice(ceil);
        setPriceLimit(ceil);
      })
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, [fetchProducts, storeId]);

  const sections = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => { if (p.section) m.set(p.section, (m.get(p.section) ?? 0) + 1); });
    return [{ name: "الكل", count: products.length }, ...Array.from(m.entries()).map(([name, count]) => ({ name, count }))];
  }, [products]);

  const cta = ctaForCategory(categorySlug);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (activeSection !== "الكل") list = list.filter((p) => p.section === activeSection);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) =>
        p.name_ar.toLowerCase().includes(q) ||
        (p.description_ar?.toLowerCase().includes(q) ?? false) ||
        (p.section?.toLowerCase().includes(q) ?? false),
      );
    }
    if (priceLimit > 0) list = list.filter((p) => (p.price == null ? true : Number(p.price) <= priceLimit));

    switch (sort) {
      case "popular": list.sort((a, b) => b.order_count - a.order_count); break;
      case "newest": list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); break;
      case "price_asc": list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
      case "price_desc": list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1)); break;
      case "discount": list.sort((a, b) => {
        const da = a.compare_at_price && a.price ? (a.compare_at_price - a.price) / a.compare_at_price : 0;
        const db = b.compare_at_price && b.price ? (b.compare_at_price - b.price) / b.compare_at_price : 0;
        return db - da;
      }); break;
    }
    return list;
  }, [products, activeSection, search, sort, priceLimit]);

  function toggleFav(id: string) {
    setFavIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  async function handleAdd(p: Product) {
    if (!user) { navigate({ to: "/auth", search: { redirect: window.location.pathname } }); return; }
    setBusyId(p.id);
    try {
      await addToCartGuarded({ store_id: storeId, name: p.name_ar, price: p.price ?? undefined });
      toast.success("أُضيف إلى السلة");
    } catch (e) { if ((e as Error).message !== "تم الإلغاء") toast.error(e instanceof Error ? e.message : "حدث خطأ"); }
    finally { setBusyId(null); }
  }

  if (loading) {
    return (
      <div className="mt-6 glass-card rounded-3xl p-5 sm:p-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-secondary/30 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-6 glass-card rounded-3xl p-10 text-center">
        <Sparkles className="h-8 w-8 text-primary mx-auto mb-3 opacity-60" />
        <p className="text-muted-foreground">لا توجد منتجات بعد</p>
      </div>
    );
  }

  const brand = brandLabel(storeNameEn, storeNameAr);

  return (
    <section className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      {/* Sidebar (desktop) + Drawer (mobile) */}
      <aside
        className={`${showFilters ? "fixed inset-0 z-50 lg:static lg:z-auto" : "hidden lg:block"}`}
        onClick={(e) => { if (e.target === e.currentTarget) setShowFilters(false); }}
      >
        <div className={`${showFilters ? "absolute right-0 top-0 h-full w-[85%] max-w-[340px] overflow-y-auto" : ""} lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto glass-card rounded-none lg:rounded-3xl p-5`}>
          <div className="flex items-center justify-between mb-4 lg:mb-5">
            <h3 className="font-display text-base font-bold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> الفئات
            </h3>
            <button onClick={() => setShowFilters(false)} className="lg:hidden p-1.5 rounded-full hover:bg-secondary/60">
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="space-y-1">
            {sections.map((s) => {
              const active = activeSection === s.name;
              return (
                <li key={s.name}>
                  <button
                    onClick={() => { setActiveSection(s.name); setShowFilters(false); }}
                    className={`group w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-primary/15 text-primary border border-primary/30" : "hover:bg-secondary/60 text-foreground/80 border border-transparent"}`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/40 group-hover:bg-primary/60"}`} />
                      {s.name}
                    </span>
                    <span className={`text-[10px] tabular-nums rounded-full px-2 py-0.5 ${active ? "bg-primary/20 text-primary" : "bg-secondary/60 text-muted-foreground"}`}>{s.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {maxPrice > 0 && (
            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> السعر</h4>
                <span className="text-[11px] tabular-nums text-muted-foreground">حتى {priceLimit} ج</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={Math.max(1, Math.floor(maxPrice / 50))}
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-muted-foreground">
                <span>0</span><span>{maxPrice} ج</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        {/* Toolbar */}
        <div className="glass-card rounded-2xl p-3 sm:p-4 flex items-center gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-xl bg-secondary/60 border border-border px-3 py-2 text-xs font-medium shrink-0"
            aria-label="الفلاتر"
          >
            <SlidersHorizontal className="h-4 w-4" /> فلتر
          </button>

          <div className="relative flex-1 min-w-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث داخل المتجر…"
              className="w-full rounded-xl bg-secondary/40 border border-border focus:border-primary/50 focus:bg-secondary/60 outline-none text-sm pr-9 pl-3 py-2.5 transition"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1 rounded-xl bg-secondary/40 border border-border p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} aria-label="شبكة">
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} aria-label="قائمة">
              <List className="h-4 w-4" />
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl bg-secondary/40 border border-border text-xs sm:text-sm px-2 sm:px-3 py-2.5 outline-none focus:border-primary/50 shrink-0"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Active chips */}
        {(activeSection !== "الكل" || search || priceLimit < maxPrice) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeSection !== "الكل" && (
              <button onClick={() => setActiveSection("الكل")} className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 text-primary px-3 py-1 text-xs">
                {activeSection} <X className="h-3 w-3" />
              </button>
            )}
            {search && (
              <button onClick={() => setSearch("")} className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs">
                "{search}" <X className="h-3 w-3" />
              </button>
            )}
            {priceLimit < maxPrice && (
              <button onClick={() => setPriceLimit(maxPrice)} className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs">
                حتى {priceLimit} ج <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="mt-3 mb-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground tabular-nums">{filtered.length} منتج</span>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-10 text-center">
            <Search className="h-8 w-8 text-primary mx-auto mb-3 opacity-60" />
            <p className="text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((p, idx) => {
              const discount = p.compare_at_price && p.price ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100) : 0;
              const isNew = (Date.now() - +new Date(p.created_at)) < 1000 * 60 * 60 * 24 * 14;
              const isHot = p.order_count > 20 || idx === 0 && sort === "popular";
              const dots = dotsFor(p.id);
              const fav = favIds.has(p.id);
              const hue = (p.id.charCodeAt(0) * 17) % 360;
              return (
                <article key={p.id} className="group relative flex flex-col rounded-2xl bg-secondary/30 border border-border overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  {/* Image */}
                  <Link to="/products/$id" params={{ id: p.id }} className="block relative aspect-square overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name_ar} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center" style={{ background: `radial-gradient(120% 90% at 30% 25%, oklch(0.32 0.08 ${hue}) 0%, oklch(0.18 0.04 ${hue}) 70%)` }}>
                        <ShoppingBag className="h-12 w-12 opacity-30" style={{ color: `oklch(0.75 0.15 ${hue})` }} />
                      </div>
                    )}

                    {!p.is_available && (
                      <div className="absolute inset-0 bg-background/75 grid place-items-center text-xs font-bold text-destructive backdrop-blur-sm">غير متوفر</div>
                    )}
                  </Link>

                  {/* Top badges (above link, positioned absolutely in card) */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(p.id); }}
                    aria-label="مفضلة"
                    className={`absolute top-2 right-2 z-10 grid place-items-center h-8 w-8 rounded-full backdrop-blur-md transition ${fav ? "bg-primary text-primary-foreground" : "bg-background/60 text-foreground/80 hover:bg-background/80"}`}
                  >
                    <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
                  </button>

                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
                    {discount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] font-bold tabular-nums">
                        خصم {discount}%
                      </span>
                    )}
                    {isHot && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold">
                        <Flame className="h-3 w-3" /> بطل
                      </span>
                    )}
                    {isNew && !isHot && discount === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[10px] font-bold">
                        + جديد
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    {brand && <div className="text-[9px] tracking-[0.18em] uppercase text-primary/80 font-bold truncate">{brand}</div>}
                    <Link to="/products/$id" params={{ id: p.id }} className="font-display text-[13px] sm:text-sm font-bold leading-tight line-clamp-2 min-h-[2.2em] hover:text-primary transition">{p.name_ar}</Link>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-2.5 w-2.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/40"}`} />
                      ))}
                      <span className="tabular-nums ms-0.5">({Math.max(3, p.order_count)})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      {p.price != null ? (
                        <>
                          <span className="font-display text-base sm:text-lg font-extrabold text-primary tabular-nums">
                            {Number(p.price).toFixed(0)}<span className="text-[10px] font-bold ms-0.5">ج</span>
                          </span>
                          {p.compare_at_price && p.compare_at_price > p.price && (
                            <span className="text-[10px] line-through text-muted-foreground tabular-nums">{Number(p.compare_at_price).toFixed(0)} ج</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">السعر عند الطلب</span>
                      )}
                    </div>

                    {p.product_type === "clothing" && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {dots.map((c, i) => (
                          <span key={i} className="h-2.5 w-2.5 rounded-full ring-1 ring-white/15" style={{ background: c }} />
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleAdd(p)}
                      disabled={!p.is_available || busyId === p.id}
                      className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-[13px] font-bold py-2.5 transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed glow-ring"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {busyId === p.id ? "جارٍ…" : cta}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((p) => {
              const discount = p.compare_at_price && p.price ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100) : 0;
              const hue = (p.id.charCodeAt(0) * 17) % 360;
              return (
                <article key={p.id} className="flex gap-3 rounded-2xl bg-secondary/30 border border-border p-2.5 hover:border-primary/40 transition">
                  <Link to="/products/$id" params={{ id: p.id }} className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden shrink-0 block">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name_ar} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center" style={{ background: `radial-gradient(120% 90% at 30% 25%, oklch(0.32 0.08 ${hue}), oklch(0.18 0.04 ${hue}))` }}>
                        <ImageOff className="h-6 w-6 opacity-40" />
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1 flex flex-col">
                    {brand && <div className="text-[9px] tracking-[0.18em] uppercase text-primary/80 font-bold">{brand}</div>}
                    <Link to="/products/$id" params={{ id: p.id }} className="font-display text-sm font-bold line-clamp-2 hover:text-primary transition">{p.name_ar}</Link>
                    {p.description_ar && <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{p.description_ar}</p>}
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        {p.price != null && (
                          <span className="font-display text-base font-extrabold text-primary tabular-nums">{Number(p.price).toFixed(0)} ج</span>
                        )}
                        {discount > 0 && <span className="rounded-full bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[9px] font-bold">-{discount}%</span>}
                      </div>
                      <button
                        onClick={() => handleAdd(p)}
                        disabled={!p.is_available || busyId === p.id}
                        className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 disabled:opacity-40"
                      >
                        <ShoppingBag className="h-3 w-3" /> {cta}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
