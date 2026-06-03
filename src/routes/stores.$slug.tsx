import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { BottomTabBar } from "@/components/ash/BottomTabBar";
import { getStoreBySlug, listStores } from "@/lib/stores.functions";
import {
  Star, BadgeCheck, MapPin, ArrowRight,
  ShieldCheck, Share2, Navigation, Sparkles, Store as StoreIcon,
  Bike, Timer, FileText, DoorOpen, DoorClosed, CircleDot,
} from "lucide-react";
import { Reviews } from "@/components/ash/Reviews";
import { FavoriteButton } from "@/components/ash/FavoriteButton";
import { FollowStoreButton } from "@/components/ash/FollowStoreButton";

import { StoreCatalog } from "@/components/ash/StoreCatalog";
import { recordRecentStore } from "@/components/ash/RecentlyViewed";
import { toast } from "sonner";

export const Route = createFileRoute("/stores/$slug")({
  loader: async ({ params }) => {
    const { store } = await getStoreBySlug({ data: { slug: params.slug } });
    if (!store) throw notFound();
    return { store };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.store?.name_ar ?? "متجر"} — آش مول` },
      { name: "description", content: loaderData?.store?.description_ar ?? "متجر موثّق في أشمون." },
      { property: "og:title", content: `${loaderData?.store?.name_ar} — آش مول` },
      { property: "og:description", content: loaderData?.store?.description_ar ?? "" },
      ...(loaderData?.store?.cover_url ? [{ property: "og:image", content: loaderData.store.cover_url }] : []),
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center" dir="rtl">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">المتجر غير موجود</h1>
        <Link to="/stores" className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm">كل المتاجر</Link>
      </div>
    </div>
  ),
  errorComponent: () => <div className="min-h-screen grid place-items-center"><p className="text-muted-foreground">حدث خطأ ما.</p></div>,
  component: StorePage,
});


interface SimilarStore {
  id: string; slug: string; name_ar: string; rating: number;
  cover_url: string | null;
}

function StorePage() {
  const { store } = Route.useLoaderData();
  const hue = Math.abs(store.slug.charCodeAt(0) * 13) % 360;
  const fetchSimilar = useServerFn(listStores);
  const [similar, setSimilar] = useState<SimilarStore[]>([]);

  useEffect(() => {
    if (store?.id) recordRecentStore(store.id);
  }, [store?.id]);

  useEffect(() => {
    if (!store.categories?.slug) return;
    fetchSimilar({ data: { categorySlug: store.categories.slug, limit: 6 } })
      .then((r) => {
        setSimilar(((r.stores ?? []) as unknown as SimilarStore[]).filter((s) => s.id !== store.id).slice(0, 3));
      })
      .catch(() => { /* ignore */ });
  }, [fetchSimilar, store.categories?.slug, store.id]);


  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: store.name_ar, text: store.description_ar ?? "", url }); return; } catch { /* user cancelled */ }
    }
    try { await navigator.clipboard.writeText(url); toast.success("تم نسخ الرابط"); }
    catch { toast.error("تعذّر النسخ"); }
  }

  const mapsUrl = store.latitude && store.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-20 pb-20">
        {/* Cinematic cover */}
        <div className="relative h-[44vh] min-h-[300px] overflow-hidden">
          {store.cover_url ? (
            <img src={store.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover scale-105" />
          ) : (
            <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 20% 20%, oklch(0.62 0.2 ${hue}) 0%, oklch(0.2 0.04 30) 70%, oklch(0.13 0.01 30) 100%)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />
          {/* Soft orange glow */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-5xl px-5 sm:px-6 -mt-28 relative">
          <Link
            to="/stores"
            className="group inline-flex items-center gap-2 rounded-full glass-strong border border-border/60 hover:border-primary/50 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/90 hover:text-primary transition-all duration-300 mb-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <span className="grid place-items-center h-6 w-6 rounded-full bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span>كل المتاجر</span>
            <StoreIcon className="h-3.5 w-3.5 opacity-60" />
          </Link>


          <div className="glass-strong rounded-3xl p-5 sm:p-10 animate-rise" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="flex flex-wrap items-start gap-4 sm:gap-5">
              {/* Logo bubble */}
              <div className="relative h-16 w-16 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40 grid place-items-center">
                {store.logo_url ? (
                  <img src={store.logo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-primary">{store.name_ar.slice(0, 1)}</span>
                )}
                <div className="absolute inset-0 ring-1 ring-white/15 rounded-2xl pointer-events-none" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl sm:text-5xl font-extrabold tracking-tight break-words">{store.name_ar}</h1>
                  <BadgeCheck className="h-5 w-5 sm:h-7 sm:w-7 text-primary shrink-0" />
                </div>
                {store.name_en && <div className="mt-1 text-xs sm:text-sm text-muted-foreground" dir="ltr">{store.name_en}</div>}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  {store.categories?.name_ar && (
                    <Link to="/categories/$slug" params={{ slug: store.categories.slug }} className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1 text-xs text-foreground hover:border-primary/40 transition">
                      {store.categories.name_ar}
                    </Link>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="tabular-nums">{Number(store.rating).toFixed(1)}</span>
                    <span className="text-muted-foreground">({store.rating_count})</span>
                  </span>
                </div>

              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                <FavoriteButton storeId={store.id} />
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary border border-primary/30 px-3 py-1.5 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5" /> موثّق
                </div>
              </div>
            </div>

            {store.description_ar && (
              <p className="mt-6 text-[15px] sm:text-base text-foreground/90 leading-relaxed">{store.description_ar}</p>
            )}

            {/* Action bar — orders flow through the website only, no direct contact */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <FollowStoreButton storeId={store.id} />
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium hover:border-primary/40 transition active:scale-95">
                <Navigation className="h-4 w-4" /> الاتجاهات
              </a>
              <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-medium hover:border-primary/40 transition active:scale-95">
                <Share2 className="h-4 w-4" /> مشاركة
              </button>
            </div>

          </div>


          {/* Editorial info pillars — replaces the old "stats bar" */}
          <StoreInfoPanel store={store} />

          <StoreCatalog
            storeId={store.id}
            storeNameAr={store.name_ar}
            storeNameEn={store.name_en}
            categorySlug={store.categories?.slug ?? null}
          />



          <Reviews storeId={store.id} />

          {/* Similar stores */}
          {similar.length > 0 && (
            <section className="mt-12 animate-rise reveal-delay-2">
              <div className="mb-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium">قد يعجبك أيضًا</div>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">متاجر مشابهة</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {similar.map((s) => {
                  const sh = Math.abs(s.slug.charCodeAt(0) * 17) % 360;
                  return (
                    <Link key={s.id} to="/stores/$slug" params={{ slug: s.slug }} className="group relative overflow-hidden rounded-2xl glass-card hover:-translate-y-1 hover:border-primary/30 transition-all duration-500">
                      <div className="relative h-32 sm:h-36 overflow-hidden">
                        {s.cover_url ? (
                          <img src={s.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0" style={{ background: `radial-gradient(120% 80% at 20% 20%, oklch(0.6 0.2 ${sh}) 0%, oklch(0.2 0.04 ${sh}) 70%)` }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                      </div>
                      <div className="p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-display text-sm font-bold">{s.name_ar}</h3>
                          <span className="inline-flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-primary text-primary" /><span className="tabular-nums">{Number(s.rating).toFixed(1)}</span></span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}

// ---------- Editorial info panel ----------
type StoreInfo = {
  rating: number;
  rating_count: number;
  delivery_fee: number | string | null;
  prep_time_minutes: number | null;
  legal_name: string | null;
  address: string;
  opening_time: string | null;
  closing_time: string | null;
};

function parseHM(s: string | null): number | null {
  if (!s) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function isOpenNow(open: string | null, close: string | null): boolean | null {
  const o = parseHM(open); const c = parseHM(close);
  if (o == null || c == null) return null;
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  return o <= c ? t >= o && t < c : t >= o || t < c; // handles overnight
}

function fmtTime(s: string | null): string {
  if (!s) return "—";
  const n = parseHM(s); if (n == null) return s;
  const h = Math.floor(n / 60); const m = n % 60;
  const period = h < 12 ? "ص" : "م";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function StoreInfoPanel({ store }: { store: StoreInfo }) {
  const open = isOpenNow(store.opening_time, store.closing_time);
  const fee = store.delivery_fee != null ? Number(store.delivery_fee) : null;
  return (
    <section className="mt-8 animate-rise reveal-delay-1">
      {/* Pillar quad — 4 editorial info tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <InfoPillar
          icon={<Star className="h-4 w-4 fill-primary text-primary" />}
          eyebrow="التقييم"
          value={Number(store.rating).toFixed(1)}
          hint={`${store.rating_count.toLocaleString("ar-EG")} مراجعة`}
        />
        <InfoPillar
          icon={
            <CircleDot className={`h-4 w-4 ${open === true ? "text-emerald-500" : open === false ? "text-rose-500" : "text-muted-foreground"}`} />
          }
          eyebrow="الحالة"
          value={open === true ? "مفتوح الآن" : open === false ? "مغلق الآن" : "—"}
          hint={open === true ? "يستقبل الطلبات" : open === false ? "خارج ساعات العمل" : "لم تُحدّد المواعيد"}
          accent={open === true ? "emerald" : open === false ? "rose" : "muted"}
        />
        <InfoPillar
          icon={<Bike className="h-4 w-4 text-primary" />}
          eyebrow="سعر التوصيل"
          value={fee != null ? `${fee.toLocaleString("ar-EG")} ج` : "حسب العنوان"}
          hint="يُحتسب وقت الطلب"
        />
        <InfoPillar
          icon={<Timer className="h-4 w-4 text-primary" />}
          eyebrow="وقت التجهيز"
          value={store.prep_time_minutes != null ? `${store.prep_time_minutes} د` : "—"}
          hint="قبل خروج الطلب"
        />
      </div>

      {/* Legal name — editorial typographic block */}
      {store.legal_name && (
        <div className="mt-8">
          <div className="flex items-baseline gap-3">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">الاسم القانوني</h3>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Legal entity</span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">البيانات الرسمية المعتمدة للمتجر داخل المنصة.</p>
          <div className="mt-3 relative overflow-hidden rounded-2xl glass-card p-5 sm:p-6">
            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative font-display text-2xl sm:text-3xl font-extrabold tracking-tight">{store.legal_name}</div>
          </div>
        </div>
      )}

      {/* General details — address + opening/closing */}
      <div className="mt-8">
        <div className="flex items-baseline gap-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">تفاصيل عامة</h3>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Operations</span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">العنوان ومواعيد العمل اليومية.</p>

        <div className="mt-3 rounded-2xl glass-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary/15 text-primary shrink-0">
              <MapPin className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">العنوان</div>
              <div className="mt-1 text-sm sm:text-base leading-relaxed">{store.address}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
            <TimeTile icon={<DoorOpen className="h-4 w-4" />} label="موعد الفتح" value={fmtTime(store.opening_time)} />
            <TimeTile icon={<DoorClosed className="h-4 w-4" />} label="موعد الغلق" value={fmtTime(store.closing_time)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPillar({
  icon, eyebrow, value, hint, accent = "primary",
}: { icon: React.ReactNode; eyebrow: string; value: string; hint?: string; accent?: "primary" | "emerald" | "rose" | "muted" }) {
  const accentCls =
    accent === "emerald" ? "text-emerald-500"
    : accent === "rose" ? "text-rose-500"
    : accent === "muted" ? "text-foreground"
    : "text-foreground";
  return (
    <div className="relative overflow-hidden rounded-2xl glass-card p-4 sm:p-5">
      <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-primary/5 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</div>
        <span className="grid place-items-center h-7 w-7 rounded-lg bg-primary/10">{icon}</span>
      </div>
      <div className={`relative mt-3 font-display text-lg sm:text-xl font-extrabold tracking-tight ${accentCls}`}>{value}</div>
      {hint && <div className="relative mt-0.5 text-[10px] sm:text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function TimeTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] uppercase tracking-[0.25em]">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="mt-2 font-display text-base sm:text-lg font-extrabold tabular-nums">{value}</div>
    </div>
  );
}
