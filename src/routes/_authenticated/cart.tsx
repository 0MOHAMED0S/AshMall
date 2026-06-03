import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { listCart, updateCartItem, removeCartItem, clearCart } from "@/lib/cart.functions";
import { placeOrdersFromCart } from "@/lib/orders.functions";
import {
  ShoppingBag, Minus, Plus, Trash2, Loader2, CheckCircle2, Heart,
  ArrowRight, Store as StoreIcon, Receipt, Truck, Phone, MapPin, StickyNote,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cart")({
  head: () => ({ meta: [{ title: "السلة — آش مول" }] }),
  component: CartPage,
});

interface CartRow {
  id: string;
  store_id: string;
  name: string;
  quantity: number;
  price: number | null;
  notes: string | null;
  stores: { id: string; slug: string; name_ar: string; logo_url: string | null } | null;
}

function CartPage() {
  const fetchAll = useServerFn(listCart);
  const upd = useServerFn(updateCartItem);
  const rm = useServerFn(removeCartItem);
  const wipe = useServerFn(clearCart);
  const place = useServerFn(placeOrdersFromCart);
  const navigate = useNavigate();
  const router = useRouter();
  const [rows, setRows] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [backHref, setBackHref] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("cart:back");
    if (saved) setBackHref(saved);
  }, []);

  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      setRows((r.items ?? []) as unknown as CartRow[]);
    } finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, { store: CartRow["stores"]; items: CartRow[]; total: number }>();
    for (const r of rows) {
      const key = r.store_id;
      if (!map.has(key)) map.set(key, { store: r.stores, items: [], total: 0 });
      const g = map.get(key)!;
      g.items.push(r);
      g.total += (r.price ?? 0) * r.quantity;
    }
    return Array.from(map.values());
  }, [rows]);

  const grandTotal = rows.reduce((s, r) => s + (r.price ?? 0) * r.quantity, 0);
  const itemsCount = rows.reduce((s, r) => s + r.quantity, 0);
  const storesCount = grouped.length;

  async function setQty(id: string, q: number) {
    if (q < 1) return;
    setRows((p) => p.map((r) => (r.id === id ? { ...r, quantity: q } : r)));
    try { await upd({ data: { id, quantity: q } }); bumpBadges(); }
    catch { toast.error("تعذّر التحديث"); void reload(); }
  }
  async function removeOne(id: string) {
    setRows((p) => p.filter((r) => r.id !== id));
    try { await rm({ data: { id } }); bumpBadges(); toast.success("أُزيل من السلة"); }
    catch { toast.error("تعذّر الحذف"); void reload(); }
  }
  async function clearAll() {
    if (!confirm("تفريغ السلة بالكامل؟")) return;
    try { await wipe(); bumpBadges(); setRows([]); toast.success("تم تفريغ السلة"); }
    catch { toast.error("حدث خطأ"); }
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) { toast.error("اكتب رقم الهاتف والعنوان"); return; }
    setSubmitting(true);
    try {
      await place({ data: { phone: phone.trim(), address: address.trim(), notes: notes.trim() || undefined } });
      toast.success("تم إرسال طلبك بنجاح");
      setCheckout(false); setRows([]);
      navigate({ to: "/orders" });
    } catch (err) { toast.error((err as Error).message); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Nav />
      <main className="pt-36 sm:pt-44 pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <header className="relative mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="font-display font-extrabold tracking-tight text-2xl sm:text-4xl text-foreground">
                  السلة
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  راجع طلبك قبل التأكيد.
                </p>
              </div>
              <button
                onClick={() => (backHref ? (window.location.href = backHref) : router.history.back())}
                aria-label="رجوع"
                className="shrink-0 grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card border border-border hover:border-primary/40 hover:text-primary transition active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-3xl bg-secondary/40 animate-pulse" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
                <StatCard label="المتاجر" value={storesCount.toLocaleString("ar-EG")} tone="teal" icon={<StoreIcon className="h-4 w-4 sm:h-5 sm:w-5" />} />
                <StatCard label="العناصر" value={itemsCount.toLocaleString("ar-EG")} tone="amber" icon={<ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />} />
                <StatCard label="الإجمالي" value={`${grandTotal.toFixed(0)}`} suffix="ج.م" tone="primary" icon={<Receipt className="h-4 w-4 sm:h-5 sm:w-5" />} />
              </div>

              {/* Actions bar */}
              <div className="mb-5 sm:mb-6 flex items-center gap-2 flex-wrap">
                {backHref && (
                  <a
                    href={backHref}
                    onClick={() => { sessionStorage.removeItem("cart:back"); }}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:text-primary transition px-3 sm:px-4 py-2.5 text-xs font-bold active:scale-[0.97]"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    العودة للمفضلة
                  </a>
                )}
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card hover:border-destructive/40 hover:text-destructive transition px-3 sm:px-4 py-2.5 text-xs font-bold active:scale-[0.97]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  تفريغ السلة
                </button>
              </div>

              {/* Layout */}
              <div className="grid lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
                {/* Items */}
                <div className="space-y-4 sm:space-y-5 min-w-0">
                  {grouped.map((g) => (
                    <section
                      key={g.store?.id ?? Math.random()}
                      className="rounded-3xl border border-border bg-card p-4 sm:p-5"
                      style={{ boxShadow: "0 8px 24px -16px color-mix(in oklab, var(--foreground) 18%, transparent)" }}
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-4 pb-4 border-b border-border/60">
                        <Link to="/stores/$slug" params={{ slug: g.store?.slug ?? "" }} className="flex items-center gap-3 group min-w-0">
                          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl overflow-hidden bg-muted ring-1 ring-border grid place-items-center shrink-0">
                            {g.store?.logo_url ? (
                              <img src={g.store.logo_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="font-display text-lg font-bold text-primary">{g.store?.name_ar.slice(0, 1)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-display font-extrabold text-sm sm:text-base group-hover:text-primary transition truncate">{g.store?.name_ar}</div>
                            <div className="text-[11px] text-muted-foreground">{g.items.length} عنصر</div>
                          </div>
                        </Link>
                        <span className="font-display font-extrabold tabular-nums text-sm sm:text-base text-primary">
                          {g.total.toFixed(0)} <span className="text-[10px] font-medium text-muted-foreground">ج.م</span>
                        </span>
                      </div>

                      <ul className="divide-y divide-border/60">
                        {g.items.map((it) => (
                          <li key={it.id} className="py-3 sm:py-3.5 flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm leading-tight">{it.name}</div>
                              {it.notes && <div className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{it.notes}</div>}
                              {it.price != null && (
                                <div className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
                                  {it.price.toFixed(0)} × {it.quantity} =
                                  <span className="mr-1 text-foreground font-bold">{(it.price * it.quantity).toFixed(0)} ج.م</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-0.5">
                                <button
                                  onClick={() => void setQty(it.id, it.quantity - 1)}
                                  className="grid place-items-center h-7 w-7 rounded-full hover:bg-background transition disabled:opacity-40"
                                  disabled={it.quantity <= 1}
                                  aria-label="إنقاص"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold tabular-nums">{it.quantity}</span>
                                <button
                                  onClick={() => void setQty(it.id, it.quantity + 1)}
                                  className="grid place-items-center h-7 w-7 rounded-full hover:bg-background transition"
                                  aria-label="زيادة"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => void removeOne(it.id)}
                                aria-label="حذف"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-destructive transition"
                              >
                                <Trash2 className="h-3 w-3" /> حذف
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                {/* Summary / Checkout */}
                <aside className="lg:sticky lg:top-28">
                  <div
                    className="rounded-3xl border border-primary/20 bg-card p-5 sm:p-6 space-y-4"
                    style={{ boxShadow: "0 16px 36px -22px color-mix(in oklab, var(--primary) 60%, transparent)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary/10 text-primary">
                        <Receipt className="h-4 w-4" />
                      </span>
                      <h2 className="font-display font-extrabold text-base sm:text-lg">ملخّص الطلب</h2>
                    </div>

                    <div className="space-y-2 text-sm">
                      <Row label="عدد العناصر" value={`${itemsCount.toLocaleString("ar-EG")}`} />
                      <Row label="عدد المتاجر" value={`${storesCount.toLocaleString("ar-EG")}`} />
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Truck className="h-3.5 w-3.5" /> التوصيل يُحتسب مع المتجر
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-3 border-t border-border">
                      <span className="text-xs sm:text-sm text-muted-foreground">الإجمالي</span>
                      <span className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-primary">
                        {grandTotal.toFixed(0)} <span className="text-xs font-medium text-muted-foreground">ج.م</span>
                      </span>
                    </div>

                    {!checkout ? (
                      <button
                        onClick={() => setCheckout(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3.5 text-sm font-bold hover:opacity-95 active:scale-[0.99] transition"
                      >
                        <CheckCircle2 className="h-5 w-5" /> إتمام الطلب
                      </button>
                    ) : (
                      <form onSubmit={submitOrder} className="space-y-3 pt-2 border-t border-border">
                        <Field label="رقم الهاتف *" icon={<Phone className="h-3.5 w-3.5" />}>
                          <input
                            dir="ltr"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm text-start focus:outline-none focus:border-primary/50 transition"
                          />
                        </Field>
                        <Field label="عنوان التوصيل *" icon={<MapPin className="h-3.5 w-3.5" />}>
                          <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="الشارع، المنطقة، أقرب علامة مميزة"
                            className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition"
                          />
                        </Field>
                        <Field label="ملاحظات (اختياري)" icon={<StickyNote className="h-3.5 w-3.5" />}>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition resize-none"
                          />
                        </Field>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setCheckout(false)}
                            disabled={submitting}
                            className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold hover:border-border/80 transition disabled:opacity-50"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-bold hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                          >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            تأكيد الطلب
                          </button>
                        </div>
                      </form>
                    )}

                    <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
                      سيتم إرسال طلبك للمتجر مباشرةً وستصلك إشعارات بحالة الطلب.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs sm:text-sm">{label}</span>
      <span className="font-bold tabular-nums text-sm">{value}</span>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1.5">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({
  label, value, suffix, tone, icon,
}: {
  label: string; value: string; suffix?: string;
  tone: "teal" | "amber" | "primary"; icon: React.ReactNode;
}) {
  const palette =
    tone === "teal"
      ? { bg: "oklch(0.95 0.04 195)", fg: "oklch(0.55 0.13 195)", ring: "oklch(0.85 0.07 195)" }
      : tone === "amber"
      ? { bg: "oklch(0.96 0.06 70)", fg: "oklch(0.65 0.18 55)", ring: "oklch(0.88 0.1 65)" }
      : { bg: "color-mix(in oklab, var(--primary) 12%, var(--card))", fg: "var(--primary)", ring: "color-mix(in oklab, var(--primary) 30%, transparent)" };
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-3 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-0.5 sm:mt-1 font-display text-lg sm:text-2xl font-extrabold tabular-nums leading-tight">
            {value}
            {suffix && <span className="ms-1 text-[10px] sm:text-xs font-medium text-muted-foreground">{suffix}</span>}
          </div>
        </div>
        <span
          className="grid place-items-center h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl shrink-0"
          style={{ background: palette.bg, color: palette.fg, boxShadow: `inset 0 0 0 1px ${palette.ring}` }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 sm:p-14 text-center">
      <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full grid place-items-center bg-primary/10 text-primary mb-4">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="font-display text-lg sm:text-xl font-extrabold">سلتك فاضية</h2>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
        تصفّح المتاجر وأضف الطلبات اللي عايزها لتظهر هنا.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
        <Link to="/stores" className="inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition">
          تصفّح المتاجر
        </Link>
        <Link
          to="/favorites"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:border-primary/40 hover:text-primary transition"
        >
          <Heart className="h-4 w-4" /> المفضلة
        </Link>
      </div>
    </div>
  );
}
