import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Package, Search, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { adminListProducts, adminUpdateProduct, adminDeleteProduct } from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsAdmin,
});

interface Product {
  id: string;
  name_ar: string;
  price: number | null;
  currency: string;
  image_url: string | null;
  is_available: boolean;
  order_count: number;
  store_id: string;
  stores: { name_ar: string; slug: string } | null;
}

function ProductsAdmin() {
  const list = useServerFn(adminListProducts);
  const upd = useServerFn(adminUpdateProduct);
  const del = useServerFn(adminDeleteProduct);
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [edits, setEdits] = useState<Record<string, { name_ar?: string; price?: string }>>({});

  async function reload() {
    setLoading(true);
    try {
      const r = await list({ data: { q: q || undefined } });
      setRows((r.products ?? []) as Product[]);
      setEdits({});
    } finally { setLoading(false); }
  }
  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, []);

  async function toggle(p: Product) {
    try {
      await upd({ data: { id: p.id, is_available: !p.is_available } });
      setRows((prev) => prev.map((r) => (r.id === p.id ? { ...r, is_available: !p.is_available } : r)));
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحديث"); }
  }

  async function save(p: Product) {
    const e = edits[p.id];
    if (!e) return;
    try {
      await upd({ data: {
        id: p.id,
        name_ar: e.name_ar ?? p.name_ar,
        price: e.price !== undefined ? (e.price === "" ? null : Number(e.price)) : p.price,
      } });
      toast.success("تم الحفظ");
      await reload();
    } catch (er) { toast.error(er instanceof Error ? er.message : "فشل الحفظ"); }
  }

  async function remove(id: string) {
    if (!confirm("حذف المنتج؟")) return;
    try {
      await del({ data: { id } });
      setRows((p) => p.filter((r) => r.id !== id));
      toast.success("تم الحذف");
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div>
      <AdminPageHeader
        icon={Package}
        eyebrow="Products"
        title="إدارة المنتجات"
        description="جميع المنتجات في كل المتاجر — تحكّم في السعر والتوفر والحذف."
      />

      <Card className="p-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void reload(); }}
              placeholder="ابحث بالاسم..."
              className="w-full rounded-xl border border-border bg-background pr-9 pl-3 py-2 text-sm focus:border-primary outline-none"
            />
          </div>
          <button onClick={() => void reload()} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">بحث</button>
        </div>
      </Card>

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Package} title="لا توجد منتجات" hint="جرّب بحث آخر." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((p) => {
              const e = edits[p.id] ?? {};
              const dirty = e.name_ar !== undefined || e.price !== undefined;
              return (
                <li key={p.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-secondary border border-border overflow-hidden shrink-0">
                    {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2">
                    <input
                      defaultValue={p.name_ar}
                      onChange={(ev) => setEdits((prev) => ({ ...prev, [p.id]: { ...prev[p.id], name_ar: ev.target.value } }))}
                      className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm focus:border-primary outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={p.price ?? ""}
                      onChange={(ev) => setEdits((prev) => ({ ...prev, [p.id]: { ...prev[p.id], price: ev.target.value } }))}
                      placeholder="السعر"
                      className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm focus:border-primary outline-none tabular-nums"
                      dir="ltr"
                    />
                    <div className="text-[11px] text-muted-foreground col-span-full">
                      المتجر: <span className="font-semibold text-foreground">{p.stores?.name_ar ?? "—"}</span>
                      <span className="mx-2">·</span>
                      الطلبات: <span className="tabular-nums">{p.order_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {dirty && (
                      <button onClick={() => save(p)} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold">
                        <Save className="h-3.5 w-3.5" /> حفظ
                      </button>
                    )}
                    <button
                      onClick={() => toggle(p)}
                      title={p.is_available ? "إخفاء" : "إظهار"}
                      className={`grid place-items-center h-8 w-8 rounded-full border transition ${p.is_available ? "border-emerald-500/30 text-emerald-600" : "border-border text-muted-foreground"}`}
                    >
                      {p.is_available ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => remove(p.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
