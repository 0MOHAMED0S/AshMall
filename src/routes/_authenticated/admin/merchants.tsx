import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Briefcase, Search, Plus, KeyRound, Trash2, Copy, Mail, Phone, Store as StoreIcon,
  X, Loader2, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminListMerchants, adminCreateMerchant, adminResetMerchantPassword, adminDeleteMerchant,
} from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState, StatusBadge } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/merchants")({
  component: MerchantsAdmin,
});

interface Merchant {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  stores: { id: string; name_ar: string; slug: string; status: string }[];
}

function MerchantsAdmin() {
  const list = useServerFn(adminListMerchants);
  const create = useServerFn(adminCreateMerchant);
  const reset = useServerFn(adminResetMerchantPassword);
  const del = useServerFn(adminDeleteMerchant);

  const [rows, setRows] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [resetTarget, setResetTarget] = useState<Merchant | null>(null);

  async function reload() {
    setLoading(true);
    try { const r = await list({ data: { q } }); setRows((r.merchants ?? []) as Merchant[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, []);

  async function removeMerchant(m: Merchant) {
    if (!confirm(`حذف حساب التاجر "${m.full_name ?? m.email}" نهائياً؟ سيتم حذف كل بياناته.`)) return;
    try { await del({ data: { user_id: m.id } }); toast.success("تم الحذف"); setRows((p) => p.filter((x) => x.id !== m.id)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div>
      <AdminPageHeader
        icon={Briefcase}
        eyebrow="Merchants"
        title="حسابات التجار"
        description="أنشئ حسابات تجارة بإيميل وكلمة مرور، وأعد ضبط الباسوورد عند الحاجة."
        actions={
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" /> تاجر جديد
          </button>
        }
      />

      <Card className="p-3 mb-4">
        <form onSubmit={(e) => { e.preventDefault(); void reload(); }} className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="بحث بالاسم أو البريد..."
            className="w-full rounded-full bg-background border border-border ps-4 pe-9 py-2 text-sm focus:border-primary outline-none"
          />
        </form>
      </Card>

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Briefcase} title="لا يوجد تجار بعد" hint="أنشئ أول حساب تاجر من زر «تاجر جديد»." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((m) => (
              <li key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold truncate">{m.full_name ?? "(بدون اسم)"}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold">
                      <ShieldCheck className="h-3 w-3" /> تاجر
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                    {m.email && (
                      <span className="inline-flex items-center gap-1" dir="ltr">
                        <Mail className="h-3 w-3" /> {m.email}
                        <button onClick={() => { navigator.clipboard.writeText(m.email!); toast.success("نُسخ"); }} className="opacity-60 hover:opacity-100"><Copy className="h-3 w-3" /></button>
                      </span>
                    )}
                    {m.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {m.phone}</span>}
                  </div>
                  {m.stores.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.stores.map((s) => (
                        <Link key={s.id} to="/stores/$slug" params={{ slug: s.slug }}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-2 py-0.5 text-[10px] hover:border-primary/40 hover:text-primary transition">
                          <StoreIcon className="h-3 w-3" /> {s.name_ar} <StatusBadge status={s.status} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setResetTarget(m)} className="inline-flex items-center gap-1 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs hover:bg-secondary/80 transition">
                    <KeyRound className="h-3.5 w-3.5" /> كلمة مرور
                  </button>
                  <button onClick={() => removeMerchant(m)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition" aria-label="حذف">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {openCreate && <CreateMerchantModal onClose={() => setOpenCreate(false)} onCreated={() => { setOpenCreate(false); void reload(); }} create={create} />}
      {resetTarget && <ResetPasswordModal merchant={resetTarget} onClose={() => setResetTarget(null)} reset={reset} />}
    </div>
  );
}

function CreateMerchantModal({ onClose, onCreated, create }: {
  onClose: () => void; onCreated: () => void;
  create: ReturnType<typeof useServerFn<typeof adminCreateMerchant>>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(() => generatePassword());
  const [full_name, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await create({ data: { email: email.trim(), password, full_name: full_name.trim(), phone: phone.trim() || undefined } });
      toast.success("تم إنشاء حساب التاجر ✅");
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الإنشاء");
    } finally { setLoading(false); }
  }

  return (
    <Modal onClose={onClose} title="إنشاء حساب تاجر" subtitle="أدخل بيانات الدخول التي سيستخدمها التاجر في صفحة /auth.">
      <form onSubmit={submit} className="space-y-3">
        <Field label="الاسم الكامل">
          <input required value={full_name} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
        </Field>
        <Field label="البريد الإلكتروني">
          <input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls + " text-start"} />
        </Field>
        <Field label="كلمة المرور (8 أحرف على الأقل)">
          <div className="flex gap-2">
            <input required minLength={8} dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls + " text-start flex-1"} />
            <button type="button" onClick={() => setPassword(generatePassword())} className="rounded-xl border border-border bg-secondary px-3 text-xs hover:bg-secondary/80">توليد</button>
            <button type="button" onClick={() => { navigator.clipboard.writeText(password); toast.success("نُسخت"); }} className="grid place-items-center rounded-xl border border-border bg-secondary px-3 hover:bg-secondary/80"><Copy className="h-4 w-4" /></button>
          </div>
        </Field>
        <Field label="رقم الهاتف (اختياري)">
          <input dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls + " text-start"} />
        </Field>
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
          احفظ كلمة المرور وأرسلها للتاجر — لن تظهر مرة أخرى بعد إغلاق هذه النافذة.
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm">إلغاء</button>
          <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} إنشاء الحساب
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({ merchant, onClose, reset }: {
  merchant: Merchant; onClose: () => void;
  reset: ReturnType<typeof useServerFn<typeof adminResetMerchantPassword>>;
}) {
  const [password, setPassword] = useState(() => generatePassword());
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await reset({ data: { user_id: merchant.id, password } });
      toast.success("تم تغيير كلمة المرور ✅");
      onClose();
    } catch (err) { toast.error(err instanceof Error ? err.message : "فشل التحديث"); }
    finally { setLoading(false); }
  }
  return (
    <Modal onClose={onClose} title="تغيير كلمة المرور" subtitle={merchant.email ?? merchant.full_name ?? ""}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="كلمة المرور الجديدة">
          <div className="flex gap-2">
            <input required minLength={8} dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls + " text-start flex-1"} />
            <button type="button" onClick={() => setPassword(generatePassword())} className="rounded-xl border border-border bg-secondary px-3 text-xs hover:bg-secondary/80">توليد</button>
            <button type="button" onClick={() => { navigator.clipboard.writeText(password); toast.success("نُسخت"); }} className="grid place-items-center rounded-xl border border-border bg-secondary px-3 hover:bg-secondary/80"><Copy className="h-4 w-4" /></button>
          </div>
        </Field>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm">إلغاء</button>
          <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-95 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} حفظ
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls = "w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:border-primary outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-border bg-gradient-to-bl from-primary/10 to-transparent">
          <div className="min-w-0">
            <div className="font-display text-lg font-extrabold">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground mt-0.5 truncate" dir="ltr">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="grid place-items-center h-8 w-8 rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let s = "";
  const arr = new Uint32Array(12);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 12; i++) s += chars[arr[i] % chars.length];
  return s;
}
