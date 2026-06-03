import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyStoreProducts, createProduct, deleteProduct } from "@/lib/products.functions";
import { Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

export function OwnerProductsManager({ storeId }: { storeId: string }) {
  const fetchMine = useServerFn(listMyStoreProducts);
  const create = useServerFn(createProduct);
  const del = useServerFn(deleteProduct);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-products", storeId],
    queryFn: () => fetchMine({ data: { storeId } }),
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [section, setSection] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("اكتب اسم المنتج"); return; }
    setBusy(true);
    try {
      await create({ data: {
        store_id: storeId,
        name_ar: name.trim(),
        price: price ? Number(price) : undefined,
        section: section.trim() || undefined,
        image_url: image.trim() || undefined,
        description_ar: desc.trim() || undefined,
      }});
      toast.success("تمت إضافة المنتج");
      setName(""); setPrice(""); setSection(""); setImage(""); setDesc("");
      qc.invalidateQueries({ queryKey: ["my-products", storeId] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "خطأ"); }
    finally { setBusy(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا المنتج؟")) return;
    try {
      await del({ data: { id } });
      toast.success("تم الحذف");
      qc.invalidateQueries({ queryKey: ["my-products", storeId] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "خطأ"); }
  }

  const products = (data?.products ?? []) as Array<{ id: string; name_ar: string; price: number | null; currency: string; section: string | null; image_url: string | null }>;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-5">
        <Package className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-bold">منتجات المتجر</h3>
      </div>

      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المنتج *" maxLength={150} className="bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
        <input value={section} onChange={(e) => setSection(e.target.value)} placeholder="القسم (مثل: مأكولات، أدوية)" maxLength={80} className="bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
        <input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر (جنيه)" className="bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 tabular-nums" />
        <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="رابط الصورة (اختياري)" className="bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف قصير (اختياري)" maxLength={800} rows={2} className="sm:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 resize-none" />
        <button type="submit" disabled={busy} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 transition active:scale-95 disabled:opacity-50">
          <Plus className="h-4 w-4" /> {busy ? "..." : "إضافة منتج"}
        </button>
      </form>

      <div className="space-y-2">
        {isLoading && <div className="h-16 rounded-xl bg-secondary/30 animate-pulse" />}
        {!isLoading && products.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">لا توجد منتجات بعد.</p>}
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl bg-secondary/30 border border-border p-3">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary shrink-0">
              {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{p.name_ar}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                {p.section && <span>{p.section}</span>}
                {p.price != null && <span className="tabular-nums">· {Number(p.price).toFixed(2)} {p.currency}</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(p.id)} aria-label="حذف" className="grid place-items-center h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 transition">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
