import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { adminUpsertSiteSettings } from "@/lib/admin.functions";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { AdminPageHeader, Card, Spinner } from "@/components/ash/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SiteSettingsAdmin,
});

interface SiteSettings {
  site_name: string;
  tagline: string | null;
  logo_url: string | null;
  primary_color: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
}

function SiteSettingsAdmin() {
  const load = useServerFn(getSiteSettings);
  const save = useServerFn(adminUpsertSiteSettings);
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load().then((r) => setS(r.settings as SiteSettings)).catch(() => {});
  }, [load]);

  async function submit() {
    if (!s) return;
    if (!s.site_name?.trim()) { toast.error("اسم الموقع مطلوب"); return; }
    setSaving(true);
    try {
      await save({ data: {
        site_name: s.site_name,
        tagline: s.tagline,
        logo_url: s.logo_url,
        primary_color: s.primary_color,
        contact_phone: s.contact_phone,
        contact_whatsapp: s.contact_whatsapp,
        contact_email: s.contact_email,
      } });
      toast.success("تم حفظ الإعدادات — هتظهر فورًا في الموقع");
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <AdminPageHeader
        icon={Settings}
        eyebrow="Settings"
        title="إعدادات الموقع"
        description="اسم الموقع، الشعار، الألوان، وبيانات التواصل — تنعكس فورًا على كل الزوار."
      />

      {!s ? <Spinner /> : (
        <Card className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="اسم الموقع *">
              <input value={s.site_name} onChange={(e) => setS({ ...s, site_name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="الشعار (نص قصير)">
              <input value={s.tagline ?? ""} onChange={(e) => setS({ ...s, tagline: e.target.value })} className={inputCls} placeholder="دليلك للمحلات والخدمات في أشمون" />
            </Field>
            <Field label="رابط اللوجو">
              <input value={s.logo_url ?? ""} onChange={(e) => setS({ ...s, logo_url: e.target.value })} className={inputCls} dir="ltr" placeholder="https://..." />
            </Field>
            <Field label="اللون الأساسي (oklch / hex)">
              <div className="flex items-center gap-2">
                <input value={s.primary_color ?? ""} onChange={(e) => setS({ ...s, primary_color: e.target.value })} className={inputCls} dir="ltr" placeholder="مثال: #ff7043 أو oklch(0.7 0.18 50)" />
                {s.primary_color && (
                  <span className="h-9 w-9 rounded-xl border border-border shrink-0" style={{ background: s.primary_color }} />
                )}
              </div>
            </Field>
            <Field label="رقم التواصل">
              <input value={s.contact_phone ?? ""} onChange={(e) => setS({ ...s, contact_phone: e.target.value })} className={inputCls} dir="ltr" placeholder="01XXXXXXXXX" />
            </Field>
            <Field label="واتساب">
              <input value={s.contact_whatsapp ?? ""} onChange={(e) => setS({ ...s, contact_whatsapp: e.target.value })} className={inputCls} dir="ltr" placeholder="201XXXXXXXXX" />
            </Field>
            <Field label="البريد الإلكتروني">
              <input value={s.contact_email ?? ""} onChange={(e) => setS({ ...s, contact_email: e.target.value })} className={inputCls} dir="ltr" placeholder="hello@example.com" />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={submit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[11px] font-semibold text-muted-foreground mb-1">{label}</span>{children}</label>;
}
