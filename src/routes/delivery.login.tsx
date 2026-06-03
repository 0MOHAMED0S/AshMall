import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bike, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/delivery/login")({
  component: DeliveryLogin,
  head: () => ({ meta: [{ title: "دخول الدليفري — آش مول" }] }),
});

function DeliveryLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = "/delivery";
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      toast.success("أهلاً بك");
      // Hard reload to ensure session is fully hydrated before _authenticated guard runs
      window.location.href = "/delivery";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تسجيل الدخول");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center px-5" dir="rtl">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> العودة للرئيسية
        </Link>
        <div className="rounded-3xl border border-border bg-card p-7 sm:p-8" style={{ boxShadow: "0 20px 60px -30px color-mix(in oklab, var(--primary) 40%, transparent)" }}>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))" }}>
              <Bike className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">Delivery</div>
              <h1 className="font-display text-2xl font-extrabold">لوحة الدليفري</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">دخول بيانات الدليفري اللي وصلتك من إدارة آش مول.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">البريد الإلكتروني</span>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full rounded-xl bg-background border border-border ps-4 pe-10 py-2.5 text-sm focus:border-primary outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">كلمة المرور</span>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full rounded-xl bg-background border border-border ps-4 pe-10 py-2.5 text-sm focus:border-primary outline-none" />
              </div>
            </label>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-bold hover:opacity-95 transition disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              دخول لوحة الدليفري
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
