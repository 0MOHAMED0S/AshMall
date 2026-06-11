import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star } from "lucide-react";
function StoreCard({
  s
}) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/stores/$slug",
      params: { slug: s.slug },
      className: "group relative overflow-hidden rounded-3xl glass-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 active:scale-[0.98]",
      style: { boxShadow: "var(--shadow-elevated)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-48 sm:h-44 overflow-hidden", children: [
          s.cover_url ? /* @__PURE__ */ jsx("img", { src: s.cover_url, alt: "", loading: "lazy", className: "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" }) : /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-110",
              style: { background: `radial-gradient(120% 80% at 20% 20%, oklch(0.62 0.2 ${Math.abs(s.slug.charCodeAt(0) * 7) % 360}) 0%, oklch(0.2 0.04 30) 70%, oklch(0.13 0.01 30) 100%)` }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" }),
          s.categories?.name_ar && /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-3 rounded-full bg-background/85 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-foreground border border-border shadow-sm", children: s.categories.name_ar }),
          /* @__PURE__ */ jsxs("span", { className: "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/95 text-primary-foreground px-2.5 py-1 text-[10px] font-bold shadow-sm", children: [
            /* @__PURE__ */ jsx(BadgeCheck, { className: "h-3 w-3" }),
            " موثّق"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute right-5 top-[calc(12rem-1.75rem)] sm:top-[calc(11rem-1.75rem)] h-14 w-14 rounded-2xl ring-2 ring-background bg-card overflow-hidden grid place-items-center shadow-lg z-10", children: s.logo_url ? /* @__PURE__ */ jsx("img", { src: s.logo_url, alt: "", loading: "lazy", className: "h-full w-full object-contain" }) : /* @__PURE__ */ jsx("span", { className: "font-display text-xl font-extrabold text-primary", children: s.name_ar.slice(0, 1) }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 pt-9", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "truncate font-display text-lg font-bold leading-tight", children: s.name_ar }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1 text-[11px] text-muted-foreground", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: s.address })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs shrink-0", children: [
              /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-amber-500 text-amber-500" }),
              /* @__PURE__ */ jsx("span", { className: "tabular-nums font-bold", children: Number(s.rating).toFixed(1) })
            ] })
          ] }),
          s.description_ar && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: s.description_ar }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/60", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: [
              s.rating_count.toLocaleString("ar-EG"),
              " تقييم"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 py-2 text-xs font-bold shadow-md group-hover:shadow-lg group-hover:translate-x-[-2px] transition-all", children: [
              "افتح المتجر",
              /* @__PURE__ */ jsx("span", { className: "transition-transform group-hover:-translate-x-1", children: "←" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  StoreCard as S
};
