import { Link } from "@tanstack/react-router";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeader({
  title,
  icon: Icon,
  href,
  hrefLabel = "عرض المزيد",
  extra,
}: {
  title: string;
  icon: LucideIcon;
  href?: string;
  hrefLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="inline-flex items-center gap-3 rounded-full bg-primary-soft border border-primary/15 px-3.5 py-1.5 shadow-[var(--shadow-chip)]">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="font-display text-sm font-extrabold text-foreground">{title}</span>
      </div>
      {extra ?? (href && (
        <Link to={href as never} className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:gap-1.5 transition-all">
          <ChevronLeft className="h-4 w-4" /> {hrefLabel}
        </Link>
      ))}
    </div>
  );
}
