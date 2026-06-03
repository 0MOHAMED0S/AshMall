import { useEffect, useMemo, useState } from "react";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { listProductsByStore } from "@/lib/products.functions";
import { useCartAdd } from "@/hooks/use-cart-add";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Plus, Package, ImageOff } from "lucide-react";

interface Product {
  id: string;
  name_ar: string;
  description_ar: string | null;
  price: number | null;
  currency: string;
  image_url: string | null;
  section: string | null;
  is_available: boolean;
}

export function StoreProducts({ storeId }: { storeId: string }) {
  const fetchProducts = useServerFn(listProductsByStore);
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("الكل");

  useEffect(() => {
    fetchProducts({ data: { storeId } })
      .then((r) => setProducts(r.products as Product[]))
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, [fetchProducts, storeId]);

  const sections = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.section) set.add(p.section); });
    return ["الكل", ...Array.from(set)];
  }, [products]);

  const filtered = activeSection === "الكل" ? products : products.filter((p) => p.section === activeSection);

  async function handleAdd(p: Product) {
    if (!user) { navigate({ to: "/auth", search: { redirect: window.location.pathname } }); return; }
    setBusyId(p.id);
    try {
      await addToCartGuarded({ store_id: storeId, name: p.name_ar, price: p.price ?? undefined });
      toast.success("أُضيف إلى السلة");
    } catch (e) { if ((e as Error).message !== "تم الإلغاء") toast.error(e instanceof Error ? e.message : "حدث خطأ"); }
    finally { setBusyId(null); }
  }

  if (loading) {
    return (
      <div className="mt-6 glass-card rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-secondary/30 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-6 glass-card rounded-3xl p-6 sm:p-8 animate-rise">
      <div className="flex items-center gap-2 mb-5">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">المنتجات</h2>
        <span className="text-xs text-muted-foreground tabular-nums ms-1">({products.length})</span>
      </div>

      {sections.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition border ${activeSection === s ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="group glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-secondary/40">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name_ar} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground/40"><ImageOff className="h-8 w-8" /></div>
              )}
              {!p.is_available && <div className="absolute inset-0 bg-background/70 grid place-items-center text-xs font-medium text-destructive">غير متوفر</div>}
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
              <h3 className="font-display text-sm font-bold line-clamp-2 leading-tight">{p.name_ar}</h3>
              {p.description_ar && <p className="text-[11px] text-muted-foreground line-clamp-2">{p.description_ar}</p>}
              <div className="mt-auto flex items-center justify-between gap-2">
                <div className="tabular-nums text-sm font-bold text-primary">
                  {p.price != null ? `${Number(p.price).toFixed(2)} ${p.currency}` : <span className="text-muted-foreground text-xs">السعر عند الطلب</span>}
                </div>
                <button
                  onClick={() => handleAdd(p)}
                  disabled={!p.is_available || busyId === p.id}
                  aria-label="أضف للسلة"
                  className="grid place-items-center h-8 w-8 rounded-full bg-primary text-primary-foreground hover:opacity-95 transition active:scale-90 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
