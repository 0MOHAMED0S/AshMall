import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { getCategoryBySlug, listStores } from "@/lib/stores.functions";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StoreCard } from "@/components/ash/StoreCard";
import { ArrowRight } from "lucide-react";

// Sub-categories per main category slug. Matched against store tags / name / description.
const SUBCATEGORIES: Record<string, { key: string; label: string; match: string[] }[]> = {
  fashion: [
    { key: "men", label: "شبابي", match: ["شبابي", "رجالي", "men", "man", "male"] },
    { key: "women", label: "بناتي", match: ["بناتي", "حريمي", "نسائي", "women", "woman", "female"] },
    { key: "kids", label: "أطفال", match: ["اطفال", "أطفال", "kids", "child", "children", "baby"] },
  ],
};

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const { category } = await getCategoryBySlug({ data: { slug: params.slug } });
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category?.name_ar ?? "فئة"} في أشمون — آش مول` },
      { name: "description", content: `كل ${loaderData?.category?.name_ar} الموثّقة في مدينة أشمون.` },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center" dir="rtl">
      <div className="text-center"><h1 className="font-display text-3xl font-bold">الفئة غير موجودة</h1><Link to="/" className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm">الرئيسية</Link></div>
    </div>
  ),
  errorComponent: () => <div className="min-h-screen grid place-items-center"><p className="text-muted-foreground">حدث خطأ ما.</p></div>,
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const fetchStores = useServerFn(listStores);
  const { data, isLoading } = useQuery({
    queryKey: ["stores", "cat", category.slug],
    queryFn: () => fetchStores({ data: { categorySlug: category.slug, limit: 48 } }),
  });
  const stores = data?.stores ?? [];

  const subs = SUBCATEGORIES[category.slug] ?? [];
  const [activeSub, setActiveSub] = useState<string>("all");
  const filteredStores = useMemo(() => {
    if (!subs.length || activeSub === "all") return stores;
    const sub = subs.find((s) => s.key === activeSub);
    if (!sub) return stores;
    const needles = sub.match.map((m) => m.toLowerCase());
    return stores.filter((s: any) => {
      const hay = [
        ...(s.tags ?? []),
        s.name_ar ?? "",
        s.name_en ?? "",
        s.description_ar ?? "",
      ].join(" ").toLowerCase();
      return needles.some((n) => hay.includes(n));
    });
  }, [stores, subs, activeSub]);

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-36 lg:pt-40 pb-20 mx-auto max-w-6xl px-5 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowRight className="h-4 w-4" /> الرئيسية
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft border border-primary/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase shadow-[var(--shadow-chip)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> فئة
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-primary/30 via-border to-transparent" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-gradient-soft leading-[1.4] py-1">{category.name_ar}</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground pr-4">كل متاجر فئة {category.name_ar} الموثّقة في أشمون.</p>

        {subs.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSub("all")}
              className={`rounded-full px-4 py-2 text-xs font-bold border transition ${activeSub === "all" ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]" : "bg-card text-foreground/80 border-border hover:border-primary/40"}`}
            >
              الكل
            </button>
            {subs.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSub(s.key)}
                className={`rounded-full px-4 py-2 text-xs font-bold border transition ${activeSub === s.key ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]" : "bg-card text-foreground/80 border-border hover:border-primary/40"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card rounded-3xl h-80 shimmer" />)}
          {!isLoading && filteredStores.length === 0 && (
            <div className="col-span-full glass-card rounded-3xl p-12 text-center text-sm text-muted-foreground">لا توجد متاجر في هذه الفئة بعد.</div>
          )}
          {filteredStores.map((s) => <StoreCard key={s.id} s={s} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
