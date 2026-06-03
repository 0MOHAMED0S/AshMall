import { Link } from "@tanstack/react-router";
import { Star, BadgeCheck, MapPin } from "lucide-react";

export function StoreCard({
  s,
}: {
  s: {
    slug: string;
    name_ar: string;
    rating: number;
    rating_count: number;
    cover_url: string | null;
    logo_url?: string | null;
    tags: string[] | null;
    categories: { name_ar: string } | null;
    address: string;
    description_ar?: string | null;
  };
}) {
  return (
    <Link
      to="/stores/$slug"
      params={{ slug: s.slug }}
      className="group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 active:scale-[0.98]"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="relative h-48 sm:h-44 overflow-hidden">
        {s.cover_url ? (
          <img src={s.cover_url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-110"
            style={{ background: `radial-gradient(120% 80% at 20% 20%, oklch(0.62 0.2 ${Math.abs(s.slug.charCodeAt(0) * 7) % 360}) 0%, oklch(0.2 0.04 30) 70%, oklch(0.13 0.01 30) 100%)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {s.categories?.name_ar && (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-foreground border border-border shadow-sm">
            {s.categories.name_ar}
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/95 text-primary-foreground px-2.5 py-1 text-[10px] font-bold shadow-sm">
          <BadgeCheck className="h-3 w-3" /> موثّق
        </span>

      </div>

      <div className="absolute right-5 top-[calc(12rem-1.75rem)] sm:top-[calc(11rem-1.75rem)] h-14 w-14 rounded-2xl ring-2 ring-background bg-card overflow-hidden grid place-items-center shadow-lg z-10">
        {s.logo_url ? (
          <img src={s.logo_url} alt="" loading="lazy" className="h-full w-full object-contain" />
        ) : (
          <span className="font-display text-xl font-extrabold text-primary">{s.name_ar.slice(0, 1)}</span>
        )}
      </div>

      <div className="p-5 pt-9">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg font-bold leading-tight">{s.name_ar}</h3>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{s.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs shrink-0">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-bold">{Number(s.rating).toFixed(1)}</span>
          </div>
        </div>

        {s.description_ar && (
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{s.description_ar}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {s.rating_count.toLocaleString("ar-EG")} تقييم
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 py-2 text-xs font-bold shadow-md group-hover:shadow-lg group-hover:translate-x-[-2px] transition-all">
            افتح المتجر
            <span className="transition-transform group-hover:-translate-x-1">←</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
