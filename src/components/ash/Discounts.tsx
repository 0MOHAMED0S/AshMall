import { useEffect, useState } from "react";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import { toast } from "sonner";
import { listDiscountProducts } from "@/lib/home.functions";
import { useCartAdd } from "@/hooks/use-cart-add";
import { useAuth } from "@/lib/auth-context";
import { ProductCardMini, type MiniProduct } from "./ProductCardMini";
import { SectionHeader } from "./SectionHeader";

interface Row {
  id: string;
  name_ar: string;
  price: number | null;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  store_id: string;
  stores: { slug: string; name_ar: string } | null;
}

export function Discounts() {
  const fetchDisc = useServerFn(listDiscountProducts);
  const addToCartGuarded = useCartAdd();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisc().then((r) => setRows((r.products ?? []) as unknown as Row[])).catch(() => {}).finally(() => setLoading(false));
  }, [fetchDisc]);

  async function onAdd(p: MiniProduct) {
    if (!user) { navigate({ to: "/auth", search: { redirect: "/" } }); return; }
    const row = rows.find((r) => r.id === p.id);
    if (!row) return;
    try {
      await addToCartGuarded({ store_id: row.store_id, name: row.name_ar, price: row.price ?? undefined });
      toast.success("أُضيف للسلة");
    } catch (e) { if ((e as Error).message !== "تم الإلغاء") toast.error((e as Error).message || "تعذّر الإضافة"); }
  }

  if (!loading && rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
      <SectionHeader title="خصومات وعروض" icon={Tag} />
      <div className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="shrink-0 w-[170px] sm:w-[200px] aspect-[3/4] rounded-3xl bg-secondary animate-pulse" />)
          : rows.map((r) => (
              <ProductCardMini
                key={r.id}
                p={{ id: r.id, name_ar: r.name_ar, price: r.price, compare_at_price: r.compare_at_price, image_url: r.image_url, store: { slug: r.stores?.slug ?? "", name_ar: r.stores?.name_ar ?? "" } }}
                onAdd={onAdd}
              />
            ))}
      </div>
    </section>
  );
}
