import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { s as supabase } from "./client-1xsKmu53.js";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { e as applyForStore, u as useAuth } from "./router-B21PHlE4.js";
import { ArrowRight, Store, ImagePlus, X, Loader2, Tag, MapPin, IdCard, Timer, Bike, DoorOpen, DoorClosed, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
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
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "./auth-middleware-tARyaGyP.js";
function NewStore() {
  const navigate = useNavigate();
  const submit = useServerFn(applyForStore);
  const {
    user
  } = useAuth();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [form, setForm] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    category_id: "",
    address: "",
    legal_name: "",
    delivery_fee: "",
    prep_time_minutes: "",
    opening_time: "",
    closing_time: "",
    logo_url: "",
    cover_url: ""
  });
  useEffect(() => {
    supabase.from("categories").select("id, name_ar, icon").order("sort_order").then(({
      data
    }) => {
      if (data) setCats(data);
    });
  }, []);
  async function uploadImage(file, kind) {
    if (!user) return null;
    const setBusy = kind === "logo" ? setLogoUploading : setCoverUploading;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("store-media").upload(path, file, {
        upsert: true,
        cacheControl: "3600"
      });
      if (upErr) throw upErr;
      const {
        data
      } = supabase.storage.from("store-media").getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      toast.error("فشل رفع الصورة: " + e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function onLogoChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("الحجم الأقصى 5 ميجا");
      return;
    }
    const url = await uploadImage(f, "logo");
    if (url) setForm((s) => ({
      ...s,
      logo_url: url
    }));
  }
  async function onCoverChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("الحجم الأقصى 5 ميجا");
      return;
    }
    const url = await uploadImage(f, "cover");
    if (url) setForm((s) => ({
      ...s,
      cover_url: url
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await submit({
        data: {
          name_ar: form.name_ar,
          name_en: form.name_en || void 0,
          description_ar: form.description_ar || void 0,
          category_id: form.category_id,
          address: form.address,
          legal_name: form.legal_name,
          delivery_fee: form.delivery_fee ? Number(form.delivery_fee) : void 0,
          prep_time_minutes: form.prep_time_minutes ? Number(form.prep_time_minutes) : void 0,
          opening_time: form.opening_time || void 0,
          closing_time: form.closing_time || void 0,
          logo_url: form.logo_url || void 0,
          cover_url: form.cover_url || void 0
        }
      });
      toast.success("تم استلام طلبك — سنراجعه خلال ٢٤ ساعة.");
      navigate({
        to: "/dashboard"
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-28 pb-20 mx-auto max-w-3xl px-5 sm:px-6", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition", children: [
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }),
        " العودة للوحة التحكم"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "grid place-items-center h-14 w-14 rounded-2xl text-primary-foreground shrink-0", style: {
          background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
          boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent)"
        }, children: /* @__PURE__ */ jsx(Store, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-primary", style: {
            boxShadow: "var(--shadow-chip)"
          }, children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
            " تسجيل متجر جديد"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "mt-1.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.4] py-1", children: "سجّل متجرك في أشمون" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "سنراجع الطلب خلال ٢٤ ساعة ويظهر تلقائيًا في الفئة المختارة." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-8 glass-strong rounded-3xl p-6 sm:p-8 space-y-6", style: {
        boxShadow: "var(--shadow-elevated)"
      }, children: [
        /* @__PURE__ */ jsx(Section, { title: "صور المتجر", icon: ImagePlus, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-stretch", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-muted-foreground mb-1.5", children: "صورة الغلاف" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => coverInputRef.current?.click(), className: "relative w-full h-36 rounded-2xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition group bg-secondary/30", children: form.cover_url ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("img", { src: form.cover_url, alt: "", className: "absolute inset-0 h-full w-full object-cover" }),
              /* @__PURE__ */ jsx("span", { onClick: (ev) => {
                ev.stopPropagation();
                setForm((s) => ({
                  ...s,
                  cover_url: ""
                }));
              }, className: "absolute top-2 left-2 grid place-items-center h-7 w-7 rounded-full bg-background/90 backdrop-blur text-foreground border border-border hover:bg-destructive hover:text-destructive-foreground transition", children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }) })
            ] }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-muted-foreground group-hover:text-primary transition", children: coverUploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx(ImagePlus, { className: "h-6 w-6 mx-auto" }),
              /* @__PURE__ */ jsx("div", { className: "mt-1.5 text-xs", children: "اضغط لرفع الغلاف" })
            ] }) }) }),
            /* @__PURE__ */ jsx("input", { ref: coverInputRef, type: "file", accept: "image/*", onChange: onCoverChange, className: "hidden" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs text-muted-foreground mb-1.5", children: "الشعار" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => logoInputRef.current?.click(), className: "relative h-36 w-36 rounded-2xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition group bg-secondary/30", children: form.logo_url ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("img", { src: form.logo_url, alt: "", className: "absolute inset-0 h-full w-full object-cover" }),
              /* @__PURE__ */ jsx("span", { onClick: (ev) => {
                ev.stopPropagation();
                setForm((s) => ({
                  ...s,
                  logo_url: ""
                }));
              }, className: "absolute top-2 left-2 grid place-items-center h-7 w-7 rounded-full bg-background/90 backdrop-blur text-foreground border border-border hover:bg-destructive hover:text-destructive-foreground transition", children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }) })
            ] }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-muted-foreground group-hover:text-primary transition", children: logoUploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx(ImagePlus, { className: "h-6 w-6 mx-auto" }),
              /* @__PURE__ */ jsx("div", { className: "mt-1.5 text-[11px]", children: "شعار" })
            ] }) }) }),
            /* @__PURE__ */ jsx("input", { ref: logoInputRef, type: "file", accept: "image/*", onChange: onLogoChange, className: "hidden" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(Section, { title: "بيانات أساسية", icon: Store, children: [
          /* @__PURE__ */ jsx(Field, { label: "اسم المتجر بالعربية *", children: /* @__PURE__ */ jsx("input", { required: true, maxLength: 100, value: form.name_ar, onChange: (e) => setForm({
            ...form,
            name_ar: e.target.value
          }), className: inputCls, placeholder: "مثال: حلواني الندى" }) }),
          /* @__PURE__ */ jsx(Field, { label: "الاسم بالإنجليزية (اختياري)", children: /* @__PURE__ */ jsx("input", { dir: "ltr", maxLength: 100, value: form.name_en, onChange: (e) => setForm({
            ...form,
            name_en: e.target.value
          }), className: inputCls, placeholder: "Al-Nada Sweets" }) }),
          /* @__PURE__ */ jsx(Field, { label: "الفئة *", icon: Tag, children: /* @__PURE__ */ jsxs("select", { required: true, value: form.category_id, onChange: (e) => setForm({
            ...form,
            category_id: e.target.value
          }), className: inputCls, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "اختر فئة" }),
            cats.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
              c.icon,
              " ",
              c.name_ar
            ] }, c.id))
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "الموقع", icon: MapPin, children: [
          /* @__PURE__ */ jsx(Field, { label: "العنوان الفعلي في أشمون *", icon: MapPin, children: /* @__PURE__ */ jsx("input", { required: true, maxLength: 300, value: form.address, onChange: (e) => setForm({
            ...form,
            address: e.target.value
          }), className: inputCls, placeholder: "شارع الجلاء، بجوار مسجد..." }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground -mt-1", children: "التواصل بين العميل والمتجر يتم داخل المنصة فقط — لا يتم عرض أرقام تواصل مباشرة في صفحة المتجر." })
        ] }),
        /* @__PURE__ */ jsx(Section, { title: "الاسم القانوني", icon: IdCard, children: /* @__PURE__ */ jsx(Field, { label: "الاسم الرسمي للمتجر *", icon: IdCard, children: /* @__PURE__ */ jsx("input", { required: true, maxLength: 150, value: form.legal_name, onChange: (e) => setForm({
          ...form,
          legal_name: e.target.value
        }), className: inputCls, placeholder: "مثال: عمار السوري" }) }) }),
        /* @__PURE__ */ jsx(Section, { title: "تفاصيل التشغيل", icon: Timer, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(Field, { label: "سعر التوصيل (جنيه)", icon: Bike, children: /* @__PURE__ */ jsx("input", { type: "number", min: 0, step: "0.5", value: form.delivery_fee, onChange: (e) => setForm({
            ...form,
            delivery_fee: e.target.value
          }), className: inputCls, placeholder: "15" }) }),
          /* @__PURE__ */ jsx(Field, { label: "وقت التجهيز (دقيقة)", icon: Timer, children: /* @__PURE__ */ jsx("input", { type: "number", min: 0, step: "1", value: form.prep_time_minutes, onChange: (e) => setForm({
            ...form,
            prep_time_minutes: e.target.value
          }), className: inputCls, placeholder: "30" }) }),
          /* @__PURE__ */ jsx(Field, { label: "موعد الفتح", icon: DoorOpen, children: /* @__PURE__ */ jsx("input", { type: "time", value: form.opening_time, onChange: (e) => setForm({
            ...form,
            opening_time: e.target.value
          }), className: inputCls }) }),
          /* @__PURE__ */ jsx(Field, { label: "موعد الغلق", icon: DoorClosed, children: /* @__PURE__ */ jsx("input", { type: "time", value: form.closing_time, onChange: (e) => setForm({
            ...form,
            closing_time: e.target.value
          }), className: inputCls }) })
        ] }) }),
        /* @__PURE__ */ jsx(Section, { title: "وصف المتجر", icon: FileText, children: /* @__PURE__ */ jsx(Field, { label: "نبذة عن المتجر", children: /* @__PURE__ */ jsx("textarea", { maxLength: 1e3, rows: 4, value: form.description_ar, onChange: (e) => setForm({
          ...form,
          description_ar: e.target.value
        }), className: inputCls + " resize-none", placeholder: "عرّف العملاء بمتجرك وأهم منتجاتك..." }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }),
          " سيتم التحقق يدويًا من العنوان قبل النشر."
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading || logoUploading || coverUploading, className: "w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-primary to-primary-glow text-primary-foreground py-3.5 text-sm font-bold hover:opacity-95 transition active:scale-[0.98] glow-ring disabled:opacity-60 shadow-lg", children: [
          loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
          "إرسال طلب التسجيل"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const inputCls = "w-full rounded-xl glass border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition";
function Section({
  title,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-primary uppercase", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
      " ",
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children })
  ] });
}
function Field({
  label,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5", children: [
      Icon && /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
      " ",
      label
    ] }),
    children
  ] });
}
export {
  NewStore as component
};
