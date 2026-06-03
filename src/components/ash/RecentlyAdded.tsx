import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Star, MapPin, Clock, ArrowLeft } from "lucide-react";
import { listRecentStores } from "@/lib/home.functions";
import { SectionHeader } from "./SectionHeader";

interface Store {
  id: string; slug: string; name_ar: string; description_ar: string | null;
  logo_url: string | null; cover_url: string | null; address: string;
  rating: number; categories: { name_ar: string } | null;
}

function isOpen(): boolean {
  // Placeholder until opening_hours is wired
  return true;
}

export function RecentlyAdded() {
  const fetchRec = useServerFn(listRecentStores);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRec().then((r) => setStores((r.stores ?? []) as unknown as Store[])).catch(() => {}).finally(() => setLoading(false));
  }, [fetchRec]);

  if (!loading && stores.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
      <SectionHeader title="أُضيف حديثاً" icon={Sparkles} href="/stores" />
      <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x no-scrollbar pb-3 -mx-4 sm:-mx-6 px-4 sm:px-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="shrink-0 w-[270px] h-[230px] rounded-3xl bg-secondary animate-pulse" />)
          : stores.map((s) => {
              const open = isOpen();
              return (
                <Link key={s.id} to="/stores/$slug" params={{ slug: s.slug }} className="snap-start shrink-0 w-[270px] sm:w-[290px] soft-card rounded-3xl group relative">
                  <div className="relative h-32 bg-secondary overflow-hidden rounded-t-3xl">
                    {s.cover_url ? (
                      <img src={s.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-accent to-secondary" />
                    )}
                    <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-2 py-1 text-[10px] font-bold tabular-nums">
                      <Star className="h-2.5 w-2.5 fill-primary text-primary" /> {Number(s.rating).toFixed(1)}
                    </div>
                    <div className={`absolute top-2 left-2 rounded-full px-2 py-1 text-[10px] font-bold ${open ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                      {open ? "مفتوح" : "مغلق"}
                    </div>
                  </div>
                  <div className="absolute top-[104px] right-4 h-14 w-14 rounded-2xl bg-card border border-border grid place-items-center overflow-hidden shadow-lg z-10">
                    {s.logo_url ? <img src={s.logo_url} alt="" className="h-full w-full object-contain p-1 bg-card" /> : <span className="font-display text-lg font-extrabold text-primary">{s.name_ar.slice(0, 1)}</span>}
                  </div>
                  <div className="pt-8 pb-4 px-4">
                    <div className="font-display font-bold text-[15px] truncate">{s.name_ar}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{s.description_ar ?? s.categories?.name_ar ?? "متجر موثّق"}</div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2.5 py-1 text-muted-foreground">
                        <Clock className="h-3 w-3" /> 30 دقيقة
                      </span>
                      <span className="inline-flex items-center gap-1 text-primary font-bold">
                        زيارة <ArrowLeft className="h-3 w-3" />
                      </span>
                    </div>
                    <div className="mt-2 flex items-start gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                      <span className="truncate">{s.address}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
