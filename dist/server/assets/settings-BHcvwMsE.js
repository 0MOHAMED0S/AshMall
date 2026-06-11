import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { u as useAuth } from "./router-B21PHlE4.js";
import { s as supabase } from "./client-1xsKmu53.js";
import { ChevronLeft, Loader2, Camera, Trash2, User, Phone, Mail, Lock, ShieldCheck, Bell, LayoutDashboard, ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import "./useServerFn-DL2oePlL.js";
import "zod";
import "./server-Dxshj7Uq.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "@tanstack/react-query";
import "./auth-middleware-tARyaGyP.js";
import "@supabase/supabase-js";
function SettingsPage() {
  const {
    user,
    signOut,
    isStoreOwner,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
    });
  }, [user]);
  async function uploadAvatar(file) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("الحد الأقصى 5 ميجابايت");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const {
      error: upErr
    } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true
    });
    if (upErr) {
      setUploading(false);
      toast.error(upErr.message);
      return;
    }
    const {
      data: pub
    } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = pub.publicUrl;
    const {
      error: dbErr
    } = await supabase.from("profiles").update({
      avatar_url: url
    }).eq("id", user.id);
    setUploading(false);
    if (dbErr) {
      toast.error(dbErr.message);
      return;
    }
    setAvatarUrl(url);
    toast.success("تم تحديث صورة البروفايل");
  }
  async function removeAvatar() {
    if (!user) return;
    setUploading(true);
    const {
      error
    } = await supabase.from("profiles").update({
      avatar_url: null
    }).eq("id", user.id);
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setAvatarUrl(null);
    toast.success("تم حذف الصورة");
  }
  async function saveInfo(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: fullName,
      phone
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("تم حفظ بياناتك");
  }
  async function changePassword(e) {
    e.preventDefault();
    if (pwd.length < 6) {
      toast.error("كلمة المرور 6 أحرف على الأقل");
      return;
    }
    setPwdSaving(true);
    const {
      error
    } = await supabase.auth.updateUser({
      password: pwd
    });
    setPwdSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("تم تغيير كلمة المرور");
      setPwd("");
    }
  }
  const displayName = fullName || user?.email?.split("@")[0] || "حسابك";
  const initial = (displayName?.[0] || "?").toUpperCase();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-24 pb-28 mx-auto max-w-2xl px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
          to: "/profile"
        }), className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
          "العودة لحسابك"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-xl sm:text-2xl font-extrabold text-foreground", children: "الإعدادات" })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "rounded-3xl p-6 sm:p-8 mb-5 overflow-hidden", style: {
        background: "linear-gradient(140deg, color-mix(in oklab, var(--primary-soft) 70%, transparent), color-mix(in oklab, var(--accent-soft, var(--primary-soft)) 60%, transparent))",
        boxShadow: "var(--shadow-elevated)"
      }, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsx("div", { className: "h-28 w-28 rounded-full overflow-hidden grid place-items-center text-4xl font-extrabold text-primary bg-background", style: {
            boxShadow: "0 0 0 4px color-mix(in oklab, var(--primary) 30%, transparent), 0 12px 30px -10px color-mix(in oklab, var(--primary) 35%, transparent)"
          }, children: avatarUrl ? /* @__PURE__ */ jsx("img", { src: avatarUrl, alt: displayName, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx("span", { children: initial }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => fileRef.current?.click(), disabled: uploading, "aria-label": "تغيير الصورة", className: "absolute -bottom-1 -left-1 grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground border-4 border-background hover:scale-105 transition active:scale-95 disabled:opacity-70", style: {
            boxShadow: "0 8px 20px -8px color-mix(in oklab, var(--primary) 50%, transparent)"
          }, children: uploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) void uploadAvatar(f);
            e.target.value = "";
          } })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-xl font-extrabold text-foreground", children: displayName }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-muted-foreground", dir: "ltr", children: user?.email }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => fileRef.current?.click(), disabled: uploading, className: "inline-flex items-center gap-1.5 rounded-full bg-background/80 border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background transition", children: [
            /* @__PURE__ */ jsx(Camera, { className: "h-3.5 w-3.5" }),
            avatarUrl ? "تغيير الصورة" : "إضافة صورة"
          ] }),
          avatarUrl && /* @__PURE__ */ jsxs("button", { onClick: removeAvatar, disabled: uploading, className: "inline-flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/15 transition", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
            "حذف الصورة"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "بياناتي الشخصية", icon: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("form", { onSubmit: saveInfo, className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "الاسم الكامل", icon: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), value: fullName, onChange: setFullName, placeholder: "اكتب اسمك" }),
        /* @__PURE__ */ jsx(Field, { label: "رقم الهاتف", icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), value: phone, onChange: setPhone, ltr: true, placeholder: "+20…" }),
        /* @__PURE__ */ jsx(Field, { label: "البريد الإلكتروني", icon: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), value: user?.email ?? "", onChange: () => {
        }, ltr: true, disabled: true }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: saving, className: "inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-95 transition active:scale-[0.98] disabled:opacity-60", style: {
          boxShadow: "0 10px 25px -10px color-mix(in oklab, var(--primary) 50%, transparent)"
        }, children: [
          saving && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          "حفظ التغييرات"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "الأمان", icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("form", { onSubmit: changePassword, className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "كلمة مرور جديدة", icon: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), value: pwd, onChange: setPwd, ltr: true, type: "password", placeholder: "••••••••" }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: pwdSaving || !pwd, className: "inline-flex items-center justify-center gap-2 w-full rounded-2xl border border-border bg-card hover:bg-muted text-foreground px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60", children: [
          pwdSaving && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          "تغيير كلمة المرور"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "التفضيلات", icon: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(RowLink, { to: "/notifications", icon: /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }), label: "الإشعارات" }),
        (isStoreOwner || isAdmin) && /* @__PURE__ */ jsx(RowLink, { to: "/dashboard", icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4" }), label: "لوحة التحكم" })
      ] }) }),
      /* @__PURE__ */ jsxs("button", { onClick: signOut, className: "mt-2 flex items-center justify-between gap-3 w-full rounded-2xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive px-4 py-3 text-sm font-medium transition active:scale-[0.98]", children: [
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 rotate-180" }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
          " تسجيل الخروج"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function SectionCard({
  title,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl bg-background border border-border/60 p-5 sm:p-6 mb-4", style: {
    boxShadow: "0 4px 14px -6px color-mix(in oklab, var(--foreground) 10%, transparent)"
  }, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-10 w-10 rounded-2xl text-primary", style: {
        background: "color-mix(in oklab, var(--primary-soft) 70%, white)"
      }, children: icon }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-base sm:text-lg font-extrabold text-foreground", children: title })
    ] }),
    children
  ] });
}
function RowLink({
  to,
  icon,
  label
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: "flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 px-4 py-3 text-sm text-foreground transition active:scale-[0.98]", children: [
    /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 text-muted-foreground" }),
    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-primary", children: icon }),
      label
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  ltr,
  disabled,
  type = "text",
  placeholder,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-xs text-muted-foreground mb-1.5", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      icon && /* @__PURE__ */ jsx("span", { className: `absolute top-1/2 -translate-y-1/2 ${ltr ? "left-3" : "right-3"} text-muted-foreground`, children: icon }),
      /* @__PURE__ */ jsx("input", { dir: ltr ? "ltr" : void 0, value, type, placeholder, disabled, onChange: (e) => onChange(e.target.value), className: `w-full rounded-2xl bg-muted/40 border border-border/60 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition disabled:opacity-70 ${icon ? ltr ? "pl-10 pr-4" : "pr-10 pl-4" : "px-4"} ${ltr ? "text-start" : ""}` })
    ] })
  ] });
}
export {
  SettingsPage as component
};
