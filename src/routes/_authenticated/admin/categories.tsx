import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Tag, Plus, Trash2, Edit2, X, Save, ChevronDown, ChevronUp, Store as StoreIcon, ExternalLink, Star, ImagePlus, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminListCategories, adminUpsertCategory, adminDeleteCategory,
  adminListStoresByCategory, adminCreateStore, adminDeleteStore,
} from "@/lib/admin.functions";
import { AdminPageHeader, Card, Spinner, EmptyState, StatusBadge } from "@/components/ash/AdminUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoriesAdmin,
});

interface Category {
  id: string; name_ar: string; name_en: string; slug: string;
  icon: string | null; sort_order: number;
}
interface StoreRow {
  id: string; slug: string; name_ar: string; address: string; phone: string | null;
  status: string; is_featured: boolean; rating: number; rating_count: number;
  cover_url: string | null; logo_url: string | null;
}
interface NewStore {
  name_ar: string; name_en: string; description_ar: string;
  address: string; legal_name: string;
  delivery_fee: string; prep_time_minutes: string;
  opening_time: string; closing_time: string;
  logo_url: string; cover_url: string; is_featured: boolean;
}
const emptyStore: NewStore = {
  name_ar: "", name_en: "", description_ar: "",
  address: "", legal_name: "",
  delivery_fee: "", prep_time_minutes: "",
  opening_time: "", closing_time: "",
  logo_url: "", cover_url: "", is_featured: false,
};

