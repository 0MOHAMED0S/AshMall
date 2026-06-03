import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { applyForStore } from "@/lib/stores.functions";
import { ArrowRight, Loader2, ShieldCheck, ImagePlus, Store as StoreIcon, MapPin, FileText, Tag, X, Bike, Timer, DoorOpen, DoorClosed, IdCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/dashboard/new-store")({
  component: NewStore,
  head: () => ({ meta: [{ title: "تسجيل متجر — آش مول" }] }),
});

function NewStore() {
  const navigate = useNavigate();
  const submit = useServerFn(applyForStore);
  const { user } = useAuth();
  const [cats, setCats] = useState<Array<{ id: string; name_ar: string; icon: string | null }>>([]);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name_ar: "", name_en: "", description_ar: "",
    category_id: "", address: "", legal_name: "",
    delivery_fee: "", prep_time_minutes: "",
    opening_time: "", closing_time: "",
    logo_url: "", cover_url: "",
  });

  useEffect(() => {
    supabase.from("categories").select("id, name_ar, icon").order("sort_order").then(({ data }) => {
      if (data) setCats(data);
    });
  }, []);

  async function uploadImage(file: File, kind: "logo" | "cover") {
    if (!user) return null;
    const setBusy = kind === "logo" ? setLogoUploading : setCoverUploading;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("store-media").upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("store-media").getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      toast.error("فشل رفع الصورة: " + (e as Error).message);
      return null;
    } finally { setBusy(false); }
  }

  async function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("الحجم الأقصى 5 ميجا"); return; }
    const url = await uploadImage(f, "logo");
    if (url) setForm((s) => ({ ...s, logo_url: url }));
  }
  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("الحجم الأقصى 5 ميجا"); return; }
    const url = await uploadImage(f, "cover");
    if (url) setForm((s) => ({ ...s, cover_url: url }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submit({ data: {
        name_ar: form.name_ar,
        name_en: form.name_en || undefined,
        description_ar: form.description_ar || undefined,
        category_id: form.category_id,
        address: form.address,
        legal_name: form.legal_name,
        delivery_fee: form.delivery_fee ? Number(form.delivery_fee) : undefined,
        prep_time_minutes: form.prep_time_minutes ? Number(form.prep_time_minutes) : undefined,
        opening_time: form.opening_time || undefined,
        closing_time: form.closing_time || undefined,
        logo_url: form.logo_url || undefined,
        cover_url: form.cover_url || undefined,
      } });
      toast.success("تم استلام طلبك — سنراجعه خلال ٢٤ ساعة.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-28 pb-20 mx-auto max-w-3xl px-5 sm:px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowRight className="h-4 w-4" /> العودة للوحة التحكم
        </Link>

        {/* Header */}
        <div className="mt-5 flex items-start gap-4">
          <span className="grid place-items-center h-14 w-14 rounded-2xl text-primary-foreground shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))", boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent)" }}>
            <StoreIcon className="h-7 w-7" />
          </span>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-primary"
              style={{ boxShadow: "var(--shadow-chip)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> تسجيل متجر جديد
            </span>
            <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.4] py-1">
              سجّل متجرك في أشمون
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">سنراجع الطلب خلال ٢٤ ساعة ويظهر تلقائيًا في الفئة المختارة.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 glass-strong rounded-3xl p-6 sm:p-8 space-y-6" style={{ boxShadow: "var(--shadow-elevated)" }}>
          {/* Media uploads */}
          <Section title="صور المتجر" icon={ImagePlus}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-stretch">
              {/* Cover */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">صورة الغلاف</label>
                <button type="button" onClick={() => coverInputRef.current?.click()}
                  className="relative w-full h-36 rounded-2xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition group bg-secondary/30">
                  {form.cover_url ? (
                    <>
                      <img src={form.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span onClick={(ev) => { ev.stopPropagation(); setForm((s) => ({ ...s, cover_url: "" })); }}
                        className="absolute top-2 left-2 grid place-items-center h-7 w-7 rounded-full bg-background/90 backdrop-blur text-foreground border border-border hover:bg-destructive hover:text-destructive-foreground transition">
                        <X className="h-3.5 w-3.5" />
                      </span>
                    </>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground group-hover:text-primary transition">
                      {coverUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                        <div className="text-center">
                          <ImagePlus className="h-6 w-6 mx-auto" />
                          <div className="mt-1.5 text-xs">اضغط لرفع الغلاف</div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" onChange={onCoverChange} className="hidden" />
              </div>
              {/* Logo */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">الشعار</label>
                <button type="button" onClick={() => logoInputRef.current?.click()}
                  className="relative h-36 w-36 rounded-2xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition group bg-secondary/30">
                  {form.logo_url ? (
                    <>
                      <img src={form.logo_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span onClick={(ev) => { ev.stopPropagation(); setForm((s) => ({ ...s, logo_url: "" })); }}
                        className="absolute top-2 left-2 grid place-items-center h-7 w-7 rounded-full bg-background/90 backdrop-blur text-foreground border border-border hover:bg-destructive hover:text-destructive-foreground transition">
                        <X className="h-3.5 w-3.5" />
                      </span>
                    </>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground group-hover:text-primary transition">
                      {logoUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                        <div className="text-center">
                          <ImagePlus className="h-6 w-6 mx-auto" />
                          <div className="mt-1.5 text-[11px]">شعار</div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
              </div>
            </div>
          </Section>

          {/* Basic info */}
          <Section title="بيانات أساسية" icon={StoreIcon}>
            <Field label="اسم المتجر بالعربية *">
              <input required maxLength={100} value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className={inputCls} placeholder="مثال: حلواني الندى" />
            </Field>
            <Field label="الاسم بالإنجليزية (اختياري)">
              <input dir="ltr" maxLength={100} value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className={inputCls} placeholder="Al-Nada Sweets" />
            </Field>
            <Field label="الفئة *" icon={Tag}>
              <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
                <option value="">اختر فئة</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name_ar}</option>)}
              </select>
            </Field>
          </Section>

          {/* Location */}
          <Section title="الموقع" icon={MapPin}>
            <Field label="العنوان الفعلي في أشمون *" icon={MapPin}>
              <input required maxLength={300} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} placeholder="شارع الجلاء، بجوار مسجد..." />
            </Field>
            <p className="text-[11px] text-muted-foreground -mt-1">
              التواصل بين العميل والمتجر يتم داخل المنصة فقط — لا يتم عرض أرقام تواصل مباشرة في صفحة المتجر.
            </p>
          </Section>

          {/* Legal identity */}
          <Section title="الاسم القانوني" icon={IdCard}>
            <Field label="الاسم الرسمي للمتجر *" icon={IdCard}>
              <input required maxLength={150} value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} className={inputCls} placeholder="مثال: عمار السوري" />
            </Field>
          </Section>

          {/* Operations */}
          <Section title="تفاصيل التشغيل" icon={Timer}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="سعر التوصيل (جنيه)" icon={Bike}>
                <input type="number" min={0} step="0.5" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })} className={inputCls} placeholder="15" />
              </Field>
              <Field label="وقت التجهيز (دقيقة)" icon={Timer}>
                <input type="number" min={0} step="1" value={form.prep_time_minutes} onChange={(e) => setForm({ ...form, prep_time_minutes: e.target.value })} className={inputCls} placeholder="30" />
              </Field>
              <Field label="موعد الفتح" icon={DoorOpen}>
                <input type="time" value={form.opening_time} onChange={(e) => setForm({ ...form, opening_time: e.target.value })} className={inputCls} />
              </Field>
              <Field label="موعد الغلق" icon={DoorClosed}>
                <input type="time" value={form.closing_time} onChange={(e) => setForm({ ...form, closing_time: e.target.value })} className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* Description */}
          <Section title="وصف المتجر" icon={FileText}>
            <Field label="نبذة عن المتجر">
              <textarea maxLength={1000} rows={4} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className={inputCls + " resize-none"} placeholder="عرّف العملاء بمتجرك وأهم منتجاتك..." />
            </Field>
          </Section>

          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> سيتم التحقق يدويًا من العنوان قبل النشر.
          </div>

          <button type="submit" disabled={loading || logoUploading || coverUploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-primary to-primary-glow text-primary-foreground py-3.5 text-sm font-bold hover:opacity-95 transition active:scale-[0.98] glow-ring disabled:opacity-60 shadow-lg">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            إرسال طلب التسجيل
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

const inputCls = "w-full rounded-xl glass border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-primary uppercase">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </label>
      {children}
    </div>
  );
}
