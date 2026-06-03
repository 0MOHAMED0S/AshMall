import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, LogOut, User as UserIcon, Shield, Store, ShieldCheck,
  Receipt, Info, Settings as SettingsIcon, ChevronDown,
  Heart, Bell, ShoppingBag, LayoutDashboard, Facebook, Instagram, Send,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "حسابك — آش مول" }] }),
});

function ProfilePage() {
  const { user, roles, signOut, isStoreOwner, isAdmin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [open, setOpen] = useState<string | null>("orders");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setFullName(data.full_name ?? ""); setPhone(data.phone ?? ""); setAvatarUrl(data.avatar_url ?? null); }
    });
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(({ count }) => {
      setOrdersCount(count ?? 0);
    });
  }, [user]);


  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    setLoading(false);
    if (error) toast.error(error.message); else toast.success("تم حفظ التغييرات");
  }

  const displayName = fullName || user?.email?.split("@")[0] || "حسابك";
  const initial = (displayName?.[0] || "?").toUpperCase();
  const roleLabel = isAdmin ? "مشرف" : isStoreOwner ? "صاحب متجر" : "عميل";

  function toggle(id: string) { setOpen(open === id ? null : id); }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Nav />
      <main className="pt-24 pb-28 mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-center font-display text-2xl sm:text-3xl font-extrabold text-foreground mb-6">حسابك</h1>

        {/* Profile hero card */}
        <section
          className="relative rounded-[2rem] p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500"
          style={{
            background: "linear-gradient(140deg, color-mix(in oklab, var(--primary-soft) 70%, transparent), color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 60%, transparent))",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div
                className="h-28 w-28 rounded-full overflow-hidden grid place-items-center text-4xl font-extrabold text-primary"
                style={{
                  background: "color-mix(in oklab, var(--primary-soft) 80%, white)",
                  boxShadow: "0 0 0 4px color-mix(in oklab, var(--primary) 30%, transparent), 0 12px 30px -10px color-mix(in oklab, var(--primary) 35%, transparent)",
                }}
              >
                {avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : initial}
              </div>

            </div>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">{displayName}</h2>
            <div className="mt-1 text-sm text-muted-foreground" dir="ltr">{phone || user?.email}</div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 border border-border px-3 py-1.5 text-xs text-foreground">
                <Receipt className="h-3.5 w-3.5 text-primary" />
                عدد طلباتك {ordersCount}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                حساب نشط
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary px-3 py-1.5 text-xs">
                {isAdmin ? <Shield className="h-3 w-3" /> : isStoreOwner ? <Store className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                {roleLabel}
              </span>
            </div>
          </div>
        </section>

        {/* Collapsible sections */}
        <div className="mt-6 space-y-4">
          <AccordionCard
            id="orders"
            open={open === "orders"}
            onToggle={() => toggle("orders")}
            title="طلباتك"
            count={ordersCount}
            icon={<Receipt className="h-5 w-5" />}
            tone="primary"
          >
            <div className="grid gap-2">
              <RowLink to="/orders" icon={<Receipt className="h-4 w-4" />} label="كل الطلبات" />
              <RowLink to="/cart" icon={<ShoppingBag className="h-4 w-4" />} label="سلة الشراء" />
              <RowLink to="/favorites" icon={<Heart className="h-4 w-4" />} label="المفضلة" />
            </div>
          </AccordionCard>

          <AccordionCard
            id="info"
            open={open === "info"}
            onToggle={() => toggle("info")}
            title="معلومات"
            count={3}
            icon={<Info className="h-5 w-5" />}
            tone="primary"
          >
            <form onSubmit={save} className="space-y-3">
              <Field label="الاسم الكامل" value={fullName} onChange={setFullName} />
              <Field label="رقم الهاتف" value={phone} onChange={setPhone} ltr />
              <Field label="البريد الإلكتروني" value={user?.email ?? ""} onChange={() => {}} ltr disabled />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-95 transition active:scale-[0.98] disabled:opacity-60"
                style={{ boxShadow: "0 10px 25px -10px color-mix(in oklab, var(--primary) 50%, transparent)" }}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                حفظ التغييرات
              </button>
            </form>
          </AccordionCard>

          <Link
            to="/settings"
            className="flex items-center justify-between gap-3 rounded-3xl bg-background border border-border/60 px-4 sm:px-5 py-4 hover:bg-muted/40 transition active:scale-[0.99]"
            style={{ boxShadow: "0 4px 14px -6px color-mix(in oklab, var(--foreground) 10%, transparent)" }}
          >
            <ChevronDown className="h-5 w-5 -rotate-90 text-muted-foreground" />
            <div className="flex items-center gap-3">
              <span className="font-display text-base sm:text-lg font-extrabold text-foreground">الإعدادات</span>
              <span
                className="grid place-items-center h-10 w-10 rounded-2xl text-emerald-600 dark:text-emerald-400"
                style={{ background: "color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 90%, white)" }}
              >
                <SettingsIcon className="h-5 w-5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Follow us */}
        <section className="mt-6 rounded-3xl p-6 text-center" style={{ background: "color-mix(in oklab, var(--primary-soft) 50%, transparent)" }}>
          <p className="text-sm font-semibold text-foreground">تابعنا للحصول علي عروض حصرية</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <SocialBtn href="#" aria="فيسبوك"><Facebook className="h-5 w-5" /></SocialBtn>
            <SocialBtn href="#" aria="إنستجرام"><Instagram className="h-5 w-5" /></SocialBtn>
            <SocialBtn href="#" aria="تيليجرام"><Send className="h-5 w-5" /></SocialBtn>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function AccordionCard({
  open, onToggle, title, count, icon, children, tone = "primary",
}: {
  id: string; open: boolean; onToggle: () => void; title: string; count?: number;
  icon: React.ReactNode; children: React.ReactNode; tone?: "primary" | "accent";
}) {
  const toneBg = tone === "accent"
    ? "color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 90%, white)"
    : "color-mix(in oklab, var(--primary-soft) 70%, white)";
  const toneText = tone === "accent" ? "text-emerald-600 dark:text-emerald-400" : "text-primary";
  return (
    <div
      className="rounded-3xl bg-background border border-border/60 overflow-hidden transition-all duration-300"
      style={{ boxShadow: open ? "var(--shadow-elevated)" : "0 4px 14px -6px color-mix(in oklab, var(--foreground) 10%, transparent)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-muted/40 transition"
      >
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        <div className="flex items-center gap-3">
          {typeof count === "number" && (
            <span className={`grid place-items-center min-w-7 h-7 px-2 rounded-full text-xs font-bold ${toneText}`}
              style={{ background: toneBg }}>
              {count}
            </span>
          )}
          <span className="font-display text-base sm:text-lg font-extrabold text-foreground">{title}</span>
          <span className={`grid place-items-center h-10 w-10 rounded-2xl ${toneText}`} style={{ background: toneBg }}>
            {icon}
          </span>
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function RowLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to as never}
      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 px-4 py-3 text-sm text-foreground transition active:scale-[0.98]"
    >
      <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
      <span className="flex items-center gap-2.5">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
    </Link>
  );
}

function Field({ label, value, onChange, ltr, disabled }: { label: string; value: string; onChange: (v: string) => void; ltr?: boolean; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
      <input
        dir={ltr ? "ltr" : undefined}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl bg-muted/40 border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition disabled:opacity-70 ${ltr ? "text-start" : ""}`}
      />
    </div>
  );
}

function SocialBtn({ href, aria, children }: { href: string; aria: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={aria}
      target="_blank"
      rel="noopener noreferrer"
      className="grid place-items-center h-11 w-11 rounded-2xl bg-background border border-border text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition active:scale-95"
      style={{ boxShadow: "0 4px 12px -6px color-mix(in oklab, var(--primary) 30%, transparent)" }}
    >
      {children}
    </a>
  );
}
