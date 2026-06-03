import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, LogOut, LayoutDashboard, Shield, User as UserIcon, Heart, ChevronDown, Search, Bell, Loader2, Store as StoreIcon, Tag, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { searchSuggestions } from "@/lib/suggestions.functions";
import logoAsset from "@/assets/logo.png.asset.json";
const logo = logoAsset.url;
import { useBadgeCounts, CountBadge } from "@/hooks/use-badge-counts";

interface Suggestion {
  stores: Array<{ id: string; slug: string; name_ar: string; logo_url: string | null; categories: { name_ar: string } | null }>;
  products: Array<{ id: string; name_ar: string; price: number | null; image_url: string | null; stores: { slug: string; name_ar: string } | null }>;
  categories: Array<{ slug: string; name_ar: string; icon: string | null }>;
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const { user, isAdmin, isStoreOwner, signOut } = useAuth();
  const { favs } = useBadgeCounts();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const fetchSuggestions = useServerFn(searchSuggestions);

  useEffect(() => {
    setAddress(typeof window !== "undefined" ? window.localStorage.getItem("ash:address") : null);
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSuggestOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Debounced live suggestions
  useEffect(() => {
    const text = q.trim();
    if (text.length < 2) { setSuggestions(null); return; }
    setSuggesting(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetchSuggestions({ data: { q: text } });
        setSuggestions(res);
      } catch {
        setSuggestions(null);
      } finally { setSuggesting(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [q, fetchSuggestions]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      setSuggestOpen(false);
      navigate({ to: "/search", search: { q: q.trim() } });
    }
  }

  function goFav() { user ? navigate({ to: "/favorites" }) : navigate({ to: "/auth", search: { redirect: "/favorites" } }); }
  function goBell() { user ? navigate({ to: "/notifications" }) : navigate({ to: "/auth", search: { redirect: "/notifications" } }); }

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
            { headers: { "Accept": "application/json" } },
          );
          const json = await res.json();
          const a = json.address ?? {};
          const parts = [a.neighbourhood || a.suburb, a.road, a.city || a.town || a.village, a.state]
            .filter(Boolean);
          const label = parts.slice(0, 2).join("، ") || json.display_name?.split(",").slice(0, 2).join("، ") || "موقعي الحالي";
          window.localStorage.setItem("ash:address", label);
          window.localStorage.setItem("ash:coords", JSON.stringify({ lat: latitude, lng: longitude }));
          setAddress(label);
        } catch {
          const label = `قرب (${latitude.toFixed(3)}، ${longitude.toFixed(3)})`;
          window.localStorage.setItem("ash:address", label);
          setAddress(label);
        } finally { setLocating(false); }
      },
      () => {
        setLocating(false);
        window.alert("تعذّر تحديد الموقع. تأكد من تفعيل صلاحية الموقع.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 },
    );
  }

  return (
    <header dir="rtl" className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/70">
      <div className="mx-auto max-w-6xl px-3 sm:px-5 py-2.5 sm:py-3">
        {/* Top row */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl overflow-hidden bg-primary-soft grid place-items-center border border-border">
              <img src={logo} alt="آش مول" className="h-full w-full object-cover" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-display text-[15px] font-extrabold tracking-[0.18em]">ASH MALL</div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><MapPin className="h-2.5 w-2.5" /> أشمون</div>
            </div>
          </Link>

          {/* Address chip — primary on mobile */}
          <button
            onClick={detectLocation}
            disabled={locating}
            className="md:hidden flex-1 min-w-0 flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2 text-start hover:border-primary/40 transition disabled:opacity-70"
          >
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary shrink-0">
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                {locating ? "جارٍ تحديد موقعك…" : "التوصيل إلى"} <ChevronDown className="h-3 w-3" />
              </div>
              <div className="text-[13px] font-bold truncate">{address ?? "اضغط لتحديد موقعك"}</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground mx-3">
            <Link to="/stores" className="hover:text-foreground transition">المتاجر</Link>
            <Link to="/search" search={{ q: "" }} className="hover:text-foreground transition">بحث ذكي</Link>
            <a href="/#categories" className="hover:text-foreground transition">الفئات</a>
            <a href="/#business" className="hover:text-foreground transition">للشركات</a>
          </nav>

          {/* Desktop location chip */}
          <button
            onClick={detectLocation}
            disabled={locating}
            className="hidden md:flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2 hover:border-primary/40 transition disabled:opacity-70 max-w-[220px]"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
            <div className="text-xs truncate">{address ?? "حدد موقعك"}</div>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 mr-auto">
            <button onClick={goFav} aria-label="المفضلة" className="relative grid h-10 w-10 place-items-center rounded-2xl bg-secondary border border-border text-primary hover:bg-primary-soft transition">
              <Heart className="h-[18px] w-[18px]" />
              <CountBadge count={favs} />
            </button>
            <button onClick={goBell} aria-label="الإشعارات" className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary border border-border text-primary hover:bg-primary-soft transition">
              <Bell className="h-[18px] w-[18px]" />
            </button>

            {user ? (
              <div className="relative hidden sm:block" ref={menuRef}>
                <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2 hover:bg-primary-soft transition">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
                    <UserIcon className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs truncate max-w-[120px]">{user.user_metadata?.full_name ?? user.email?.split("@")[0]}</span>
                </button>
                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-52 z-50 soft-card p-1.5 animate-rise">
                    {(isStoreOwner || isAdmin) && (
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition">
                        <LayoutDashboard className="h-4 w-4 text-primary" /> لوحة التحكم
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition">
                      <UserIcon className="h-4 w-4 text-primary" /> ملفي
                    </Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition">
                      <Package className="h-4 w-4 text-primary" /> طلباتي
                    </Link>
                    <Link to="/notifications" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition">
                      <Bell className="h-4 w-4 text-primary" /> الإشعارات
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary transition">
                        <Shield className="h-4 w-4 text-primary" /> لوحة المشرف
                      </Link>
                    )}
                    <div className="my-1 h-px bg-border" />
                    <button onClick={() => { void signOut(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition">
                      <LogOut className="h-4 w-4" /> تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" search={{ redirect: "/" }} className="hidden sm:inline-flex items-center rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-[13px] font-bold hover:opacity-95 active:scale-95 transition">
                دخول
              </Link>
            )}
          </div>
        </div>

        {/* Search */}
        <div ref={searchRef} className="relative mt-2.5">
          <form onSubmit={onSearch}>
            <div className="flex items-center gap-2 rounded-2xl bg-secondary border border-border px-3 py-2.5 sm:py-3 focus-within:border-primary/40 transition">
              {suggesting ? <Loader2 className="h-[18px] w-[18px] text-primary animate-spin shrink-0" /> : <Search className="h-[18px] w-[18px] text-primary shrink-0" />}
              <input
                dir="rtl"
                value={q}
                onChange={(e) => { setQ(e.target.value); setSuggestOpen(true); }}
                onFocus={() => setSuggestOpen(true)}
                placeholder="ابحث عن متجر، منتج، أو فئة…"
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              {q && (
                <button type="submit" className="rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-bold">
                  ابحث
                </button>
              )}
            </div>
          </form>

          {/* Suggestions dropdown */}
          {suggestOpen && q.trim().length >= 2 && suggestions && (
            <div className="absolute top-full mt-2 inset-x-0 z-50 soft-card max-h-[70vh] overflow-y-auto p-2 animate-rise">
              {suggestions.categories.length === 0 && suggestions.stores.length === 0 && suggestions.products.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  لا توجد اقتراحات — جرّب «{q}» بالبحث الذكي
                  <button onClick={() => onSearch(new Event("submit") as unknown as React.FormEvent)} className="block mx-auto mt-3 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold">
                    بحث ذكي بالكامل
                  </button>
                </div>
              ) : (
                <>
                  {suggestions.categories.length > 0 && (
                    <div className="px-2 pt-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-1 pb-1">فئات</div>
                      {suggestions.categories.map((c) => (
                        <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }} onClick={() => setSuggestOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary"><Tag className="h-4 w-4" /></div>
                          <div className="text-sm font-bold">{c.name_ar}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {suggestions.stores.length > 0 && (
                    <div className="px-2 pt-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-1 pb-1">متاجر</div>
                      {suggestions.stores.map((s) => (
                        <Link key={s.id} to="/stores/$slug" params={{ slug: s.slug }} onClick={() => setSuggestOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition">
                          <div className="h-9 w-9 rounded-lg overflow-hidden bg-secondary border border-border grid place-items-center">
                            {s.logo_url ? <img src={s.logo_url} alt="" className="h-full w-full object-cover" /> : <StoreIcon className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold truncate">{s.name_ar}</div>
                            {s.categories?.name_ar && <div className="text-[11px] text-muted-foreground truncate">{s.categories.name_ar}</div>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {suggestions.products.length > 0 && (
                    <div className="px-2 pt-2 pb-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-1 pb-1">منتجات</div>
                      {suggestions.products.map((p) => (
                        <Link key={p.id} to="/products/$id" params={{ id: p.id }} onClick={() => setSuggestOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-secondary transition">
                          <div className="h-9 w-9 rounded-lg overflow-hidden bg-secondary border border-border grid place-items-center">
                            {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold truncate">{p.name_ar}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{p.stores?.name_ar ?? ""}</div>
                          </div>
                          {p.price != null && <div className="text-[12px] font-extrabold text-primary tabular-nums">{Number(p.price).toFixed(0)} ج.م</div>}
                        </Link>
                      ))}
                    </div>
                  )}
                  <button onClick={(e) => { e.preventDefault(); setSuggestOpen(false); navigate({ to: "/search", search: { q: q.trim() } }); }} className="mt-1 w-full text-center rounded-xl bg-primary-soft text-primary px-3 py-2.5 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition">
                    بحث ذكي عن «{q}» ✨
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
