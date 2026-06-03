import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getDeliveryDashboard, deliveryUpdateRequest } from "@/lib/delivery.functions";
import {
  Bike, MapPin, Phone, Loader2, LogOut, CheckCircle2, Package, Truck,
  Clock, Navigation, MessageCircle, ChevronRight, Circle, Wallet, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/delivery")({
  component: DeliveryDashboard,
  head: () => ({ meta: [{ title: "لوحة الدليفري — آش مول" }] }),
});

type Tab = "new" | "active" | "done";

const STATUS_META: Record<string, { label: string; tone: string; dot: string }> = {
  pending:    { label: "جديد",       tone: "bg-amber-500/10 text-amber-700 border-amber-500/30",     dot: "bg-amber-500" },
  accepted:   { label: "مقبول",      tone: "bg-blue-500/10 text-blue-700 border-blue-500/30",        dot: "bg-blue-500" },
  picked_up:  { label: "بالطريق",    tone: "bg-indigo-500/10 text-indigo-700 border-indigo-500/30",  dot: "bg-indigo-500" },
  delivered:  { label: "تم التسليم", tone: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", dot: "bg-emerald-500" },
  cancelled:  { label: "ملغي",       tone: "bg-rose-500/10 text-rose-700 border-rose-500/30",        dot: "bg-rose-500" },
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "الآن";
  const m = Math.floor(s / 60); if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60); if (h < 24) return `منذ ${h} س`;
  return `منذ ${Math.floor(h / 24)} ي`;
}

