import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard, Users, Store, ShoppingBag, Clock, CheckCircle2,
  Package, Tag, Megaphone, Star, ArrowLeft, TrendingUp, Wallet, Trophy,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { adminOverview, adminAnalytics } from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, StatusBadge } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: OverviewPage,
});

interface Overview {
  counts: Record<string, number>;
  revenue: number;
  recentOrders: { id: string; total: number; currency: string; status: string; created_at: string; stores: { name_ar: string } | null }[];
  recentStores: { id: string; name_ar: string; status: string; created_at: string }[];
}
interface Analytics {
  series: { date: string; revenue: number; orders: number; users: number }[];
  statusCounts: Record<string, number>;
  topStores: { name: string; revenue: number; orders: number }[];
  totals: { revenue: number; orders: number; newUsers: number };
}

const STATUS_LABEL: Record<string, string> = {
  pending: "قيد المراجعة", confirmed: "مؤكد", preparing: "تحضير",
  delivering: "توصيل", completed: "مكتمل", cancelled: "ملغي",
};
const STATUS_COLORS = ["#f59e0b", "#3b82f6", "#a855f7", "#6366f1", "#10b981", "#ef4444"];

function OverviewPage() {
  const fetchOv = useServerFn(adminOverview);
  const fetchAn = useServerFn(adminAnalytics);
  const [data, setData] = useState<Overview | null>(null);
  const [an, setAn] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<number>(14);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOv(), fetchAn({ data: { days: range } })])
      .then(([o, a]) => { setData(o as Overview); setAn(a as Analytics); })
      .finally(() => setLoading(false));
  }, [fetchOv, fetchAn, range]);

  if (loading || !data || !an) return <Spinner label="جارٍ التحميل" />;
  const c = data.counts;

  const statusData = Object.entries(an.statusCounts).map(([k, v]) => ({
    name: STATUS_LABEL[k] ?? k, value: v,
  }));

  return (
    <div>
      <AdminPageHeader
        icon={LayoutDashboard}
        eyebrow="Overview"
        title="نظرة عامة"
        description="ملخص لحظي وتحليلات لكل عمليات المنصة."
        actions={
          <div className="inline-flex rounded-full bg-secondary p-1 text-xs">
            {[7, 14, 30].map((d) => (
              <button key={d} onClick={() => setRange(d)}
                className={`px-3 py-1.5 rounded-full font-medium transition ${range === d ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {d} يوم
              </button>
            ))}
          </div>
        }
      />

      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={Wallet} label="إجمالي المبيعات" value={`${data.revenue.toFixed(0)} EGP`} accent />
        <Stat icon={ShoppingBag} label="الطلبات" value={c.orders} />
        <Stat icon={Users} label="المستخدمون" value={c.users} />
        <Stat icon={Store} label="المتاجر" value={c.stores} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <MiniStat icon={Clock} label="قيد المراجعة" value={c.pending} tone="amber" />
        <MiniStat icon={CheckCircle2} label="موثّقة" value={c.approved} tone="emerald" />
        <MiniStat icon={Package} label="منتجات" value={c.products} />
        <MiniStat icon={Tag} label="فئات" value={c.categories} />
        <MiniStat icon={Megaphone} label="إعلانات" value={c.ads} />
        <MiniStat icon={Star} label="تقييمات" value={c.reviews} />
      </div>

      {/* Analytics charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-bold inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> الإيرادات خلال آخر {range} يوم
            </h2>
            <div className="text-xs text-muted-foreground tabular-nums">
              {an.totals.revenue.toFixed(0)} EGP · {an.totals.orders} طلب
            </div>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={an.series} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary, 240 80% 60%))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--primary, 240 80% 60%))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border, 0 0% 90%))" opacity={0.3} />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} fontSize={10} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={10} stroke="currentColor" opacity={0.6} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="url(#rev)" strokeWidth={2} name="الإيراد" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-bold mb-3 inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" /> حالات الطلبات
          </h2>
          <div className="h-56 sm:h-64">
            {statusData.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">لا توجد بيانات</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h2 className="font-display text-base font-bold mb-3 inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> مستخدمون جدد ({an.totals.newUsers})
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={an.series} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} fontSize={10} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={10} stroke="currentColor" opacity={0.6} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Bar dataKey="users" fill="var(--primary)" radius={[6, 6, 0, 0]} name="مستخدمون" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-bold mb-3 inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> أفضل المتاجر
          </h2>
          {an.topStores.length === 0 ? (
            <div className="py-10 text-sm text-muted-foreground text-center">لا توجد مبيعات بعد.</div>
          ) : (
            <ol className="space-y-2">
              {an.topStores.map((s, i) => {
                const max = an.topStores[0].revenue || 1;
                const pct = Math.max(6, Math.round((s.revenue / max) * 100));
                return (
                  <li key={i} className="rounded-xl border border-border bg-background/40 p-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="min-w-0 flex items-center gap-2">
                        <span className="grid place-items-center h-6 w-6 rounded-full bg-primary/15 text-primary text-[10px] font-bold">{i + 1}</span>
                        <span className="font-semibold text-sm truncate">{s.name}</span>
                      </div>
                      <span className="text-xs font-bold tabular-nums">{s.revenue.toFixed(0)} EGP</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-l from-primary to-primary/40" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">{s.orders} طلب</div>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> آخر الطلبات</h2>
            <Link to="/admin/orders" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">عرض الكل <ArrowLeft className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2">
            {data.recentOrders.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">لا توجد طلبات بعد.</div>}
            {data.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{o.stores?.name_ar ?? "—"}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">{new Date(o.created_at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={o.status} />
                  <div className="text-sm font-bold tabular-nums">{Number(o.total).toFixed(0)} {o.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2"><Store className="h-4 w-4 text-primary" /> أحدث المتاجر</h2>
            <Link to="/admin/stores" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">إدارة <ArrowLeft className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-2">
            {data.recentStores.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">لا توجد متاجر بعد.</div>}
            {data.recentStores.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{s.name_ar}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">{new Date(s.created_at).toLocaleDateString("ar-EG")}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 ${accent ? "border-primary/30 bg-gradient-to-bl from-primary/10 to-transparent" : "border-border bg-card"}`}
      style={{ boxShadow: "0 8px 24px -16px color-mix(in oklab, var(--foreground) 14%, transparent)" }}
    >
      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
        <span className="font-medium">{label}</span>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : ""}`} />
      </div>
      <div className="mt-2 font-display text-xl sm:text-3xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone?: "amber" | "emerald" }) {
  const toneCls = tone === "amber" ? "text-amber-600" : tone === "emerald" ? "text-emerald-600" : "text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-muted-foreground text-[11px]"><Icon className={`h-3.5 w-3.5 ${toneCls}`} /> {label}</div>
      <div className="mt-1.5 font-display text-xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}
