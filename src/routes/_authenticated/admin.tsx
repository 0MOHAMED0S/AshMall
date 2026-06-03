import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

import { Nav } from "@/components/ash/Nav";
import { useAuth } from "@/lib/auth-context";
import {
  Shield, LayoutDashboard, Store, Users, ShoppingBag,
  Tag, Megaphone, Send, Star, ShieldOff, Briefcase, Package, Settings, Boxes, Bike,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "لوحة الإدارة — آش مول" }] }),
});

const NAV: { to: string; label: string; icon: typeof Shield; exact?: boolean }[] = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { to: "/admin/stores", label: "المتاجر", icon: Store },
  { to: "/admin/merchants", label: "حسابات التجار", icon: Briefcase },
  { to: "/admin/delivery", label: "الدليفري", icon: Bike },
  { to: "/admin/catalog", label: "كتالوج المحلات", icon: Boxes },
  { to: "/admin/products", label: "المنتجات", icon: Package },
  { to: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { to: "/admin/users", label: "المستخدمون", icon: Users },
  { to: "/admin/categories", label: "الفئات", icon: Tag },
  { to: "/admin/ads", label: "الإعلانات", icon: Megaphone },
  { to: "/admin/broadcast", label: "بث إشعار", icon: Send },
  { to: "/admin/reviews", label: "التقييمات", icon: Star },
  { to: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
];


function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen" dir="rtl">
        <Nav />
        <main className="pt-32 pb-20 mx-auto max-w-md px-5 text-center">
          <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive">
            <ShieldOff className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">غير مصرّح بالوصول</h1>
          <p className="mt-2 text-sm text-muted-foreground">هذه الصفحة للمشرفين فقط.</p>
          <Link to="/" className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium">العودة للرئيسية</Link>
        </main>
      </div>
    );
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to || pathname === to + "/" : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Nav />
      <div className="pt-24 sm:pt-32 lg:pt-40 pb-16 lg:pb-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start mb-3 lg:mb-0">
            <div className="rounded-2xl lg:rounded-3xl border border-border bg-card overflow-hidden"
              style={{ boxShadow: "0 10px 30px -16px color-mix(in oklab, var(--foreground) 14%, transparent)" }}>
              {/* Desktop sidebar header */}
              <div className="hidden lg:block p-5 bg-gradient-to-bl from-primary/10 to-transparent border-b border-border/60">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))" }}>
                    <Shield className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">Admin</div>
                    <div className="font-display text-base font-extrabold truncate">لوحة الإدارة</div>
                  </div>
                </div>
              </div>
              {/* Mobile compact header */}
              <div className="lg:hidden flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-gradient-to-bl from-primary/10 to-transparent">
                <span className="grid h-7 w-7 place-items-center rounded-lg text-primary-foreground shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))" }}>
                  <Shield className="h-3.5 w-3.5" />
                </span>
                <div className="font-display text-sm font-extrabold truncate">لوحة الإدارة</div>
              </div>
              <nav className="p-1.5 lg:p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar">
                {NAV.map((item) => {
                  const active = isActive(item.to, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`shrink-0 lg:shrink inline-flex items-center gap-1.5 lg:gap-2.5 rounded-lg lg:rounded-xl px-2.5 lg:px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-medium transition whitespace-nowrap ${
                        active
                          ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="mt-3 lg:mt-0 min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
