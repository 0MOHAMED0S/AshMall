import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Star } from "lucide-react";
import { listFeaturedNearbyStores } from "@/lib/home.functions";
import { SectionHeader } from "./SectionHeader";

interface Store { id: string; slug: string; name_ar: string; logo_url: string | null; rating: number; }

function StoreCircle({ s }: { s: Store }) {
  return (
    <Link
      to="/stores/$slug"
      params={{ slug: s.slug }}
      className="shrink-0 w-20 sm:w-24 flex flex-col items-center text-center group"
    >
      <div className="relative">
        <div className="h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] rounded-full p-[3px] bg-gradient-to-bl from-primary to-primary-glow transition-transform duration-300 group-hover:scale-110">
          <div className="h-full w-full rounded-full overflow-hidden bg-card grid place-items-center">
            {s.logo_url ? (
              <img src={s.logo_url} alt={s.name_ar} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-2xl font-extrabold text-primary">{s.name_ar.slice(0, 1)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] font-bold truncate w-full">{s.name_ar}</div>
      <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2 py-0.5 text-[10px] tabular-nums">
        {Number(s.rating).toFixed(1)} <Star className="h-2.5 w-2.5 fill-primary text-primary" />
      </div>
    </Link>
  );
}

export function NearbyStoresCircles() {
  const fetchFeat = useServerFn(listFeaturedNearbyStores);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeat().then((r) => setStores((r.stores ?? []) as Store[])).catch(() => {}).finally(() => setLoading(false));
  }, [fetchFeat]);

  if (!loading && stores.length === 0) return null;

  // Duplicate the list for a seamless marquee loop
  const loop = stores.length > 0 ? [...stores, ...stores] : [];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
      <SectionHeader title="متاجر مميزة قريبة منك" icon={Sparkles} href="/stores" />

      {loading ? (
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-20 h-28 rounded-full bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className="group relative overflow-hidden pb-2 -mx-4 sm:-mx-6"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, transparent 0, #000 48px, #000 calc(100% - 48px), transparent 100%)",
          }}
        >
          <div className="flex gap-4 w-max animate-marquee-rtl px-4 sm:px-6">
            {loop.map((s, i) => (
              <StoreCircle key={`${s.id}-${i}`} s={s} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
