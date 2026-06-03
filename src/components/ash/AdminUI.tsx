import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function AdminPageHeader({ icon: Icon, eyebrow, title, description, actions }: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-5 sm:mb-7 flex items-start gap-3 sm:gap-4 flex-wrap">
      <span
        className="grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl text-primary-foreground shrink-0"
        style={{
          background: "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 55%, black))",
          boxShadow: "0 14px 30px -14px color-mix(in oklab, var(--primary) 60%, transparent)",
        }}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/80">{eyebrow}</div>
        <h1 className="mt-0.5 font-display text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">{title}</h1>
        {description && <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="w-full sm:w-auto flex items-center gap-2 flex-wrap">{actions}</div>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-border bg-card ${className}`}
      style={{ boxShadow: "0 10px 30px -18px color-mix(in oklab, var(--foreground) 14%, transparent)" }}
    >
      {children}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="py-16 grid place-items-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
      {label && <div className="mt-2 text-xs">{label}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: React.ComponentType<{ className?: string }>; title: string; hint?: string }) {
  return (
    <div className="py-14 px-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="mt-3 font-bold">{title}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "قيد المراجعة", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    approved: { label: "موثّق", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    rejected: { label: "مرفوض", cls: "bg-destructive/15 text-destructive border-destructive/30" },
    suspended: { label: "معلّق", cls: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30" },
    confirmed: { label: "مؤكد", cls: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
    preparing: { label: "قيد التحضير", cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
    delivering: { label: "قيد التوصيل", cls: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30" },
    completed: { label: "مكتمل", cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
    cancelled: { label: "ملغي", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const m = map[status] ?? { label: status, cls: "bg-secondary text-muted-foreground border-border" };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}

export function useTitle(title: string) {
  useEffect(() => { document.title = title; }, [title]);
}
