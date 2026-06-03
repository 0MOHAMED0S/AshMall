import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, ShoppingBag, ClipboardList, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useBadgeCounts, CountBadge } from "@/hooks/use-badge-counts";

export function BottomTabBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart } = useBadgeCounts();

  const items = [
    { label: "الرئيسية", to: "/", icon: Home, exact: true, badge: 0 },
    { label: "السلة", to: "/cart", icon: ShoppingBag, requireAuth: true, badge: cart },
    { label: "طلباتك", to: "/orders", icon: ClipboardList, requireAuth: true, badge: 0 },
    { label: "حسابك", to: user ? "/profile" : "/auth", icon: UserIcon, badge: 0 },
  ];

  function activeFor(to: string, exact?: boolean) {
    if (exact) return pathname === to;
    return pathname === to || pathname.startsWith(to + "/");
  }

  function onClick(e: React.MouseEvent, to: string, requireAuth?: boolean) {
    if (requireAuth && !user) {
      e.preventDefault();
      navigate({ to: "/auth", search: { redirect: to } });
    }
  }

  return (
    <nav
      dir="rtl"
      aria-label="التنقل السفلي"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-4 px-2 py-1.5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = activeFor(it.to, it.exact);
          return (
            <li key={it.label} className="grid place-items-center">
              <Link
                to={it.to as never}
                onClick={(e) => onClick(e, it.to, it.requireAuth)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <div className={`relative grid place-items-center h-9 w-9 rounded-xl transition ${active ? "bg-primary-soft" : ""}`}>
                  <Icon className="h-5 w-5" />
                  {it.badge ? <CountBadge count={it.badge} /> : null}
                </div>
                <span className={`text-[10px] font-medium ${active ? "text-primary" : ""}`}>{it.label}</span>
                {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