function CategoriesAdmin() {
  const list = useServerFn(adminListCategories);
  const save = useServerFn(adminUpsertCategory);
  const del = useServerFn(adminDeleteCategory);
  const listStores = useServerFn(adminListStoresByCategory);
  const createStore = useServerFn(adminCreateStore);
  const deleteStore = useServerFn(adminDeleteStore);

  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [storesByCat, setStoresByCat] = useState<Record<string, StoreRow[]>>({});
  const [loadingStoresFor, setLoadingStoresFor] = useState<string | null>(null);
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newStore, setNewStore] = useState<NewStore>(emptyStore);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  async function uploadStoreImage(file: File, kind: "logo" | "cover") {
    if (!user) { toast.error("يجب تسجيل الدخول"); return null; }
    if (file.size > 5 * 1024 * 1024) { toast.error("الحجم الأقصى 5 ميجا"); return null; }
    const setBusy = kind === "logo" ? setLogoUploading : setCoverUploading;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/admin-${kind}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("store-media").upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("store-media").getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      toast.error("فشل رفع الصورة: " + (e as Error).message);
      return null;
    } finally { setBusy(false); }
  }

  async function reload() {
    setLoading(true);
    try { const r = await list(); setRows((r.categories ?? []) as Category[]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  async function submitCategory() {
    if (!editing) return;
    if (!editing.name_ar || !editing.name_en || !editing.slug) { toast.error("املأ كل الحقول المطلوبة"); return; }
    try {
      await save({ data: {
        id: editing.id,
        name_ar: editing.name_ar,
        name_en: editing.name_en,
        slug: editing.slug,
        icon: editing.icon ?? null,
        sort_order: editing.sort_order ?? 0,
      } });
      toast.success("تم الحفظ");
      setEditing(null);
      await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
  }

  async function removeCategory(id: string) {
    if (!confirm("حذف الفئة؟")) return;
    try { await del({ data: { id } }); toast.success("تم الحذف"); setRows((p) => p.filter((c) => c.id !== id)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  async function loadStoresFor(catId: string) {
    setLoadingStoresFor(catId);
    try {
      const r = await listStores({ data: { category_id: catId } });
      setStoresByCat((p) => ({ ...p, [catId]: (r.stores ?? []) as StoreRow[] }));
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحميل"); }
    finally { setLoadingStoresFor(null); }
  }

  async function toggleOpen(catId: string) {
    if (openId === catId) { setOpenId(null); setAddingFor(null); return; }
    setOpenId(catId);
    setAddingFor(null);
    if (!storesByCat[catId]) await loadStoresFor(catId);
  }

  async function submitNewStore(catId: string) {
    if (!newStore.name_ar.trim() || !newStore.address.trim()) {
      toast.error("الاسم والعنوان مطلوبان"); return;
    }
    setSaving(true);
    try {
      await createStore({ data: {
        category_id: catId,
        name_ar: newStore.name_ar.trim(),
        name_en: newStore.name_en.trim() || undefined,
        description_ar: newStore.description_ar.trim() || undefined,
        address: newStore.address.trim(),
        legal_name: newStore.legal_name.trim() || undefined,
        delivery_fee: newStore.delivery_fee ? Number(newStore.delivery_fee) : undefined,
        prep_time_minutes: newStore.prep_time_minutes ? parseInt(newStore.prep_time_minutes) : undefined,
        opening_time: newStore.opening_time || undefined,
        closing_time: newStore.closing_time || undefined,
        logo_url: newStore.logo_url.trim() || undefined,
        cover_url: newStore.cover_url.trim() || undefined,
        is_featured: newStore.is_featured,
      } });
      toast.success("تمت إضافة المتجر وعرضه في الموقع");
      setNewStore(emptyStore);
      setAddingFor(null);
      await loadStoresFor(catId);
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الإضافة"); }
    finally { setSaving(false); }
  }

  async function removeStore(catId: string, id: string) {
    if (!confirm("حذف المتجر نهائياً؟")) return;
    try {
      await deleteStore({ data: { id } });
      toast.success("تم الحذف");
      setStoresByCat((p) => ({ ...p, [catId]: (p[catId] ?? []).filter((s) => s.id !== id) }));
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div>
      <AdminPageHeader
        icon={Tag} eyebrow="Categories" title="إدارة الفئات والمتاجر"
        description="كل فئة تعرض متاجرها — اضغط لعرضها أو لإضافة متجر جديد يظهر فورًا في الموقع."
        actions={
          <button onClick={() => setEditing({ name_ar: "", name_en: "", slug: "", icon: "", sort_order: 0 })}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-95 transition">
            <Plus className="h-4 w-4" /> فئة جديدة
          </button>
        }
      />

      {editing && (
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold">{editing.id ? "تعديل فئة" : "فئة جديدة"}</div>
            <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="الاسم بالعربية *"><input value={editing.name_ar ?? ""} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} className={inputCls} /></Field>
            <Field label="الاسم بالإنجليزية *"><input value={editing.name_en ?? ""} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} className={inputCls} /></Field>
            <Field label="Slug (a-z0-9-) *"><input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} dir="ltr" /></Field>
            <Field label="أيقونة (اختياري)"><input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className={inputCls} placeholder="مثل: pizza, shirt" dir="ltr" /></Field>
            <Field label="ترتيب"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} /></Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="rounded-full border border-border px-4 py-2 text-sm">إلغاء</button>
            <button onClick={submitCategory} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"><Save className="h-4 w-4" /> حفظ</button>
          </div>
        </Card>
      )}

      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState icon={Tag} title="لا توجد فئات بعد" hint="أضف أول فئة من الزر أعلاه." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((c) => {
              const isOpen = openId === c.id;
              const stores = storesByCat[c.id];
              return (
                <li key={c.id} className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg sm:rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-bold tabular-nums shrink-0">{c.sort_order}</div>
                    <button onClick={() => toggleOpen(c.id)} className="min-w-0 flex-1 text-right">
                      <div className="font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="truncate">{c.name_ar}</span>
                        <span className="text-[11px] sm:text-xs text-muted-foreground hidden sm:inline">/ {c.name_en}</span>
                        {stores && <span className="text-[10px] rounded-full bg-secondary border border-border px-2 py-0.5 text-muted-foreground shrink-0">{stores.length} متجر</span>}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate" dir="ltr">{c.slug}{c.icon ? ` · ${c.icon}` : ""}</div>
                    </button>
                    <button onClick={() => toggleOpen(c.id)} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:border-primary/40 hover:text-primary transition shrink-0" aria-label="عرض المتاجر">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button onClick={() => setEditing(c)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition shrink-0"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeCategory(c.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>

                  {isOpen && (
                    <div className="mt-3 sm:mt-4 ms-0 sm:ms-12 rounded-2xl border border-border bg-background/40 p-2.5 sm:p-3">
                      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                        <div className="text-xs font-semibold text-muted-foreground">متاجر هذه الفئة</div>
                        {addingFor !== c.id && (
                          <button onClick={() => { setAddingFor(c.id); setNewStore(emptyStore); }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-95 transition">
                            <Plus className="h-3.5 w-3.5" /> إضافة متجر
                          </button>
                        )}
                      </div>

                      {addingFor === c.id && (
                        <div className="mb-4 rounded-xl border border-border bg-card p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <Field label="اسم المتجر (عربي) *"><input value={newStore.name_ar} onChange={(e) => setNewStore({ ...newStore, name_ar: e.target.value })} className={inputCls} /></Field>
                            <Field label="الاسم (إنجليزي)"><input value={newStore.name_en} onChange={(e) => setNewStore({ ...newStore, name_en: e.target.value })} className={inputCls} dir="ltr" /></Field>
                            <Field label="العنوان *"><input value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} className={inputCls} /></Field>
                            <Field label="الاسم القانوني / السجل التجاري"><input value={newStore.legal_name} onChange={(e) => setNewStore({ ...newStore, legal_name: e.target.value })} className={inputCls} /></Field>
                            <Field label="رسوم التوصيل (ج.م)"><input type="number" min="0" step="1" value={newStore.delivery_fee} onChange={(e) => setNewStore({ ...newStore, delivery_fee: e.target.value })} className={inputCls} dir="ltr" /></Field>
                            <Field label="وقت التحضير (دقيقة)"><input type="number" min="0" step="1" value={newStore.prep_time_minutes} onChange={(e) => setNewStore({ ...newStore, prep_time_minutes: e.target.value })} className={inputCls} dir="ltr" /></Field>
                            <Field label="موعد الفتح"><input type="time" value={newStore.opening_time} onChange={(e) => setNewStore({ ...newStore, opening_time: e.target.value })} className={inputCls} dir="ltr" /></Field>
                            <Field label="موعد الإغلاق"><input type="time" value={newStore.closing_time} onChange={(e) => setNewStore({ ...newStore, closing_time: e.target.value })} className={inputCls} dir="ltr" /></Field>
                            <Field label="شعار المتجر">
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => logoInputRef.current?.click()}
                                  className="relative h-16 w-16 rounded-xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition bg-secondary/30 shrink-0">
                                  {newStore.logo_url ? (
                                    <img src={newStore.logo_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                  ) : (
                                    <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                                      {logoUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                                    </div>
                                  )}
                                </button>
                                {newStore.logo_url && (
                                  <button type="button" onClick={() => setNewStore({ ...newStore, logo_url: "" })}
                                    className="text-xs text-destructive hover:underline">إزالة</button>
                                )}
                                <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                                  onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadStoreImage(f, "logo"); if (url) setNewStore((s) => ({ ...s, logo_url: url })); e.target.value = ""; }} />
                              </div>
                            </Field>
                            <Field label="صورة الغلاف">
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => coverInputRef.current?.click()}
                                  className="relative h-16 w-28 rounded-xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition bg-secondary/30 shrink-0">
                                  {newStore.cover_url ? (
                                    <img src={newStore.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                  ) : (
                                    <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                                      {coverUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                                    </div>
                                  )}
                                </button>
                                {newStore.cover_url && (
                                  <button type="button" onClick={() => setNewStore({ ...newStore, cover_url: "" })}
                                    className="text-xs text-destructive hover:underline">إزالة</button>
                                )}
                                <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                                  onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadStoreImage(f, "cover"); if (url) setNewStore((s) => ({ ...s, cover_url: url })); e.target.value = ""; }} />
                              </div>
                            </Field>
                            <Field label="الوصف">
                              <textarea value={newStore.description_ar} onChange={(e) => setNewStore({ ...newStore, description_ar: e.target.value })}
                                className={`${inputCls} min-h-[72px] resize-y`} />
                            </Field>
                          </div>
                          <label className="mt-3 flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={newStore.is_featured} onChange={(e) => setNewStore({ ...newStore, is_featured: e.target.checked })} />
                            عرض ضمن المتاجر المميزة
                          </label>
                          <div className="mt-3 flex justify-end gap-2">
                            <button onClick={() => setAddingFor(null)} className="rounded-full border border-border px-3 py-1.5 text-xs">إلغاء</button>
                            <button onClick={() => submitNewStore(c.id)} disabled={saving || logoUploading || coverUploading}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium disabled:opacity-60">
                              <Save className="h-3.5 w-3.5" /> {saving ? "جارٍ الحفظ..." : "حفظ ونشر"}
                            </button>
                          </div>
                        </div>
                      )}

                      {loadingStoresFor === c.id ? <Spinner /> : !stores ? null : stores.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground">لا توجد متاجر في هذه الفئة بعد.</div>
                      ) : (
                        <ul className="divide-y divide-border">
                          {stores.map((s) => (
                            <li key={s.id} className="py-2.5 flex items-center gap-2 sm:gap-3">
                              {s.logo_url ? (
                                <img src={s.logo_url} alt="" className="h-10 w-10 rounded-xl object-cover border border-border shrink-0" />
                              ) : (
                                <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center text-muted-foreground shrink-0"><StoreIcon className="h-4 w-4" /></div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <Link to="/stores/$slug" params={{ slug: s.slug }} className="font-semibold text-sm hover:text-primary truncate max-w-full">{s.name_ar}</Link>
                                  <StatusBadge status={s.status} />
                                  {s.is_featured && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 text-[10px] font-bold">
                                      <Star className="h-3 w-3 fill-primary" /> مميز
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                                  {s.address}{s.phone ? ` · ${s.phone}` : ""} · ⭐ {Number(s.rating).toFixed(1)} ({s.rating_count})
                                </div>
                              </div>
                              <Link to="/stores/$slug" params={{ slug: s.slug }} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition shrink-0" aria-label="فتح">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button onClick={() => removeStore(c.id, s.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition shrink-0" aria-label="حذف">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
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
