import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { listNotifications, markNotificationRead, markAllRead } from "@/lib/notifications.functions";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

interface Notif {
  id: string;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchAll = useServerFn(listNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllRead);
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const unread = items.filter((n) => !n.read_at).length;

  const load = async () => {
    if (!user) return;
    try {
      const r = await fetchAll();
      setItems((r.notifications ?? []) as Notif[]);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!user) { setItems([]); return; }
    void load();
    const channel = supabase
      .channel(`notif-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => { void load(); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) return null;

  const onClickItem = async (n: Notif) => {
    if (!n.read_at) { try { await markRead({ data: { id: n.id } }); } catch { /* ignore */ } }
    setOpen(false);
    if (n.link) navigate({ to: n.link as never });
    await load();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="الإشعارات"
        className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center tabular-nums">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-80 z-50 glass-strong rounded-2xl overflow-hidden animate-rise" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="text-sm font-semibold">الإشعارات</div>
              {unread > 0 && (
                <button onClick={async () => { await markAll(); await load(); }} className="text-[11px] text-primary hover:underline inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> تعليم الكل كمقروء
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">لا توجد إشعارات بعد</div>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => void onClickItem(n)}
                    className={`w-full text-right px-4 py-3 hover:bg-secondary/40 transition border-b border-border/50 last:border-0 ${!n.read_at ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read_at && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{n.title}</div>
                        {n.body && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</div>}
                        <div className="text-[10px] text-muted-foreground/70 mt-1">
                          {new Date(n.created_at).toLocaleString("ar-EG", { hour: "numeric", minute: "numeric", day: "numeric", month: "short" })}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
