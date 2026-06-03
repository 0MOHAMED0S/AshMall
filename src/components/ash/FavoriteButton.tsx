import { useEffect, useState } from "react";
import { bumpBadges } from "@/hooks/use-badge-counts";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { isFavorited, toggleFavorite } from "@/lib/favorites.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function FavoriteButton({ storeId, className }: { storeId: string; className?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const check = useServerFn(isFavorited);
  const toggle = useServerFn(toggleFavorite);
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) { setFav(false); return; }
    check({ data: { store_id: storeId } }).then((r) => setFav(r.favorited)).catch(() => {});
  }, [user, storeId, check]);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: window.location.pathname } });
      return;
    }
    setBusy(true);
    try {
      const r = await toggle({ data: { store_id: storeId } }); bumpBadges();
      setFav(r.favorited);
      toast.success(r.favorited ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة");
    } catch {
      toast.error("حدث خطأ");
    } finally { setBusy(false); }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="المفضلة"
      className={`grid place-items-center h-9 w-9 rounded-full glass border border-border hover:border-primary/40 transition active:scale-95 ${className ?? ""}`}
    >
      <Heart className={`h-4 w-4 transition ${fav ? "fill-primary text-primary" : "text-muted-foreground"}`} />
    </button>
  );
}
