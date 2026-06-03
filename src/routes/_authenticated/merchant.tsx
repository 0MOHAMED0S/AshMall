import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMerchantDashboard, merchantUpdateOrderStatus, merchantRequestDelivery } from "@/lib/merchant.functions";
import { Briefcase, Store, ShoppingBag, Clock, TrendingUp, CheckCircle2, XCircle, Bike, MapPin, Phone, Loader2, LogOut, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/merchant")({
  component: MerchantDashboard,
  head: () => ({ meta: [{ title: "لوحة التاجر — آش مول" }] }),
});

function MerchantDashboard() {
  const navigate = useNavigate();
  const fetchDash = useServerFn(getMerchantDashboard);
  const updateOrder = useServerFn(merchantUpdateOrderStatus);
  const reqDelivery = useServerFn(merchantRequestDelivery);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try { const r = await fetchDash(); setData(r); } finally { setLoading(false); }
  }, [fetchDash]);

  useEffect(() => { void reload(); }, [reload]);

  useEffect(() => {
    const ch = supabase.channel("merchant-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { void reload(); })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [reload]);

  async function accept(id: string) {
    setBusy(id);
    try { await updateOrder({ data: { order_id: id, status: "confirmed" } }); toast.success("تم قبول الطلب"); await reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); }
    finally { setBusy(null); }
  }
  async function reject(id: string) {
    if (!confirm("رفض الطلب؟")) return;
    setBusy(id);
    try { await updateOrder({ data: { order_id: id, status: "cancelled" } }); toast.success("تم الرفض"); await reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); }
    finally { setBusy(null); }
  }
  async function requestDelivery(orderId: string) {
    setBusy(orderId);
    try {
      const r = await reqDelivery({ data: { order_id: orderId } });
      toast.success("تم تسجيل طلب الدليفري");
      if (r.courier?.whatsapp) {
        const msg = encodeURIComponent(
          `🚴 طلب دليفري جديد من آش مول\n\nالمتجر: ${r.store.name_ar}\nعنوان المتجر: ${r.store.address}\nرقم المتجر: ${r.store.phone ?? "-"}\n\n📍 عنوان العميل: ${r.order.address ?? "-"}\n📞 رقم العميل: ${r.order.phone ?? "-"}\n💰 قيمة الأوردر: ${r.order.total} ج\n\nادخل لوحة الدليفري لتأكيد الاستلام:\n${window.location.origin}/delivery/login`,
        );
        const wa = r.courier.whatsapp.replace(/\D/g, "");
        window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
      } else {
        toast.warning("لا يوجد دليفري نشط — تواصل مع الإدارة");
      }
      await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); }
    finally { setBusy(null); }
  }

  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/merchant/login" }); }

  if (loading) return <div className="min-h-screen grid place-items-center" dir="rtl"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  if (!data?.store) {
    return (
      <div className="min-h-screen grid place-items-center px-5" dir="rtl">
        <div className="max-w-md text-center">
          <Store className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="mt-4 font-display text-xl font-bold">لا يوجد متجر مربوط بحسابك</h1>
          <p className="mt-2 text-sm text-muted-foreground">تواصل مع إدارة آش مول لربط متجرك بهذا الحساب.</p>
          <button onClick={signOut} className="mt-4 text-xs text-muted-foreground underline">تسجيل الخروج</button>
        </div>
      </div>
    );
  }

  const s = data.store; const stats = data.stats; const orders = data.orders ?? [];
  const dr = (data.deliveryRequests ?? []) as any[];
  const drByOrder: Record<string, any> = Object.fromEntries(dr.map((r) => [r.order_id, r]));

  return (
    <div className="min-h-screen bg-background pb-16" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))" }}>
            <Briefcase className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">Merchant Dashboard</div>
            <h1 className="font-display text-lg font-extrabold truncate">{s.name_ar}</h1>
          </div>
          <Link to="/stores/$slug" params={{ slug: s.slug }} className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline">عرض المتجر</Link>
          <button onClick={signOut} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary">
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 mt-6 space-y-6">
        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الطلبات", value: stats.totalOrders, Icon: ShoppingBag },
            { label: "قيد المراجعة", value: stats.pendingOrders, Icon: Clock },
            { label: "اليوم", value: stats.todayOrders, Icon: TrendingUp },
            { label: "الإيرادات", value: `${stats.revenue.toFixed(0)} ج`, Icon: Star },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px]">{label}</span><Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 font-display text-2xl font-extrabold">{value}</div>
            </div>
          ))}
        </section>

        {/* Orders */}
        <section>
          <h2 className="font-display text-xl font-bold mb-3">الطلبات الواردة</h2>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">لا توجد طلبات بعد</div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o: any) => {
                const deliveryReq = drByOrder[o.id];
                const canRequestDelivery = (o.status === "confirmed" || o.status === "preparing") && !deliveryReq;
                return (
                  <li key={o.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="p-4 flex items-start gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold">#{o.id.slice(0, 6)}</span>
                          <OrderStatus status={o.status} />
                          {deliveryReq && <DeliveryStatus status={deliveryReq.status} />}
                          <span className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleString("ar-EG")}</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                          {o.phone && <div className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {o.phone}</div>}
                          {o.address && <div className="flex items-start gap-1"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {o.address}</div>}
                          {o.notes && <div className="italic">ملاحظات: {o.notes}</div>}
                        </div>
                        <ul className="mt-2 text-xs space-y-0.5">
                          {(o.order_items ?? []).map((it: any) => (
                            <li key={it.id} className="flex justify-between gap-2">
                              <span>× {it.quantity} {it.name}</span>
                              <span className="tabular-nums text-muted-foreground">{Number(it.price ?? 0) * it.quantity} ج</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 font-bold text-sm">الإجمالي: {o.total} ج</div>
                      </div>
                      <div className="w-full sm:w-auto flex flex-col gap-2">
                        {o.status === "pending" && (
                          <>
                            <button onClick={() => accept(o.id)} disabled={busy === o.id}
                              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-3 py-2 text-xs font-bold hover:bg-emerald-500/25 disabled:opacity-50">
                              <CheckCircle2 className="h-4 w-4" /> قبول
                            </button>
                            <button onClick={() => reject(o.id)} disabled={busy === o.id}
                              className="inline-flex items-center justify-center gap-1 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 px-3 py-2 text-xs font-bold hover:bg-destructive/20 disabled:opacity-50">
                              <XCircle className="h-4 w-4" /> رفض
                            </button>
                          </>
                        )}
                        {canRequestDelivery && (
                          <button onClick={() => requestDelivery(o.id)} disabled={busy === o.id}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 py-2.5 text-xs font-bold hover:opacity-95 disabled:opacity-50 shadow-lg">
                            {busy === o.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bike className="h-4 w-4" />}
                            اطلب دليفري آش مول الآن
                          </button>
                        )}
                        {deliveryReq && (
                          <button onClick={() => requestDelivery(o.id)} disabled={busy === o.id}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary border border-border px-3 py-2 text-xs hover:bg-secondary/80">
                            <Bike className="h-4 w-4" /> فتح واتساب الدليفري
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "جديد", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    confirmed: { label: "مؤكد", cls: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    preparing: { label: "تحضير", cls: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
    delivering: { label: "في الطريق", cls: "bg-purple-500/15 text-purple-600 border-purple-500/30" },
    completed: { label: "تم", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    cancelled: { label: "ملغي", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const m = map[status] ?? { label: status, cls: "bg-secondary text-muted-foreground border-border" };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}

function DeliveryStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "🚴 بانتظار الدليفري", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    accepted: { label: "🚴 قبل الدليفري", cls: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    picked_up: { label: "📦 استلم الأوردر", cls: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
    delivered: { label: "✅ تم التسليم", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    cancelled: { label: "ملغي", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const m = map[status] ?? { label: status, cls: "bg-secondary text-muted-foreground border-border" };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}
