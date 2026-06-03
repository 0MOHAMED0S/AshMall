import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const EVENT = "ash:badges:refresh";

export function bumpBadges() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT));
  }
}

export function useBadgeCounts() {
  const { user } = useAuth();
  const [cart, setCart] = useState(0);
  const [favs, setFavs] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(0);
      setFavs(0);
      return;
    }
    try {
      const [c, f] = await Promise.all([
        supabase
          .from("cart_items")
          .select("quantity")
          .eq("user_id", user.id),
        supabase
          .from("favorites")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);
      const cartTotal = (c.data ?? []).reduce(
        (acc, r: { quantity: number }) => acc + (r.quantity ?? 0),
        0,
      );
      setCart(cartTotal);
      setFavs(f.count ?? 0);
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const onEvt = () => refresh();
    const onFocus = () => refresh();
    window.addEventListener(EVENT, onEvt);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const interval = window.setInterval(refresh, 5000);
    return () => {
      window.removeEventListener(EVENT, onEvt);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(interval);
    };
  }, [refresh]);

  return { cart, favs, refresh };
}

// Small reusable badge bubble
export function CountBadge({ count, tone = "primary" }: { count: number; tone?: "primary" | "danger" }) {
  if (!count || count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  const bg = tone === "danger" ? "bg-destructive" : "bg-primary";
  const fg = tone === "danger" ? "text-destructive-foreground" : "text-primary-foreground";
  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full ${bg} ${fg} text-[10px] font-extrabold tabular-nums grid place-items-center ring-2 ring-background shadow-md animate-in zoom-in-50 duration-200`}
      aria-label={`${count}`}
    >
      {label}
    </span>
  );
}
