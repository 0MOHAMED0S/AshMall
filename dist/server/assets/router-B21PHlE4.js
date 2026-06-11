import { QueryClientProvider, useQueryClient, useQuery, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, notFound, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { Toaster } from "sonner";
import { s as supabase } from "./client-1xsKmu53.js";
import { T as TSS_SERVER_FUNCTION, b as getServerFnById, a as createServerFn } from "./server-Dxshj7Uq.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
const appCss = "/assets/styles-C4uunZ1d.css";
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => {
          void fetchRoles(newSession.user.id);
        }, 0);
      } else {
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) void fetchRoles(data.session.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function fetchRoles(uid) {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    if (!error && data) setRoles(data.map((r) => r.role));
  }
  async function signOut() {
    await supabase.auth.signOut();
    setRoles([]);
  }
  const value = {
    user,
    session,
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    isStoreOwner: roles.includes("store_owner"),
    signOut
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
var createSsrRpc = (functionId) => {
  const url2 = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url: url2,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getSiteSettings = createServerFn({
  method: "GET"
}).handler(createSsrRpc("6e1c851c26039a1e477558b67785ba4bc850b6cd7fffb599cf92eb098ba0b277"));
const url = "/__l5e/assets-v1/17ff7f72-0807-4415-9f12-d356addfbc6a/logo.png";
const logoAsset = {
  url
};
function SplashScreen() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (window.location.pathname !== "/") return;
    setShow(true);
    const duration = 2200;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(ease(t) * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setLeaving(true), duration + 250);
    const t2 = setTimeout(() => setShow(false), duration + 950);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  if (!show) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ${leaving ? "opacity-0 scale-110" : "opacity-100 scale-100"}`,
      style: {
        background: "radial-gradient(ellipse at center, #f5efe3 0%, #ebe2cf 50%, #d9cfb8 100%)"
      },
      "aria-hidden": leaving,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: [
          /* @__PURE__ */ jsx("span", { className: "splash-ring splash-ring-1" }),
          /* @__PURE__ */ jsx("span", { className: "splash-ring splash-ring-2" }),
          /* @__PURE__ */ jsx("span", { className: "splash-ring splash-ring-3" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute h-[420px] w-[420px] animate-[splash-spin_8s_linear_infinite]", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
            style: {
              background: "#0d5a47",
              transform: `rotate(${i * 30}deg) translateY(-200px)`,
              opacity: 0.15 + i % 4 * 0.2
            }
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 -m-12 rounded-full blur-3xl animate-[splash-pulse_2s_ease-in-out_infinite]",
                style: { background: "radial-gradient(circle, rgba(13,90,71,0.35), transparent 70%)" }
              }
            ),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: logoAsset.url,
                alt: "آش مول",
                width: 180,
                height: 180,
                className: "relative h-44 w-44 sm:h-52 sm:w-52 object-contain drop-shadow-2xl animate-[splash-logo_1.4s_cubic-bezier(0.22,1,0.36,1)_both]"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 overflow-hidden", children: /* @__PURE__ */ jsx(
            "h1",
            {
              className: "font-serif text-3xl sm:text-4xl font-black tracking-[0.18em] animate-[splash-rise_1s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]",
              style: { color: "#0d5a47", fontFamily: "'Playfair Display', 'Cairo', 'Tajawal', serif" },
              children: "ASH MALL"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "mt-2 text-[11px] sm:text-xs font-bold animate-[splash-rise_1s_cubic-bezier(0.22,1,0.36,1)_0.8s_both]",
              style: { color: "#0d5a47", opacity: 0.7, fontFamily: "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif", letterSpacing: "0.15em" },
              children: "السوق الذكي لأشمون"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 w-56 sm:w-64 animate-[splash-rise_1s_cubic-bezier(0.22,1,0.36,1)_1s_both]", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "relative h-[6px] w-full overflow-hidden rounded-full",
                style: { background: "rgba(13,90,71,0.12)", boxShadow: "inset 0 1px 2px rgba(13,90,71,0.08)" },
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-[width] duration-100 ease-out relative overflow-hidden",
                    style: {
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #0d5a47, #1a8a6e, #0d5a47)",
                      boxShadow: "0 0 10px rgba(13,90,71,0.5)"
                    },
                    children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute inset-0 animate-[splash-shimmer_1.2s_linear_infinite]",
                        style: {
                          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)"
                        }
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between text-[11px] font-semibold tracking-wider tabular-nums", style: { color: "#0d5a47" }, children: [
              /* @__PURE__ */ jsx("span", { style: { opacity: 0.7 }, children: "جارٍ التحميل…" }),
              /* @__PURE__ */ jsxs("span", { children: [
                progress,
                "%"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes splash-logo {
          0% { opacity: 0; transform: scale(0.6) rotate(-8deg); filter: blur(8px); }
          60% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes splash-rise {
          0% { opacity: 0; transform: translateY(100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes splash-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes splash-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes splash-ring-expand {
          0% { width: 180px; height: 180px; opacity: 0.8; border-width: 2px; }
          100% { width: 600px; height: 600px; opacity: 0; border-width: 1px; }
        }
        .splash-ring {
          position: absolute;
          border-radius: 9999px;
          border: 2px solid #0d5a47;
          animation: splash-ring-expand 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .splash-ring-1 { animation-delay: 0s; }
        .splash-ring-2 { animation-delay: 0.7s; }
        .splash-ring-3 { animation-delay: 1.4s; }
      ` })
      ]
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "الصفحة غير موجودة" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "الصفحة التي تبحث عنها لم تعد متاحة." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition", children: "العودة للرئيسية" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-foreground", children: "تعذّر تحميل الصفحة" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "حدث خطأ غير متوقع." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => {
        router2.invalidate();
        reset();
      }, className: "rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition", children: "إعادة المحاولة" }),
      /* @__PURE__ */ jsx("a", { href: "/", className: "rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition", children: "الرئيسية" })
    ] })
  ] }) });
}
const Route$y = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f0ede4" },
      { title: "آش مول — السوق الذكي لأشمون" },
      { name: "description", content: "كل المتاجر الحقيقية الموثّقة في أشمون في تجربة سينمائية واحدة مدعومة بالذكاء الاصطناعي." },
      { property: "og:title", content: "آش مول — السوق الذكي لأشمون" },
      { property: "og:description", content: "السوق الذكي لمدينة أشمون، مصر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Cairo:wght@600;700;800;900&family=Playfair+Display:wght@600;700;800;900&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "ar", dir: "rtl", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$y.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(AuthSync, {}),
    /* @__PURE__ */ jsx(SiteSettingsSync, {}),
    /* @__PURE__ */ jsx(SplashScreen, {}),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", theme: "light", richColors: true })
  ] }) });
}
function SiteSettingsSync() {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 6e4
  });
  const s = data?.settings;
  useEffect(() => {
    if (!s) return;
    if (s.site_name && typeof document !== "undefined") {
      document.title = s.site_name + (s.tagline ? ` — ${s.tagline}` : "");
    }
    if (s.primary_color && typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary", s.primary_color);
    }
  }, [s]);
  return null;
}
function AuthSync() {
  const router2 = useRouter();
  const qc = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router2.invalidate();
      qc.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router2, qc]);
  return null;
}
const $$splitComponentImporter$x = () => import("./stores-BPQSgsZo.js");
const Route$x = createFileRoute("/stores")({
  component: lazyRouteComponent($$splitComponentImporter$x, "component"),
  head: () => ({
    meta: [{
      title: "كل المتاجر — آش مول"
    }, {
      name: "description",
      content: "تصفّح كل المتاجر الموثّقة في مدينة أشمون."
    }, {
      property: "og:title",
      content: "كل المتاجر — آش مول"
    }]
  })
});
const $$splitComponentImporter$w = () => import("./search-CuIMoc01.js");
const Route$w = createFileRoute("/search")({
  validateSearch: (s) => ({
    q: s.q || ""
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component"),
  head: () => ({
    meta: [{
      title: "بحث ذكي — آش مول"
    }, {
      name: "description",
      content: "ابحث في كل متاجر وخدمات مدينة أشمون بلغة طبيعية مدعومة بالذكاء الاصطناعي."
    }]
  })
});
const $$splitComponentImporter$v = () => import("./auth-CVK7AgKV.js");
const Route$v = createFileRoute("/auth")({
  validateSearch: (s) => ({
    redirect: s.redirect || "/"
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component"),
  head: () => ({
    meta: [{
      title: "تسجيل الدخول — آش مول"
    }, {
      name: "description",
      content: "سجّل دخولك أو أنشئ حسابك في آش مول."
    }]
  })
});
const $$splitComponentImporter$u = () => import("./_authenticated-BFsOu0JM.js");
const Route$u = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    location
  }) => {
    const {
      data
    } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./index-CLypdoOa.js");
const Route$t = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component"),
  head: () => ({
    meta: [{
      title: "آش مول — السوق الذكي لأشمون"
    }, {
      name: "description",
      content: "آش مول يربطك بكل متجر حقيقي موثّق في مدينة أشمون — صيدليات، مطاعم، أزياء، إلكترونيات — في تجربة سلسة مدعومة بالذكاء الاصطناعي."
    }, {
      property: "og:title",
      content: "آش مول — السوق الذكي لأشمون"
    }, {
      property: "og:description",
      content: "السوق الذكي لمدينة أشمون، مصر."
    }]
  })
});
const listStores = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  categorySlug: z.string().optional(),
  limit: z.number().min(1).max(100).optional().default(24),
  featured: z.boolean().optional()
}).parse(i ?? {})).handler(createSsrRpc("ac40bde93ee29e7711dec098b29535634e8fccf96b1a40bc5b1ed2566806d5b4"));
const getStoreBySlug = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  slug: z.string().min(1).max(120)
}).parse(i)).handler(createSsrRpc("9c0faecd2b84a861e11a965da878f25e8d4297ddc27c8e650c9fbb2730083cc7"));
const listCategoriesWithCounts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("8e7d8cf9b5d066566cea70d750fc021a9c6face359f986e6b566c7d5d45a92b0"));
const getCategoryBySlug = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  slug: z.string().min(1).max(60)
}).parse(i)).handler(createSsrRpc("934342accf617b315aec8af1950863253e71fc5f64df056b1661c282f5284602"));
const listMyStores = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("84594e55e04dfcaa530832ec8bcbb94e1cdbd57c355b957210000a9e90754da5"));
const applyForStore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  name_ar: z.string().trim().min(2).max(100),
  name_en: z.string().trim().max(100).optional(),
  description_ar: z.string().trim().max(1e3).optional(),
  category_id: z.string().uuid(),
  address: z.string().trim().min(5).max(300),
  legal_name: z.string().trim().min(2).max(150),
  delivery_fee: z.number().min(0).max(1e4).optional(),
  prep_time_minutes: z.number().int().min(0).max(600).optional(),
  opening_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  closing_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  logo_url: z.string().url().max(500).optional(),
  cover_url: z.string().url().max(500).optional()
}).parse(i)).handler(createSsrRpc("49030d49072c92cf9dabe52828662d781f3ac1cc11445593f8a488151e2c8f07"));
const $$splitComponentImporter$s = () => import("./stores._slug-Dk8WRpR7.js");
const $$splitErrorComponentImporter$2 = () => import("./stores._slug-B5l40gq7.js");
const $$splitNotFoundComponentImporter$2 = () => import("./stores._slug-BzyaHocT.js");
const Route$s = createFileRoute("/stores/$slug")({
  loader: async ({
    params
  }) => {
    const {
      store
    } = await getStoreBySlug({
      data: {
        slug: params.slug
      }
    });
    if (!store) throw notFound();
    return {
      store
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.store?.name_ar ?? "متجر"} — آش مول`
    }, {
      name: "description",
      content: loaderData?.store?.description_ar ?? "متجر موثّق في أشمون."
    }, {
      property: "og:title",
      content: `${loaderData?.store?.name_ar} — آش مول`
    }, {
      property: "og:description",
      content: loaderData?.store?.description_ar ?? ""
    }, ...loaderData?.store?.cover_url ? [{
      property: "og:image",
      content: loaderData.store.cover_url
    }] : []]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const listProductsByStore = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(createSsrRpc("ad33e27f962dcec924c42c5da698dcc6f8fa972e85e8b3d98623ab5e69687a68"));
const getProductById = createServerFn({
  method: "GET"
}).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("c7fb84471f1ed3c620fa7f14e779f4ce4ede1d66e883ca357ba6cee390bd57c9"));
const listMyStoreProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  storeId: z.string().uuid()
}).parse(i)).handler(createSsrRpc("f8e44893abf6b8970c5449d351a27065a6072a28330cc7382313a6d683dde0da"));
const createProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  store_id: z.string().uuid(),
  name_ar: z.string().trim().min(1).max(150),
  description_ar: z.string().trim().max(800).optional(),
  price: z.number().min(0).max(1e6).optional(),
  image_url: z.string().url().max(500).optional(),
  section: z.string().trim().max(80).optional()
}).parse(i)).handler(createSsrRpc("acc80f592bb436c21cdce6e1d5d6087ef2a2f0e66f3aa25c96c83356a4766324"));
const deleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => z.object({
  id: z.string().uuid()
}).parse(i)).handler(createSsrRpc("154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db"));
const $$splitComponentImporter$r = () => import("./products._id-11x77xRK.js");
const $$splitErrorComponentImporter$1 = () => import("./products._id-B5l40gq7.js");
const $$splitNotFoundComponentImporter$1 = () => import("./products._id-CiiB3U4y.js");
const Route$r = createFileRoute("/products/$id")({
  params: {
    parse: (raw) => z.object({
      id: z.string().uuid()
    }).parse(raw),
    stringify: (p) => ({
      id: p.id
    })
  },
  loader: async ({
    params
  }) => {
    const {
      product
    } = await getProductById({
      data: {
        id: params.id
      }
    });
    if (!product) throw notFound();
    return {
      product
    };
  },
  head: ({
    loaderData
  }) => {
    const p = loaderData?.product;
    const store = p?.stores;
    const title = p ? `${p.name_ar} — ${store?.name_ar ?? "آش مول"}` : "منتج";
    const desc = p?.description_ar ?? `${p?.name_ar ?? "منتج"} متوفر الآن في ${store?.name_ar ?? "متجر موثّق"}.`;
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: desc
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: desc
      }, ...p?.image_url ? [{
        property: "og:image",
        content: p.image_url
      }] : []]
    };
  },
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./merchant.login-CoRgMC1l.js");
const Route$q = createFileRoute("/merchant/login")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component"),
  head: () => ({
    meta: [{
      title: "دخول التاجر — آش مول"
    }, {
      name: "description",
      content: "تسجيل دخول التجار إلى لوحة إدارة المتجر."
    }]
  })
});
const $$splitComponentImporter$p = () => import("./delivery.login-C5uCmxSR.js");
const Route$p = createFileRoute("/delivery/login")({
  component: lazyRouteComponent($$splitComponentImporter$p, "component"),
  head: () => ({
    meta: [{
      title: "دخول الدليفري — آش مول"
    }]
  })
});
const $$splitComponentImporter$o = () => import("./categories._slug-DHwYg8Sp.js");
const $$splitErrorComponentImporter = () => import("./categories._slug-B5l40gq7.js");
const $$splitNotFoundComponentImporter = () => import("./categories._slug-C1MFdtaQ.js");
const Route$o = createFileRoute("/categories/$slug")({
  loader: async ({
    params
  }) => {
    const {
      category
    } = await getCategoryBySlug({
      data: {
        slug: params.slug
      }
    });
    if (!category) throw notFound();
    return {
      category
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.category?.name_ar ?? "فئة"} في أشمون — آش مول`
    }, {
      name: "description",
      content: `كل ${loaderData?.category?.name_ar} الموثّقة في مدينة أشمون.`
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./settings-BHcvwMsE.js");
const Route$n = createFileRoute("/_authenticated/settings")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component"),
  head: () => ({
    meta: [{
      title: "الإعدادات — آش مول"
    }]
  })
});
const $$splitComponentImporter$m = () => import("./profile-BnhsqwPW.js");
const Route$m = createFileRoute("/_authenticated/profile")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
  head: () => ({
    meta: [{
      title: "حسابك — آش مول"
    }]
  })
});
const $$splitComponentImporter$l = () => import("./orders-CoECrO_O.js");
const Route$l = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [{
      title: "طلباتي — آش مول"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./notifications-BA7Fh5Ie.js");
const Route$k = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [{
      title: "الإشعارات — آش مول"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./merchant-12bjk22m.js");
const Route$j = createFileRoute("/_authenticated/merchant")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
  head: () => ({
    meta: [{
      title: "لوحة التاجر — آش مول"
    }]
  })
});
const $$splitComponentImporter$i = () => import("./favorites-Dpo-01rK.js");
const Route$i = createFileRoute("/_authenticated/favorites")({
  head: () => ({
    meta: [{
      title: "المفضلة — آش مول"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./delivery-CLpHrS0p.js");
const Route$h = createFileRoute("/_authenticated/delivery")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
  head: () => ({
    meta: [{
      title: "لوحة الدليفري — آش مول"
    }]
  })
});
const $$splitComponentImporter$g = () => import("./dashboard-B5EIBOaO.js");
const Route$g = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
  head: () => ({
    meta: [{
      title: "لوحة التحكم — آش مول"
    }]
  })
});
const $$splitComponentImporter$f = () => import("./cart-BS7sDR1a.js");
const Route$f = createFileRoute("/_authenticated/cart")({
  head: () => ({
    meta: [{
      title: "السلة — آش مول"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./admin-zlUjd8Ml.js");
const Route$e = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component"),
  head: () => ({
    meta: [{
      title: "لوحة الإدارة — آش مول"
    }]
  })
});
const $$splitComponentImporter$d = () => import("./index-levZhs9T.js");
const Route$d = createFileRoute("/_authenticated/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./new-store-DzhzCFJv.js");
const Route$c = createFileRoute("/_authenticated/dashboard/new-store")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  head: () => ({
    meta: [{
      title: "تسجيل متجر — آش مول"
    }]
  })
});
const $$splitComponentImporter$b = () => import("./users-BgI1zpiJ.js");
const Route$b = createFileRoute("/_authenticated/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./stores-B2sQ56nk.js");
const Route$a = createFileRoute("/_authenticated/admin/stores")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./settings-B4ZX6pda.js");
const Route$9 = createFileRoute("/_authenticated/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./reviews-n31AMcNL.js");
const Route$8 = createFileRoute("/_authenticated/admin/reviews")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./products-DOcvGDiX.js");
const Route$7 = createFileRoute("/_authenticated/admin/products")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./orders-DCpDVUMr.js");
const Route$6 = createFileRoute("/_authenticated/admin/orders")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./merchants-X7Djr7FT.js");
const Route$5 = createFileRoute("/_authenticated/admin/merchants")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./delivery-CYktqntN.js");
const Route$4 = createFileRoute("/_authenticated/admin/delivery")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./categories-DQopJbMn.js");
const Route$3 = createFileRoute("/_authenticated/admin/categories")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./catalog-Dt6f6mOX.js");
const Route$2 = createFileRoute("/_authenticated/admin/catalog")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./broadcast-ZcLlQnWC.js");
const Route$1 = createFileRoute("/_authenticated/admin/broadcast")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./ads-BjICCW41.js");
const Route = createFileRoute("/_authenticated/admin/ads")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StoresRoute = Route$x.update({
  id: "/stores",
  path: "/stores",
  getParentRoute: () => Route$y
});
const SearchRoute = Route$w.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$y
});
const AuthRoute = Route$v.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$y
});
const AuthenticatedRoute = Route$u.update({
  id: "/_authenticated",
  getParentRoute: () => Route$y
});
const IndexRoute = Route$t.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$y
});
const StoresSlugRoute = Route$s.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => StoresRoute
});
const ProductsIdRoute = Route$r.update({
  id: "/products/$id",
  path: "/products/$id",
  getParentRoute: () => Route$y
});
const MerchantLoginRoute = Route$q.update({
  id: "/merchant/login",
  path: "/merchant/login",
  getParentRoute: () => Route$y
});
const DeliveryLoginRoute = Route$p.update({
  id: "/delivery/login",
  path: "/delivery/login",
  getParentRoute: () => Route$y
});
const CategoriesSlugRoute = Route$o.update({
  id: "/categories/$slug",
  path: "/categories/$slug",
  getParentRoute: () => Route$y
});
const AuthenticatedSettingsRoute = Route$n.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedProfileRoute = Route$m.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedOrdersRoute = Route$l.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedNotificationsRoute = Route$k.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedMerchantRoute = Route$j.update({
  id: "/merchant",
  path: "/merchant",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedFavoritesRoute = Route$i.update({
  id: "/favorites",
  path: "/favorites",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDeliveryRoute = Route$h.update({
  id: "/delivery",
  path: "/delivery",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route$g.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedCartRoute = Route$f.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAdminRoute = Route$e.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAdminIndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedDashboardNewStoreRoute = Route$c.update({
  id: "/new-store",
  path: "/new-store",
  getParentRoute: () => AuthenticatedDashboardRoute
});
const AuthenticatedAdminUsersRoute = Route$b.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminStoresRoute = Route$a.update({
  id: "/stores",
  path: "/stores",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminSettingsRoute = Route$9.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminReviewsRoute = Route$8.update({
  id: "/reviews",
  path: "/reviews",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminProductsRoute = Route$7.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminOrdersRoute = Route$6.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminMerchantsRoute = Route$5.update({
  id: "/merchants",
  path: "/merchants",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminDeliveryRoute = Route$4.update({
  id: "/delivery",
  path: "/delivery",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminCategoriesRoute = Route$3.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminCatalogRoute = Route$2.update({
  id: "/catalog",
  path: "/catalog",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminBroadcastRoute = Route$1.update({
  id: "/broadcast",
  path: "/broadcast",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminAdsRoute = Route.update({
  id: "/ads",
  path: "/ads",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminAdsRoute,
  AuthenticatedAdminBroadcastRoute,
  AuthenticatedAdminCatalogRoute,
  AuthenticatedAdminCategoriesRoute,
  AuthenticatedAdminDeliveryRoute,
  AuthenticatedAdminMerchantsRoute,
  AuthenticatedAdminOrdersRoute,
  AuthenticatedAdminProductsRoute,
  AuthenticatedAdminReviewsRoute,
  AuthenticatedAdminSettingsRoute,
  AuthenticatedAdminStoresRoute,
  AuthenticatedAdminUsersRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedDashboardRouteChildren = {
  AuthenticatedDashboardNewStoreRoute
};
const AuthenticatedDashboardRouteWithChildren = AuthenticatedDashboardRoute._addFileChildren(
  AuthenticatedDashboardRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedCartRoute,
  AuthenticatedDashboardRoute: AuthenticatedDashboardRouteWithChildren,
  AuthenticatedDeliveryRoute,
  AuthenticatedFavoritesRoute,
  AuthenticatedMerchantRoute,
  AuthenticatedNotificationsRoute,
  AuthenticatedOrdersRoute,
  AuthenticatedProfileRoute,
  AuthenticatedSettingsRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const StoresRouteChildren = {
  StoresSlugRoute
};
const StoresRouteWithChildren = StoresRoute._addFileChildren(StoresRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  AuthRoute,
  SearchRoute,
  StoresRoute: StoresRouteWithChildren,
  CategoriesSlugRoute,
  DeliveryLoginRoute,
  MerchantLoginRoute,
  ProductsIdRoute
};
const routeTree = Route$y._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 6e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadDelay: 30,
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$w as R,
  Route$v as a,
  Route$s as b,
  Route$r as c,
  Route$o as d,
  applyForStore as e,
  createProduct as f,
  createSsrRpc as g,
  deleteProduct as h,
  getSiteSettings as i,
  listMyStoreProducts as j,
  listMyStores as k,
  listCategoriesWithCounts as l,
  listProductsByStore as m,
  listStores as n,
  router as r,
  useAuth as u
};
