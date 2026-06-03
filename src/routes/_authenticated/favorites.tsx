import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { listFavorites, toggleFavorite } from "@/lib/favorites.functions";
import { listProductsByStore } from "@/lib/products.functions";
import { useCartAdd } from "@/hooks/use-cart-add";
import {
  Heart, Star, MapPin, Trash2, Plus, Loader2, ShoppingBag, ChevronLeft, Store as StoreIcon, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "المفضلة — آش مول" }] }),
  component: FavoritesPage,
});

interface Store {
  id: string; slug: string; name_ar: string; rating: number; rating_count: number;
  cover_url: string | null; logo_url: string | null; address: string;
  categories?: { name_ar: string; slug: string } | null;
}
interface FavRow { id: string; store_id: string; stores: Store | null; }
interface Product {
  id: string; name_ar: string; description_ar: string | null;
  price: number | null; compare_at_price: number | null; currency: string;
  image_url: string | null; is_available: boolean;
}
type Tab = "stores" | "products";

function FavoritesPage() {
  const fetchAll = useServerFn(listFavorites);
  const toggle = useServerFn(toggleFavorite);
  const fetchProducts = useServerFn(listProductsByStore);
  const addToCartGuarded = useCartAdd();
  const navigate = useNavigate();
  const router = useRouter();

  const [rows, setRows] = useState<FavRow[]>([]);
  const [productsByStore, setProductsByStore] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("stores");

  useEffect(() => { void reload(); }, []);

  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      const favs = (r.favorites ?? []) as unknown as FavRow[];
      setRows(favs);
      const results = await Promise.all(
        favs.filter((f) => f.stores).map(async (f) => {
          try {
            const res = await fetchProducts({ data: { storeId: f.store_id } });
            return [f.store_id, (res.products ?? []) as Product[]] as const;
          } catch { return [f.store_id, [] as Product[]] as const; }
        }),
      );
      setProductsByStore(Object.fromEntries(results));
    } finally { setLoading(false); }
  }

  const stores = useMemo(() => rows.map((r) => r.stores).filter(Boolean) as Store[], [rows]);
  const allProducts = useMemo(
    () => stores.flatMap((s) => (productsByStore[s.id] ?? []).map((p) => ({ p, s }))),
    [stores, productsByStore],
  );
  const productsCount = allProducts.length;
  const storesCount = stores.length;

  async function removeStore(storeId: string) {
    try {
      await toggle({ data: { store_id: storeId } }); bumpBadges();
      setRows((p) => p.filter((r) => r.store_id !== storeId));
      toast.success("أُزيل المتجر من المفضلة");
    } catch { toast.error("حدث خطأ"); }
  }

  function rememberBack(storeId: string) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cart:back", `/favorites#store-${storeId}`);
    }
  }

  async function addProductToCart(p: Product, storeId: string) {
    if (!p.is_available) { toast.error("المنتج غير متاح حالياً"); return; }
    setAdding(p.id);
    try {
      await addToCartGuarded({ store_id: storeId, name: p.name_ar, quantity: 1, price: p.price ?? undefined });
      rememberBack(storeId);
      setJustAdded(p.id);
      window.setTimeout(() => setJustAdded((cur) => (cur === p.id ? null : cur)), 4000);
      toast.success(`أُضيف "${p.name_ar}" للسلة 🛒`, {
        action: { label: "عرض السلة", onClick: () => navigate({ to: "/cart" }) },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر الإضافة");
    } finally { setAdding(null); }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Nav />
      <main className="pt-36 sm:pt-44 pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <header className="relative mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="font-display font-extrabold tracking-tight text-2xl sm:text-4xl text-foreground">
                  المفضلة
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  مساحتك المختارة بعناية.
                </p>
              </div>
              <button
                onClick={() => router.history.back()}
                aria-label="رجوع"
                className="shrink-0 grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card border border-border hover:border-primary/40 hover:text-primary transition active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <StatCard
              label="المتاجر"
              value={loading ? "…" : storesCount.toLocaleString("ar-EG")}
              tone="teal"
              icon={<StoreIcon className="h-5 w-5" />}
              active={tab === "stores"}
              onClick={() => setTab("stores")}
            />
            <StatCard
              label="المنتجات"
              value={loading ? "…" : productsCount.toLocaleString("ar-EG")}
              tone="amber"
              icon={<ShoppingBag className="h-5 w-5" />}
              active={tab === "products"}
              onClick={() => setTab("products")}
            />
          </div>

          {/* Tabs (segmented) */}
          <div className="mb-6 sm:mb-8 p-1.5 rounded-2xl bg-secondary/60 border border-border grid grid-cols-2 gap-1 text-sm font-bold">
            <TabBtn active={tab === "stores"} onClick={() => setTab("stores")}>المتاجر</TabBtn>
            <TabBtn active={tab === "products"} onClick={() => setTab("products")}>المنتجات</TabBtn>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-secondary/40 animate-pulse" />
              ))}
            </div>
          ) : tab === "stores" ? (
            stores.length === 0 ? (
              <EmptyState
                icon={<StoreIcon className="h-7 w-7" />}
                title="لا توجد متاجر مفضلة بعد"
                desc="تصفّح المتاجر واضغط على ❤️ لحفظها هنا."
                ctaLabel="كل المتاجر"
                ctaTo="/stores"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((s) => {
                  const count = productsByStore[s.id]?.length ?? 0;
                  return (
                    <article
                      key={s.id}
                      id={`store-${s.id}`}
                      className="group relative scroll-mt-28 rounded-3xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:-translate-y-0.5"
                      style={{ boxShadow: "0 8px 24px -14px color-mix(in oklab, var(--foreground) 18%, transparent)" }}
                    >
                      <Link to="/stores/$slug" params={{ slug: s.slug }} className="block relative h-32 sm:h-36 overflow-hidden">
                        {s.cover_url ? (
                          <img src={s.cover_url} alt={s.name_ar} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                        {s.categories?.name_ar && (
                          <span className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold border border-border">
                            {s.categories.name_ar}
                          </span>
                        )}
                      </Link>
                      <div className="-mt-8 px-4 pb-4 relative">
                        <div className="flex items-end gap-3">
                          <div className="h-14 w-14 rounded-2xl ring-2 ring-card bg-muted overflow-hidden grid place-items-center shrink-0 shadow-lg">
                            {s.logo_url ? (
                              <img src={s.logo_url} alt={s.name_ar} className="h-full w-full object-cover" />
                            ) : (<span className="font-bold text-primary text-lg">{s.name_ar[0]}</span>)}
                          </div>
                          <div className="min-w-0 flex-1 pb-1">
                            <Link to="/stores/$slug" params={{ slug: s.slug }} className="block">
                              <h3 className="font-display text-base font-extrabold truncate hover:text-primary transition">{s.name_ar}</h3>
                            </Link>
                          </div>
                          <button
                            onClick={() => void removeStore(s.id)}
                            aria-label="إزالة من المفضلة"
                            className="shrink-0 grid place-items-center h-9 w-9 rounded-full border border-border bg-background hover:border-destructive/40 hover:text-destructive hover:bg-destructive/5 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span className="tabular-nums font-bold text-foreground">{Number(s.rating).toFixed(1)}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{s.address}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/60">
                          <span className="text-[11px] text-muted-foreground tabular-nums">{count} منتج</span>
                          <Link
                            to="/stores/$slug"
                            params={{ slug: s.slug }}
                            className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-bold hover:opacity-95 transition"
                          >
                            زيارة <ChevronLeft className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )
          ) : allProducts.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-7 w-7" />}
              title="لا توجد منتجات محفوظة بعد"
              desc="أضف منتجاتك المفضلة لتجدها هنا بسرعة وبشكل أنيق."
              ctaLabel="تصفّح المتاجر"
              ctaTo="/stores"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {allProducts.map(({ p, s }) => (
                <article key={p.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:border-primary/40 transition">
                  <Link to="/products/$id" params={{ id: p.id }} className="block relative aspect-square overflow-hidden bg-muted">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name_ar} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-muted-foreground"><ShoppingBag className="h-8 w-8" /></div>
                    )}
                    {!p.is_available && (
                      <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm text-xs font-bold text-destructive">غير متاح</div>
                    )}
                  </Link>
                  <div className="p-2.5 sm:p-3 flex flex-col gap-1.5 flex-1">
                    <Link to="/stores/$slug" params={{ slug: s.slug }} className="text-[10px] text-muted-foreground hover:text-primary truncate transition">
                      {s.name_ar}
                    </Link>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight line-clamp-2 min-h-[2.2em]">{p.name_ar}</h3>
                    <div className="flex items-baseline gap-1.5">
                      {p.price != null ? (
                        <span className="text-sm font-extrabold text-primary tabular-nums">
                          {Number(p.price).toFixed(0)} <span className="text-[10px] font-medium text-muted-foreground">{p.currency}</span>
                        </span>
                      ) : (<span className="text-[11px] text-muted-foreground">السعر عند الطلب</span>)}
                      {p.compare_at_price && p.price && p.compare_at_price > p.price && (
                        <span className="text-[10px] line-through text-muted-foreground tabular-nums">{Number(p.compare_at_price).toFixed(0)}</span>
                      )}
                    </div>
                    {justAdded === p.id ? (
                      <Link to="/cart" className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-white py-2 text-xs font-semibold hover:bg-emerald-600 transition active:scale-[0.97]">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        اذهب للسلة
                      </Link>
                    ) : (
                      <button
                        onClick={() => void addProductToCart(p, s.id)}
                        disabled={adding === p.id || !p.is_available}
                        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground py-2 text-xs font-semibold hover:opacity-95 transition active:scale-[0.97] disabled:opacity-50"
                      >
                        {adding === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        أضف للسلة
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({
  label, value, tone, icon, active, onClick,
}: {
  label: string; value: string; tone: "teal" | "amber";
  icon: React.ReactNode; active?: boolean; onClick?: () => void;
}) {
  const palette = tone === "teal"
    ? { bg: "oklch(0.95 0.04 195)", fg: "oklch(0.55 0.13 195)", ring: "oklch(0.85 0.07 195)" }
    : { bg: "oklch(0.96 0.06 70)", fg: "oklch(0.65 0.18 55)", ring: "oklch(0.88 0.1 65)" };
  return (
    <button
      onClick={onClick}
      className={`group text-right rounded-3xl border bg-card p-4 sm:p-5 transition active:scale-[0.98] ${
        active ? "border-primary/50" : "border-border hover:border-primary/30"
      }`}
      style={{ boxShadow: active ? "0 10px 24px -16px color-mix(in oklab, var(--primary) 60%, transparent)" : undefined }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tabular-nums">{value}</div>
        </div>
        <span
          className="grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl shrink-0"
          style={{ background: palette.bg, color: palette.fg, boxShadow: `inset 0 0 0 1px ${palette.ring}` }}
        >
          {icon}
        </span>
      </div>
    </button>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 rounded-xl transition ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({
  icon, title, desc, ctaLabel, ctaTo,
}: { icon: React.ReactNode; title: string; desc: string; ctaLabel: string; ctaTo: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 sm:p-14 text-center">
      <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full grid place-items-center bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h2 className="font-display text-lg sm:text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <Link to={ctaTo} className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition">
        {ctaLabel}
      </Link>
    </div>
  );
}
