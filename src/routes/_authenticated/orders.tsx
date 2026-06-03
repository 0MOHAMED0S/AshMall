import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { listMyOrders, cancelMyOrder } from "@/lib/orders.functions";
import { ClipboardList, Package, MapPin, Phone, X, Clock, CheckCircle2, Truck, ChefHat, PackageCheck, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "طلباتي — آش مول" }] }),
  component: OrdersPage,
});

interface Order {
  id: string;
  status: "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled";
  total: number;
  currency: string;
  created_at: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  store: { id: string; slug: string; name_ar: string; logo_url: string | null } | null;
  order_items: { id: string; name: string; quantity: number; price: number | null; notes: string | null }[];
}

const STATUS_META: Record<Order["status"], { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  pending: { label: "قيد المراجعة", icon: Clock, cls: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  confirmed: { label: "مؤكَّد", icon: CheckCircle2, cls: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  preparing: { label: "قيد التحضير", icon: ChefHat, cls: "bg-orange-500/15 text-orange-500 border-orange-500/30" },
  delivering: { label: "في الطريق", icon: Truck, cls: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30" },
  completed: { label: "تم التسليم", icon: PackageCheck, cls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
  cancelled: { label: "ملغي", icon: XCircle, cls: "bg-destructive/15 text-destructive border-destructive/30" },
};

function OrdersPage() {
  const fetchAll = useServerFn(listMyOrders);
  const cancel = useServerFn(cancelMyOrder);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      setOrders((r.orders ?? []) as unknown as Order[]);
    } finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  async function cancelOne(id: string) {
    if (!confirm("هل تريد إلغاء هذا الطلب؟")) return;
    try { await cancel({ data: { id } }); toast.success("تم إلغاء الطلب"); void reload(); }
    catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-36 sm:pt-40 pb-24">

        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <header className="mb-10 relative">
            <div
              aria-hidden
              className="absolute -top-16 -right-10 h-56 w-56 rounded-full blur-3xl opacity-50 pointer-events-none"
              style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 38%, transparent), transparent)" }}
            />
            <div
              aria-hidden
              className="absolute -bottom-10 left-0 h-32 w-32 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 25%, transparent), transparent)" }}
            />

            <div className="flex items-center gap-4">
              <span
                className="relative grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl text-primary-foreground shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
                  boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h1
                  className="font-display font-extrabold tracking-tight text-2xl sm:text-3xl bg-clip-text text-transparent"
                  style={{
                    lineHeight: 1.3,
                    paddingBlock: "0.15em",
                    backgroundImage: "linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklab, var(--primary) 80%, var(--foreground)) 100%)",
                  }}
                >
                  طلباتي
                </h1>

                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className="h-[2px] w-10 rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 10%, transparent))" }}
                  />
                  <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">My Orders</span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed">
              تابع حالة طلباتك من جميع المتاجر في مكان واحد، بتحديثات لحظية وحالة واضحة لكل طلب.
            </p>
          </header>



          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 rounded-3xl bg-secondary/40 animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-display text-xl font-bold">لا توجد طلبات بعد</h2>
              <p className="mt-2 text-sm text-muted-foreground">ابدأ بتصفّح المتاجر واطلب ما تحب.</p>
              <Link to="/stores" className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium">تصفّح المتاجر</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
                const meta = STATUS_META[o.status];
                const Icon = meta.icon;
                const canCancel = o.status === "pending" || o.status === "confirmed";
                return (
                  <article key={o.id} className="glass-card rounded-3xl p-5 sm:p-6 animate-rise">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <Link to="/stores/$slug" params={{ slug: o.store?.slug ?? "" }} className="flex items-center gap-3 group">
                        <div className="h-11 w-11 rounded-xl overflow-hidden bg-secondary border border-border grid place-items-center">
                          {o.store?.logo_url ? <img src={o.store.logo_url} alt="" className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="font-display font-bold group-hover:text-primary transition">{o.store?.name_ar ?? "متجر"}</div>
                          <div className="text-[11px] text-muted-foreground tabular-nums">
                            #{o.id.slice(0, 8)} • {new Date(o.created_at).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" })}
                          </div>
                        </div>
                      </Link>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border ${meta.cls}`}>
                        <Icon className="h-3.5 w-3.5" /> {meta.label}
                      </span>
                    </div>

                    <ul className="mt-4 divide-y divide-border">
                      {o.order_items.map((it) => (
                        <li key={it.id} className="py-2.5 flex items-start gap-3 text-sm">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{it.name}</div>
                            {it.notes && <div className="text-xs text-muted-foreground mt-0.5">{it.notes}</div>}
                          </div>
                          <div className="text-xs text-muted-foreground tabular-nums shrink-0">
                            × {it.quantity}{it.price != null && <span className="text-foreground"> — {(it.price * it.quantity).toFixed(2)} ج.م</span>}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {(o.address || o.phone) && (
                      <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {o.address && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.address}</span>}
                        {o.phone && <span className="inline-flex items-center gap-1" dir="ltr"><Phone className="h-3.5 w-3.5" />{o.phone}</span>}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">إجمالي الطلب</span>
                      <div className="flex items-center gap-3">
                        {canCancel && (
                          <button onClick={() => void cancelOne(o.id)} className="inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-xs text-destructive hover:border-destructive/40 transition">
                            <X className="h-3.5 w-3.5" /> إلغاء
                          </button>
                        )}
                        <span className="font-display text-lg font-extrabold tabular-nums text-primary">{Number(o.total).toFixed(2)} {o.currency}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
