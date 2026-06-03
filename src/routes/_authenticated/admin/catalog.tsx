import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Boxes, Store as StoreIcon, Search, Plus, Trash2, Save, X, ChevronDown,
  ChevronUp, Shirt, UtensilsCrossed, Package, ImagePlus, Loader2, Tag,
  Palette, Ruler, Star, Edit2,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminListStoresLite, adminGetStoreCatalog,
  adminUpsertSection, adminDeleteSection,
  adminUpsertProduct, adminDeleteProductFull,
  adminUpsertVariant, adminDeleteVariant,
  adminUpsertExtra, adminDeleteExtra,
} from "@/lib/catalog.functions";
import { AdminPageHeader, Card, Spinner, EmptyState } from "@/components/ash/AdminUI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/admin/catalog")({
  component: CatalogAdmin,
});

type ProductType = "general" | "clothing" | "food";
interface StoreLite { id: string; name_ar: string; slug: string; status: string; logo_url: string | null; categories: { name_ar: string; slug: string } | null }
interface Section { id: string; store_id: string; name_ar: string; name_en: string | null; icon: string | null; sort_order: number }
interface Product {
  id: string; store_id: string; section_id: string | null; product_type: ProductType;
  name_ar: string; description_ar: string | null; price: number | null; compare_at_price: number | null;
  image_url: string | null; image_url_extra: string | null; stock: number | null; sku: string | null;
  is_available: boolean; sort_order: number; currency: string;
}
interface Variant { id: string; product_id: string; size: string | null; color: string | null; color_hex: string | null; sku: string | null; price: number | null; stock: number; image_url: string | null; sort_order: number }
interface Extra { id: string; product_id: string; name_ar: string; price: number; is_required: boolean; sort_order: number }

const TYPE_LABELS: Record<ProductType, { label: string; icon: typeof Package; hint: string }> = {
  general: { label: "منتج عام", icon: Package, hint: "سعر + صورة + وصف" },
  clothing: { label: "ملابس / إكسسوار", icon: Shirt, hint: "مقاسات + ألوان + مخزون لكل تركيبة" },
  food: { label: "طعام / منيو", icon: UtensilsCrossed, hint: "صنف منيو + إضافات اختيارية" },
};

// Smart auto-detect based on category slug
function detectType(categorySlug?: string | null): ProductType {
  const s = (categorySlug ?? "").toLowerCase();
  if (/restaurant|food|bakery|cafe|sweet|مطعم/.test(s)) return "food";
  if (/cloth|fashion|shoe|bag|kid|men|women|ملابس|أزياء/.test(s)) return "clothing";
  return "general";
}

