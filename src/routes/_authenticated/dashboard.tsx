import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyStores, listCategoriesWithCounts } from "@/lib/stores.functions";
import { Store, Plus, MapPin, Star, Clock, CheckCircle2, XCircle, ChevronDown, Tag } from "lucide-react";
import { useState, useMemo } from "react";
import { OwnerProductsManager } from "@/components/ash/OwnerProductsManager";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "لوحة التحكم — آش مول" }] }),
});

function Dashboard() {
  const { user } = useAuth();
  const fetchMine = useServerFn(listMyStores);
  const fetchCats = useServerFn(listCategoriesWithCounts);
  const { data, isLoading } = useQuery({
    queryKey: ["my-stores"],
    queryFn: () => fetchMine(),
  });
  const { data: catsData } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => fetchCats(),
  });

  const stores = data?.stores ?? [];
  const categories = catsData?.categories ?? [];

  const grouped = useMemo(() => {
    const catById = new Map(categories.map((c) => [c.id, c]));
    const map = new Map<string, { cat: { id: string; name_ar: string; icon: string | null } | null; items: typeof stores }>();
    for (const s of stores) {
      const cid = s.category_id ?? "uncategorized";
      if (!map.has(cid)) map.set(cid, { cat: catById.get(cid) ?? null, items: [] });
      map.get(cid)!.items.push(s);
    }
    return Array.from(map.entries());
  }, [stores, categories]);

  return (
    <div className="relative min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-28 pb-20 mx-auto max-w-6xl px-5 sm:px-6">
        <div className="animate-rise">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-medium">لوحة التحكم</div>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-gradient-soft">
            أهلاً، {user?.user_metadata?.full_name ?? user?.email?.split("@")[0]}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">إدارة متاجرك، الإحصاءات، والحملات.</p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-rise reveal-delay-1">
          {[
            { label: "متاجرك", value: stores.length, icon: Store },
            { label: "موثّقة", value: stores.filter((s) => s.status === "approved").length, icon: CheckCircle2 },
            { label: "قيد المراجعة", value: stores.filter((s) => s.status === "pending").length, icon: Clock },
            { label: "متوسط التقييم", value: stores.length ? (stores.reduce((a, s) => a + Number(s.rating), 0) / stores.length).toFixed(1) : "—", icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs">{label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 font-display text-3xl font-extrabold">{value}</div>
            </div>
          ))}
        </div>

        {/* Add store CTA */}
        <div className="mt-12 flex items-end justify-between flex-wrap gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-primary" style={{ boxShadow: "var(--shadow-chip)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> متاجرك
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.4] py-1">
              المتاجر مجمّعة حسب الفئة
            </h2>
          </div>
          <Link to="/dashboard/new-store" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition active:scale-95 glow-ring shadow-lg">
            <Plus className="h-4 w-4" /> إضافة متجر
          </Link>
        </div>

        <div className="mt-6 space-y-8">
          {isLoading && Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 h-24 shimmer" />
          ))}
          {!isLoading && stores.length === 0 && (
            <div className="glass-card rounded-3xl p-12 text-center">
              <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl bg-secondary border border-border text-primary">
                <Store className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">لا توجد متاجر بعد</h3>
              <p className="mt-2 text-sm text-muted-foreground">سجّل متجرك الحقيقي في أشمون وابدأ استقبال العملاء.</p>
              <Link to="/dashboard/new-store" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 transition glow-ring">
                <Plus className="h-4 w-4" /> سجّل متجرك الأول
              </Link>
            </div>
          )}

          {grouped.map(([key, { cat, items }]) => (
            <section key={key} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary-soft text-primary text-base">
                  {cat?.icon ?? <Tag className="h-4 w-4" />}
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight">{cat?.name_ar ?? "بدون فئة"}</h3>
                <span className="text-xs text-muted-foreground tabular-nums">({items.length})</span>
                <div className="flex-1 h-px bg-gradient-to-l from-border to-transparent" />
              </div>
              <div className="space-y-3">
                {items.map((s) => <StoreRow key={s.id} store={s} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
    approved: { label: "موثّق", cls: "bg-primary/15 text-primary border-primary/30", Icon: CheckCircle2 },
    pending: { label: "قيد المراجعة", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30", Icon: Clock },
    rejected: { label: "مرفوض", cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: XCircle },
    suspended: { label: "موقوف", cls: "bg-destructive/15 text-destructive border-destructive/30", Icon: XCircle },
  };
  const c = cfg[status] ?? cfg.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${c.cls}`}>
      <c.Icon className="h-2.5 w-2.5" /> {c.label}
    </span>
  );
}

interface StoreRowData {
  id: string;
  name_ar: string;
  status: string;
  address: string;
  rating: number;
  rating_count: number;
  logo_url?: string | null;
  cover_url?: string | null;
  category_id?: string | null;
}

function StoreRow({ store: s }: { store: StoreRowData }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition hover:border-primary/40" style={{ boxShadow: "var(--shadow-elevated)" }}>
      <button onClick={() => setOpen((v) => !v)} className="w-full p-4 flex items-center gap-4 hover:bg-secondary/20 transition text-right">
        {/* Logo */}
        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-secondary border border-border grid place-items-center shrink-0">
          {s.logo_url ? (
            <img src={s.logo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-xl font-extrabold text-primary">{s.name_ar.slice(0, 1)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold truncate">{s.name_ar}</h3>
            <StatusBadge status={s.status} />
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{s.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-2 py-1">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-bold">{Number(s.rating).toFixed(1)}</span>
            <span className="text-muted-foreground">({s.rating_count})</span>
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-border p-5 bg-secondary/10">
          <OwnerProductsManager storeId={s.id} />
        </div>
      )}
    </div>
  );
}
