import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminListReviews, adminDeleteReview } from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: ReviewsAdmin,
});

interface Review {
  id: string; rating: number; comment: string | null; created_at: string;
  stores: { name_ar: string } | null;
}

function ReviewsAdmin() {
  const list = useServerFn(adminListReviews);
  const del = useServerFn(adminDeleteReview);
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try { const r = await list(); setRows((r.reviews ?? []) as Review[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  async function remove(id: string) {
    if (!confirm("حذف التقييم؟")) return;
    try { await del({ data: { id } }); setRows((p) => p.filter((r) => r.id !== id)); toast.success("تم الحذف"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div>
      <AdminPageHeader icon={Star} eyebrow="Reviews" title="إدارة التقييمات" description="مراجعة وحذف التقييمات المخالفة." />

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Star} title="لا توجد تقييمات" />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="p-4 flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold tabular-nums shrink-0">{r.rating}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{r.stores?.name_ar ?? "—"}</div>
                  {r.comment && <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{r.comment}</p>}
                  <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{new Date(r.created_at).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}</div>
                </div>
                <button onClick={() => remove(r.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
