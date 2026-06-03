import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listStores } from "@/lib/stores.functions";
import { StoreCard } from "@/components/ash/StoreCard";

export const Route = createFileRoute("/stores")({
  component: StoresPage,
  head: () => ({
    meta: [
      { title: "كل المتاجر — آش مول" },
      { name: "description", content: "تصفّح كل المتاجر الموثّقة في مدينة أشمون." },
      { property: "og:title", content: "كل المتاجر — آش مول" },
    ],
  }),
});

function StoresPage() {
  const { pathname } = useLocation();
  const fetchStores = useServerFn(listStores);
  const { data, isLoading } = useQuery({ queryKey: ["stores", "all"], queryFn: () => fetchStores({ data: { limit: 60 } }) });
  const stores = data?.stores ?? [];
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPathname !== "/stores") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />
      <main className="pt-36 sm:pt-40 pb-20 mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft border border-primary/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase shadow-[var(--shadow-chip)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> المتاجر
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-primary/30 via-border to-transparent" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient-soft leading-[1.4] py-1">كل متاجر أشمون</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground pr-4">المتاجر الموثّقة فقط بعنوان فعلي داخل أشمون.</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card rounded-3xl h-80 shimmer" />)}
          {!isLoading && stores.length === 0 && (
            <div className="col-span-full glass-card rounded-3xl p-12 text-center">
              <p className="text-sm text-muted-foreground">لا توجد متاجر بعد. كن أوّل من يسجّل!</p>
            </div>
          )}
          {stores.map((s) => <StoreCard key={s.id} s={s} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}


