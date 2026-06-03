import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { BottomTabBar } from "@/components/ash/BottomTabBar";
import { getProductById } from "@/lib/products.functions";
import { useCartAdd } from "@/hooks/use-cart-add";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  ShoppingBag, Heart, Share2, ArrowRight, Star, BadgeCheck,
  Minus, Plus, MapPin, ShieldCheck, ImageOff,
} from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  params: {
    parse: (raw) => z.object({ id: z.string().uuid() }).parse(raw),
    stringify: (p) => ({ id: p.id }),
  },
  loader: async ({ params }) => {
    const { product } = await getProductById({ data: { id: params.id } });
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const store = p?.stores;
    const title = p ? `${p.name_ar} — ${store?.name_ar ?? "آش مول"}` : "منتج";
    const desc = p?.description_ar ?? `${p?.name_ar ?? "منتج"} متوفر الآن في ${store?.name_ar ?? "متجر موثّق"}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.image_url ? [{ property: "og:image", content: p.image_url }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center" dir="rtl">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">المنتج غير موجود</h1>
        <Link to="/stores" className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm">كل المتاجر</Link>
      </div>
    </div>
  ),
  errorComponent: () => <div className="min-h-screen grid place-items-center"><p className="text-muted-foreground">حدث خطأ ما.</p></div>,
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const store = product.stores as {
    id: string; slug: string; name_ar: string; name_en: string | null;
    logo_url: string | null; rating: number; rating_count: number;
    address: string; phone: string | null; whatsapp: string | null;
    categories: { slug: string; name_ar: string } | null;
  };
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const images = [product.image_url, product.image_url_extra].filter(Boolean) as string[];
  const discount = product.compare_at_price && product.price ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) : 0;
  const hue = (product.id.charCodeAt(0) * 17) % 360;

  async function handleAdd() {
    if (!user) { navigate({ to: "/auth", search: { redirect: window.location.pathname } }); return; }
    setBusy(true);
    try {
      await addToCartGuarded({ store_id: store.id, name: product.name_ar, quantity: qty, price: product.price ?? undefined });
      toast.success(`أُضيف ${qty} للسلة`);
    } catch (e) { if ((e as Error).message !== "تم الإلغاء") toast.error(e instanceof Error ? e.message : "حدث خطأ"); }
    finally { setBusy(false); }
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name_ar, text: product.description_ar ?? "", url }); return; } catch { /* cancelled */ }
    }
    try { await navigator.clipboard.writeText(url); toast.success("تم نسخ الرابط"); }
    catch { toast.error("تعذّر النسخ"); }
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap">
            <Link to="/" className="hover:text-foreground transition">الرئيسية</Link>
            <span>/</span>
            <Link to="/stores" className="hover:text-foreground transition">المتاجر</Link>
            <span>/</span>
            <Link to="/stores/$slug" params={{ slug: store.slug }} className="hover:text-foreground transition truncate max-w-[140px]">{store.name_ar}</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[180px]">{product.name_ar}</span>
          </nav>

          <Link to="/stores/$slug" params={{ slug: store.slug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-4">
            <ArrowRight className="h-4 w-4" /> العودة إلى {store.name_ar}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Gallery */}
            <div>
              <div className="relative aspect-square rounded-3xl overflow-hidden glass-card" style={{ background: `radial-gradient(120% 90% at 30% 25%, oklch(0.95 0.02 ${hue}) 0%, oklch(0.88 0.03 ${hue}) 70%)` }}>
                {images.length > 0 ? (
                  <img src={images[activeImg]} alt={product.name_ar} className="absolute inset-0 h-full w-full object-contain p-6" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <ImageOff className="h-16 w-16 opacity-30" />
                  </div>
                )}

                {discount > 0 && (
                  <span className="absolute top-3 right-3 rounded-full bg-destructive text-destructive-foreground px-3 py-1 text-xs font-bold tabular-nums">
                    خصم {discount}%
                  </span>
                )}
                {!product.is_available && (
                  <div className="absolute inset-0 bg-background/80 grid place-items-center text-base font-bold text-destructive backdrop-blur-sm">غير متوفر حالياً</div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${i === activeImg ? "border-primary" : "border-border hover:border-primary/40"}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {store.categories?.name_ar && (
                <Link
                  to="/categories/$slug"
                  params={{ slug: store.categories.slug }}
                  className="inline-flex w-fit items-center rounded-full bg-secondary border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground transition mb-3"
                >
                  {store.categories.name_ar}
                </Link>
              )}

              <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">{product.name_ar}</h1>

              <div className="mt-3 flex items-center gap-3 flex-wrap text-sm">
                <div className="inline-flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                  ))}
                  <span className="tabular-nums ms-1 text-muted-foreground text-xs">({Math.max(3, product.order_count)} تقييم)</span>
                </div>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> ضمان جودة
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                {product.price != null ? (
                  <>
                    <span className="font-display text-4xl sm:text-5xl font-extrabold text-primary tabular-nums">
                      {Number(product.price).toFixed(0)}<span className="text-lg font-bold ms-1">ج</span>
                    </span>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <span className="text-base line-through text-muted-foreground tabular-nums">{Number(product.compare_at_price).toFixed(0)} ج</span>
                    )}
                  </>
                ) : (
                  <span className="text-base text-muted-foreground">السعر عند الطلب</span>
                )}
              </div>

              {product.description_ar && (
                <p className="mt-5 text-sm sm:text-base text-foreground/85 leading-relaxed">{product.description_ar}</p>
              )}

              {product.section && (
                <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1 text-xs text-muted-foreground">
                  القسم: <span className="text-foreground font-medium">{product.section}</span>
                </div>
              )}

              {/* Qty */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">الكمية</span>
                <div className="inline-flex items-center rounded-full bg-secondary/60 border border-border overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-secondary transition" aria-label="نقص">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-display font-bold tabular-nums">{qty}</span>
                  <button onClick={() => setQty(Math.min(99, qty + 1))} className="p-2.5 hover:bg-secondary transition" aria-label="زيادة">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  onClick={handleAdd}
                  disabled={!product.is_available || busy}
                  className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold transition hover:opacity-95 active:scale-[0.98] disabled:opacity-40 glow-ring"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {busy ? "جارٍ الإضافة…" : "أضف للسلة"}
                </button>
                <button
                  onClick={() => setFav(!fav)}
                  aria-label="مفضلة"
                  className={`grid place-items-center h-12 w-12 rounded-full border transition ${fav ? "bg-primary/15 border-primary/40 text-primary" : "glass hover:border-primary/40"}`}
                >
                  <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="مشاركة"
                  className="grid place-items-center h-12 w-12 rounded-full glass hover:border-primary/40 transition"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Store card */}
              <Link
                to="/stores/$slug"
                params={{ slug: store.slug }}
                className="mt-6 group flex items-center gap-3 rounded-2xl glass-card p-3 hover:border-primary/40 transition"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/40 grid place-items-center shrink-0">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display font-bold text-primary">{store.name_ar.slice(0, 1)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-display font-bold text-sm truncate">{store.name_ar}</span>
                    <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /><span className="tabular-nums">{Number(store.rating).toFixed(1)}</span></span>
                    <span className="inline-flex items-center gap-1 truncate"><MapPin className="h-3 w-3" /> <span className="truncate">{store.address}</span></span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition rotate-180" />
              </Link>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
