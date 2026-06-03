import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { listNotifications, markNotificationRead, markAllRead } from "@/lib/notifications.functions";
import {
  Bell, Check, CheckCheck, Inbox, Info, CheckCircle2, AlertTriangle, XCircle,
  ArrowRight, MailOpen,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "الإشعارات — آش مول" }] }),
  component: NotificationsPage,
});

interface Notif {
  id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

type Tab = "all" | "unread";

const TYPE_META: Record<string, { Icon: React.ComponentType<{ className?: string }>; bg: string; fg: string; ring: string }> = {
  info:    { Icon: Info,          bg: "oklch(0.95 0.04 240)", fg: "oklch(0.5 0.18 245)",  ring: "oklch(0.85 0.08 240)" },
  success: { Icon: CheckCircle2,  bg: "oklch(0.95 0.05 160)", fg: "oklch(0.5 0.15 160)",  ring: "oklch(0.85 0.08 160)" },
  warning: { Icon: AlertTriangle, bg: "oklch(0.96 0.06 70)",  fg: "oklch(0.6 0.18 55)",   ring: "oklch(0.88 0.1 65)"   },
  error:   { Icon: XCircle,       bg: "oklch(0.95 0.05 25)",  fg: "oklch(0.55 0.2 25)",   ring: "oklch(0.85 0.1 25)"   },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60);
  if (h < 24) return `منذ ${h} س`;
  const d = Math.floor(h / 24);
  if (d < 7) return `منذ ${d} ي`;
  return new Date(iso).toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

function NotificationsPage() {
  const { user } = useAuth();
  const fetchAll = useServerFn(listNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllRead);
  const navigate = useNavigate();
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");

  async function reload() {
    setLoading(true);
    try {
      const r = await fetchAll();
      setItems((r.notifications ?? []) as Notif[]);
    } finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`notif-page-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => { void reload(); })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read_at).length, [items]);
  const totalCount = items.length;
  const visible = tab === "unread" ? items.filter((n) => !n.read_at) : items;

  async function open(n: Notif) {
    if (!n.read_at) {
      try { await markRead({ data: { id: n.id } }); } catch { /* ignore */ }
      setItems((p) => p.map((x) => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x));
    }
    if (n.link) navigate({ to: n.link as never });
  }

  async function readAll() {
    try {
      await markAll();
      setItems((p) => p.map((x) => ({ ...x, read_at: x.read_at ?? new Date().toISOString() })));
      toast.success("تم تعليم الكل كمقروء");
    } catch { toast.error("حدث خطأ"); }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Nav />
      <main className="pt-36 sm:pt-44 pb-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header */}
          <header className="relative mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="font-display font-extrabold tracking-tight text-2xl sm:text-4xl text-foreground">
                  الإشعارات
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  تحديثاتك في مكان واحد.
                </p>
              </div>
              <button
                onClick={() => router.history.back()}
                aria-label="رجوع"
                className="shrink-0 grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card border border-border hover:border-primary/40 hover:text-primary transition active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <StatCard
              label="الكل"
              value={loading ? "…" : totalCount.toLocaleString("ar-EG")}
              tone="teal"
              icon={<Bell className="h-5 w-5" />}
              active={tab === "all"}
              onClick={() => setTab("all")}
            />
            <StatCard
              label="غير مقروء"
              value={loading ? "…" : unreadCount.toLocaleString("ar-EG")}
              tone="amber"
              icon={<MailOpen className="h-5 w-5" />}
              active={tab === "unread"}
              onClick={() => setTab("unread")}
            />
          </div>

          {/* Tabs + action */}
          <div className="mb-6 sm:mb-8 flex items-center gap-3">
            <div className="flex-1 p-1.5 rounded-2xl bg-secondary/60 border border-border grid grid-cols-2 gap-1 text-sm font-bold">
              <TabBtn active={tab === "all"} onClick={() => setTab("all")}>الكل</TabBtn>
              <TabBtn active={tab === "unread"} onClick={() => setTab("unread")}>
                غير مقروء {unreadCount > 0 && (
                  <span className={`mr-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${tab === "unread" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                    {unreadCount}
                  </span>
                )}
              </TabBtn>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => void readAll()}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:text-primary transition px-3 sm:px-4 py-2.5 text-xs font-bold active:scale-[0.97]"
              >
                <CheckCheck className="h-4 w-4" />
                <span className="hidden sm:inline">تعليم الكل</span>
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-secondary/40 animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={tab === "unread" ? <CheckCheck className="h-7 w-7" /> : <Inbox className="h-7 w-7" />}
              title={tab === "unread" ? "لا توجد إشعارات غير مقروءة" : "لا توجد إشعارات"}
              desc={tab === "unread" ? "أنت متابع لكل شيء — استمتع بهدوء صندوقك." : "سنخبرك هنا بأي تحديثات على طلباتك أو متجرك."}
              ctaLabel="تصفّح المتاجر"
              ctaTo="/stores"
            />
          ) : (
            <ul className="space-y-2.5">
              {visible.map((n) => {
                const meta = TYPE_META[n.type] ?? TYPE_META.info;
                const Icon = meta.Icon;
                const isNew = !n.read_at;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => void open(n)}
                      className={`group w-full text-right flex items-start gap-3 rounded-2xl border bg-card p-3.5 sm:p-4 transition hover:border-primary/40 hover:-translate-y-0.5 ${
                        isNew ? "border-primary/30" : "border-border"
                      }`}
                      style={{
                        boxShadow: isNew
                          ? "0 8px 22px -16px color-mix(in oklab, var(--primary) 55%, transparent)"
                          : undefined,
                      }}
                    >
                      <span
                        className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl shrink-0"
                        style={{ background: meta.bg, color: meta.fg, boxShadow: `inset 0 0 0 1px ${meta.ring}` }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-[15px] truncate">{n.title}</h3>
                          {isNew && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 animate-pulse" />}
                        </div>
                        {n.body && (
                          <p className="mt-1 text-xs sm:text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {n.body}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/80 tabular-nums">
                          <span>{timeAgo(n.created_at)}</span>
                          {n.link && (
                            <span className="inline-flex items-center gap-1 text-primary/80 font-semibold opacity-0 group-hover:opacity-100 transition">
                              فتح
                            </span>
                          )}
                        </div>
                      </div>
                      {isNew && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-bold shrink-0 self-start">
                          <Check className="h-3 w-3" /> جديد
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({
  label, value, tone, icon, active, onClick,
}: {
  label: string; value: string; tone: "teal" | "amber";
  icon: React.ReactNode; active?: boolean; onClick?: () => void;
}) {
  const palette = tone === "teal"
    ? { bg: "oklch(0.95 0.04 195)", fg: "oklch(0.55 0.13 195)", ring: "oklch(0.85 0.07 195)" }
    : { bg: "oklch(0.96 0.06 70)", fg: "oklch(0.65 0.18 55)", ring: "oklch(0.88 0.1 65)" };
  return (
    <button
      onClick={onClick}
      className={`group text-right rounded-3xl border bg-card p-4 sm:p-5 transition active:scale-[0.98] ${
        active ? "border-primary/50" : "border-border hover:border-primary/30"
      }`}
      style={{ boxShadow: active ? "0 10px 24px -16px color-mix(in oklab, var(--primary) 60%, transparent)" : undefined }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tabular-nums">{value}</div>
        </div>
        <span
          className="grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-2xl shrink-0"
          style={{ background: palette.bg, color: palette.fg, boxShadow: `inset 0 0 0 1px ${palette.ring}` }}
        >
          {icon}
        </span>
      </div>
    </button>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 rounded-xl transition inline-flex items-center justify-center ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({
  icon, title, desc, ctaLabel, ctaTo,
}: { icon: React.ReactNode; title: string; desc: string; ctaLabel: string; ctaTo: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 sm:p-14 text-center">
      <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full grid place-items-center bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h2 className="font-display text-lg sm:text-xl font-extrabold">{title}</h2>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">{desc}</p>
      <Link
        to={ctaTo}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:opacity-95 transition"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
