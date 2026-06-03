import { Link } from "@tanstack/react-router";
import { Plus, Star, ImageIcon } from "lucide-react";

export interface MiniProduct {
  id: string;
  name_ar: string;
  price: number | null;
  compare_at_price?: number | null;
  currency?: string;
  image_url: string | null;
  store: { slug: string; name_ar: string };
}

export function ProductCardMini({
  p,
  onAdd,
  rating = 5,
}: {
  p: MiniProduct;
  onAdd?: (p: MiniProduct) => void;
  rating?: number;
}) {
  const hasDiscount =
    p.compare_at_price != null && (p.price ?? 0) < (p.compare_at_price ?? 0);
  const off = hasDiscount
    ? Math.round((p.compare_at_price ?? 0) - (p.price ?? 0))
    : 0;

  return (
    <div className="snap-start shrink-0 w-[180px] sm:w-[210px] group">
      <Link
        to="/products/$id"
        params={{ id: p.id }}
        className="relative block aspect-[3/4] rounded-[26px] overflow-hidden bg-card border border-border/70 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] transition-all duration-500 group-hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.28)] group-hover:-translate-y-1"
      >
        {/* Image (full-bleed) */}
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name_ar}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-secondary/40">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

        {/* Top row: rating + discount */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold tabular-nums text-neutral-900 shadow-sm">
            <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          {hasDiscount && (
            <div className="rounded-full bg-success text-success-foreground px-2.5 py-1 text-[10px] font-bold tabular-nums shadow">
              {off}- ج.م
            </div>
          )}
        </div>

        {/* Bottom info block */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 text-right">
          <span className="block text-[10px] font-medium text-white/70 truncate mb-0.5">
            {p.store.name_ar}
          </span>
          <h3 className="text-[13px] font-bold text-white leading-snug line-clamp-2 mb-2">
            {p.name_ar}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1 tabular-nums">
              <span className="text-[15px] font-black text-white tracking-tight">
                {(p.price ?? 0).toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-white/70">ج.م</span>
              {hasDiscount && (
                <span className="text-[10px] text-white/50 line-through ms-1">
                  {(p.compare_at_price ?? 0).toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAdd?.(p);
              }}
              aria-label="إضافة للسلة"
              className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-90 transition"
            >
              <Plus className="h-4 w-4" strokeWidth={2.8} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
