import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { MapPin, Loader2, ChevronDown, Heart, Bell, User, LayoutDashboard, Package, Shield, LogOut, Search, Tag, Store } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { g as createSsrRpc, u as useAuth } from "./router-B21PHlE4.js";
import { z } from "zod";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { s as supabase } from "./client-1xsKmu53.js";
const searchSuggestions = createServerFn({
  method: "POST"
}).inputValidator((i) => z.object({
  q: z.string().trim().min(1).max(80)
}).parse(i)).handler(createSsrRpc("7b56f205859d8fb93a1fe62324e635a8a2d99c549e0766896fdf1a658999bc4c"));
const url = "/__l5e/assets-v1/0f6405d2-d003-4a08-adcf-2106a5ff958c/logo.png";
const logoAsset = {
  url
};
const EVENT = "ash:badges:refresh";
function bumpBadges() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT));
  }
}
function useBadgeCounts() {
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
        supabase.from("cart_items").select("quantity").eq("user_id", user.id),
        supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id)
      ]);
      const cartTotal = (c.data ?? []).reduce(
        (acc, r) => acc + (r.quantity ?? 0),
        0
      );
      setCart(cartTotal);
      setFavs(f.count ?? 0);
    } catch {
    }
  }, [user]);
  useEffect(() => {
    refresh();
    const onEvt = () => refresh();
    const onFocus = () => refresh();
    window.addEventListener(EVENT, onEvt);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const interval = window.setInterval(refresh, 5e3);
    return () => {
      window.removeEventListener(EVENT, onEvt);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(interval);
    };
  }, [refresh]);
  return { cart, favs, refresh };
}
function CountBadge({ count, tone = "primary" }) {
  if (!count || count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  const bg = tone === "danger" ? "bg-destructive" : "bg-primary";
  const fg = tone === "danger" ? "text-destructive-foreground" : "text-primary-foreground";
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full ${bg} ${fg} text-[10px] font-extrabold tabular-nums grid place-items-center ring-2 ring-background shadow-md animate-in zoom-in-50 duration-200`,
      "aria-label": `${count}`,
      children: label
    }
  );
}
const logo = logoAsset.url;
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [address, setAddress] = useState(null);
  const [locating, setLocating] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const { user, isAdmin, isStoreOwner, signOut } = useAuth();
  const { favs } = useBadgeCounts();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const fetchSuggestions = useServerFn(searchSuggestions);
  useEffect(() => {
    setAddress(typeof window !== "undefined" ? window.localStorage.getItem("ash:address") : null);
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  useEffect(() => {
    const text = q.trim();
    if (text.length < 2) {
      setSuggestions(null);
      return;
    }
    setSuggesting(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetchSuggestions({ data: { q: text } });
        setSuggestions(res);
      } catch {
        setSuggestions(null);
      } finally {
        setSuggesting(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q, fetchSuggestions]);
  function onSearch(e) {
    e.preventDefault();
    if (q.trim()) {
      setSuggestOpen(false);
      navigate({ to: "/search", search: { q: q.trim() } });
    }
  }
  function goFav() {
    user ? navigate({ to: "/favorites" }) : navigate({ to: "/auth", search: { redirect: "/favorites" } });
  }
  function goBell() {
    user ? navigate({ to: "/notifications" }) : navigate({ to: "/auth", search: { redirect: "/notifications" } });
  }
  function detectLocation() {
    if (!("geolocation" in navigator)) {
      window.alert("متصفحك لا يدعم تحديد الموقع");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ar&zoom=16`,
            { headers: { "Accept": "application/json" } }
          );
          const json = await res.json();
          const a = json.address ?? {};
          const parts = [a.neighbourhood || a.suburb, a.road, a.city || a.town || a.village, a.state].filter(Boolean);
          const label = parts.slice(0, 2).join("، ") || json.display_name?.split(",").slice(0, 2).join("، ") || "موقعي الحالي";
          window.localStorage.setItem("ash:address", label);
          window.localStorage.setItem("ash:coords", JSON.stringify({ lat: latitude, lng: longitude }));
          setAddress(label);
        } catch {
          const label = `قرب (${latitude.toFixed(3)}، ${longitude.toFixed(3)})`;
          window.localStorage.setItem("ash:address", label);
          setAddress(label);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        window.alert("تعذّر تحديد الموقع. تأكد من تفعيل صلاحية الموقع.");
      },
      { enableHighAccuracy: true, timeout: 12e3, maximumAge: 6e4 }
    );
  }
  return /* @__PURE__ */ jsx("header", { dir: "rtl", className: "fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/70", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-3 sm:px-5 py-2.5 sm:py-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 sm:h-11 sm:w-11 rounded-2xl overflow-hidden bg-primary-soft grid place-items-center border border-border", children: /* @__PURE__ */ jsx("img", { src: logo, alt: "آش مول", className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:block leading-tight", children: [
          /* @__PURE__ */ jsx("div", { className: "font-display text-[15px] font-extrabold tracking-[0.18em]", children: "ASH MALL" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-2.5 w-2.5" }),
            " أشمون"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: detectLocation,
          disabled: locating,
          className: "md:hidden flex-1 min-w-0 flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2 text-start hover:border-primary/40 transition disabled:opacity-70",
          children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary shrink-0", children: locating ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 leading-tight", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: [
                locating ? "جارٍ تحديد موقعك…" : "التوصيل إلى",
                " ",
                /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-bold truncate", children: address ?? "اضغط لتحديد موقعك" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-5 text-sm text-muted-foreground mx-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/stores", className: "hover:text-foreground transition", children: "المتاجر" }),
        /* @__PURE__ */ jsx(Link, { to: "/search", search: { q: "" }, className: "hover:text-foreground transition", children: "بحث ذكي" }),
        /* @__PURE__ */ jsx("a", { href: "/#categories", className: "hover:text-foreground transition", children: "الفئات" }),
        /* @__PURE__ */ jsx("a", { href: "/#business", className: "hover:text-foreground transition", children: "للشركات" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: detectLocation,
          disabled: locating,
          className: "hidden md:flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2 hover:border-primary/40 transition disabled:opacity-70 max-w-[220px]",
          children: [
            locating ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-primary" }) : /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs truncate", children: address ?? "حدد موقعك" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 mr-auto", children: [
        /* @__PURE__ */ jsxs("button", { onClick: goFav, "aria-label": "المفضلة", className: "relative grid h-10 w-10 place-items-center rounded-2xl bg-secondary border border-border text-primary hover:bg-primary-soft transition", children: [
          /* @__PURE__ */ jsx(Heart, { className: "h-[18px] w-[18px]" }),
          /* @__PURE__ */ jsx(CountBadge, { count: favs })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: goBell, "aria-label": "الإشعارات", className: "grid h-10 w-10 place-items-center rounded-2xl bg-secondary border border-border text-primary hover:bg-primary-soft transition", children: /* @__PURE__ */ jsx(Bell, { className: "h-[18px] w-[18px]" }) }),
        user ? /* @__PURE__ */ jsxs("div", { className: "relative hidden sm:block", ref: menuRef, children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => setMenuOpen((v) => !v), className: "flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2 hover:bg-primary-soft transition", children: [
            /* @__PURE__ */ jsx("div", { className: "h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center", children: /* @__PURE__ */ jsx(User, { className: "h-3 w-3 text-primary-foreground" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs truncate max-w-[120px]", children: user.user_metadata?.full_name ?? user.email?.split("@")[0] })
          ] }),
          menuOpen && /* @__PURE__ */ jsxs("div", { className: "absolute left-0 mt-2 w-52 z-50 soft-card p-1.5 animate-rise", children: [
            (isStoreOwner || isAdmin) && /* @__PURE__ */ jsxs(Link, { to: "/dashboard", onClick: () => setMenuOpen(false), className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition", children: [
              /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4 text-primary" }),
              " لوحة التحكم"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/profile", onClick: () => setMenuOpen(false), className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition", children: [
              /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-primary" }),
              " ملفي"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/orders", onClick: () => setMenuOpen(false), className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition", children: [
              /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-primary" }),
              " طلباتي"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/notifications", onClick: () => setMenuOpen(false), className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition", children: [
              /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4 text-primary" }),
              " الإشعارات"
            ] }),
            isAdmin && /* @__PURE__ */ jsxs(Link, { to: "/admin", onClick: () => setMenuOpen(false), className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition", children: [
              /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 text-primary" }),
              " لوحة المشرف"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "my-1 h-px bg-border" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => {
              void signOut();
              setMenuOpen(false);
            }, className: "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition", children: [
              /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
              " تسجيل الخروج"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx(Link, { to: "/auth", search: { redirect: "/" }, className: "hidden sm:inline-flex items-center rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-[13px] font-bold hover:opacity-95 active:scale-95 transition", children: "دخول" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { ref: searchRef, className: "relative mt-2.5", children: [
      /* @__PURE__ */ jsx("form", { onSubmit: onSearch, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2.5 sm:py-3 focus-within:border-primary/40 transition", children: [
        suggesting ? /* @__PURE__ */ jsx(Loader2, { className: "h-[18px] w-[18px] text-primary animate-spin shrink-0" }) : /* @__PURE__ */ jsx(Search, { className: "h-[18px] w-[18px] text-primary shrink-0" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            dir: "rtl",
            value: q,
            onChange: (e) => {
              setQ(e.target.value);
              setSuggestOpen(true);
            },
            onFocus: () => setSuggestOpen(true),
            placeholder: "ابحث عن متجر، منتج، أو فئة…",
            className: "flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          }
        ),
        q && /* @__PURE__ */ jsx("button", { type: "submit", className: "rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold", children: "ابحث" })
      ] }) }),
      suggestOpen && q.trim().length >= 2 && suggestions && /* @__PURE__ */ jsx("div", { className: "absolute top-full mt-2 inset-x-0 z-50 soft-card max-h-[70vh] overflow-y-auto p-2 animate-rise", children: suggestions.categories.length === 0 && suggestions.stores.length === 0 && suggestions.products.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "px-3 py-6 text-center text-sm text-muted-foreground", children: [
        "لا توجد اقتراحات — جرّب «",
        q,
        "» بالبحث الذكي",
        /* @__PURE__ */ jsx("button", { onClick: () => onSearch(new Event("submit")), className: "block mx-auto mt-3 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold", children: "بحث ذكي بالكامل" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        suggestions.categories.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-2 pt-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-1 pb-1", children: "فئات" }),
          suggestions.categories.map((c) => /* @__PURE__ */ jsxs(Link, { to: "/categories/$slug", params: { slug: c.slug }, onClick: () => setSuggestOpen(false), className: "flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition", children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary", children: /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: c.name_ar })
          ] }, c.slug))
        ] }),
        suggestions.stores.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-2 pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-1 pb-1", children: "متاجر" }),
          suggestions.stores.map((s) => /* @__PURE__ */ jsxs(Link, { to: "/stores/$slug", params: { slug: s.slug }, onClick: () => setSuggestOpen(false), className: "flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition", children: [
            /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-lg overflow-hidden bg-secondary border border-border grid place-items-center", children: s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(Store, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold truncate", children: s.name_ar }),
              s.categories?.name_ar && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: s.categories.name_ar })
            ] })
          ] }, s.id))
        ] }),
        suggestions.products.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-2 pt-2 pb-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-1 pb-1", children: "منتجات" }),
          suggestions.products.map((p) => /* @__PURE__ */ jsxs(Link, { to: "/products/$id", params: { id: p.id }, onClick: () => setSuggestOpen(false), className: "flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition", children: [
            /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-lg overflow-hidden bg-secondary border border-border grid place-items-center", children: p.image_url ? /* @__PURE__ */ jsx("img", { src: p.image_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(Package, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold truncate", children: p.name_ar }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: p.stores?.name_ar ?? "" })
            ] }),
            p.price != null && /* @__PURE__ */ jsxs("div", { className: "text-[12px] font-extrabold text-primary tabular-nums", children: [
              Number(p.price).toFixed(0),
              " ج.م"
            ] })
          ] }, p.id))
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: (e) => {
          e.preventDefault();
          setSuggestOpen(false);
          navigate({ to: "/search", search: { q: q.trim() } });
        }, className: "mt-1 w-full text-center rounded-xl bg-primary-soft text-primary px-3 py-2.5 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition", children: [
          "بحث ذكي عن «",
          q,
          "» ✨"
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  CountBadge as C,
  Nav as N,
  bumpBadges as b,
  useBadgeCounts as u
};
