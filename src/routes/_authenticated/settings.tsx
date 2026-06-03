import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, Camera, Loader2, LogOut, Bell, LayoutDashboard,
  User as UserIcon, Phone, Mail, ShieldCheck, Lock, ChevronLeft, Trash2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "الإعدادات — آش مول" }] }),
});

function SettingsPage() {
  const { user, signOut, isStoreOwner, isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name ?? "");
          setPhone(data.phone ?? "");
          setAvatarUrl(data.avatar_url ?? null);
        }
      });
  }, [user]);

  async function uploadAvatar(file: File) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("الحد الأقصى 5 ميجابايت"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); toast.error(upErr.message); return; }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = pub.publicUrl;
    const { error: dbErr } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setUploading(false);
    if (dbErr) { toast.error(dbErr.message); return; }
    setAvatarUrl(url);
    toast.success("تم تحديث صورة البروفايل");
  }

  async function removeAvatar() {
    if (!user) return;
    setUploading(true);
    const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
    setUploading(false);
    if (error) { toast.error(error.message); return; }
    setAvatarUrl(null);
    toast.success("تم حذف الصورة");
  }

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("تم حفظ بياناتك");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 6) { toast.error("كلمة المرور 6 أحرف على الأقل"); return; }
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setPwdSaving(false);
    if (error) toast.error(error.message); else { toast.success("تم تغيير كلمة المرور"); setPwd(""); }
  }

  const displayName = fullName || user?.email?.split("@")[0] || "حسابك";
  const initial = (displayName?.[0] || "?").toUpperCase();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Nav />
      <main className="pt-24 pb-28 mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة لحسابك
          </button>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">الإعدادات</h1>
        </div>

        {/* Avatar card */}
        <section
          className="rounded-3xl p-6 sm:p-8 mb-5 overflow-hidden"
          style={{
            background: "linear-gradient(140deg, color-mix(in oklab, var(--primary-soft) 70%, transparent), color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 60%, transparent))",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <div
                className="h-28 w-28 rounded-full overflow-hidden grid place-items-center text-4xl font-extrabold text-primary bg-background"
                style={{
                  boxShadow: "0 0 0 4px color-mix(in oklab, var(--primary) 30%, transparent), 0 12px 30px -10px color-mix(in oklab, var(--primary) 35%, transparent)",
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="تغيير الصورة"
                className="absolute -bottom-1 -left-1 grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground border-4 border-background hover:scale-105 transition active:scale-95 disabled:opacity-70"
                style={{ boxShadow: "0 8px 20px -8px color-mix(in oklab, var(--primary) 50%, transparent)" }}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadAvatar(f); e.target.value = ""; }}
              />
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-foreground">{displayName}</h2>
            <div className="mt-1 text-sm text-muted-foreground" dir="ltr">{user?.email}</div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-background/80 border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background transition"
              >
                <Camera className="h-3.5 w-3.5" />
                {avatarUrl ? "تغيير الصورة" : "إضافة صورة"}
              </button>
              {avatarUrl && (
                <button
                  onClick={removeAvatar}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/15 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف الصورة
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Personal info */}
        <SectionCard title="بياناتي الشخصية" icon={<UserIcon className="h-5 w-5" />}>
          <form onSubmit={saveInfo} className="space-y-3">
            <Field label="الاسم الكامل" icon={<UserIcon className="h-4 w-4" />} value={fullName} onChange={setFullName} placeholder="اكتب اسمك" />
            <Field label="رقم الهاتف" icon={<Phone className="h-4 w-4" />} value={phone} onChange={setPhone} ltr placeholder="+20…" />
            <Field label="البريد الإلكتروني" icon={<Mail className="h-4 w-4" />} value={user?.email ?? ""} onChange={() => {}} ltr disabled />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-95 transition active:scale-[0.98] disabled:opacity-60"
              style={{ boxShadow: "0 10px 25px -10px color-mix(in oklab, var(--primary) 50%, transparent)" }}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </button>
          </form>
        </SectionCard>

        {/* Security */}
        <SectionCard title="الأمان" icon={<ShieldCheck className="h-5 w-5" />}>
          <form onSubmit={changePassword} className="space-y-3">
            <Field
              label="كلمة مرور جديدة"
              icon={<Lock className="h-4 w-4" />}
              value={pwd}
              onChange={setPwd}
              ltr
              type="password"
              placeholder="••••••••"
            />
            <button
              type="submit"
              disabled={pwdSaving || !pwd}
              className="inline-flex items-center justify-center gap-2 w-full rounded-2xl border border-border bg-card hover:bg-muted text-foreground px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60"
            >
              {pwdSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              تغيير كلمة المرور
            </button>
          </form>
        </SectionCard>

        {/* Preferences / shortcuts */}
        <SectionCard title="التفضيلات" icon={<Bell className="h-5 w-5" />}>
          <div className="grid gap-2">
            <RowLink to="/notifications" icon={<Bell className="h-4 w-4" />} label="الإشعارات" />
            {(isStoreOwner || isAdmin) && (
              <RowLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="لوحة التحكم" />
            )}
          </div>
        </SectionCard>

        {/* Danger */}
        <button
          onClick={signOut}
          className="mt-2 flex items-center justify-between gap-3 w-full rounded-2xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive px-4 py-3 text-sm font-medium transition active:scale-[0.98]"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> تسجيل الخروج</span>
        </button>
      </main>
      <Footer />
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section
      className="rounded-3xl bg-background border border-border/60 p-5 sm:p-6 mb-4"
      style={{ boxShadow: "0 4px 14px -6px color-mix(in oklab, var(--foreground) 10%, transparent)" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="grid place-items-center h-10 w-10 rounded-2xl text-primary"
          style={{ background: "color-mix(in oklab, var(--primary-soft) 70%, white)" }}
        >
          {icon}
        </span>
        <h3 className="font-display text-base sm:text-lg font-extrabold text-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function RowLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to as never}
      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 px-4 py-3 text-sm text-foreground transition active:scale-[0.98]"
    >
      <ChevronLeft className="h-4 w-4 text-muted-foreground" />
      <span className="flex items-center gap-2.5">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
    </Link>
  );
}

function Field({
  label, value, onChange, ltr, disabled, type = "text", placeholder, icon,
}: {
  label: string; value: string; onChange: (v: string) => void; ltr?: boolean;
  disabled?: boolean; type?: string; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <span className={`absolute top-1/2 -translate-y-1/2 ${ltr ? "left-3" : "right-3"} text-muted-foreground`}>
            {icon}
          </span>
        )}
        <input
          dir={ltr ? "ltr" : undefined}
          value={value}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl bg-muted/40 border border-border/60 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition disabled:opacity-70 ${icon ? (ltr ? "pl-10 pr-4" : "pr-10 pl-4") : "px-4"} ${ltr ? "text-start" : ""}`}
        />
      </div>
    </div>
  );
}