function DeliveryDashboard() {
  const navigate = useNavigate();
  const fetchDash = useServerFn(getDeliveryDashboard);
  const update = useServerFn(deliveryUpdateRequest);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("new");
  const [online, setOnline] = useState(true);

  const reload = useCallback(async () => {
    try { setData(await fetchDash()); } finally { setLoading(false); }
  }, [fetchDash]);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => {
    const ch = supabase.channel("delivery-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "delivery_requests" }, () => {
        toast.success("🚴 طلب دليفري جديد!");
        try {
          const a = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
          void a.play();
        } catch {}
        void reload();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "delivery_requests" }, () => { void reload(); })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [reload]);

  async function act(id: string, action: "accept" | "picked_up" | "delivered" | "cancel") {
    setBusy(id);
    try { await update({ data: { id, action } }); toast.success("تم التحديث"); await reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); }
    finally { setBusy(null); }
  }

  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/delivery/login" }); }

  const filtered = useMemo(() => {
    const list = data?.requests ?? [];
    if (tab === "new") return list.filter((r: any) => r.status === "pending");
    if (tab === "active") return list.filter((r: any) => r.status === "accepted" || r.status === "picked_up");
    return list.filter((r: any) => r.status === "delivered" || r.status === "cancelled");
  }, [data, tab]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background" dir="rtl">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.me) {
    return (
      <div className="min-h-screen grid place-items-center px-5 text-center bg-background" dir="rtl">
        <div className="rounded-3xl border border-border bg-card p-8 max-w-sm shadow-card">
          <Bike className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="font-display text-lg font-bold mt-4">الحساب غير مفعّل</h2>
          <p className="mt-2 text-sm text-muted-foreground">حسابك غير مفعّل كدليفري حالياً. الرجاء التواصل مع الإدارة لتفعيل الخدمة.</p>
          <button onClick={signOut} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-bold">
            <LogOut className="h-3.5 w-3.5" /> تسجيل خروج
          </button>
        </div>
      </div>
    );
  }

  const initials = (data.me.name || "د").trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]).join("");

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {/* HERO HEADER */}
      <header
        className="relative overflow-hidden text-primary-foreground"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 70%, black) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5 pt-6 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm font-display font-extrabold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/70">Delivery Partner</div>
              <h1 className="font-display text-xl font-extrabold truncate">{data.me.name}</h1>
            </div>
            <button
              onClick={() => setOnline((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold border backdrop-blur-sm transition-colors ${
                online ? "bg-emerald-500/25 border-emerald-300/40" : "bg-white/10 border-white/20"
              }`}
            >
              <Circle className={`h-2 w-2 ${online ? "fill-emerald-300 text-emerald-300 animate-pulse" : "fill-white/50 text-white/50"}`} />
              {online ? "متصل" : "غير متصل"}
            </button>
            <button onClick={signOut} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15">
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* STATS */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            {[
              { label: "طلبات جديدة", value: data.stats.pending, Icon: Package, accent: "text-amber-200" },
              { label: "قيد التوصيل", value: data.stats.active,  Icon: Truck,   accent: "text-blue-200" },
              { label: "مكتملة اليوم", value: data.stats.delivered, Icon: TrendingUp, accent: "text-emerald-200" },
            ].map(({ label, value, Icon, accent }) => (
              <div key={label} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white/70">{label}</span>
                  <Icon className={`h-3.5 w-3.5 ${accent}`} />
                </div>
                <div className="mt-1.5 font-display text-2xl font-extrabold tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 mt-6">
        {/* TABS */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-1.5 grid grid-cols-3 gap-1">
          {([
            { key: "new",    label: "جديدة",  count: data.stats.pending },
            { key: "active", label: "نشطة",   count: data.stats.active },
            { key: "done",   label: "مكتملة", count: data.stats.delivered },
          ] as { key: Tab; label: string; count: number }[]).map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{t.label}</span>
                {t.count > 0 && (
                  <span className={`mr-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-extrabold tabular-nums ${
                    isActive ? "bg-white/25" : "bg-primary/10 text-primary"
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ORDERS LIST */}
        <section className="mt-5">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/50 p-14 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display font-bold">
                {tab === "new" ? "لا توجد طلبات جديدة" : tab === "active" ? "لا يوجد طلبات نشطة" : "لم تكمل أي طلب بعد"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {tab === "new" ? "سيظهر الطلب هنا فور وصوله" : "تابع لوحتك للطلبات الجديدة"}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((r: any) => {
                const meta = STATUS_META[r.status] ?? STATUS_META.pending;
                const itemsCount = (r.order?.order_items ?? []).reduce((s: number, i: any) => s + (i.quantity ?? 0), 0);
                return (
                  <li key={r.id} className="group rounded-3xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elevated transition-shadow">
                    {/* Card header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-l from-secondary/40 to-transparent">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-display font-extrabold text-sm">
                        #{r.order_id.slice(0, 4).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.tone}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" /> {timeAgo(r.created_at)}
                          </span>
                        </div>
                        {r.order && (
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {itemsCount} منتج · {Number(r.order.total ?? 0).toLocaleString("ar-EG")} ج.م
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Route: Store → Customer */}
                    <div className="px-4 py-3.5 space-y-3">
                      {r.store && (
                        <div className="flex gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold tracking-wider text-muted-foreground">الاستلام</div>
                            <div className="font-bold text-sm truncate">{r.store.name_ar}</div>
                            {r.store.address && (
                              <div className="text-[11px] text-muted-foreground flex items-start gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                <span className="line-clamp-1">{r.store.address}</span>
                              </div>
                            )}
                            {r.store.phone && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <a href={`tel:${r.store.phone}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold hover:bg-secondary">
                                  <Phone className="h-3 w-3" /> اتصال
                                </a>
                                {r.store.whatsapp && (
                                  <a href={`https://wa.me/${r.store.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 px-2.5 py-1 text-[10px] font-bold">
                                    <MessageCircle className="h-3 w-3" /> واتساب
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Connector */}
                      {r.order && (
                        <div className="flex items-center gap-2 pr-4">
                          <div className="h-6 w-px bg-gradient-to-b from-amber-500/40 to-emerald-500/40" />
                          <ChevronRight className="h-3 w-3 text-muted-foreground -rotate-90" />
                          <div className="h-px flex-1 bg-border" />
                        </div>
                      )}

                      {r.order && (
                        <div className="flex gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                            <Navigation className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold tracking-wider text-muted-foreground">التسليم</div>
                            <div className="font-bold text-sm">عميل آش مول</div>
                            {r.order.address && (
                              <div className="text-[11px] text-muted-foreground flex items-start gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                <span className="line-clamp-2">{r.order.address}</span>
                              </div>
                            )}
                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                              {r.order.phone && (
                                <a href={`tel:${r.order.phone}`} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold">
                                  <Phone className="h-3 w-3" /> {r.order.phone}
                                </a>
                              )}
                              {r.order.address && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.order.address)}`}
                                  target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold hover:bg-secondary"
                                >
                                  <Navigation className="h-3 w-3" /> خرائط
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Items + total */}
                      {r.order?.order_items?.length > 0 && (
                        <details className="rounded-2xl bg-secondary/40 border border-border/60 px-3 py-2 text-[11px] [&_summary]:cursor-pointer">
                          <summary className="font-bold flex items-center justify-between">
                            <span>تفاصيل الأوردر ({itemsCount} قطعة)</span>
                            <span className="tabular-nums text-primary">{Number(r.order.total).toLocaleString("ar-EG")} ج.م</span>
                          </summary>
                          <ul className="mt-2 space-y-1">
                            {r.order.order_items.map((it: any, i: number) => (
                              <li key={i} className="flex justify-between text-muted-foreground">
                                <span>× {it.quantity} {it.name}</span>
                                <span className="tabular-nums">{(Number(it.price ?? 0) * it.quantity).toLocaleString("ar-EG")} ج</span>
                              </li>
                            ))}
                          </ul>
                          {r.order.notes && (
                            <div className="mt-2 pt-2 border-t border-border/60 text-[11px]">
                              <span className="font-bold">ملاحظات: </span>{r.order.notes}
                            </div>
                          )}
                        </details>
                      )}
                    </div>

                    {/* Actions */}
                    {(r.status !== "delivered" && r.status !== "cancelled") && (
                      <div className="px-4 pb-4 flex gap-2">
                        {r.status === "pending" && (
                          <button onClick={() => act(r.id, "accept")} disabled={busy === r.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary text-primary-foreground px-3 py-3 text-xs font-bold shadow-sm hover:opacity-95 disabled:opacity-50">
                            {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            قبول الطلب
                          </button>
                        )}
                        {r.status === "accepted" && (
                          <button onClick={() => act(r.id, "picked_up")} disabled={busy === r.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 text-white px-3 py-3 text-xs font-bold hover:opacity-95 disabled:opacity-50">
                            <Package className="h-4 w-4" /> استلمت من المتجر
                          </button>
                        )}
                        {r.status === "picked_up" && (
                          <button onClick={() => act(r.id, "delivered")} disabled={busy === r.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 text-white px-3 py-3 text-xs font-bold hover:opacity-95 disabled:opacity-50">
                            <CheckCircle2 className="h-4 w-4" /> تم التسليم
                          </button>
                        )}
                        {(r.status === "pending" || r.status === "accepted") && (
                          <button onClick={() => act(r.id, "cancel")} disabled={busy === r.id}
                            className="rounded-2xl border border-border bg-background px-3 py-3 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50">
                            رفض
                          </button>
                        )}
                      </div>
                    )}

                    {r.status === "delivered" && (
                      <div className="px-4 pb-4">
                        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3 py-2.5 text-xs font-bold inline-flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5" /> تم تحصيل الأوردر بنجاح
                        </div>
                      </div>
                    )}
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
