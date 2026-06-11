import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-1xsKmu53.js";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { g as createSsrRpc, a as Route } from "./router-B21PHlE4.js";
import { r as requireSupabaseAuth } from "./auth-middleware-tARyaGyP.js";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { z } from "zod";
import { ArrowLeft, User, Store, Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
const claimStoreOwnerRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("8f27371ce786bca7dd2e87bc5c1736f014bcbfbdc236a42ea3d290e57c50f511"));
const ensureMerchantShortcut = createServerFn({
  method: "POST"
}).inputValidator((input) => z.object({
  identifier: z.string().min(1).max(100),
  password: z.string().min(1).max(200)
}).parse(input)).handler(createSsrRpc("d40176337b963db22a207dc9644bef998ad409ffe9459a127a9a0652b368e22a"));
function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const search = Route.useSearch();
  const claimOwner = useServerFn(claimStoreOwnerRole);
  const claimShortcut = useServerFn(ensureMerchantShortcut);
  const [role, setRole] = useState("customer");
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: search.redirect
      });
    });
  }, [navigate, search.redirect]);
  async function finalize() {
    if (role === "owner") {
      try {
        await claimOwner();
      } catch {
      }
      await router.invalidate();
      navigate({
        to: "/dashboard"
      });
    } else {
      await router.invalidate();
      navigate({
        to: search.redirect
      });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (role === "owner") {
        const result = await claimShortcut({
          data: {
            identifier: email,
            password
          }
        });
        if (result.matched) {
          const {
            error
          } = await supabase.auth.signInWithPassword({
            email: result.email,
            password: result.password
          });
          if (error) throw error;
          toast.success("أهلاً بك في لوحة الإدارة");
          await router.invalidate();
          navigate({
            to: "/admin"
          });
          return;
        }
      }
      const creds = {
        email,
        password
      };
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          ...creds,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: name || email.split("@")[0],
              intended_role: role
            }
          }
        });
        if (error) throw error;
        toast.success(role === "owner" ? "تم إنشاء حساب التاجر" : "تم إنشاء حسابك بنجاح");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword(creds);
        if (error) throw error;
        toast.success(role === "owner" ? "أهلاً بعودتك يا تاجر" : "أهلاً بعودتك");
      }
      await finalize();
    } catch (err) {
      toast.error(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin
    });
    if (result.error) {
      toast.error("تعذّر تسجيل الدخول بـ Google");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    await finalize();
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen w-full max-w-full overflow-x-hidden flex items-center justify-center px-4 py-12", dir: "rtl", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 overflow-hidden pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/4 -translate-x-1/2 h-[320px] w-[320px] sm:h-[500px] sm:w-[500px] rounded-full opacity-30 blur-3xl animate-pulse-glow", style: {
      background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)"
    } }) }),
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "absolute top-6 right-4 sm:right-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition z-10", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
      " الرئيسية"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 animate-rise", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow glow-ring", children: /* @__PURE__ */ jsx("span", { className: "font-display text-xl font-extrabold text-primary-foreground", children: "آ" }) }),
        /* @__PURE__ */ jsx("h1", { className: "mt-5 font-display text-3xl font-extrabold text-gradient-soft", children: mode === "signin" ? "أهلاً بعودتك" : "أنشئ حسابك" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: role === "owner" ? "بوابة التجار — أدر متجرك على آش مول" : mode === "signin" ? "سجّل دخولك للوصول إلى آش مول" : "ابدأ رحلتك مع السوق الذكي لأشمون" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-5 grid grid-cols-2 gap-2 p-1.5 rounded-2xl glass border border-border", children: [{
        id: "customer",
        label: "عميل",
        icon: User
      }, {
        id: "owner",
        label: "تاجر",
        icon: Store
      }].map((r) => {
        const active = role === r.id;
        const Icon = r.icon;
        return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
          setRole(r.id);
          if (r.id === "owner") setMode("signin");
        }, className: `relative flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${active ? "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]" : "text-muted-foreground hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
          r.label
        ] }, r.id);
      }) }),
      role === "owner" && /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground mb-1", children: "حساب التاجر يُنشأ من قِبَل الإدارة" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "تُرسَل لك بيانات الدخول (البريد وكلمة المرور) بعد التعاقد. لطلب حساب تاجر تواصل مع فريق آش مول." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-strong rounded-3xl p-7 sm:p-8 animate-rise reveal-delay-1", style: {
        boxShadow: "var(--shadow-elevated)"
      }, children: [
        role === "customer" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("button", { onClick: handleGoogle, disabled: loading, className: "w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/60 hover:bg-secondary px-4 py-3 text-sm font-medium transition active:scale-95 disabled:opacity-50", children: [
            /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
              /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
              /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
            ] }),
            "متابعة باستخدام Google"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "my-6 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-border" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "أو سجّل بنفسك" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-border" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
          mode === "signup" && role === "customer" && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "الاسم الكامل", className: "w-full rounded-xl glass border-border px-10 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: role === "owner" ? "text" : "email", required: true, dir: "ltr", value: email, onChange: (e) => setEmail(e.target.value), placeholder: role === "owner" ? "البريد أو رقم التاجر" : "email@example.com", className: "w-full rounded-xl glass border-border px-10 py-3 text-sm text-start placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: "password", required: true, minLength: 6, dir: "ltr", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "كلمة المرور (٦ أحرف على الأقل)", className: "w-full rounded-xl glass border-border px-10 py-3 text-sm text-start placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition" })
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 text-sm font-medium hover:opacity-95 transition active:scale-95 glow-ring disabled:opacity-60", children: [
            loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"
          ] })
        ] }),
        role === "customer" && /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
          mode === "signin" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟",
          " ",
          /* @__PURE__ */ jsx("button", { onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "text-primary hover:underline font-medium", children: mode === "signin" ? "إنشاء حساب" : "تسجيل الدخول" })
        ] })
      ] })
    ] })
  ] });
}
export {
  AuthPage as component
};
