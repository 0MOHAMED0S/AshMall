import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listStores } from "@/lib/stores.functions";
import { Star, MapPin, BadgeCheck } from "lucide-react";

interface Store {
  id: string;
  slug: string;
  name_ar: string;
  rating: number;
  rating_count: number;
  cover_url: string | null;
  is_featured: boolean;
  tags: string[] | null;
  categories: { name_ar: string } | null;
}

export function FeaturedStores() {
  const fetchStores = useServerFn(listStores);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores({ data: { limit: 6 } })
      .then((r) => setStores((r.stores ?? []) as unknown as Store[]))
      .catch(() => {
        /* ignore */
      })
      .finally(() => setLoading(false));
  }, [fetchStores]);

  return (
    <section id="stores" className="relative mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
      <div
        aria-hidden
        className="absolute -top-10 right-0 h-72 w-72 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent)" }}
      />

      <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12 flex-wrap relative">
        <div className="min-w-0 flex items-center gap-3">
          <h2
            className="font-display font-extrabold tracking-tight text-xl sm:text-2xl bg-clip-text text-transparent"
            style={{
              lineHeight: 1.2,
              paddingBlock: "0.1em",
              backgroundImage: "linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklab, var(--primary) 80%, var(--foreground)) 100%)",
            }}
          >
            متاجر مختارة بعناية
          </h2>
          <span
            className="grid relative place-items-center h-8 w-8 rounded-full text-primary-foreground shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
              boxShadow: "0 10px 24px -10px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <BadgeCheck className="h-4 w-4" />
          </span>
        </div>
        <Link
          to="/stores"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs sm:text-sm font-medium hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition active:scale-95"
        >
          كل المتاجر
          <span className="transition-transform group-hover:-translate-x-1">←</span>
        </Link>
      </div>

      <div className="-mt-6 sm:-mt-8 mb-8 sm:mb-10 flex items-center gap-2">
        <span
          className="h-[2px] w-10 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 10%, transparent))" }}
        />
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">Curated Stores</span>
        <span
          className="h-[2px] flex-1 max-w-[60px] rounded-full"
          style={{ background: "linear-gradient(270deg, var(--primary), color-mix(in oklab, var(--primary) 10%, transparent))" }}
        />
      </div>



      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-3xl bg-secondary/30 animate-pulse" />
          ))
        ) : stores.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
            لا توجد متاجر معتمدة بعد.
          </div>
        ) : (
          stores.map((s, i) => {
            const hue = Math.abs(s.slug.charCodeAt(0) * 17) % 360;
            const tag = s.is_featured ? "مميّز" : (s.tags?.[0] ?? "موثّق");
            return (
              <Link
                key={s.id}
                to="/stores/$slug"
                params={{ slug: s.slug }}
                className="group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 block"
                style={{ boxShadow: "var(--shadow-elevated)", transitionDelay: `${i * 30}ms` }}
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  {s.cover_url ? (
                    <img
                      src={s.cover_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      style={{
                        background: `radial-gradient(120% 80% at 20% 20%, oklch(0.62 0.2 ${hue}) 0%, oklch(0.22 0.05 ${hue}) 60%, oklch(0.13 0.01 ${hue}) 100%)`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-md px-2.5 py-1 text-[10px] tracking-wider text-foreground border border-border">
                    <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    {tag}
                  </span>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="w-full min-w-0 sm:flex-1">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <h3 className="font-display text-[15px] sm:text-lg font-bold leading-snug break-words whitespace-normal">
                          {s.name_ar}
                        </h3>
                        <BadgeCheck className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                      </div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {s.categories?.name_ar ?? ""}
                      </div>
                    </div>
                    <div className="flex w-fit items-center gap-1 rounded-xl bg-secondary/80 border border-border px-2 py-1 text-[11px] sm:text-xs shrink-0">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="tabular-nums">{Number(s.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-5 h-px ring-divider" />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {s.rating_count} تقييم
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-semibold shadow-sm group-hover:shadow-md transition">
                      افتح المتجر
                      <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
