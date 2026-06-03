import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState, StatusBadge } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersAdmin,
});

interface AdminOrder {
  id: string; total: number; currency: string; status: string; phone: string | null;
  address: string | null; created_at: string; user_id: string; store_id: string;
  stores: { name_ar: string } | null;
}

const STATUSES = ["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"] as const;
type Status = typeof STATUSES[number];

function OrdersAdmin() {
  const list = useServerFn(adminListOrders);
  const setStatus = useServerFn(adminUpdateOrderStatus);
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function reload() {
    setLoading(true);
    try { const r = await list({ data: { status: filter } }); setRows((r.orders ?? []) as AdminOrder[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, [filter]);

  async function changeStatus(id: string, next: Status) {
    try { await setStatus({ data: { id, status: next } }); toast.success("تم التحديث"); setRows((p) => p.map((o) => o.id === id ? { ...o, status: next } : o)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحديث"); }
  }

  const tabs = [
    { key: "all", label: "الكل" },
    ...STATUSES.map((s) => ({ key: s, label: ({ pending: "قيد المراجعة", confirmed: "مؤكدة", preparing: "تحضير", delivering: "توصيل", completed: "مكتملة", cancelled: "ملغية" } as Record<string, string>)[s] })),
  ];

  return (
    <div>
      <AdminPageHeader icon={ShoppingBag} eyebrow="Orders" title="إدارة الطلبات" description="متابعة وتحديث حالة كل طلبات المنصة." />

      <Card className="p-3 mb-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                filter === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="لا توجد طلبات" />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((o) => (
              <li key={o.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold truncate max-w-full">{o.stores?.name_ar ?? "—"}</span>
                    <StatusBadge status={o.status} />
                    <span className="text-[11px] text-muted-foreground tabular-nums">#{o.id.slice(0, 8)}</span>
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 sm:truncate">
                    {new Date(o.created_at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}
                    {o.phone ? ` · ${o.phone}` : ""}
                    {o.address ? ` · ${o.address}` : ""}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                  <div className="text-sm font-bold tabular-nums">{Number(o.total).toFixed(0)} {o.currency}</div>
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value as Status)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs focus:border-primary outline-none"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{({ pending: "قيد المراجعة", confirmed: "مؤكدة", preparing: "تحضير", delivering: "توصيل", completed: "مكتملة", cancelled: "ملغية" } as Record<string, string>)[s]}</option>)}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
