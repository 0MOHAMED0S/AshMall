import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock4, Star } from "lucide-react";
import { getStoresByIds } from "@/lib/home.functions";
import { SectionHeader } from "./SectionHeader";

const KEY = "ash:recentStores";

export function recordRecentStore(id: string) {
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const next = [id, ...arr.filter((x) => x !== id)].slice(0, 10);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}

interface Store {
  id: string; slug: string; name_ar: string;
  logo_url: string | null; cover_url: string | null;
  rating: number; categories: { name_ar: string } | null;
}

export function RecentlyViewed() {
  const fetchByIds = useServerFn(getStoresByIds);
  const [stores, setStores] = useState<Store[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      if (ids.length === 0) { setReady(true); return; }
      fetchByIds({ data: { ids } })
        .then((r) => setStores((r.stores ?? []) as unknown as Store[]))
        .catch(() => {})
        .finally(() => setReady(true));
    } catch { setReady(true); }
  }, [fetchByIds]);

  if (!ready || stores.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
      <SectionHeader title="آخر ما شاهدته" icon={Clock4} />
      <p className="-mt-2 mb-4 text-xs text-muted-foreground">متاجر رجعت لك بناءً على آخر العناصر التي فتحتها أو شاهدتها مؤخرًا.</p>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
        {stores.map((s) => (
          <Link key={s.id} to="/stores/$slug" params={{ slug: s.slug }} className="snap-start shrink-0 w-[160px] sm:w-[180px] soft-card overflow-hidden rounded-3xl group">
            <div className="relative aspect-square bg-secondary overflow-hidden">
              {s.cover_url || s.logo_url ? (
                <img src={(s.cover_url ?? s.logo_url) as string} alt={s.name_ar} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-primary-soft">
                  <span className="font-display text-3xl font-extrabold text-primary">{s.name_ar.slice(0, 1)}</span>
                </div>
              )}
              <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-2 py-0.5 text-[10px] font-bold">
                <Clock4 className="h-2.5 w-2.5 text-primary" /> شوهد مؤخراً
              </div>
              <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur px-2 py-0.5 text-[10px] font-bold tabular-nums">
                {Number(s.rating).toFixed(1)} <Star className="h-2.5 w-2.5 fill-primary text-primary" />
              </div>
            </div>
            <div className="px-3 py-3 text-center">
              <div className="font-bold text-[13px] truncate">{s.name_ar}</div>
              <div className="text-[11px] text-muted-foreground truncate">{s.categories?.name_ar ?? "متجر"}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
