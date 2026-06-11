import { jsx, jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate, Link } from "@tanstack/react-router";
import { Home, ShoppingBag, ClipboardList, User } from "lucide-react";
import { u as useAuth } from "./router-B21PHlE4.js";
import { u as useBadgeCounts, C as CountBadge } from "./Nav-C1MbaG3s.js";
function BottomTabBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart } = useBadgeCounts();
  const items = [
    { label: "الرئيسية", to: "/", icon: Home, exact: true, badge: 0 },
    { label: "السلة", to: "/cart", icon: ShoppingBag, requireAuth: true, badge: cart },
    { label: "طلباتك", to: "/orders", icon: ClipboardList, requireAuth: true, badge: 0 },
    { label: "حسابك", to: user ? "/profile" : "/auth", icon: User, badge: 0 }
  ];
  function activeFor(to, exact) {
    if (exact) return pathname === to;
    return pathname === to || pathname.startsWith(to + "/");
  }
  function onClick(e, to, requireAuth) {
    if (requireAuth && !user) {
      e.preventDefault();
      navigate({ to: "/auth", search: { redirect: to } });
    }
  }
  return /* @__PURE__ */ jsx(
    "nav",
    {
      dir: "rtl",
      "aria-label": "التنقل السفلي",
      className: "md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl",
      style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
      children: /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-4 px-2 py-1.5", children: items.map((it) => {
        const Icon = it.icon;
        const active = activeFor(it.to, it.exact);
        return /* @__PURE__ */ jsx("li", { className: "grid place-items-center", children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: it.to,
            onClick: (e) => onClick(e, it.to, it.requireAuth),
            className: `relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: `relative grid place-items-center h-9 w-9 rounded-xl transition ${active ? "bg-primary-soft" : ""}`, children: [
                /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }),
                it.badge ? /* @__PURE__ */ jsx(CountBadge, { count: it.badge }) : null
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-medium ${active ? "text-primary" : ""}`, children: it.label }),
              active && /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 h-1 w-1 rounded-full bg-primary" })
            ]
          }
        ) }, it.label);
      }) })
    }
  );
}
export {
  BottomTabBar as B
};
