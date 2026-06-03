import { useState } from "react";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Plus, ShoppingBag } from "lucide-react";
import { useCartAdd } from "@/hooks/use-cart-add";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function AddToCartForm({ storeId }: { storeId: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCartGuarded = useCartAdd();
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    if (!name.trim()) { toast.error("اكتب اسم العنصر"); return; }
    setBusy(true);
    try {
      await addToCartGuarded({
        store_id: storeId,
        name: name.trim(),
        quantity: qty,
        price: price ? Number(price) : undefined,
        notes: notes.trim() || undefined,
      });
      toast.success("أُضيف إلى السلة");
      setName(""); setQty(1); setPrice(""); setNotes("");
    } catch (err) {
      if ((err as Error).message !== "تم الإلغاء") toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="glass-card rounded-3xl p-6 sm:p-8 mt-6">
      <div className="flex items-center gap-2 mb-5">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">أضف إلى السلة</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم العنصر *" maxLength={120} className="bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition" />
        <div className="flex gap-2">
          <input type="number" min={1} max={999} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))} placeholder="الكمية" className="w-24 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition tabular-nums" />
          <input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر (اختياري)" className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition tabular-nums" />
        </div>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات (اختياري)" maxLength={300} className="sm:col-span-2 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition" />
      </div>
      <button type="submit" disabled={busy} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-95 transition active:scale-95 disabled:opacity-50">
        <Plus className="h-4 w-4" /> {busy ? "جارٍ الإضافة..." : "أضف إلى السلة"}
      </button>
    </form>
  );
}
