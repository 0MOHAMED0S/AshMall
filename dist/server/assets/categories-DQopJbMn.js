import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { Tag, Plus, X, Save, ChevronUp, ChevronDown, Edit2, Trash2, Loader2, ImagePlus, Store, Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { l as adminListCategories, A as adminUpsertCategory, f as adminDeleteCategory, r as adminListStoresByCategory, d as adminCreateStore, j as adminDeleteStore } from "./admin.functions-B9xDw6Pq.js";
import { A as AdminPageHeader, C as Card, S as Spinner, E as EmptyState, a as StatusBadge } from "./AdminUI-P1Smhk6f.js";
import { s as supabase } from "./client-1xsKmu53.js";
import { u as useAuth } from "./router-B21PHlE4.js";
import "zod";
import "./auth-middleware-tARyaGyP.js";
import "@supabase/supabase-js";
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
const emptyStore = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  address: "",
  legal_name: "",
  delivery_fee: "",
  prep_time_minutes: "",
  opening_time: "",
  closing_time: "",
  logo_url: "",
  cover_url: "",
  is_featured: false
};
function CategoriesAdmin() {
  const list = useServerFn(adminListCategories);
  const save = useServerFn(adminUpsertCategory);
  const del = useServerFn(adminDeleteCategory);
  const listStores = useServerFn(adminListStoresByCategory);
  const createStore = useServerFn(adminCreateStore);
  const deleteStore = useServerFn(adminDeleteStore);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [storesByCat, setStoresByCat] = useState({});
  const [loadingStoresFor, setLoadingStoresFor] = useState(null);
  const [addingFor, setAddingFor] = useState(null);
  const [newStore, setNewStore] = useState(emptyStore);
  const [saving, setSaving] = useState(false);
  const {
    user
  } = useAuth();
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  async function uploadStoreImage(file, kind) {
    if (!user) {
      toast.error("يجب تسجيل الدخول");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("الحجم الأقصى 5 ميجا");
      return null;
    }
    const setBusy = kind === "logo" ? setLogoUploading : setCoverUploading;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/admin-${kind}-${Date.now()}.${ext}`;
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
  async function reload() {
    setLoading(true);
    try {
      const r = await list();
      setRows(r.categories ?? []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function submitCategory() {
    if (!editing) return;
    if (!editing.name_ar || !editing.name_en || !editing.slug) {
      toast.error("املأ كل الحقول المطلوبة");
      return;
    }
    try {
      await save({
        data: {
          id: editing.id,
          name_ar: editing.name_ar,
          name_en: editing.name_en,
          slug: editing.slug,
          icon: editing.icon ?? null,
          sort_order: editing.sort_order ?? 0
        }
      });
      toast.success("تم الحفظ");
      setEditing(null);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    }
  }
  async function removeCategory(id) {
    if (!confirm("حذف الفئة؟")) return;
    try {
      await del({
        data: {
          id
        }
      });
      toast.success("تم الحذف");
      setRows((p) => p.filter((c) => c.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  async function loadStoresFor(catId) {
    setLoadingStoresFor(catId);
    try {
      const r = await listStores({
        data: {
          category_id: catId
        }
      });
      setStoresByCat((p) => ({
        ...p,
        [catId]: r.stores ?? []
      }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل التحميل");
    } finally {
      setLoadingStoresFor(null);
    }
  }
  async function toggleOpen(catId) {
    if (openId === catId) {
      setOpenId(null);
      setAddingFor(null);
      return;
    }
    setOpenId(catId);
    setAddingFor(null);
    if (!storesByCat[catId]) await loadStoresFor(catId);
  }
  async function submitNewStore(catId) {
    if (!newStore.name_ar.trim() || !newStore.address.trim()) {
      toast.error("الاسم والعنوان مطلوبان");
      return;
    }
    setSaving(true);
    try {
      await createStore({
        data: {
          category_id: catId,
          name_ar: newStore.name_ar.trim(),
          name_en: newStore.name_en.trim() || void 0,
          description_ar: newStore.description_ar.trim() || void 0,
          address: newStore.address.trim(),
          legal_name: newStore.legal_name.trim() || void 0,
          delivery_fee: newStore.delivery_fee ? Number(newStore.delivery_fee) : void 0,
          prep_time_minutes: newStore.prep_time_minutes ? parseInt(newStore.prep_time_minutes) : void 0,
          opening_time: newStore.opening_time || void 0,
          closing_time: newStore.closing_time || void 0,
          logo_url: newStore.logo_url.trim() || void 0,
          cover_url: newStore.cover_url.trim() || void 0,
          is_featured: newStore.is_featured
        }
      });
      toast.success("تمت إضافة المتجر وعرضه في الموقع");
      setNewStore(emptyStore);
      setAddingFor(null);
      await loadStoresFor(catId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الإضافة");
    } finally {
      setSaving(false);
    }
  }
  async function removeStore(catId, id) {
    if (!confirm("حذف المتجر نهائياً؟")) return;
    try {
      await deleteStore({
        data: {
          id
        }
      });
      toast.success("تم الحذف");
      setStoresByCat((p) => ({
        ...p,
        [catId]: (p[catId] ?? []).filter((s) => s.id !== id)
      }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحذف");
    }
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminPageHeader, { icon: Tag, eyebrow: "Categories", title: "إدارة الفئات والمتاجر", description: "كل فئة تعرض متاجرها — اضغط لعرضها أو لإضافة متجر جديد يظهر فورًا في الموقع.", actions: /* @__PURE__ */ jsxs("button", { onClick: () => setEditing({
      name_ar: "",
      name_en: "",
      slug: "",
      icon: "",
      sort_order: 0
    }), className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-95 transition", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " فئة جديدة"
    ] }) }),
    editing && /* @__PURE__ */ jsxs(Card, { className: "p-5 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "font-display font-bold", children: editing.id ? "تعديل فئة" : "فئة جديدة" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(null), className: "grid h-8 w-8 place-items-center rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "الاسم بالعربية *", children: /* @__PURE__ */ jsx("input", { value: editing.name_ar ?? "", onChange: (e) => setEditing({
          ...editing,
          name_ar: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "الاسم بالإنجليزية *", children: /* @__PURE__ */ jsx("input", { value: editing.name_en ?? "", onChange: (e) => setEditing({
          ...editing,
          name_en: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "Slug (a-z0-9-) *", children: /* @__PURE__ */ jsx("input", { value: editing.slug ?? "", onChange: (e) => setEditing({
          ...editing,
          slug: e.target.value
        }), className: inputCls, dir: "ltr" }) }),
        /* @__PURE__ */ jsx(Field, { label: "أيقونة (اختياري)", children: /* @__PURE__ */ jsx("input", { value: editing.icon ?? "", onChange: (e) => setEditing({
          ...editing,
          icon: e.target.value
        }), className: inputCls, placeholder: "مثل: pizza, shirt", dir: "ltr" }) }),
        /* @__PURE__ */ jsx(Field, { label: "ترتيب", children: /* @__PURE__ */ jsx("input", { type: "number", value: editing.sort_order ?? 0, onChange: (e) => setEditing({
          ...editing,
          sort_order: parseInt(e.target.value) || 0
        }), className: inputCls }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setEditing(null), className: "rounded-full border border-border px-4 py-2 text-sm", children: "إلغاء" }),
        /* @__PURE__ */ jsxs("button", { onClick: submitCategory, className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          " حفظ"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { children: loading ? /* @__PURE__ */ jsx(Spinner, {}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Tag, title: "لا توجد فئات بعد", hint: "أضف أول فئة من الزر أعلاه." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: rows.map((c) => {
      const isOpen = openId === c.id;
      const stores = storesByCat[c.id];
      return /* @__PURE__ */ jsxs("li", { className: "p-3 sm:p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg sm:rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-bold tabular-nums shrink-0", children: c.sort_order }),
          /* @__PURE__ */ jsxs("button", { onClick: () => toggleOpen(c.id), className: "min-w-0 flex-1 text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate", children: c.name_ar }),
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] sm:text-xs text-muted-foreground hidden sm:inline", children: [
                "/ ",
                c.name_en
              ] }),
              stores && /* @__PURE__ */ jsxs("span", { className: "text-[10px] rounded-full bg-secondary border border-border px-2 py-0.5 text-muted-foreground shrink-0", children: [
                stores.length,
                " متجر"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] sm:text-[11px] text-muted-foreground truncate", dir: "ltr", children: [
              c.slug,
              c.icon ? ` · ${c.icon}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => toggleOpen(c.id), className: "grid h-8 w-8 place-items-center rounded-full border border-border hover:border-primary/40 hover:text-primary transition shrink-0", "aria-label": "عرض المتاجر", children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setEditing(c), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition shrink-0", children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => removeCategory(c.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition shrink-0", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }),
        isOpen && /* @__PURE__ */ jsxs("div", { className: "mt-3 sm:mt-4 ms-0 sm:ms-12 rounded-2xl border border-border bg-background/40 p-2.5 sm:p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-3 flex-wrap", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-muted-foreground", children: "متاجر هذه الفئة" }),
            addingFor !== c.id && /* @__PURE__ */ jsxs("button", { onClick: () => {
              setAddingFor(c.id);
              setNewStore(emptyStore);
            }, className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-95 transition", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " إضافة متجر"
            ] })
          ] }),
          addingFor === c.id && /* @__PURE__ */ jsxs("div", { className: "mb-4 rounded-xl border border-border bg-card p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: [
              /* @__PURE__ */ jsx(Field, { label: "اسم المتجر (عربي) *", children: /* @__PURE__ */ jsx("input", { value: newStore.name_ar, onChange: (e) => setNewStore({
                ...newStore,
                name_ar: e.target.value
              }), className: inputCls }) }),
              /* @__PURE__ */ jsx(Field, { label: "الاسم (إنجليزي)", children: /* @__PURE__ */ jsx("input", { value: newStore.name_en, onChange: (e) => setNewStore({
                ...newStore,
                name_en: e.target.value
              }), className: inputCls, dir: "ltr" }) }),
              /* @__PURE__ */ jsx(Field, { label: "العنوان *", children: /* @__PURE__ */ jsx("input", { value: newStore.address, onChange: (e) => setNewStore({
                ...newStore,
                address: e.target.value
              }), className: inputCls }) }),
              /* @__PURE__ */ jsx(Field, { label: "الاسم القانوني / السجل التجاري", children: /* @__PURE__ */ jsx("input", { value: newStore.legal_name, onChange: (e) => setNewStore({
                ...newStore,
                legal_name: e.target.value
              }), className: inputCls }) }),
              /* @__PURE__ */ jsx(Field, { label: "رسوم التوصيل (ج.م)", children: /* @__PURE__ */ jsx("input", { type: "number", min: "0", step: "1", value: newStore.delivery_fee, onChange: (e) => setNewStore({
                ...newStore,
                delivery_fee: e.target.value
              }), className: inputCls, dir: "ltr" }) }),
              /* @__PURE__ */ jsx(Field, { label: "وقت التحضير (دقيقة)", children: /* @__PURE__ */ jsx("input", { type: "number", min: "0", step: "1", value: newStore.prep_time_minutes, onChange: (e) => setNewStore({
                ...newStore,
                prep_time_minutes: e.target.value
              }), className: inputCls, dir: "ltr" }) }),
              /* @__PURE__ */ jsx(Field, { label: "موعد الفتح", children: /* @__PURE__ */ jsx("input", { type: "time", value: newStore.opening_time, onChange: (e) => setNewStore({
                ...newStore,
                opening_time: e.target.value
              }), className: inputCls, dir: "ltr" }) }),
              /* @__PURE__ */ jsx(Field, { label: "موعد الإغلاق", children: /* @__PURE__ */ jsx("input", { type: "time", value: newStore.closing_time, onChange: (e) => setNewStore({
                ...newStore,
                closing_time: e.target.value
              }), className: inputCls, dir: "ltr" }) }),
              /* @__PURE__ */ jsx(Field, { label: "شعار المتجر", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => logoInputRef.current?.click(), className: "relative h-16 w-16 rounded-xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition bg-secondary/30 shrink-0", children: newStore.logo_url ? /* @__PURE__ */ jsx("img", { src: newStore.logo_url, alt: "", className: "absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-muted-foreground", children: logoUploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(ImagePlus, { className: "h-4 w-4" }) }) }),
                newStore.logo_url && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setNewStore({
                  ...newStore,
                  logo_url: ""
                }), className: "text-xs text-destructive hover:underline", children: "إزالة" }),
                /* @__PURE__ */ jsx("input", { ref: logoInputRef, type: "file", accept: "image/*", className: "hidden", onChange: async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadStoreImage(f, "logo");
                  if (url) setNewStore((s) => ({
                    ...s,
                    logo_url: url
                  }));
                  e.target.value = "";
                } })
              ] }) }),
              /* @__PURE__ */ jsx(Field, { label: "صورة الغلاف", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => coverInputRef.current?.click(), className: "relative h-16 w-28 rounded-xl overflow-hidden border border-dashed border-border hover:border-primary/50 transition bg-secondary/30 shrink-0", children: newStore.cover_url ? /* @__PURE__ */ jsx("img", { src: newStore.cover_url, alt: "", className: "absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-items-center text-muted-foreground", children: coverUploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(ImagePlus, { className: "h-4 w-4" }) }) }),
                newStore.cover_url && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setNewStore({
                  ...newStore,
                  cover_url: ""
                }), className: "text-xs text-destructive hover:underline", children: "إزالة" }),
                /* @__PURE__ */ jsx("input", { ref: coverInputRef, type: "file", accept: "image/*", className: "hidden", onChange: async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await uploadStoreImage(f, "cover");
                  if (url) setNewStore((s) => ({
                    ...s,
                    cover_url: url
                  }));
                  e.target.value = "";
                } })
              ] }) }),
              /* @__PURE__ */ jsx(Field, { label: "الوصف", children: /* @__PURE__ */ jsx("textarea", { value: newStore.description_ar, onChange: (e) => setNewStore({
                ...newStore,
                description_ar: e.target.value
              }), className: `${inputCls} min-h-[72px] resize-y` }) })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "mt-3 flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: newStore.is_featured, onChange: (e) => setNewStore({
                ...newStore,
                is_featured: e.target.checked
              }) }),
              "عرض ضمن المتاجر المميزة"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setAddingFor(null), className: "rounded-full border border-border px-3 py-1.5 text-xs", children: "إلغاء" }),
              /* @__PURE__ */ jsxs("button", { onClick: () => submitNewStore(c.id), disabled: saving || logoUploading || coverUploading, className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium disabled:opacity-60", children: [
                /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }),
                " ",
                saving ? "جارٍ الحفظ..." : "حفظ ونشر"
              ] })
            ] })
          ] }),
          loadingStoresFor === c.id ? /* @__PURE__ */ jsx(Spinner, {}) : !stores ? null : stores.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-6 text-center text-xs text-muted-foreground", children: "لا توجد متاجر في هذه الفئة بعد." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-border", children: stores.map((s) => /* @__PURE__ */ jsxs("li", { className: "py-2.5 flex items-center gap-2 sm:gap-3", children: [
            s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: "", className: "h-10 w-10 rounded-xl object-cover border border-border shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-secondary grid place-items-center text-muted-foreground shrink-0", children: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
                  slug: s.slug
                }, className: "font-semibold text-sm hover:text-primary truncate max-w-full", children: s.name_ar }),
                /* @__PURE__ */ jsx(StatusBadge, { status: s.status }),
                s.is_featured && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 text-[10px] font-bold", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-primary" }),
                  " مميز"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] sm:text-[11px] text-muted-foreground truncate", children: [
                s.address,
                s.phone ? ` · ${s.phone}` : "",
                " · ⭐ ",
                Number(s.rating).toFixed(1),
                " (",
                s.rating_count,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/stores/$slug", params: {
              slug: s.slug
            }, className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary transition shrink-0", "aria-label": "فتح", children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => removeStore(c.id, s.id), className: "grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive transition shrink-0", "aria-label": "حذف", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }, s.id)) })
        ] })
      ] }, c.id);
    }) }) })
  ] });
}
const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-semibold text-muted-foreground mb-1", children: label }),
    children
  ] });
}
export {
  CategoriesAdmin as component
};
