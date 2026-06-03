import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Bell, BellRing, Check } from "lucide-react";
import { isFavorited, toggleFavorite } from "@/lib/favorites.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function FollowStoreButton({ storeId }: { storeId: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const check = useServerFn(isFavorited);
  const toggle = useServerFn(toggleFavorite);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) { setFollowing(false); return; }
    check({ data: { store_id: storeId } }).then((r) => setFollowing(r.favorited)).catch(() => {});
  }, [user, storeId, check]);

  async function onClick() {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    setBusy(true);
    try {
      const r = await toggle({ data: { store_id: storeId } });
      setFollowing(r.favorited);
      toast.success(r.favorited ? "تمت المتابعة ✓" : "تم إلغاء المتابعة");
    } catch {
      toast.error("حدث خطأ");
    } finally { setBusy(false); }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-95 shadow-sm
        ${following
          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/20"
          : "bg-primary text-primary-foreground hover:opacity-95 glow-ring"}`}
    >
      {following ? (
        <><Check className="h-4 w-4" /> متابَع</>
      ) : (
        <><Bell className="h-4 w-4" /> متابعة</>
      )}
      {following && <BellRing className="h-3.5 w-3.5 opacity-70 animate-pulse" />}
    </button>
  );
}
