import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Store, Search, Star, Trash2, CheckCircle2, XCircle, ShieldOff, RotateCcw, ExternalLink, KeyRound, Copy, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminListStores, adminUpdateStore, adminDeleteStore } from "@/lib/admin.functions";
import { adminCreateMerchantForStore, adminGetStoreCredentials } from "@/lib/merchant.functions";
import { AdminPageHeader, Card, Spinner, EmptyState, StatusBadge } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/stores")({
  component: StoresAdmin,
});

interface AdminStore {
  id: string; slug: string; name_ar: string; address: string; phone: string | null;
  status: string; is_featured: boolean; rating: number; rating_count: number;
  owner_id: string | null; created_at: string;
  categories: { name_ar: string } | null;
}

function StoresAdmin() {
  const list = useServerFn(adminListStores);
  const update = useServerFn(adminUpdateStore);
  const del = useServerFn(adminDeleteStore);
  const [credTarget, setCredTarget] = useState<AdminStore | null>(null);
  const [rows, setRows] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");

  async function reload() {
    setLoading(true);
    try { const r = await list({ data: { status, q } }); setRows((r.stores ?? []) as AdminStore[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, [status]);

  async function setStoreStatus(id: string, next: "approved" | "rejected" | "suspended" | "pending") {
    try { await update({ data: { id, status: next } }); toast.success("تم التحديث"); await reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحديث"); }
  }
  async function toggleFeature(id: string, is_featured: boolean) {
    try { await update({ data: { id, is_featured } }); toast.success(is_featured ? "تمت الإضافة للمميزة" : "تمت الإزالة"); await reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحديث"); }
  }
  async function removeStore(id: string) {
    if (!confirm("حذف المتجر نهائياً؟ لا يمكن التراجع.")) return;
    try { await del({ data: { id } }); toast.success("تم الحذف"); setRows((p) => p.filter((s) => s.id !== id)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  const tabs = [
    { key: "all", label: "الكل" },
    { key: "pending", label: "قيد المراجعة" },
    { key: "approved", label: "موثّقة" },
    { key: "rejected", label: "مرفوضة" },
    { key: "suspended", label: "معلّقة" },
  ];

  return (
    <div>
      <AdminPageHeader icon={Store} eyebrow="Stores" title="إدارة المتاجر" description="مراجعة وتوثيق وإيقاف وتمييز المتاجر." />

      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatus(t.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  status === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); void reload(); }}
            className="ms-auto relative flex-1 min-w-[200px] max-w-sm"
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="بحث بالاسم..."
              className="w-full rounded-full bg-background border border-border ps-4 pe-9 py-2 text-sm focus:border-primary outline-none"
            />
          </form>
        </div>
      </Card>

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Store} title="لا توجد متاجر" hint="جرّب تغيير الفلتر أو البحث." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((s) => (
              <li key={s.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to="/stores/$slug" params={{ slug: s.slug }} className="font-display font-bold hover:text-primary truncate max-w-full">
                      {s.name_ar}
                    </Link>
                    <StatusBadge status={s.status} />
                    {s.is_featured && <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold"><Star className="h-3 w-3 fill-primary" /> مميز</span>}
                    {s.categories?.name_ar && <span className="text-[10px] rounded-full bg-secondary border border-border text-muted-foreground px-2 py-0.5">{s.categories.name_ar}</span>}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 sm:truncate">
                    {s.address}{s.phone ? ` · ${s.phone}` : ""} · ⭐ {Number(s.rating).toFixed(1)} ({s.rating_count})
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {s.status !== "approved" && (
                    <button onClick={() => setStoreStatus(s.id, "approved")} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-3 py-1.5 text-xs hover:bg-emerald-500/25 transition">
                      <CheckCircle2 className="h-3.5 w-3.5" /> توثيق
                    </button>
                  )}
                  {s.status === "pending" && (
                    <button onClick={() => setStoreStatus(s.id, "rejected")} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30 px-3 py-1.5 text-xs hover:bg-destructive/20 transition">
                      <XCircle className="h-3.5 w-3.5" /> رفض
                    </button>
                  )}
                  {s.status === "approved" && (
                    <>
                      <button onClick={() => toggleFeature(s.id, !s.is_featured)} className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs hover:bg-secondary/80 transition">
                        <Star className={`h-3.5 w-3.5 ${s.is_featured ? "fill-primary text-primary" : ""}`} />
                        {s.is_featured ? "إلغاء التمييز" : "تمييز"}
                      </button>
                      <button onClick={() => setStoreStatus(s.id, "suspended")} className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 px-3 py-1.5 text-xs hover:bg-amber-500/20 transition">
                        <ShieldOff className="h-3.5 w-3.5" /> إيقاف
                      </button>
                    </>
                  )}
                  {(s.status === "rejected" || s.status === "suspended") && (
                    <button onClick={() => setStoreStatus(s.id, "pending")} className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs hover:bg-secondary/80 transition">
                      <RotateCcw className="h-3.5 w-3.5" /> إعادة للمراجعة
                    </button>
                  )}
                  <button onClick={() => setCredTarget(s)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 text-xs hover:bg-primary/20 transition">
                    <KeyRound className="h-3.5 w-3.5" /> بيانات دخول التاجر
                  </button>
                  <Link to="/stores/$slug" params={{ slug: s.slug }} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition" aria-label="فتح">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button onClick={() => removeStore(s.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition" aria-label="حذف">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {credTarget && <StoreCredentialsModal store={credTarget} onClose={() => setCredTarget(null)} />}
    </div>
  );
}

function StoreCredentialsModal({ store, onClose }: { store: AdminStore; onClose: () => void }) {
  const get = useServerFn(adminGetStoreCredentials);
  const create = useServerFn(adminCreateMerchantForStore);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [creds, setCreds] = useState<{ email: string; password: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await get({ data: { store_id: store.id } });
        if (r.credentials) setCreds({ email: r.credentials.email, password: r.credentials.password });
      } finally { setLoading(false); }
    })();
  }, [store.id, get]);

  async function generate() {
    setWorking(true);
    try {
      const r = await create({
        data: {
          store_id: store.id,
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(password.trim() ? { password: password.trim() } : {}),
        },
      });
      setCreds({ email: r.email, password: r.password });
      toast.success("تم إنشاء/تحديث بيانات الدخول ✅");
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); }
    finally { setWorking(false); }
  }

  function copy(t: string) { navigator.clipboard.writeText(t); toast.success("نُسخ"); }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-border bg-gradient-to-bl from-primary/10 to-transparent">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">Merchant Login</div>
            <div className="font-display text-lg font-extrabold truncate">{store.name_ar}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">سيستخدم التاجر هذه البيانات للدخول على /merchant/login</div>
          </div>
          <button onClick={onClose} className="grid place-items-center h-8 w-8 rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          {loading ? <Spinner /> : creds ? (
            <div className="space-y-2">
              <Row label="البريد" value={creds.email} onCopy={() => copy(creds.email)} />
              <Row label="كلمة المرور" value={creds.password} onCopy={() => copy(creds.password)} />
              <button onClick={generate} disabled={working} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-sm hover:bg-secondary/80 disabled:opacity-60">
                {working && <Loader2 className="h-4 w-4 animate-spin" />} إعادة توليد كلمة مرور جديدة
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">لا يوجد حساب دخول لهذا المتجر بعد. اكتب البريد وكلمة المرور أو اتركها فاضية للتوليد التلقائي.</p>
              <label className="block">
                <span className="block text-xs font-semibold text-muted-foreground mb-1.5">البريد (اختياري)</span>
                <input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`merchant-${store.slug}@ashmoun.local`}
                  className="w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:border-primary outline-none text-start" />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-muted-foreground mb-1.5">كلمة المرور (اختياري)</span>
                <input dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="اتركها فاضية للتوليد"
                  className="w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:border-primary outline-none text-start" />
              </label>
              <button onClick={generate} disabled={working} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-60">
                {working && <Loader2 className="h-4 w-4 animate-spin" />} إنشاء حساب التاجر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2">
      <div className="text-[11px] text-muted-foreground w-20 shrink-0">{label}</div>
      <div dir="ltr" className="flex-1 text-sm font-mono truncate">{value}</div>
      <button onClick={onCopy} className="grid place-items-center h-7 w-7 rounded-full hover:bg-background"><Copy className="h-3.5 w-3.5" /></button>
    </div>
  );
}
