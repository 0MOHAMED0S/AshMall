import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Megaphone, Plus, Trash2, Edit2, X, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { adminListAds, adminUpsertAd, adminDeleteAd } from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/ads")({
  component: AdsAdmin,
});

interface Ad {
  id: string; title: string; subtitle: string | null; image_url: string | null;
  link: string | null; active: boolean; sort_order: number; created_at: string;
}

function AdsAdmin() {
  const list = useServerFn(adminListAds);
  const save = useServerFn(adminUpsertAd);
  const del = useServerFn(adminDeleteAd);
  const [rows, setRows] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Ad> | null>(null);

  async function reload() {
    setLoading(true);
    try { const r = await list(); setRows((r.ads ?? []) as Ad[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  async function submit() {
    if (!editing?.title) { toast.error("العنوان مطلوب"); return; }
    try {
      await save({ data: {
        id: editing.id,
        title: editing.title,
        subtitle: editing.subtitle ?? null,
        image_url: editing.image_url ?? null,
        link: editing.link ?? null,
        sort_order: editing.sort_order ?? 0,
        active: editing.active ?? true,
      } });
      toast.success("تم الحفظ"); setEditing(null); await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
  }
  async function toggleActive(ad: Ad) {
    try { await save({ data: { id: ad.id, title: ad.title, subtitle: ad.subtitle, image_url: ad.image_url, link: ad.link, sort_order: ad.sort_order, active: !ad.active } });
      setRows((p) => p.map((a) => a.id === ad.id ? { ...a, active: !a.active } : a)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل"); }
  }
  async function remove(id: string) {
    if (!confirm("حذف الإعلان؟")) return;
    try { await del({ data: { id } }); toast.success("تم الحذف"); setRows((p) => p.filter((a) => a.id !== id)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div>
      <AdminPageHeader
        icon={Megaphone} eyebrow="Ads" title="إدارة الإعلانات" description="بنرات الإعلانات على الصفحة الرئيسية."
        actions={
          <button onClick={() => setEditing({ title: "", subtitle: "", image_url: "", link: "", sort_order: 0, active: true })}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-95 transition">
            <Plus className="h-4 w-4" /> إعلان جديد
          </button>
        }
      />

      {editing && (
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold">{editing.id ? "تعديل الإعلان" : "إعلان جديد"}</div>
            <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="العنوان *"><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></Field>
            <Field label="العنوان الفرعي"><input value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className={inputCls} /></Field>
            <Field label="رابط الصورة (URL)"><input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className={inputCls} dir="ltr" placeholder="https://..." /></Field>
            <Field label="الرابط عند الضغط"><input value={editing.link ?? ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className={inputCls} dir="ltr" placeholder="/stores/..." /></Field>
            <Field label="ترتيب"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} /></Field>
            <Field label="الحالة">
              <label className="inline-flex items-center gap-2 mt-2"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> نشط</label>
            </Field>
          </div>
          {editing.image_url && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-border h-32">
              <img src={editing.image_url} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-full border border-border px-4 py-2 text-sm">إلغاء</button>
            <button onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"><Save className="h-4 w-4" /> حفظ</button>
          </div>
        </Card>
      )}

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Megaphone} title="لا توجد إعلانات بعد" />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((a) => (
              <li key={a.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-16 w-24 rounded-xl bg-secondary overflow-hidden shrink-0">
                    {a.image_url ? <img src={a.image_url} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center text-muted-foreground"><Megaphone className="h-5 w-5" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{a.title}</div>
                    {a.subtitle && <div className="text-xs text-muted-foreground truncate">{a.subtitle}</div>}
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>ترتيب {a.sort_order}</span>
                      {a.active ? <span className="text-emerald-600">● نشط</span> : <span>● موقوف</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  <button onClick={() => toggleActive(a)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition" aria-label={a.active ? "إيقاف" : "تفعيل"}>
                    {a.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => setEditing(a)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(a.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[11px] font-semibold text-muted-foreground mb-1">{label}</span>{children}</label>;
}