function CatalogAdmin() {
  const listStores = useServerFn(adminListStoresLite);
  const getCatalog = useServerFn(adminGetStoreCatalog);

  const [stores, setStores] = useState<StoreLite[]>([]);
  const [storeQ, setStoreQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => { void reloadStores(); }, []);
  async function reloadStores() {
    try { const r = await listStores({ data: { q: storeQ || undefined } }); setStores(r.stores as StoreLite[]); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحميل"); }
  }

  const [catalog, setCatalog] = useState<{ sections: Section[]; products: Product[]; variants: Variant[]; extras: Extra[] } | null>(null);
  const [loadingCat, setLoadingCat] = useState(false);

  async function reloadCatalog(id: string) {
    setLoadingCat(true);
    try {
      const r = await getCatalog({ data: { store_id: id } });
      setCatalog({
        sections: r.sections as Section[],
        products: r.products as Product[],
        variants: r.variants as Variant[],
        extras: r.extras as Extra[],
      });
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل التحميل"); }
    finally { setLoadingCat(false); }
  }

  useEffect(() => { if (selectedId) void reloadCatalog(selectedId); else setCatalog(null); }, [selectedId]);

  const selectedStore = useMemo(() => stores.find((s) => s.id === selectedId) ?? null, [stores, selectedId]);
  const defaultType: ProductType = detectType(selectedStore?.categories?.slug);

  return (
    <div>
      <AdminPageHeader
        icon={Boxes}
        eyebrow="Catalog"
        title="إدارة المنتجات الذكية"
        description="اختر محلًا، أضف أقسام داخلية وضع منتجاته بنظام ذكي حسب النوع (ملابس بمقاسات وألوان، منيو مطعم بإضافات، أو منتجات عامة)."
      />

      {!selectedId && (
        <Card className="p-3 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={storeQ} onChange={(e) => setStoreQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && reloadStores()}
                placeholder="ابحث عن محل..."
                className="w-full rounded-xl border border-border bg-background pr-9 pl-3 py-2 text-sm focus:border-primary outline-none" />
            </div>
            <button onClick={reloadStores} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">بحث</button>
          </div>
          {stores.length === 0 ? (
            <EmptyState icon={StoreIcon} title="لا يوجد محلات" hint="أنشئ محلات أولًا من صفحة الفئات." />
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {stores.map((s) => {
                const t = detectType(s.categories?.slug);
                const TIcon = TYPE_LABELS[t].icon;
                return (
                  <li key={s.id}>
                    <button onClick={() => setSelectedId(s.id)}
                      className="w-full text-right rounded-2xl border border-border bg-background hover:border-primary/50 hover:bg-secondary/40 transition p-3 flex items-center gap-3">
                      {s.logo_url ? (
                        <img src={s.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover border border-border shrink-0" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center text-muted-foreground shrink-0"><StoreIcon className="h-5 w-5" /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate">{s.name_ar}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{s.categories?.name_ar ?? "—"} · {s.status}</div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-1 text-[10px] font-bold shrink-0">
                        <TIcon className="h-3 w-3" /> {TYPE_LABELS[t].label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      {selectedId && (
        <>
          <Card className="p-3 mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              {selectedStore?.logo_url ? (
                <img src={selectedStore.logo_url} alt="" className="h-10 w-10 rounded-xl object-cover border border-border" />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center text-muted-foreground"><StoreIcon className="h-4 w-4" /></div>
              )}
              <div className="min-w-0">
                <div className="font-bold truncate">{selectedStore?.name_ar ?? "..."}</div>
                <div className="text-[11px] text-muted-foreground truncate">{selectedStore?.categories?.name_ar ?? "—"} · النوع المقترح: {TYPE_LABELS[defaultType].label}</div>
              </div>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-xs rounded-full border border-border px-3 py-1.5 hover:bg-secondary">تغيير المحل</button>
          </Card>

          {loadingCat || !catalog ? <Spinner /> : (
            <CatalogEditor
              storeId={selectedId}
              defaultType={defaultType}
              catalog={catalog}
              onReload={() => reloadCatalog(selectedId)}
            />
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// Editor
// ============================================================
function CatalogEditor({ storeId, defaultType, catalog, onReload }: {
  storeId: string;
  defaultType: ProductType;
  catalog: { sections: Section[]; products: Product[]; variants: Variant[]; extras: Extra[] };
  onReload: () => void | Promise<void>;
}) {
  const upsertSection = useServerFn(adminUpsertSection);
  const deleteSection = useServerFn(adminDeleteSection);
  const deleteProduct = useServerFn(adminDeleteProductFull);

  const [editSection, setEditSection] = useState<Partial<Section> | null>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  async function saveSection() {
    if (!editSection?.name_ar?.trim()) return;
    try {
      await upsertSection({ data: {
        id: editSection.id,
        store_id: storeId,
        name_ar: editSection.name_ar.trim(),
        name_en: editSection.name_en ?? undefined,
        icon: editSection.icon ?? undefined,
        sort_order: editSection.sort_order ?? 0,
      } });
      toast.success("تم حفظ القسم");
      setEditSection(null);
      await onReload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
  }
  async function removeSection(id: string) {
    if (!confirm("حذف القسم؟ المنتجات اللي بداخله هتفضل بس بدون قسم.")) return;
    try { await deleteSection({ data: { id } }); toast.success("تم الحذف"); await onReload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }
  async function removeProduct(id: string) {
    if (!confirm("حذف المنتج وكل تشكيلاته وإضافاته؟")) return;
    try { await deleteProduct({ data: { id } }); toast.success("تم الحذف"); await onReload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  const productsBySection = useMemo(() => {
    const m = new Map<string | "_none", Product[]>();
    for (const p of catalog.products) {
      const k = p.section_id ?? "_none";
      m.set(k, [...(m.get(k) ?? []), p]);
    }
    return m;
  }, [catalog.products]);

  return (
    <>
      {/* SECTIONS */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /><span className="font-bold">الأقسام الداخلية ({catalog.sections.length})</span></div>
          <button onClick={() => setEditSection({ name_ar: "", sort_order: catalog.sections.length })}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium">
            <Plus className="h-3.5 w-3.5" /> قسم جديد
          </button>
        </div>

        {editSection && (
          <div className="mb-3 rounded-xl border border-border bg-background p-3 grid grid-cols-1 sm:grid-cols-[1fr_120px_auto_auto] gap-2 items-end">
            <Field label="اسم القسم *">
              <input autoFocus value={editSection.name_ar ?? ""} onChange={(e) => setEditSection({ ...editSection, name_ar: e.target.value })} className={inputCls} placeholder="مثال: المقبلات / مجموعة الشتاء" />
            </Field>
            <Field label="ترتيب">
              <input type="number" value={editSection.sort_order ?? 0} onChange={(e) => setEditSection({ ...editSection, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
            </Field>
            <button onClick={saveSection} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold"><Save className="h-3.5 w-3.5" /> حفظ</button>
            <button onClick={() => setEditSection(null)} className="rounded-full border border-border px-4 py-2 text-xs">إلغاء</button>
          </div>
        )}

        {catalog.sections.length === 0 ? (
          <div className="text-xs text-muted-foreground py-3 text-center">لا أقسام بعد. هتقدر تضيف منتجات بدون أقسام برضه.</div>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {catalog.sections.map((s) => (
              <li key={s.id} className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs">
                <span className="font-semibold">{s.name_ar}</span>
                <span className="text-muted-foreground">({productsBySection.get(s.id)?.length ?? 0})</span>
                <button onClick={() => setEditSection(s)} className="grid place-items-center h-5 w-5 rounded-full hover:bg-background"><Edit2 className="h-3 w-3" /></button>
                <button onClick={() => removeSection(s.id)} className="grid place-items-center h-5 w-5 rounded-full hover:bg-destructive/10 text-destructive"><Trash2 className="h-3 w-3" /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* PRODUCTS */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2"><Boxes className="h-4 w-4 text-primary" /><span className="font-bold">المنتجات ({catalog.products.length})</span></div>
          <button
            onClick={() => setEditProduct({
              store_id: storeId, product_type: defaultType, name_ar: "",
              is_available: true, sort_order: catalog.products.length,
              section_id: catalog.sections[0]?.id ?? null,
            })}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium">
            <Plus className="h-3.5 w-3.5" /> منتج جديد
          </button>
        </div>

        {editProduct && (
          <ProductForm
            initial={editProduct}
            sections={catalog.sections}
            onCancel={() => setEditProduct(null)}
            onSaved={async () => { setEditProduct(null); await onReload(); }}
          />
        )}

        {catalog.products.length === 0 ? (
          <EmptyState icon={Boxes} title="لا توجد منتجات بعد" hint="اضغط منتج جديد لإضافة أول منتج." />
        ) : (
          <div className="space-y-4 mt-2">
            {Array.from(productsBySection.entries()).map(([sectionKey, prods]) => {
              const section = sectionKey === "_none" ? null : catalog.sections.find((s) => s.id === sectionKey);
              return (
                <div key={sectionKey}>
                  <div className="text-xs font-bold text-muted-foreground mb-2 pb-1 border-b border-border">
                    {section?.name_ar ?? "بدون قسم"} · {prods.length}
                  </div>
                  <ul className="divide-y divide-border">
                    {prods.map((p) => {
                      const isOpen = openProductId === p.id;
                      const vCount = catalog.variants.filter((v) => v.product_id === p.id).length;
                      const eCount = catalog.extras.filter((e) => e.product_id === p.id).length;
                      const TIcon = TYPE_LABELS[p.product_type].icon;
                      return (
                        <li key={p.id} className="py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-12 w-12 rounded-xl bg-secondary border border-border overflow-hidden shrink-0">
                              {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-sm truncate">{p.name_ar}</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 text-[10px] font-bold"><TIcon className="h-3 w-3" /> {TYPE_LABELS[p.product_type].label}</span>
                                {!p.is_available && <span className="rounded-full bg-muted text-muted-foreground px-1.5 py-0.5 text-[10px]">مخفي</span>}
                              </div>
                              <div className="text-[11px] text-muted-foreground tabular-nums" dir="ltr">
                                {p.price != null ? `${p.price} ${p.currency}` : "—"}
                                {p.compare_at_price ? ` · قبل: ${p.compare_at_price}` : ""}
                                {p.product_type === "clothing" && ` · ${vCount} تركيبة`}
                                {p.product_type === "food" && ` · ${eCount} إضافة`}
                              </div>
                            </div>
                            {(p.product_type === "clothing" || p.product_type === "food") && (
                              <button onClick={() => setOpenProductId(isOpen ? null : p.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary">
                                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            )}
                            <button onClick={() => setEditProduct(p)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-primary/40 hover:text-primary"><Edit2 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => removeProduct(p.id)} className="grid place-items-center h-8 w-8 rounded-full border border-border hover:border-destructive/40 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>

                          {isOpen && p.product_type === "clothing" && (
                            <VariantsEditor productId={p.id} variants={catalog.variants.filter((v) => v.product_id === p.id)} onReload={onReload} />
                          )}
                          {isOpen && p.product_type === "food" && (
                            <ExtrasEditor productId={p.id} extras={catalog.extras.filter((e) => e.product_id === p.id)} onReload={onReload} />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}

// ============================================================
// Product form (smart: changes shape based on product_type)
// ============================================================
function ProductForm({ initial, sections, onCancel, onSaved }: {
  initial: Partial<Product>;
  sections: Section[];
  onCancel: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const upsert = useServerFn(adminUpsertProduct);
  const { user } = useAuth();
  const [p, setP] = useState<Partial<Product>>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    if (!user) { toast.error("سجل دخول أولاً"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("الحجم الأقصى 5MB"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/product-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("store-media").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("store-media").getPublicUrl(path);
      setP((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (e) { toast.error("فشل الرفع: " + (e as Error).message); }
    finally { setUploading(false); }
  }

  async function submit() {
    if (!p.name_ar?.trim()) { toast.error("الاسم مطلوب"); return; }
    setSaving(true);
    try {
      await upsert({ data: {
        id: p.id,
        store_id: p.store_id!,
        section_id: p.section_id ?? null,
        product_type: (p.product_type ?? "general") as ProductType,
        name_ar: p.name_ar.trim(),
        description_ar: p.description_ar ?? null,
        price: p.price ?? null,
        compare_at_price: p.compare_at_price ?? null,
        image_url: p.image_url ?? "",
        image_url_extra: p.image_url_extra ?? "",
        stock: p.stock ?? null,
        sku: p.sku ?? null,
        is_available: p.is_available ?? true,
        sort_order: p.sort_order ?? 0,
      } });
      toast.success("تم الحفظ");
      await onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
    finally { setSaving(false); }
  }

  const type = (p.product_type ?? "general") as ProductType;

  return (
    <div className="mb-4 rounded-2xl border-2 border-primary/30 bg-background p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-bold">{p.id ? "تعديل منتج" : "منتج جديد"}</div>
        <button onClick={onCancel} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
      </div>

      {/* Type picker */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(Object.keys(TYPE_LABELS) as ProductType[]).map((t) => {
          const TIcon = TYPE_LABELS[t].icon;
          const active = type === t;
          return (
            <button key={t} type="button" onClick={() => setP({ ...p, product_type: t })}
              className={`rounded-2xl border p-3 text-right transition ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
              <div className="flex items-center gap-2 mb-1"><TIcon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} /><span className="font-bold text-xs">{TYPE_LABELS[t].label}</span></div>
              <div className="text-[10px] text-muted-foreground">{TYPE_LABELS[t].hint}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="اسم المنتج *">
          <input value={p.name_ar ?? ""} onChange={(e) => setP({ ...p, name_ar: e.target.value })} className={inputCls} />
        </Field>
        <Field label="القسم">
          <select value={p.section_id ?? ""} onChange={(e) => setP({ ...p, section_id: e.target.value || null })} className={inputCls}>
            <option value="">— بدون قسم —</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
          </select>
        </Field>
        <Field label={type === "clothing" ? "السعر الأساسي (يتغيّر حسب التركيبة)" : "السعر"}>
          <input type="number" step="0.01" value={p.price ?? ""} onChange={(e) => setP({ ...p, price: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} dir="ltr" />
        </Field>
        <Field label="السعر قبل الخصم (اختياري)">
          <input type="number" step="0.01" value={p.compare_at_price ?? ""} onChange={(e) => setP({ ...p, compare_at_price: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} dir="ltr" />
        </Field>

        {type === "general" && (
          <Field label="المخزون (اختياري)">
            <input type="number" value={p.stock ?? ""} onChange={(e) => setP({ ...p, stock: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} dir="ltr" />
          </Field>
        )}

        <Field label="صورة المنتج">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="relative h-20 w-20 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition bg-secondary/30 shrink-0">
              {p.image_url ? <img src={p.image_url} className="absolute inset-0 h-full w-full object-cover" /> : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-5 w-5" />}</div>
              )}
            </button>
            {p.image_url && <button type="button" onClick={() => setP({ ...p, image_url: null })} className="text-xs text-destructive hover:underline">إزالة</button>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadImage(f); e.target.value = ""; }} />
          </div>
        </Field>

        <Field label="الوصف">
          <textarea value={p.description_ar ?? ""} onChange={(e) => setP({ ...p, description_ar: e.target.value })} className={`${inputCls} min-h-[72px] resize-y`} />
        </Field>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs">
        <input type="checkbox" checked={p.is_available ?? true} onChange={(e) => setP({ ...p, is_available: e.target.checked })} />
        ظاهر للعملاء
      </label>

      {type !== "general" && (
        <div className="mt-3 text-[11px] text-muted-foreground bg-secondary/50 rounded-xl p-2.5">
          💡 احفظ المنتج الأول، وبعدين هتقدر تضيف {type === "clothing" ? "المقاسات والألوان والمخزون" : "الإضافات الاختيارية"} من زر السهم بجانب المنتج.
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm">إلغاء</button>
        <button onClick={submit} disabled={saving || uploading} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? "حفظ..." : "حفظ"}</button>
      </div>
    </div>
  );
}

// ============================================================
// Variants editor (clothing)
// ============================================================
function VariantsEditor({ productId, variants, onReload }: { productId: string; variants: Variant[]; onReload: () => void | Promise<void> }) {
  const upsert = useServerFn(adminUpsertVariant);
  const del = useServerFn(adminDeleteVariant);
  const [draft, setDraft] = useState<Partial<Variant> | null>(null);

  async function save() {
    if (!draft) return;
    if (!draft.size && !draft.color) { toast.error("أدخل مقاس أو لون على الأقل"); return; }
    try {
      await upsert({ data: {
        id: draft.id,
        product_id: productId,
        size: draft.size ?? null,
        color: draft.color ?? null,
        color_hex: draft.color_hex || "",
        sku: draft.sku ?? null,
        price: draft.price ?? null,
        stock: draft.stock ?? 0,
        image_url: draft.image_url || "",
        sort_order: draft.sort_order ?? 0,
      } });
      toast.success("تم الحفظ");
      setDraft(null);
      await onReload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
  }
  async function remove(id: string) {
    if (!confirm("حذف التركيبة؟")) return;
    try { await del({ data: { id } }); await onReload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div className="mt-3 ms-14 rounded-xl bg-secondary/40 border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> المقاسات والألوان ({variants.length})</div>
        {!draft && (
          <button onClick={() => setDraft({ stock: 0 })} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[11px] font-semibold"><Plus className="h-3 w-3" /> تركيبة</button>
        )}
      </div>

      {draft && (
        <div className="mb-2 grid grid-cols-2 sm:grid-cols-6 gap-2 items-end rounded-lg bg-background p-2 border border-border">
          <input placeholder="مقاس (M)" value={draft.size ?? ""} onChange={(e) => setDraft({ ...draft, size: e.target.value })} className={inputXs} />
          <input placeholder="لون" value={draft.color ?? ""} onChange={(e) => setDraft({ ...draft, color: e.target.value })} className={inputXs} />
          <input type="color" value={draft.color_hex ?? "#000000"} onChange={(e) => setDraft({ ...draft, color_hex: e.target.value })} className="h-8 w-full rounded border border-border" />
          <input type="number" step="0.01" placeholder="سعر" value={draft.price ?? ""} onChange={(e) => setDraft({ ...draft, price: e.target.value === "" ? null : Number(e.target.value) })} className={inputXs} dir="ltr" />
          <input type="number" placeholder="مخزون" value={draft.stock ?? 0} onChange={(e) => setDraft({ ...draft, stock: parseInt(e.target.value) || 0 })} className={inputXs} dir="ltr" />
          <div className="flex gap-1">
            <button onClick={save} className="flex-1 rounded-md bg-primary text-primary-foreground px-2 py-1 text-[11px] font-semibold">حفظ</button>
            <button onClick={() => setDraft(null)} className="rounded-md border border-border px-2 py-1 text-[11px]">×</button>
          </div>
        </div>
      )}

      {variants.length === 0 ? (
        <div className="text-[11px] text-muted-foreground py-2 text-center">لا توجد تركيبات بعد.</div>
      ) : (
        <ul className="divide-y divide-border/70">
          {variants.map((v) => (
            <li key={v.id} className="py-1.5 flex items-center gap-2 text-xs">
              {v.color_hex && <span className="h-4 w-4 rounded-full border border-border shrink-0" style={{ background: v.color_hex }} />}
              <span className="font-semibold">{v.size || "—"}</span>
              <span className="text-muted-foreground">{v.color || ""}</span>
              <span className="ms-auto tabular-nums" dir="ltr">{v.price != null ? `${v.price}` : "—"}</span>
              <span className="text-muted-foreground tabular-nums">مخزون: {v.stock}</span>
              <button onClick={() => setDraft(v)} className="grid place-items-center h-6 w-6 rounded-full hover:bg-background"><Edit2 className="h-3 w-3" /></button>
              <button onClick={() => remove(v.id)} className="grid place-items-center h-6 w-6 rounded-full hover:bg-destructive/10 text-destructive"><Trash2 className="h-3 w-3" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// Extras editor (food)
// ============================================================
function ExtrasEditor({ productId, extras, onReload }: { productId: string; extras: Extra[]; onReload: () => void | Promise<void> }) {
  const upsert = useServerFn(adminUpsertExtra);
  const del = useServerFn(adminDeleteExtra);
  const [draft, setDraft] = useState<Partial<Extra> | null>(null);

  async function save() {
    if (!draft?.name_ar?.trim()) { toast.error("اسم الإضافة مطلوب"); return; }
    try {
      await upsert({ data: {
        id: draft.id,
        product_id: productId,
        name_ar: draft.name_ar.trim(),
        price: draft.price ?? 0,
        is_required: draft.is_required ?? false,
        sort_order: draft.sort_order ?? 0,
      } });
      toast.success("تم الحفظ");
      setDraft(null);
      await onReload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحفظ"); }
  }
  async function remove(id: string) {
    if (!confirm("حذف الإضافة؟")) return;
    try { await del({ data: { id } }); await onReload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "فشل الحذف"); }
  }

  return (
    <div className="mt-3 ms-14 rounded-xl bg-secondary/40 border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold flex items-center gap-1.5"><UtensilsCrossed className="h-3.5 w-3.5" /> الإضافات ({extras.length})</div>
        {!draft && (
          <button onClick={() => setDraft({ price: 0 })} className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[11px] font-semibold"><Plus className="h-3 w-3" /> إضافة</button>
        )}
      </div>

      {draft && (
        <div className="mb-2 grid grid-cols-2 sm:grid-cols-5 gap-2 items-end rounded-lg bg-background p-2 border border-border">
          <input placeholder="اسم (جبنة إضافية)" value={draft.name_ar ?? ""} onChange={(e) => setDraft({ ...draft, name_ar: e.target.value })} className={`${inputXs} col-span-2`} />
          <input type="number" step="0.01" placeholder="سعر" value={draft.price ?? 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })} className={inputXs} dir="ltr" />
          <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={draft.is_required ?? false} onChange={(e) => setDraft({ ...draft, is_required: e.target.checked })} /> إجباري</label>
          <div className="flex gap-1">
            <button onClick={save} className="flex-1 rounded-md bg-primary text-primary-foreground px-2 py-1 text-[11px] font-semibold">حفظ</button>
            <button onClick={() => setDraft(null)} className="rounded-md border border-border px-2 py-1 text-[11px]">×</button>
          </div>
        </div>
      )}

      {extras.length === 0 ? (
        <div className="text-[11px] text-muted-foreground py-2 text-center">لا توجد إضافات بعد.</div>
      ) : (
        <ul className="divide-y divide-border/70">
          {extras.map((x) => (
            <li key={x.id} className="py-1.5 flex items-center gap-2 text-xs">
              <span className="font-semibold">{x.name_ar}</span>
              {x.is_required && <span className="text-[10px] rounded-full bg-destructive/10 text-destructive px-1.5">إجباري</span>}
              <span className="ms-auto tabular-nums" dir="ltr">+{x.price}</span>
              <button onClick={() => setDraft(x)} className="grid place-items-center h-6 w-6 rounded-full hover:bg-background"><Edit2 className="h-3 w-3" /></button>
              <button onClick={() => remove(x.id)} className="grid place-items-center h-6 w-6 rounded-full hover:bg-destructive/10 text-destructive"><Trash2 className="h-3 w-3" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary outline-none";
const inputXs = "w-full rounded-md border border-border bg-background px-2 py-1 text-xs focus:border-primary outline-none";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[11px] font-semibold text-muted-foreground mb-1">{label}</span>{children}</label>;
}
