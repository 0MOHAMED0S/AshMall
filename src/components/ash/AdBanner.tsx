import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, Flame, Tag, Clock, BadgeCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { listActiveAds } from "@/lib/ads.functions";

interface Ad {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link: string | null;
  ends_at?: string | null;
}

function timeLeft(ends_at?: string | null): string | null {
  if (!ends_at) return null;
  const ms = new Date(ends_at).getTime() - Date.now();
  if (ms <= 0) return null;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  if (d > 0) return `ينتهي خلال ${d} يوم`;
  if (h > 0) return `ينتهي خلال ${h} ساعة`;
  const m = Math.max(1, Math.floor((ms % 3600000) / 60000));
  return `ينتهي خلال ${m} دقيقة`;
}

export function AdBanner() {
  const fetchAds = useServerFn(listActiveAds);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetchAds().then((r) => setAds((r.ads ?? []) as Ad[])).catch(() => { /* ignore */ });
  }, [fetchAds]);

  if (ads.length === 0) return null;

  const [hero, ...rest] = ads;
  const side = rest.slice(0, 4);

  return (
    <section className="relative mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
      {/* Layered premium background */}
      <div aria-hidden className="absolute inset-x-2 sm:inset-x-4 inset-y-10 rounded-[2rem] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 opacity-[0.18]">
          {ads.slice(0, 8).map((a, i) => (
            a.image_url ? (
              <img
                key={`${a.id}-bg-${i}`}
                src={a.image_url}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
                style={{ filter: "blur(14px) saturate(1.15)", transform: "scale(1.15)" }}
              />
            ) : (
              <div key={`${a.id}-bg-${i}`} className="h-full w-full" style={{ background: `linear-gradient(135deg, color-mix(in oklab, var(--primary) ${15 + i * 4}%, transparent), transparent)` }} />
            )
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--background) 88%, transparent) 0%, color-mix(in oklab, var(--background) 70%, transparent) 50%, color-mix(in oklab, var(--background) 92%, transparent) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 80% 10%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(50% 40% at 10% 90%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)" }} />
        <div className="absolute inset-0 ring-1 ring-inset ring-border/40 rounded-[2rem]" />
      </div>

      <div aria-hidden className="pointer-events-none absolute -top-10 right-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

      {/* Header */}
      <div className="relative flex items-end justify-between mb-8 sm:mb-12 flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-primary font-medium">
            <Flame className="h-3 w-3" /> عروض حصرية
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient-soft leading-tight">
            صفقات الأسبوع <br className="sm:hidden" />
            <span className="text-gradient-brand">من قلب أشمون</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            أفضل تخفيضات المحلات الموثّقة — منتقاة بعناية، صالحة لفترة محدودة.
          </p>
        </div>
        <Link to="/stores" className="hidden sm:inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-medium text-foreground/80 hover:text-foreground hover:border-primary/40 transition">
          كل العروض <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Bento grid */}
      <div className="relative grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-[minmax(0,_1fr)]">
        {/* Hero offer */}
        <Link
          to={(hero.link ?? "/stores") as never}
          className="group relative col-span-2 lg:row-span-2 overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
          style={{ boxShadow: "var(--shadow-elevated)", minHeight: "320px" }}
        >
          {hero.image_url ? (
            <img src={hero.image_url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/10 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/40" />

          {/* Sponsored ribbon */}
          <div className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-md border border-border px-2.5 py-1 text-[10px] tracking-wider">
            <Sparkles className="h-3 w-3 text-primary" /> ممول
          </div>

          <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold tracking-wide w-fit shadow-lg shadow-primary/30">
              <Tag className="h-3 w-3" /> العرض الأبرز
            </div>
            <h3 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold leading-tight line-clamp-2">
              {hero.title}
            </h3>
            {hero.subtitle && (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground line-clamp-2 max-w-lg">
                {hero.subtitle}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                اكتشف العرض <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </div>
              {timeLeft(hero.ends_at) && (
                <div className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {timeLeft(hero.ends_at)}
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Side offers */}
        {side.map((ad, i) => (
          <Link
            key={ad.id}
            to={(ad.link ?? "/stores") as never}
            className="group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/30"
            style={{ minHeight: "150px", transitionDelay: `${i * 40}ms` }}
          >
            {ad.image_url && (
              <div className="absolute inset-0">
                <img src={ad.image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
              </div>
            )}
            <div className="absolute -top-12 -end-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl opacity-60 group-hover:opacity-100 group-hover:bg-primary/25 transition duration-700" />

            <div className="relative h-full flex flex-col justify-between p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 backdrop-blur-md border border-border px-2 py-0.5 text-[9px] tracking-wider text-muted-foreground">
                  <BadgeCheck className="h-2.5 w-2.5 text-primary" /> ممول
                </span>
                {timeLeft(ad.ends_at) && (
                  <span className="text-[9px] text-muted-foreground tabular-nums">
                    {timeLeft(ad.ends_at)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold leading-snug line-clamp-2">
                  {ad.title}
                </h3>
                {ad.subtitle && (
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
                    {ad.subtitle}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-primary font-medium">
                  استفد الآن <ArrowLeft className="h-3 w-3 transition group-hover:-translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Trust strip */}
      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> محلات موثّقة</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-primary" /> أسعار حصرية</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> لفترة محدودة</span>
      </div>
    </section>
  );
}
