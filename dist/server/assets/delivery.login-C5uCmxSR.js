import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-1xsKmu53.js";
import { ArrowLeft, Bike, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "@supabase/supabase-js";
function DeliveryLogin() {
  useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) window.location.href = "/delivery";
    });
  }, []);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) throw error;
      toast.success("أهلاً بك");
      window.location.href = "/delivery";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تسجيل الدخول");
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background grid place-items-center px-5", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
      " العودة للرئيسية"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card p-7 sm:p-8", style: {
      boxShadow: "0 20px 60px -30px color-mix(in oklab, var(--primary) 40%, transparent)"
    }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground", style: {
          background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))"
        }, children: /* @__PURE__ */ jsx(Bike, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80", children: "Delivery" }),
          /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-extrabold", children: "لوحة الدليفري" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "دخول بيانات الدليفري اللي وصلتك من إدارة آش مول." }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground mb-1.5 block", children: "البريد الإلكتروني" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full rounded-xl bg-background border border-border ps-4 pe-10 py-2.5 text-sm focus:border-primary outline-none" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground mb-1.5 block", children: "كلمة المرور" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "w-full rounded-xl bg-background border border-border ps-4 pe-10 py-2.5 text-sm focus:border-primary outline-none" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-bold hover:opacity-95 transition disabled:opacity-50", children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          "دخول لوحة الدليفري"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  DeliveryLogin as component
};
